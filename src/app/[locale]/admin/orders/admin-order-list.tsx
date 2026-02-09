"use client";

import { useState } from "react";
import { Eye, Check, X, Clock, Calendar, User, Package, Play, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    status: string;
    totalPrice: number;
    startDate: Date;
    endDate: Date;
    customer: {
        name: string;
        email: string;
    };
    product: {
        nameEn: string;
    };
}

interface AdminOrderListProps {
    orders: Order[];
    locale: string;
}

export function AdminOrderList({ orders, locale }: AdminOrderListProps) {
    const router = useRouter();
    const [filter, setFilter] = useState("All");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter(o => o.status === filter);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACTIVE": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C" };
            case "CONFIRMED": return { bg: "rgba(135, 206, 235, 0.2)", color: "#87CEEB" };
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

    const handleUpdateStatus = async (id: string, status: string) => {
        const confirmText = locale === "th"
            ? `คุณแน่ใจหรือว่าต้องการทำเครื่องหมายคำสั่งซื้อนี้เป็น ${status}?`
            : `Are you sure you want to mark this order as ${status}?`;
        if (!confirm(confirmText)) return;

        setLoadingId(id);
        try {
            // Assuming we have an API for this, otherwise we might need to create it.
            // Using a generic update endpoint or specific action.
            // For now, I'll assume we might need to handle this via API.
            // If payment approval handles everything, maybe we don't need this?
            // But the UI had buttons. I'll implement a fetch call.
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div>
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
                {(locale === "th"
                    ? ["ทั้งหมด", "รอดำเนินการ", "ยืนยันแล้ว", "กำลังดำเนินการ", "เสร็จสิ้น", "ยกเลิก"]
                    : ["All", "PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"]
                ).map((tab, index) => {
                    const filterValues = ["All", "PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];
                    const filterValue = filterValues[index];
                    return (
                        <button
                            key={filterValue}
                            onClick={() => setFilter(filterValue)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: filter === filterValue ? "1px solid #9370DB" : "1px solid var(--border-color)",
                                backgroundColor: filter === filterValue ? "rgba(147, 112, 219, 0.1)" : "var(--bg-card)",
                                color: filter === filterValue ? "#9370DB" : "var(--text-secondary)",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "500",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s"
                            }}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="order-grid">
                <style jsx global>{`
                    .mobile-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    .desktop-table {
                        display: none;
                        width: 100%;
                        border-collapse: collapse;
                        background-color: var(--bg-card);
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid var(--border-color);
                    }
                    .desktop-table th {
                        text-align: left;
                        padding: 16px;
                        background-color: var(--bg-secondary);
                        color: var(--text-secondary);
                        font-size: 13px;
                        font-weight: 600;
                        border-bottom: 1px solid var(--border-color);
                    }
                    .desktop-table td {
                        padding: 16px;
                        border-bottom: 1px solid var(--border-color);
                        color: var(--text-primary);
                        font-size: 14px;
                        vertical-align: middle;
                    }
                    .desktop-table tr:last-child td {
                        border-bottom: none;
                    }

                    @media (min-width: 768px) {
                        .mobile-grid {
                            display: none;
                        }
                        .desktop-table {
                            display: table;
                        }
                    }
                `}</style>

                {filteredOrders.length > 0 ? (
                    <>
                        {/* Mobile Grid View */}
                        <div className="mobile-grid">
                            {filteredOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                const isLoading = loadingId === order.id;

                                return (
                                    <div key={order.id} style={{
                                        backgroundColor: "var(--bg-card)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                        transition: "transform 0.2s",
                                    }}>
                                        {/* Header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <User size={12} /> {order.customer.name}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#9370DB" }}>
                                                    ฿{order.totalPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ height: "1px", backgroundColor: "var(--border-color)" }} />

                                        {/* Details */}
                                        <div>
                                            <div style={{ display: "flex", alignItems: "start", gap: "8px", marginBottom: "8px" }}>
                                                <Package size={14} color="var(--text-secondary)" style={{ marginTop: "3px" }} />
                                                <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "500" }}>
                                                    {order.product.nameEn}
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Calendar size={14} color="var(--text-secondary)" />
                                                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                                    {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                                            <Link
                                                href={`/${locale}/admin/orders/${order.id}`}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    backgroundColor: "var(--bg-secondary)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "6px",
                                                    textDecoration: "none",
                                                    color: "var(--text-primary)",
                                                    fontSize: "13px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                <Eye size={16} />
                                                {locale === "th" ? "ดู" : "View"}
                                            </Link>

                                            {/* PENDING: Confirm or Cancel */}
                                            {order.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                                                        disabled={isLoading}
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(135, 206, 235, 0.2)",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            color: "#87CEEB",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            opacity: isLoading ? 0.5 : 1
                                                        }}
                                                    >
                                                        <Check size={16} />
                                                        {locale === "th" ? "ยืนยัน" : "Confirm"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                                        disabled={isLoading}
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(255, 182, 193, 0.2)",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            color: "#FFB6C1",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            opacity: isLoading ? 0.5 : 1
                                                        }}
                                                    >
                                                        <X size={16} />
                                                        {locale === "th" ? "ยกเลิก" : "Cancel"}
                                                    </button>
                                                </>
                                            )}

                                            {/* CONFIRMED: Start Active or Cancel */}
                                            {order.status === "CONFIRMED" && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "ACTIVE")}
                                                        disabled={isLoading}
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(127, 255, 212, 0.2)",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            color: "#7FFFD4",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            opacity: isLoading ? 0.5 : 1
                                                        }}
                                                    >
                                                        <Play size={16} />
                                                        {locale === "th" ? "เริ่มเช่า" : "Start"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                                        disabled={isLoading}
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(255, 182, 193, 0.2)",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            color: "#FFB6C1",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            opacity: isLoading ? 0.5 : 1
                                                        }}
                                                    >
                                                        <X size={16} />
                                                        {locale === "th" ? "ยกเลิก" : "Cancel"}
                                                    </button>
                                                </>
                                            )}

                                            {/* ACTIVE: Complete (costume returned) */}
                                            {order.status === "ACTIVE" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                                    disabled={isLoading}
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        backgroundColor: new Date(order.endDate) < new Date()
                                                            ? "rgba(255, 100, 100, 0.2)"
                                                            : "rgba(147, 112, 219, 0.2)",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "6px",
                                                        color: new Date(order.endDate) < new Date()
                                                            ? "#FF6464"
                                                            : "#9370DB",
                                                        fontSize: "13px",
                                                        fontWeight: "500",
                                                        opacity: isLoading ? 0.5 : 1
                                                    }}
                                                >
                                                    {new Date(order.endDate) < new Date() && <AlertTriangle size={16} />}
                                                    <CheckCircle size={16} />
                                                    {locale === "th"
                                                        ? (new Date(order.endDate) < new Date() ? "เลยกำหนด!" : "คืนแล้ว")
                                                        : (new Date(order.endDate) < new Date() ? "Overdue!" : "Returned")}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table View */}
                        <table className="desktop-table">
                            <thead>
                                <tr>
                                    <th>{locale === "th" ? "รหัสคำสั่ง" : "Order ID"}</th>
                                    <th>{locale === "th" ? "ลูกค้า" : "Customer"}</th>
                                    <th>{locale === "th" ? "สินค้า" : "Product"}</th>
                                    <th>{locale === "th" ? "วันที่" : "Date"}</th>
                                    <th>{locale === "th" ? "ยอดรวม" : "Total"}</th>
                                    <th>{locale === "th" ? "สถานะ" : "Status"}</th>
                                    <th>{locale === "th" ? "การดำเนินการ" : "Actions"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const statusStyle = getStatusStyle(order.status);
                                    const isLoading = loadingId === order.id;

                                    return (
                                        <tr key={order.id}>
                                            <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                                                #{order.id.slice(-6).toUpperCase()}
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ fontWeight: "500" }}>{order.customer.name}</span>
                                                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{order.customer.email}</span>
                                                </div>
                                            </td>
                                            <td>{order.product.nameEn}</td>
                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", fontSize: "13px" }}>
                                                    <span>{new Date(order.startDate).toLocaleDateString()}</span>
                                                    <span style={{ color: "var(--text-secondary)" }}>{locale === "th" ? "ถึง" : "to"} {new Date(order.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: "bold", color: "#9370DB" }}>
                                                ฿{order.totalPrice.toLocaleString()}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: "4px 10px",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color
                                                }}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <Link
                                                        href={`/${locale}/admin/orders/${order.id}`}
                                                        style={{
                                                            padding: "6px",
                                                            borderRadius: "6px",
                                                            backgroundColor: "var(--bg-secondary)",
                                                            color: "var(--text-primary)",
                                                            display: "flex", alignItems: "center", justifyContent: "center"
                                                        }}
                                                        title={locale === "th" ? "ดูรายละเอียด" : "View Details"}
                                                    >
                                                        <Eye size={16} />
                                                    </Link>

                                                    {/* PENDING: Confirm or Cancel */}
                                                    {order.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: "6px",
                                                                    borderRadius: "6px",
                                                                    backgroundColor: "rgba(135, 206, 235, 0.2)",
                                                                    color: "#87CEEB",
                                                                    border: "none",
                                                                    cursor: "pointer"
                                                                }}
                                                                title={locale === "th" ? "ยืนยันคำสั่งซื้อ" : "Confirm Order"}
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: "6px",
                                                                    borderRadius: "6px",
                                                                    backgroundColor: "rgba(255, 182, 193, 0.2)",
                                                                    color: "#FFB6C1",
                                                                    border: "none",
                                                                    cursor: "pointer"
                                                                }}
                                                                title={locale === "th" ? "ยกเลิกคำสั่งซื้อ" : "Cancel Order"}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* CONFIRMED: Start Active or Cancel */}
                                                    {order.status === "CONFIRMED" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, "ACTIVE")}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: "6px",
                                                                    borderRadius: "6px",
                                                                    backgroundColor: "rgba(127, 255, 212, 0.2)",
                                                                    color: "#7FFFD4",
                                                                    border: "none",
                                                                    cursor: "pointer"
                                                                }}
                                                                title={locale === "th" ? "เริ่มเช่า" : "Start Rental"}
                                                            >
                                                                <Play size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                                                disabled={isLoading}
                                                                style={{
                                                                    padding: "6px",
                                                                    borderRadius: "6px",
                                                                    backgroundColor: "rgba(255, 182, 193, 0.2)",
                                                                    color: "#FFB6C1",
                                                                    border: "none",
                                                                    cursor: "pointer"
                                                                }}
                                                                title={locale === "th" ? "ยกเลิกคำสั่งซื้อ" : "Cancel Order"}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* ACTIVE: Complete (costume returned) */}
                                                    {order.status === "ACTIVE" && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                                            disabled={isLoading}
                                                            style={{
                                                                padding: "6px",
                                                                borderRadius: "6px",
                                                                backgroundColor: new Date(order.endDate) < new Date()
                                                                    ? "rgba(255, 100, 100, 0.2)"
                                                                    : "rgba(147, 112, 219, 0.2)",
                                                                color: new Date(order.endDate) < new Date()
                                                                    ? "#FF6464"
                                                                    : "#9370DB",
                                                                border: "none",
                                                                cursor: "pointer"
                                                            }}
                                                            title={locale === "th"
                                                                ? (new Date(order.endDate) < new Date() ? "เลยกำหนด! คลิกเพื่อยืนยันคืน" : "คืนแล้ว")
                                                                : (new Date(order.endDate) < new Date() ? "Overdue! Click to confirm return" : "Mark as Returned")}
                                                        >
                                                            {new Date(order.endDate) < new Date() && <AlertTriangle size={16} />}
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                        <Clock size={40} style={{ opacity: 0.5, marginBottom: "12px" }} />
                        <p>{locale === "th" ? "ไม่พบคำสั่งซื้อ" : "No orders found"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
