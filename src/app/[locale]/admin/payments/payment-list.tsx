"use client";

import { useState } from "react";
import { Check, X, Eye, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Define simplified types for the component props
interface Payment {
    id: string;
    status: string;
    amount: number;
    proofImageUrl: string | null;
    createdAt: Date;
    booking: {
        customer: {
            name: string;
        };
        product: {
            nameEn: string;
        };
    };
}

interface PaymentListProps {
    payments: Payment[];
}

export function PaymentList({ payments }: PaymentListProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/payments/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update status");
            }

            router.refresh(); // Refresh server data
        } catch (error) {
            console.error(error);
            alert("Failed to update status. Please try again.");
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "APPROVED": return { bg: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4", border: "#7FFFD4" };
            case "PENDING": return { bg: "rgba(240, 230, 140, 0.2)", color: "#F0E68C", border: "#F0E68C" };
            case "REJECTED": return { bg: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1", border: "#FFB6C1" };
            default: return { bg: "rgba(156, 163, 175, 0.2)", color: "#9CA3AF", border: "#9CA3AF" };
        }
    };

    if (payments.length === 0) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                <Clock size={40} style={{ opacity: 0.5, marginBottom: "12px" }} />
                <p>No payments found</p>
            </div>
        );
    }

    return (
        <div className="payment-grid">
            <style jsx global>{`
                .payment-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                
                @media (min-width: 768px) {
                    .payment-grid {
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    }
                }

                .payment-card {
                    background-color: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .payment-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .payment-amount {
                    font-size: 18px;
                    font-weight: bold;
                    color: #9370DB;
                }

                .action-btn {
                    flex: 1;
                    padding: 8px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }
                
                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>

            {payments.map((payment) => {
                const statusStyle = getStatusStyle(payment.status);
                const isPending = payment.status === "PENDING";
                const isLoading = loadingId === payment.id;

                return (
                    <div key={payment.id} className="payment-card">
                        <div className="card-header">
                            <div>
                                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "2px" }}>
                                    #{payment.id.slice(-6).toUpperCase()}
                                </p>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusStyle.color }}></span>
                                {payment.status}
                            </div>
                        </div>

                        <div style={{ padding: "12px 0", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
                            <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
                                {payment.booking.product.nameEn}
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <span>👤 {payment.booking.customer.name}</span>
                            </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="payment-amount">฿{payment.amount.toLocaleString()}</span>

                            {payment.proofImageUrl && (
                                <a
                                    href={payment.proofImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        backgroundColor: "var(--bg-secondary)",
                                        color: "var(--text-primary)",
                                        textDecoration: "none",
                                        fontSize: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px"
                                    }}
                                >
                                    <Eye size={14} /> Proof
                                </a>
                            )}
                        </div>

                        {/* Actions */}
                        {isPending && (
                            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                <button
                                    onClick={() => handleUpdateStatus(payment.id, "APPROVED")}
                                    disabled={isLoading}
                                    className="action-btn"
                                    style={{ backgroundColor: "rgba(127, 255, 212, 0.2)", color: "#7FFFD4" }}
                                >
                                    <Check size={16} /> Approve
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(payment.id, "REJECTED")}
                                    disabled={isLoading}
                                    className="action-btn"
                                    style={{ backgroundColor: "rgba(255, 182, 193, 0.2)", color: "#FFB6C1" }}
                                >
                                    <X size={16} /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
