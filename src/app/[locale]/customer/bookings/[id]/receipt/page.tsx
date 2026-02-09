import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ChevronLeft } from "lucide-react";
import { PrintReceiptButton } from "@/components/bookings/print-receipt-button";

export default async function ReceiptPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            product: true,
            customer: true,
            payment: true,
        },
    });

    if (!booking) {
        notFound();
    }

    // Determine status display
    const isPaid = booking.status === "CONFIRMED" || booking.status === "COMPLETED" || (booking.payment && booking.payment.status === "APPROVED");

    // Calculate days
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    return (
        <CustomerLayout>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", paddingBottom: "40px" }}>
                <div style={{ width: "100%", maxWidth: "380px" }}>
                    {/* Back Link & Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <Link
                            href={`/${locale}/customer/bookings`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                fontSize: "14px",
                            }}
                        >
                            <ChevronLeft size={18} />
                            {locale === "th" ? "กลับ" : "Back"}
                        </Link>
                        <PrintReceiptButton label={locale === "th" ? "พิมพ์" : "Print"} />
                    </div>

                    {/* Thermal Receipt Card */}
                    <div
                        id="receipt"
                        style={{
                            backgroundColor: "white",
                            padding: "24px",
                            position: "relative",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            fontFamily: "'Courier New', Courier, monospace", // Thermal receipt font style
                            color: "#000",
                        }}
                    >
                        {/* Paper Tear Effect Top */}
                        <div style={{
                            position: "absolute",
                            top: "-5px",
                            left: "0",
                            right: "0",
                            height: "10px",
                            background: "radial-gradient(circle, transparent 0.25em, white 0.25em)",
                            backgroundSize: "0.5em 0.5em",
                            backgroundPosition: "0 -0.25em",
                        }} />

                        {/* Header */}
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <div style={{ width: "50px", height: "50px", margin: "0 auto 8px", position: "relative" }}>
                                <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                            </div>
                            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "2px", textTransform: "uppercase" }}>
                                CLOVER COSPLAY
                            </h2>
                            <p style={{ fontSize: "10px", color: "#666" }}>{locale === "th" ? "บริการเช่าชุดคอสเพลย์พรีเมียม" : "Premium Costume Rental Service"}</p>
                            <p style={{ fontSize: "10px", color: "#666" }}>www.clovercosplay.com</p>
                        </div>

                        {/* Dashed Line */}
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "16px" }} />

                        {/* Receipt Meta */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11px" }}>
                            <span>{locale === "th" ? "เลขที่ใบเสร็จ:" : "RECEIPT NO:"}</span>
                            <span style={{ fontWeight: "bold" }}>#{booking.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "11px" }}>
                            <span>{locale === "th" ? "วันที่:" : "DATE:"}</span>
                            <span>{format(new Date(), "dd/MM/yyyy HH:mm")}</span>
                        </div>

                        {/* Customer */}
                        <div style={{ marginBottom: "16px", fontSize: "11px" }}>
                            <span style={{ display: "block", fontWeight: "bold", marginBottom: "2px" }}>{locale === "th" ? "ลูกค้า:" : "CUSTOMER:"}</span>
                            <span>{booking.customer.name}</span>
                            <span style={{ display: "block", marginTop: "2px" }}>{booking.customer.phone || "-"}</span>
                        </div>

                        {/* Dashed Line */}
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "16px" }} />

                        {/* Items */}
                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "11px", fontWeight: "bold" }}>
                                <span>{locale === "th" ? "รายการ" : "ITEM"}</span>
                                <span>{locale === "th" ? "ราคา" : "AMT"}</span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "11px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: "bold" }}>{locale === "th" && booking.product.nameTh ? booking.product.nameTh : booking.product.nameEn}</span>
                                    <span style={{ fontSize: "10px", color: "#444" }}>{locale === "th" ? "ไซส์:" : "Size:"} {booking.product.size}</span>
                                    <span style={{ fontSize: "10px", color: "#444" }}>
                                        {format(new Date(booking.startDate), "dd/MM")} - {format(new Date(booking.endDate), "dd/MM")} ({totalDays}{locale === "th" ? "วัน" : "d"})
                                    </span>
                                </div>
                                <span>{Number(booking.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Dashed Line */}
                        <div style={{ borderBottom: "1px dashed #000", marginBottom: "16px" }} />

                        {/* Totals */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", fontWeight: "bold" }}>
                            <span>{locale === "th" ? "รวม" : "TOTAL"}</span>
                            <span>฿{Number(booking.totalPrice).toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "11px" }}>
                            <span>{locale === "th" ? "การชำระเงิน" : "PAYMENT"}</span>
                            <span>{isPaid ? (locale === "th" ? "ชำระแล้ว" : "PAID") : (locale === "th" ? "รอดำเนินการ" : "PENDING")}</span>
                        </div>

                        {/* Rules */}
                        <div style={{ marginBottom: "16px", fontSize: "10px", color: "#444", border: "1px solid #000", padding: "8px" }}>
                            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>{locale === "th" ? "กฎสำคัญ:" : "IMPORTANT RULES:"}</p>
                            <ul style={{ paddingLeft: "12px", margin: 0 }}>
                                <li>{locale === "th" ? "ค่าปรับคืนช้า: 500 บาท / วัน" : "Late return fee: 500 THB / day"}</li>
                                <li>{locale === "th" ? "ห้ามซักชุด" : "Do not wash the costume"}</li>
                                <li>{locale === "th" ? "ค่าเสียหายขึ้นอยู่กับสภาพ" : "Damage fee depends on condition"}</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "10px", color: "#444" }}>
                            <p>{locale === "th" ? "ขอบคุณที่ใช้บริการ" : "THANK YOU FOR YOUR ORDER"}</p>
                            <p style={{ marginTop: "4px" }}>{locale === "th" ? "กรุณาตรวจสอบสินค้าเมื่อรับ" : "Please check items upon receiving"}</p>
                        </div>

                        {/* Paper Tear Effect Bottom */}
                        <div style={{
                            position: "absolute",
                            bottom: "-5px",
                            left: "0",
                            right: "0",
                            height: "10px",
                            background: "radial-gradient(circle, transparent 0.25em, white 0.25em)",
                            backgroundSize: "0.5em 0.5em",
                            backgroundPosition: "0 -0.25em",
                            transform: "rotate(180deg)"
                        }} />
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #receipt, #receipt * {
                            visibility: visible;
                        }
                        #receipt {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            box-shadow: none !important;
                        }
                        .print-btn {
                            display: none !important;
                        }
                    }
                `}} />
            </div>
        </CustomerLayout>
    );
}
