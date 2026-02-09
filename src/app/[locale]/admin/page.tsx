import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Package,
    ShoppingCart,
    Clock,
    Users,
    TrendingUp,
    ArrowUpRight,
    Calendar,
} from "lucide-react";

export default async function AdminDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Check authentication and authorization
    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }
    if (session.user.role !== "ADMIN") {
        redirect(`/${locale}/customer`);
    }

    // Fetch real data from database
    const [productsCount, bookingsCount, pendingCount, activeCount, customersCount, totalRevenue] = await Promise.all([
        prisma.product.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.booking.aggregate({ where: { status: { in: ["COMPLETED", "ACTIVE"] } }, _sum: { totalPrice: true } }),
    ]);

    // Fetch recent orders
    const recentOrders = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            customer: { select: { name: true } },
            product: { select: { nameEn: true } },
        },
    });

    const overviewStats = [
        { icon: Package, labelEn: "Total Products", labelTh: "สินค้าทั้งหมด", value: productsCount, color: "#9370DB" },
        { icon: ShoppingCart, labelEn: "Total Bookings", labelTh: "การจองทั้งหมด", value: bookingsCount, color: "#7FFFD4" },
        { icon: Clock, labelEn: "Pending", labelTh: "รอดำเนินการ", value: pendingCount, color: "#F0E68C" },
        { icon: Users, labelEn: "Customers", labelTh: "ลูกค้า", value: customersCount, color: "#FFB6C1" },
    ];

    const getStatusStyle = (status: string) => {
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

    return (
        <AdminLayout pageTitle="Dashboard Admin">
            {/* Overview Section */}
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                    {locale === "th" ? "ภาพรวม" : "Overview"}
                </h2>

                {/* Stats Cards Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                    {overviewStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "16px",
                                }}
                            >
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "10px",
                                    backgroundColor: `${stat.color}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Icon size={20} color={stat.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                                        {locale === "th" ? stat.labelTh : stat.labelEn}
                                    </p>
                                    <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-primary)" }}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Two Column Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {/* Revenue Card */}
                <div
                    style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                                {locale === "th" ? "รายได้ทั้งหมด" : "Total Revenue"}
                            </p>
                            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                {locale === "th" ? "จากการจองที่เสร็จสิ้น" : "From completed bookings"}
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#7FFFD4", fontSize: "12px" }}>
                            <TrendingUp size={14} />
                            <span>{locale === "th" ? "กำลังดำเนินการ" : "Active"}</span>
                        </div>
                    </div>
                    <p style={{ fontSize: "32px", fontWeight: "bold", color: "var(--text-primary)" }}>
                        ฿{(totalRevenue._sum.totalPrice || 0).toLocaleString()}
                    </p>
                </div>

                {/* Summary Card */}
                <div
                    style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                        {locale === "th" ? "สรุปย่อ" : "Quick Summary"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Calendar size={14} color="#7FFFD4" />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{locale === "th" ? "การเช่าที่กำลังดำเนินการ" : "Active Rentals"}</span>
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#7FFFD4" }}>{activeCount}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Clock size={14} color="#F0E68C" />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{locale === "th" ? "รออนุมัติ" : "Pending Approval"}</span>
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#F0E68C" }}>{pendingCount}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Package size={14} color="#9370DB" />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{locale === "th" ? "สินค้าทั้งหมด" : "Total Products"}</span>
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#9370DB" }}>{productsCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {locale === "th" ? "การจองล่าสุด" : "Recent Bookings"}
                    </h3>
                    <Link href={`/${locale}/admin/orders`} style={{ display: "flex", alignItems: "center", gap: "4px", color: "#9370DB", fontSize: "12px", textDecoration: "none" }}>
                        {locale === "th" ? "ดูทั้งหมด" : "View All"}
                        <ArrowUpRight size={12} />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                    {locale === "th" ? "ลูกค้า" : "Customer"}
                                </th>
                                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                    {locale === "th" ? "สินค้า" : "Product"}
                                </th>
                                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                    {locale === "th" ? "วันที่" : "Date"}
                                </th>
                                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                    {locale === "th" ? "สถานะ" : "Status"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order: any) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--text-primary)" }}>
                                            {order.customer.name}
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                            {order.product.nameEn}
                                        </td>
                                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                            {order.createdAt.toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{
                                                padding: "4px 10px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "600",
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                            }}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <p style={{ fontSize: "13px" }}>{locale === "th" ? "ยังไม่มีการจอง" : "No bookings yet"}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
