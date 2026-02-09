import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import {
    Package,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
} from "lucide-react";

export default async function CustomerDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Check authentication
    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    if (session.user.role === "ADMIN") {
        redirect(`/${locale}/admin`);
    }

    // Fetch real data
    const bookings = await prisma.booking.findMany({
        where: { customerId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            product: { select: { nameEn: true, nameTh: true } },
        },
    });

    const bookingStats = await prisma.booking.groupBy({
        by: ["status"],
        where: { customerId: session.user.id },
        _count: { id: true },
    });

    const totalBookings = bookingStats.reduce((acc: number, curr: any) => acc + curr._count.id, 0);
    const activeRentals = bookingStats.find((s: any) => s.status === "ACTIVE")?._count.id || 0;
    const pendingPayments = bookingStats.find((s: any) => s.status === "PENDING")?._count.id || 0;
    const completedRentals = bookingStats.find((s: any) => s.status === "COMPLETED")?._count.id || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "COMPLETED": return { bg: "rgba(147, 112, 219, 0.2)", color: "#9370DB" };
            case "CANCELLED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF" };
        }
    };

    const getStatusText = (status: string) => {
        if (locale !== "th") return status;
        switch (status) {
            case "ACTIVE": return "กำลังเช่า";
            case "PENDING": return "รอดำเนินการ";
            case "COMPLETED": return "เสร็จสิ้น";
            case "CANCELLED": return "ยกเลิก";
            case "CONFIRMED": return "ยืนยันแล้ว";
            default: return status;
        }
    };

    const overviewStats = [
        { icon: Package, label: locale === "th" ? "ทั้งหมด" : "Total", value: totalBookings, color: "#9370DB" },
        { icon: Clock, label: locale === "th" ? "กำลังเช่า" : "Active", value: activeRentals, color: "#7FFFD4" },
        { icon: AlertCircle, label: locale === "th" ? "รอชำระ" : "Pending", value: pendingPayments, color: "#F0E68C" },
        { icon: CheckCircle, label: locale === "th" ? "เสร็จสิ้น" : "Completed", value: completedRentals, color: "#DDA0DD" },
    ];

    const pageTitle = locale === "th" ? `สวัสดี, ${session.user.name}!` : `Hello, ${session.user.name}!`;

    return (
        <CustomerLayout pageTitle={pageTitle}>
            {/* Overview Stats */}
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "14px" }}>
                    {locale === "th" ? "ภาพรวม" : "Overview"}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px" }}>
                    {overviewStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "18px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "14px",
                                }}
                            >
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    backgroundColor: `${stat.color}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Icon size={18} color={stat.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                        {stat.label}
                                    </p>
                                    <p style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-primary)" }}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Bookings */}
            <div
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {locale === "th" ? "การจองล่าสุด" : "Recent Bookings"}
                    </h3>
                    <Link
                        href={`/${locale}/customer/bookings`}
                        style={{ color: "#9370DB", fontSize: "12px", textDecoration: "none" }}
                    >
                        {locale === "th" ? "ดูทั้งหมด" : "View All"} →
                    </Link>
                </div>

                {bookings.length > 0 ? (
                    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {bookings.map((booking: any) => {
                            const statusStyle = getStatusColor(booking.status);
                            const productName = locale === "th" && booking.product.nameTh ? booking.product.nameTh : booking.product.nameEn;
                            return (
                                <div
                                    key={booking.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "14px 16px",
                                        borderRadius: "10px",
                                        backgroundColor: "var(--bg-secondary)",
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                            <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>#{booking.id.slice(-6).toUpperCase()}</span>
                                            <span
                                                style={{
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    fontSize: "9px",
                                                    fontWeight: "600",
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                }}
                                            >
                                                {getStatusText(booking.status)}
                                            </span>
                                        </div>
                                        <h4 style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "13px", marginBottom: "3px" }}>
                                            {productName}
                                        </h4>
                                        <p style={{ fontSize: "11px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Calendar size={10} />
                                            {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#9370DB" }}>
                                            ฿{booking.totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <p style={{ fontSize: "13px", marginBottom: "14px" }}>
                            {locale === "th" ? "ยังไม่มีการจอง" : "No bookings yet"}
                        </p>
                        <Link
                            href={`/${locale}/customer/products`}
                            className="btn-primary"
                            style={{ display: "inline-flex", padding: "10px 18px", fontSize: "12px" }}
                        >
                            {locale === "th" ? "เริ่มค้นหาชุด" : "Browse Costumes"}
                        </Link>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
