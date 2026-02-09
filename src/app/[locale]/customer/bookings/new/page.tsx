"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { ArrowLeft, Calendar, Clock, CreditCard, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: string;
    nameEn: string;
    nameTh: string;
    anime: string;
    character: string;
    pricePerDay: number;
    size: string | null;
    stock: number;
    images: { url: string }[];
}

function NewBookingContent() {
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const productId = searchParams.get("product");

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [acceptRules, setAcceptRules] = useState(false);

    useEffect(() => {
        if (productId) {
            fetch(`/api/products/${productId}`)
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error("Failed to load product");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [productId]);

    // Calculate total days and price
    const calculateTotal = () => {
        if (!startDate || !endDate || !product) return { days: 0, total: 0 };
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (days < 1) return { days: 0, total: 0 };
        return { days, total: days * product.pricePerDay };
    };

    const { days, total } = calculateTotal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !session?.user) return;

        if (!acceptRules) {
            toast.error(locale === "th" ? "กรุณายอมรับกฎการเช่า" : "Please accept rental rules");
            return;
        }

        if (days < 1) {
            toast.error(locale === "th" ? "กรุณาเลือกวันที่ถูกต้อง" : "Please select valid dates");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    startDate,
                    endDate,
                    totalDays: days,
                    totalPrice: total,
                    rulesAccepted: acceptRules,
                }),
            });

            if (res.ok) {
                const booking = await res.json();
                toast.success(locale === "th" ? "สร้างการจองสำเร็จ!" : "Booking created successfully!");
                router.push(`/${locale}/customer/bookings/${booking.id}`);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create booking");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    // Get today's date for min date
    const today = new Date().toISOString().split("T")[0];

    const pageTitle = locale === "th" ? "สร้างการจอง" : "Create Booking";

    if (loading) {
        return (
            <CustomerLayout pageTitle={pageTitle}>
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                    {locale === "th" ? "กำลังโหลด..." : "Loading..."}
                </div>
            </CustomerLayout>
        );
    }

    if (!product) {
        return (
            <CustomerLayout pageTitle={pageTitle}>
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-color)",
                }}>
                    <AlertCircle size={48} color="#FFB6C1" style={{ marginBottom: "16px" }} />
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px" }}>
                        {locale === "th" ? "ไม่พบสินค้า" : "Product not found"}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                        {locale === "th" ? "กรุณาเลือกสินค้าที่ต้องการจองก่อน" : "Please select a product to book first"}
                    </p>
                    <Link
                        href={`/${locale}/customer/products`}
                        className="btn-primary"
                        style={{ padding: "12px 24px" }}
                    >
                        {locale === "th" ? "เลือกสินค้า" : "Browse Products"}
                    </Link>
                </div>
            </CustomerLayout>
        );
    }

    const productName = locale === "th" && product.nameTh ? product.nameTh : product.nameEn;
    const mainImage = product.images?.[0]?.url || "/images/placeholder-costume.png";

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "14px",
        outline: "none",
    };

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "500" as const,
        color: "var(--text-secondary)",
        marginBottom: "8px",
    };

    return (
        <CustomerLayout pageTitle={pageTitle}>
            {/* Back Button */}
            <Link
                href={`/${locale}/customer/products/${product.id}`}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "13px",
                    marginBottom: "20px",
                }}
            >
                <ArrowLeft size={16} />
                {locale === "th" ? "กลับไปหน้าสินค้า" : "Back to Product"}
            </Link>

            <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Product Summary */}
                    <div style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "16px",
                        display: "flex",
                        gap: "16px",
                    }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            flexShrink: 0,
                        }}>
                            <Image
                                src={mainImage}
                                alt={productName}
                                width={80}
                                height={80}
                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "var(--text-primary)",
                                marginBottom: "4px",
                            }}>
                                {productName}
                            </h2>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                                {product.anime} • {product.character}
                            </p>
                            <span style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#9370DB",
                            }}>
                                ฿{product.pricePerDay.toLocaleString()}
                                <span style={{ fontSize: "12px", fontWeight: "400", color: "var(--text-secondary)" }}>
                                    /{locale === "th" ? "วัน" : "day"}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "20px",
                    }}>
                        <h3 style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <Calendar size={18} color="#9370DB" />
                            {locale === "th" ? "เลือกวันที่เช่า" : "Select Rental Dates"}
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div>
                                <label style={labelStyle}>
                                    {locale === "th" ? "วันเริ่มต้น" : "Start Date"} *
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={today}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    {locale === "th" ? "วันสิ้นสุด" : "End Date"} *
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || today}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        {days > 0 && (
                            <div style={{
                                marginTop: "16px",
                                padding: "12px",
                                backgroundColor: "var(--bg-secondary)",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}>
                                <Clock size={16} color="#7FFFD4" />
                                <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                    {locale === "th" ? `ระยะเวลาเช่า: ${days} วัน` : `Rental duration: ${days} days`}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Rental Rules */}
                    <div style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "20px",
                    }}>
                        <h3 style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "12px",
                        }}>
                            {locale === "th" ? "กฎการเช่า" : "Rental Rules"}
                        </h3>
                        <ul style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            paddingLeft: "20px",
                            marginBottom: "16px",
                            lineHeight: "1.8",
                        }}>
                            <li>{locale === "th" ? "กรุณาคืนชุดภายในเวลาที่กำหนด" : "Please return the costume on time"}</li>
                            <li>{locale === "th" ? "หากเกิดความเสียหาย ต้องชดใช้ตามราคาจริง" : "Damages must be compensated"}</li>
                            <li>{locale === "th" ? "ต้องมัดจำ 50% ล่วงหน้า" : "50% deposit required in advance"}</li>
                        </ul>

                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                        }}>
                            <input
                                type="checkbox"
                                checked={acceptRules}
                                onChange={(e) => setAcceptRules(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "#9370DB" }}
                            />
                            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                {locale === "th" ? "ฉันยอมรับกฎการเช่าทั้งหมด" : "I accept all rental rules"}
                            </span>
                        </label>
                    </div>

                    {/* Order Summary */}
                    <div style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "16px",
                        padding: "20px",
                    }}>
                        <h3 style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <CreditCard size={18} color="#9370DB" />
                            {locale === "th" ? "สรุปการสั่งซื้อ" : "Order Summary"}
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>
                                    {locale === "th" ? "ราคาต่อวัน" : "Price per day"}
                                </span>
                                <span style={{ color: "var(--text-primary)" }}>
                                    ฿{product.pricePerDay.toLocaleString()}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                <span style={{ color: "var(--text-secondary)" }}>
                                    {locale === "th" ? "จำนวนวัน" : "Number of days"}
                                </span>
                                <span style={{ color: "var(--text-primary)" }}>
                                    {days} {locale === "th" ? "วัน" : "days"}
                                </span>
                            </div>
                            <div style={{
                                borderTop: "1px solid var(--border-color)",
                                paddingTop: "12px",
                                marginTop: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                                <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                                    {locale === "th" ? "ยอดรวม" : "Total"}
                                </span>
                                <span style={{ fontSize: "20px", fontWeight: "bold", color: "#9370DB" }}>
                                    ฿{total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || !acceptRules || days < 1}
                        className="btn-primary"
                        style={{
                            width: "100%",
                            padding: "16px",
                            fontSize: "15px",
                            justifyContent: "center",
                            opacity: (submitting || !acceptRules || days < 1) ? 0.5 : 1,
                        }}
                    >
                        <Check size={18} />
                        {submitting
                            ? (locale === "th" ? "กำลังดำเนินการ..." : "Processing...")
                            : (locale === "th" ? "ยืนยันการจอง" : "Confirm Booking")
                        }
                    </button>
                </div>
            </form>
        </CustomerLayout>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
            <NewBookingContent />
        </Suspense>
    );
}
