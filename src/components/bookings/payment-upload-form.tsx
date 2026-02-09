"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
    ChevronLeft,
    CreditCard,
    Upload,
    Image as ImageIcon,
    Check,
    Copy,
    Loader2,
    AlertCircle
} from "lucide-react";

interface PaymentUploadFormProps {
    booking: {
        id: string;
        product: {
            nameEn: string;
            nameTh: string;
        };
        startDate: Date;
        endDate: Date;
        totalPrice: number; // Decimal in Prisma but cast to number for simple display or keep as is?
        // Prisma Decimal passes as { padding, etc } usually, often better to serialize to string or number before passing to client component.
        // We will assume it's passed as number or string. Let's say number for now.
    };
    bankAccount: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    initialPayment?: {
        id: string;
        amount: number;
        proofImageUrl: string | null;
        status: string;
    };
}

export function PaymentUploadForm({ booking, bankAccount, initialPayment }: PaymentUploadFormProps) {
    const locale = useLocale();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialPayment?.proofImageUrl || null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(bankAccount.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!file && !initialPayment?.proofImageUrl) return; // If no file selected AND no initial image, return

        // If simply viewing existing payment without changing file, do nothing or show updated message
        if (!file && initialPayment?.proofImageUrl) {
            // If they clicked update but didn't change the file, we can either:
            // 1. Return immediately
            // 2. Or if they are allowed to update other fields (like re-submitting to change status), logic changes.
            // For now, let's assume they must select a file to Update.
            // BUT wait, if they just want to see it, they shouldn't need to click "Submit".
            // The request was: "if paid, show receipt and edit button".
            // So if file is null but we have initialPayment, maybe just alert "Please select a new image to update".
            if (!file) {
                alert(locale === "th" ? "กรุณาเลือกรูปภาพใหม่เพื่อแก้ไข" : "Please select a new image to update.");
                return;
            }
        }

        setLoading(true);

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file!); // file is known to be present here due to check above

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const errorData = await uploadRes.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const { url } = await uploadRes.json();

            // 2. Create/Update Payment Record
            const paymentRes = await fetch("/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: booking.id,
                    amount: booking.totalPrice,
                    proofImageUrl: url,
                    bankName: bankAccount.bankName,
                    accountNumber: bankAccount.accountNumber,
                }),
            });

            if (!paymentRes.ok) {
                const errorData = await paymentRes.json();
                throw new Error(errorData.error || "Payment submission failed");
            }

            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", borderRadius: "50%", background: "linear-gradient(135deg, #7FFFD4, #40E0D0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={40} color="#0D0D1A" />
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                    <span className="text-gradient">
                        {locale === "th"
                            ? (initialPayment ? "แก้ไขหลักฐานสำเร็จ!" : "อัปโหลดสำเร็จ!")
                            : (initialPayment ? "Proof Updated!" : "Upload Successful!")}
                    </span>
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                    {locale === "th"
                        ? "เราจะตรวจสอบการชำระเงินของคุณภายใน 24 ชั่วโมง"
                        : "We will verify your payment within 24 hours"
                    }
                </p>
                <Link
                    href={`/${locale}/customer/bookings`}
                    className="btn-primary"
                    style={{ padding: "12px 24px" }}
                >
                    {locale === "th" ? "ดูการจองของฉัน" : "View My Bookings"}
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px" }}>
            {/* Back Link */}
            <Link
                href={`/${locale}/customer/bookings/${booking.id}`}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    marginBottom: "24px",
                    fontSize: "14px",
                }}
            >
                <ChevronLeft size={18} />
                {locale === "th" ? "กลับไปรายละเอียดการจอง" : "Back to Booking Details"}
            </Link>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <CreditCard size={32} color="#9370DB" />
                <div>
                    <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>
                        <span className="text-gradient">
                            {initialPayment
                                ? (locale === "th" ? "แก้ไขหลักฐานการโอน" : "Edit Payment Proof")
                                : (locale === "th" ? "อัปโหลดหลักฐานการชำระเงิน" : "Upload Payment Proof")
                            }
                        </span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                        {locale === "th" ? `การจอง #${booking.id}` : `Booking #${booking.id}`}
                    </p>
                </div>
            </div>

            {/* Booking Summary */}
            <div
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "14px",
                    padding: "16px",
                    marginBottom: "20px",
                }}
            >
                <h3 style={{ fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)", fontSize: "15px" }}>
                    {locale === "th" ? booking.product.nameTh : booking.product.nameEn}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-secondary)" }}>
                    <span>
                        {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                    <span style={{ fontWeight: "bold", color: "#9370DB" }}>฿{Number(booking.totalPrice).toLocaleString()}</span>
                </div>
            </div>

            {/* Bank Account Info */}
            <div
                style={{
                    backgroundColor: "rgba(147, 112, 219, 0.1)",
                    border: "1px solid rgba(147, 112, 219, 0.3)",
                    borderRadius: "14px",
                    padding: "20px",
                    marginBottom: "20px",
                }}
            >
                <h3 style={{ fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)", fontSize: "15px" }}>
                    {locale === "th" ? "โอนเงินไปยัง" : "Transfer to"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{locale === "th" ? "ธนาคาร" : "Bank"}</span>
                        <span style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "14px" }}>{bankAccount.bankName}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{locale === "th" ? "เลขบัญชี" : "Account No."}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: "600", color: "#9370DB", fontSize: "16px", letterSpacing: "1px" }}>{bankAccount.accountNumber}</span>
                            <button
                                onClick={handleCopy}
                                style={{
                                    padding: "6px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "var(--bg-card)",
                                    cursor: "pointer",
                                }}
                            >
                                {copied ? <Check size={14} color="#7FFFD4" /> : <Copy size={14} color="var(--text-secondary)" />}
                            </button>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{locale === "th" ? "ชื่อบัญชี" : "Account Name"}</span>
                        <span style={{ fontWeight: "500", color: "var(--text-primary)", fontSize: "14px" }}>{bankAccount.accountName}</span>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "2px dashed var(--border-color)",
                    borderRadius: "14px",
                    padding: "24px",
                    marginBottom: "20px",
                    textAlign: "center",
                }}
            >
                {preview ? (
                    <div>
                        <img src={preview} alt="Payment proof" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", marginBottom: "12px" }} />
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{file ? file.name : (locale === "th" ? "รูปภาพปัจจุบัน" : "Current Image")}</p>
                    </div>
                ) : (
                    <>
                        <ImageIcon size={40} color="var(--text-secondary)" style={{ marginBottom: "12px" }} />
                        <p style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "4px" }}>
                            {locale === "th" ? "เลือกรูปภาพหลักฐานการโอน" : "Select payment proof image"}
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                            PNG, JPG (max 5MB)
                        </p>
                    </>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="proof-upload"
                />
                <label
                    htmlFor="proof-upload"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        marginTop: "12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    <Upload size={16} />
                    {preview ? (locale === "th" ? "เปลี่ยนรูป" : "Change Image") : (locale === "th" ? "เลือกไฟล์" : "Choose File")}
                </label>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "15px",
                    justifyContent: "center",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {loading
                    ? (locale === "th" ? "กำลังอัปโหลด..." : "Uploading...")
                    : (initialPayment
                        ? (locale === "th" ? "อัปเดตหลักฐานการชำระเงิน" : "Update Payment Proof")
                        : (locale === "th" ? "ส่งหลักฐานการชำระเงิน" : "Submit Payment Proof")
                    )
                }
            </button>

            {/* Note */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "16px" }}>
                <AlertCircle size={16} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>
                    {locale === "th"
                        ? "หลังจากอัปโหลด ทีมงานจะตรวจสอบและยืนยันภายใน 24 ชั่วโมง"
                        : "After uploading, our team will verify and confirm within 24 hours"
                    }
                </p>
            </div>
        </div>
    );
}
