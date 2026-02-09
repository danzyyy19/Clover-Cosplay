import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Mail, Phone, Calendar, ShoppingCart } from "lucide-react";

export default async function AdminCustomersPage({
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

    const customers = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { bookings: true } },
        },
    });

    return (
        <AdminLayout pageTitle={locale === "th" ? "ลูกค้า" : "Customers"}>
            <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                overflow: "hidden",
            }}>
                {/* Desktop Table */}
                <div className="desktop-only">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                                {(locale === "th"
                                    ? ["ลูกค้า", "ติดต่อ", "เข้าร่วมเมื่อ", "การจอง"]
                                    : ["Customer", "Contact", "Joined", "Bookings"]).map((h) => (
                                        <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                            {h}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer: any) => (
                                <tr key={customer.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(147, 112, 219, 0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "600",
                                                color: "#9370DB",
                                                fontSize: "14px",
                                            }}>
                                                {customer.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "13px" }}>{customer.name}</p>
                                                <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>ID: {customer.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                                <Mail size={12} /> {customer.email}
                                            </span>
                                            {customer.phone && (
                                                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                                    <Phone size={12} /> {customer.phone}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                            <Calendar size={12} /> {customer.createdAt.toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#7FFFD4" }}>
                                            <ShoppingCart size={14} /> {customer._count.bookings}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-only">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {customers.map((customer: any) => (
                            <div key={customer.id} style={{ padding: "16px", borderBottom: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <div style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(147, 112, 219, 0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "600",
                                        color: "#9370DB",
                                        fontSize: "20px",
                                    }}>
                                        {customer.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "15px" }}>{customer.name}</p>
                                        <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>ID: {customer.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                        <Mail size={14} /> {customer.email}
                                    </span>
                                    {customer.phone && (
                                        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                            <Phone size={14} /> {customer.phone}
                                        </span>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                            <Calendar size={12} /> {locale === "th" ? "เข้าร่วม:" : "Joined:"} {customer.createdAt.toLocaleDateString()}
                                        </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#7FFFD4" }}>
                                            <ShoppingCart size={14} /> {customer._count.bookings} {locale === "th" ? "การจอง" : "Bookings"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {customers.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <p>{locale === "th" ? "ยังไม่มีลูกค้า" : "No customers yet"}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
