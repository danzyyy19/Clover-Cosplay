import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ChevronLeft, Calendar, CreditCard, Package, Clock, CheckCircle } from "lucide-react";

export default async function CustomerBookingDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    const booking = await prisma.booking.findUnique({
        where: { id, customerId: session.user.id },
        include: {
            product: {
                include: {
                    images: true,
                },
            },
            payment: true,
        },
    });

    if (!booking) {
        redirect(`/${locale}/customer/bookings`);
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACTIVE": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4", icon: Clock };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C", icon: Clock };
            case "COMPLETED": return { bg: "rgba(147, 112, 219, 0.2)", color: "#9370DB", icon: CheckCircle };
            case "CANCELLED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1", icon: Clock };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF", icon: Clock };
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

    const statusInfo = getStatusStyle(booking.status);
    const StatusIcon = statusInfo.icon;
    const productName = locale === "th" && booking.product.nameTh ? booking.product.nameTh : booking.product.nameEn;
    const pageTitle = locale === "th" ? "รายละเอียดการจอง" : "Booking Details";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            <Link href={`/${locale}/customer/bookings`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px", textDecoration: "none" }}>
                <ChevronLeft size={16} />
                {locale === "th" ? "กลับไปยังการจอง" : "Back to Bookings"}
            </Link>

            {/* Responsive Grid Layout */}
            <div className="booking-detail-grid">


                {/* Main */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
                    {/* Status Card */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                            <div>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>{locale === "th" ? "รหัสคำสั่งซื้อ" : "Order ID"}</p>
                                <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>#{booking.id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", backgroundColor: statusInfo.bg }}>
                                <StatusIcon size={16} color={statusInfo.color} />
                                <span style={{ fontSize: "13px", fontWeight: "600", color: statusInfo.color }}>{getStatusText(booking.status)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                            {locale === "th" ? "สินค้า" : "Product"}
                        </h3>
                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                            <div style={{ width: "100px", height: "100px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", overflow: "hidden", flexShrink: 0 }}>
                                {booking.product.images[0] ? (
                                    <img src={booking.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Package size={30} color="var(--text-secondary)" />
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: "200px" }}>
                                <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "15px", marginBottom: "6px" }}>{productName}</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>{booking.product.anime} - {booking.product.character}</p>
                                <p style={{ fontSize: "14px", color: "#9370DB", fontWeight: "600" }}>฿{booking.product.pricePerDay.toString()}/{locale === "th" ? "วัน" : "day"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rental Period */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>
                            {locale === "th" ? "ระยะเวลาเช่า" : "Rental Period"}
                        </h3>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: "120px" }}>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>{locale === "th" ? "วันเริ่มต้น" : "Start Date"}</p>
                                <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Calendar size={14} />
                                    {booking.startDate.toLocaleDateString()}
                                </p>
                            </div>
                            <div style={{ flex: 1, minWidth: "120px" }}>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>{locale === "th" ? "วันสิ้นสุด" : "End Date"}</p>
                                <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Calendar size={14} />
                                    {booking.endDate.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Total */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>
                            {locale === "th" ? "ยอดรวม" : "Total"}
                        </h3>
                        <p style={{ fontSize: "28px", fontWeight: "bold", color: "#9370DB" }}>
                            ฿{booking.totalPrice.toLocaleString()}
                        </p>
                    </div>

                    {/* Actions */}
                    {/* Payment Proof Preview if exists */}
                    {booking.payment && booking.payment.proofImageUrl && (
                        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                            <h3 style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "12px" }}>
                                {locale === "th" ? "หลักฐานการชำระเงิน" : "Payment Proof"}
                            </h3>
                            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                                <img src={booking.payment.proofImageUrl} alt="Payment Proof" style={{ width: "100%", height: "auto", display: "block" }} />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {booking.status === "PENDING" && (
                        <Link
                            href={`/${locale}/customer/bookings/${booking.id}/payment`}
                            className={booking.payment ? "btn-secondary" : "btn-primary"}
                            style={{ width: "100%", padding: "12px", fontSize: "13px", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px", textDecoration: "none", backgroundColor: booking.payment ? "transparent" : undefined, border: booking.payment ? "1px solid var(--border-color)" : undefined, color: booking.payment ? "var(--text-primary)" : undefined }}
                        >
                            <CreditCard size={16} />
                            {booking.payment
                                ? (locale === "th" ? "แก้ไขหลักฐานการโอน" : "Edit Payment Proof")
                                : (locale === "th" ? "ชำระเงิน" : "Pay Now")
                            }
                        </Link>
                    )}

                    {booking.status === "COMPLETED" && (
                        <Link
                            href={`/${locale}/customer/bookings/${booking.id}/receipt`}
                            className="btn-primary"
                            style={{ width: "100%", padding: "12px", fontSize: "13px", justifyContent: "center" }}
                        >
                            {locale === "th" ? "ดาวน์โหลดใบเสร็จ" : "Download Receipt"}
                        </Link>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
