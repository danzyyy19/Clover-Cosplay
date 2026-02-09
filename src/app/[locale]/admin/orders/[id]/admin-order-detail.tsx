"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Calendar, CreditCard, User, Check, X, Clock } from "lucide-react";

interface AdminOrderDetailProps {
    booking: any;
    locale: string;
}

export function AdminOrderDetail({ booking, locale }: AdminOrderDetailProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    const handleUpdateStatus = async (status: string) => {
        const confirmText = locale === "th"
            ? `คุณแน่ใจหรือว่าต้องการทำเครื่องหมายคำสั่งซื้อนี้เป็น ${getStatusText(status)}?`
            : `Are you sure you want to mark this order as ${status}?`;
        if (!confirm(confirmText)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
        } catch (error) {
            alert(locale === "th" ? "ไม่สามารถอัปเดตสถานะ" : "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const statusStyle = getStatusStyle(booking.status);

    return (
        <div>
            <Link href={`/${locale}/admin/orders`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px", textDecoration: "none" }}>
                <ChevronLeft size={16} />
                {locale === "th" ? "กลับไปยังคำสั่งซื้อ" : "Back to Orders"}
            </Link>

            <div className="admin-order-detail-grid">
                {/* Main */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
                    {/* Order Status */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{locale === "th" ? "สถานะคำสั่งซื้อ" : "Order Status"}</h3>
                            <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                {getStatusText(booking.status)}
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Calendar size={14} color="var(--text-secondary)" />
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <CreditCard size={14} color="#9370DB" />
                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#9370DB" }}>
                                    ฿{booking.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "สินค้า" : "Product"}</h3>
                        <div style={{ display: "flex", gap: "14px" }}>
                            <div style={{ width: "80px", height: "80px", borderRadius: "10px", backgroundColor: "var(--bg-secondary)", overflow: "hidden", flexShrink: 0 }}>
                                {booking.product.images[0] ? (
                                    <img src={booking.product.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Package size={24} color="var(--text-secondary)" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px", marginBottom: "4px" }}>{booking.product.nameEn}</p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>{booking.product.anime} - {booking.product.character}</p>
                                <p style={{ fontSize: "13px", color: "#9370DB", fontWeight: "500" }}>฿{booking.product.pricePerDay.toString()}/{locale === "th" ? "วัน" : "day"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "การชำระเงิน" : "Payment"}</h3>
                        {booking.payment ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div key={booking.payment.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{new Date(booking.payment.createdAt).toLocaleDateString()}</span>
                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>฿{booking.payment.amount.toLocaleString()}</span>
                                </div>
                                {booking.payment.proofImageUrl && (
                                    <div style={{ marginTop: "10px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>{locale === "th" ? "หลักฐานการชำระเงิน" : "Proof of Payment"}</p>
                                        <a href={booking.payment.proofImageUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                                            <img src={booking.payment.proofImageUrl} alt="Proof" style={{ width: "100%", maxWidth: "200px", height: "auto" }} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{locale === "th" ? "ยังไม่มีการชำระเงิน" : "No payment recorded"}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar - Customer */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "18px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>{locale === "th" ? "ลูกค้า" : "Customer"}</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(147, 112, 219, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <User size={18} color="#9370DB" />
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "13px" }}>{booking.customer.name}</p>
                                    <p style={{ fontSize: "11px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{booking.customer.email}</p>
                                </div>
                            </div>
                            {booking.customer.phone && (
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>📞 {booking.customer.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {booking.status === "PENDING" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button
                                onClick={() => handleUpdateStatus("CONFIRMED")}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "rgba(127, 255, 212, 0.2)",
                                    color: "#7FFFD4",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <Check size={16} /> {locale === "th" ? "อนุมัติคำสั่งซื้อ" : "Approve Order"}
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("CANCELLED")}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "rgba(255, 182, 193, 0.2)",
                                    color: "#FFB6C1",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <X size={16} /> {locale === "th" ? "ยกเลิกคำสั่งซื้อ" : "Cancel Order"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
