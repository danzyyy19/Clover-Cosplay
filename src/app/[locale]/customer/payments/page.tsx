import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function CustomerPaymentsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    const payments = await prisma.payment.findMany({
        where: { booking: { customerId: session.user.id } },
        orderBy: { createdAt: "desc" },
        include: {
            booking: {
                include: { product: { select: { nameEn: true, nameTh: true } } },
            },
        },
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <CheckCircle size={16} color="#7FFFD4" />;
            case "PENDING": return <Clock size={16} color="#F0E68C" />;
            case "REJECTED": return <XCircle size={16} color="#FFB6C1" />;
            default: return <Clock size={16} color="var(--text-secondary)" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "APPROVED": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "REJECTED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF" };
        }
    };

    const getStatusText = (status: string) => {
        if (locale !== "th") return status;
        switch (status) {
            case "PENDING": return "รอดำเนินการ";
            case "APPROVED": return "อนุมัติแล้ว";
            case "REJECTED": return "ถูกปฏิเสธ";
            default: return status;
        }
    };

    const pageTitle = locale === "th" ? "ประวัติการชำระเงิน" : "Payment History";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
                {[
                    { label: locale === "th" ? "รอตรวจสอบ" : "Pending", value: payments.filter((p: any) => p.status === "PENDING").length, color: "#F0E68C", icon: Clock },
                    { label: locale === "th" ? "อนุมัติแล้ว" : "Approved", value: payments.filter((p: any) => p.status === "APPROVED").length, color: "#7FFFD4", icon: CheckCircle },
                    { label: locale === "th" ? "ถูกปฏิเสธ" : "Rejected", value: payments.filter((p: any) => p.status === "REJECTED").length, color: "#FFB6C1", icon: XCircle },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} style={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon size={16} color={stat.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{stat.label}</p>
                                <p style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-primary)" }}>{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payments List */}
            <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                overflow: "hidden",
            }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {locale === "th" ? "รายการชำระเงิน" : "Payment Records"}
                    </h3>
                </div>
                {payments.length > 0 ? (
                    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {payments.map((payment: any) => {
                            const statusStyle = getStatusStyle(payment.status);
                            const productName = locale === "th" && payment.booking.product.nameTh ? payment.booking.product.nameTh : payment.booking.product.nameEn;
                            return (
                                <div
                                    key={payment.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "14px 16px",
                                        borderRadius: "10px",
                                        backgroundColor: "var(--bg-secondary)",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        {getStatusIcon(payment.status)}
                                        <div>
                                            <p style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "13px" }}>{productName}</p>
                                            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                                {payment.createdAt.toLocaleDateString()} • #{payment.id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#9370DB" }}>
                                            ฿{Number(payment.amount).toLocaleString()}
                                        </span>
                                        <span style={{ padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "600", backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                            {getStatusText(payment.status)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <CreditCard size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
                        <p style={{ fontSize: "13px" }}>{locale === "th" ? "ยังไม่มีประวัติการชำระเงิน" : "No payment history"}</p>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
