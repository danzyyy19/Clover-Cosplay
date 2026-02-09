import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Check, X, Eye, Clock } from "lucide-react";
import { PaymentList } from "./payment-list";

export default async function AdminPaymentsPage({
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

    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            booking: {
                include: {
                    customer: { select: { name: true } },
                    product: { select: { nameEn: true } },
                },
            },
        },
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "APPROVED": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "REJECTED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF" };
        }
    };

    // Convert decimals to numbers for client component
    const serializedPayments = payments.map((payment: any) => ({
        ...payment,
        amount: Number(payment.amount),
    }));

    return (
        <AdminLayout pageTitle={locale === "th" ? "การชำระเงิน" : "Payments"}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                    { label: locale === "th" ? "รอดำเนินการ" : "Pending", value: payments.filter((p: any) => p.status === "PENDING").length, color: "#F0E68C" },
                    { label: locale === "th" ? "อนุมัติแล้ว" : "Approved", value: payments.filter((p: any) => p.status === "APPROVED").length, color: "#7FFFD4" },
                    { label: locale === "th" ? "ปฏิเสธ" : "Rejected", value: payments.filter((p: any) => p.status === "REJECTED").length, color: "#FFB6C1" },
                ].map((stat) => (
                    <div key={stat.label} style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "12px",
                        padding: "18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={18} color={stat.color} />
                        </div>
                        <div>
                            <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{stat.label}</p>
                            <p style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-primary)" }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payments List */}
            <div style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                overflow: "hidden",
                padding: "20px"
            }}>
                <div style={{ paddingBottom: "20px", borderBottom: "1px solid var(--border-color)", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>{locale === "th" ? "หลักฐานการชำระเงิน" : "Payment Proofs"}</h3>
                </div>

                <PaymentList payments={serializedPayments} locale={locale} />
            </div>
        </AdminLayout>
    );
}
