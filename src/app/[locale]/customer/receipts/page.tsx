import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { FileText, Download, Calendar } from "lucide-react";

export default async function CustomerReceiptsPage({
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

    const completedBookings = await prisma.booking.findMany({
        where: {
            customerId: session.user.id,
            status: { in: ["CONFIRMED", "ACTIVE", "COMPLETED"] },
        },
        orderBy: { createdAt: "desc" },
        include: {
            product: { select: { nameEn: true, nameTh: true } },
        },
    });

    const pageTitle = locale === "th" ? "ใบเสร็จ" : "Receipts";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            {completedBookings.length > 0 ? (
                <div style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                                {[
                                    locale === "th" ? "เลขที่" : "Receipt #",
                                    locale === "th" ? "สินค้า" : "Product",
                                    locale === "th" ? "วันที่" : "Date",
                                    locale === "th" ? "จำนวนเงิน" : "Amount",
                                    locale === "th" ? "ดำเนินการ" : "Action",
                                ].map((h) => (
                                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {completedBookings.map((booking) => {
                                const productName = locale === "th" && booking.product.nameTh ? booking.product.nameTh : booking.product.nameEn;
                                return (
                                    <tr key={booking.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                                        <td style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "500", color: "var(--text-primary)" }}>
                                            #{booking.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                            {productName}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                                                <Calendar size={12} />
                                                {booking.endDate.toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#9370DB" }}>
                                            ฿{booking.totalPrice.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <Link
                                                href={`/${locale}/customer/bookings/${booking.id}/receipt`}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    backgroundColor: "rgba(147, 112, 219, 0.2)",
                                                    textDecoration: "none",
                                                    fontSize: "11px",
                                                    color: "#9370DB",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                <Download size={12} />
                                                {locale === "th" ? "ดาวน์โหลด" : "Download"}
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "60px", textAlign: "center" }}>
                    <FileText size={40} color="var(--text-secondary)" style={{ marginBottom: "16px" }} />
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                        {locale === "th" ? "ยังไม่มีใบเสร็จ" : "No receipts yet"}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        {locale === "th" ? "ใบเสร็จจะปรากฏหลังการเช่าเสร็จสิ้น" : "Receipts will appear after completed rentals"}
                    </p>
                </div>
            )}
        </CustomerLayout>
    );
}
