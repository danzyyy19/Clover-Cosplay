import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import { TrendingUp, ShoppingCart, Package, Users, Calendar } from "lucide-react";

export default async function AdminReportsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    // Fetch stats
    const [totalRevenue, totalBookings, totalProducts, totalCustomers, statsPending, statsActive, statsCompleted, statsCancelled] = await Promise.all([
        prisma.booking.aggregate({ where: { status: { in: ["COMPLETED", "ACTIVE"] } }, _sum: { totalPrice: true } }),
        prisma.booking.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "ACTIVE" } }),
        prisma.booking.count({ where: { status: "COMPLETED" } }),
        prisma.booking.count({ where: { status: "CANCELLED" } }),
    ]);

    const stats = [
        { icon: TrendingUp, label: locale === "th" ? "รายได้ทั้งหมด" : "Total Revenue", value: `฿${(totalRevenue._sum.totalPrice || 0).toLocaleString()}`, color: "#7FFFD4" },
        { icon: ShoppingCart, label: locale === "th" ? "การจองทั้งหมด" : "Total Bookings", value: totalBookings, color: "#9370DB" },
        { icon: Package, label: locale === "th" ? "สินค้าทั้งหมด" : "Total Products", value: totalProducts, color: "#DDA0DD" },
        { icon: Users, label: locale === "th" ? "ลูกค้าทั้งหมด" : "Total Customers", value: totalCustomers, color: "#FFB6C1" },
    ];

    return (
        <AdminLayout pageTitle={locale === "th" ? "รายงาน" : "Reports"}>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px",
                                padding: "20px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={20} color={stat.color} />
                                </div>
                            </div>
                            <p style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "4px" }}>
                                {stat.value}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Reports Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Monthly Activity */}
                <div style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "20px",
                }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "กิจกรรม" : "Activity"}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", height: "100%", alignItems: "center", color: "var(--text-secondary)" }}>
                        <p style={{ fontSize: "13px" }}>{locale === "th" ? "การวิเคราะห์รายละเอียดเร็วๆ นี้..." : "Detailed analytics coming soon..."}</p>
                    </div>
                </div>

                {/* Booking Status - Real Data */}
                <div style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "20px",
                }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "สถานะการจอง" : "Booking Status"}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                            { label: locale === "th" ? "รอดำเนินการ" : "Pending", value: statsPending, color: "#F0E68C" },
                            { label: locale === "th" ? "กำลังใช้งาน" : "Active", value: statsActive, color: "#7FFFD4" },
                            { label: locale === "th" ? "เสร็จสิ้น" : "Completed", value: statsCompleted, color: "#9370DB" },
                            { label: locale === "th" ? "ยกเลิก" : "Cancelled", value: statsCancelled, color: "#FFB6C1" },
                        ].map((item) => (
                            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.color }} />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1 }}>{item.label}</span>
                                <span style={{ fontSize: "13px", fontWeight: "bold", color: "var(--text-primary)" }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
