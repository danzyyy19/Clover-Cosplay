"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
    const locale = useLocale();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError(locale === "th" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError(locale === "th" ? "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" : "Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setError(locale === "th" ? "อีเมลนี้ถูกใช้งานแล้ว" : "Email already registered");
                } else {
                    setError(data.error || (locale === "th" ? "เกิดข้อผิดพลาด" : "Something went wrong"));
                }
            } else {
                setSuccess(true);
                toast.success(
                    locale === "th" ? "สมัครสมาชิกสำเร็จ!" : "Registration successful!",
                    { description: locale === "th" ? "กำลังนำคุณไปหน้าเข้าสู่ระบบ" : "Redirecting to login page" }
                );
                setTimeout(() => {
                    router.push(`/${locale}/login`);
                }, 2000);
            }
        } catch (err) {
            setError(locale === "th" ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "380px",
                        backgroundColor: "var(--bg-card)",
                        border: "2px solid var(--border-color)",
                        borderRadius: "20px",
                        padding: "32px",
                        textAlign: "center",
                    }}
                >
                    <CheckCircle size={48} color="#7FFFD4" style={{ marginBottom: "16px" }} />
                    <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px", color: "var(--text-primary)" }}>
                        {locale === "th" ? "สมัครสมาชิกสำเร็จ!" : "Registration Successful!"}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                        {locale === "th" ? "กำลังนำคุณไปหน้าเข้าสู่ระบบ..." : "Redirecting you to login..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                    backgroundColor: "var(--bg-card)",
                    border: "2px solid var(--border-color)",
                    borderRadius: "20px",
                    padding: "24px 28px",
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <Link href={`/${locale}`} style={{ display: "inline-block" }}>
                        <div style={{ width: "50px", height: "50px", margin: "0 auto 10px", position: "relative" }}>
                            <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                        </div>
                    </Link>
                    <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "4px" }}>
                        <span className="text-gradient">{locale === "th" ? "สมัครสมาชิก" : "Create Account"}</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                        {locale === "th" ? "เริ่มต้นการผจญภัยคอสเพลย์ของคุณ" : "Start your cosplay adventure"}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            backgroundColor: "rgba(255, 182, 193, 0.2)",
                            border: "1px solid #FFB6C1",
                            borderRadius: "10px",
                            padding: "10px 12px",
                            marginBottom: "14px",
                            color: "#FFB6C1",
                            fontSize: "13px",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", marginBottom: "5px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                            {locale === "th" ? "ชื่อ-นามสกุล" : "Full Name"}
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "10px 12px" }}>
                            <User size={16} color="var(--text-secondary)" />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={locale === "th" ? "ชื่อของคุณ" : "Your name"} required disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px" }} />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", marginBottom: "5px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                            {locale === "th" ? "อีเมล" : "Email"}
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "10px 12px" }}>
                            <Mail size={16} color="var(--text-secondary)" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px" }} />
                        </div>
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", marginBottom: "5px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                            {locale === "th" ? "เบอร์โทรศัพท์" : "Phone Number"}
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "10px 12px" }}>
                            <Phone size={16} color="var(--text-secondary)" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0XX-XXX-XXXX" disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px" }} />
                        </div>
                    </div>

                    {/* Password Row - Side by Side */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                                {locale === "th" ? "รหัสผ่าน" : "Password"}
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "10px 12px" }}>
                                <Lock size={16} color="var(--text-secondary)" />
                                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={8} disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", width: "100%" }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                                {locale === "th" ? "ยืนยัน" : "Confirm"}
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "10px 12px" }}>
                                <Lock size={16} color="var(--text-secondary)" />
                                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required minLength={8} disabled={loading} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px", width: "100%" }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                            {locale === "th" ? "อย่างน้อย 8 ตัวอักษร" : "Min 8 characters"}
                        </p>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "var(--color-clover-purple)" }}>
                            {showPassword ? (locale === "th" ? "ซ่อน" : "Hide") : (locale === "th" ? "แสดง" : "Show")}
                        </button>
                    </div>

                    {/* Terms */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                            <input type="checkbox" required style={{ marginTop: "2px", accentColor: "#9370DB" }} />
                            <span style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.4" }}>
                                {locale === "th" ? "ฉันยอมรับ " : "I agree to the "}
                                <Link href={`/${locale}/rules`} style={{ color: "var(--color-clover-purple)" }}>
                                    {locale === "th" ? "ข้อกำหนดและเงื่อนไข" : "Terms and Conditions"}
                                </Link>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: "100%", padding: "12px", fontSize: "14px", justifyContent: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                        {loading ? (locale === "th" ? "กำลังสมัคร..." : "Creating...") : (locale === "th" ? "สมัครสมาชิก" : "Create Account")}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{locale === "th" ? "หรือ" : "or"}</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
                </div>

                {/* Login Link */}
                <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
                    {locale === "th" ? "มีบัญชีอยู่แล้ว?" : "Already have an account?"}
                    <Link href={`/${locale}/login`} style={{ color: "var(--color-clover-purple)", fontWeight: "600", marginLeft: "6px", textDecoration: "none" }}>
                        {locale === "th" ? "เข้าสู่ระบบ" : "Sign In"} <ArrowRight size={14} style={{ display: "inline", marginLeft: "2px", verticalAlign: "middle" }} />
                    </Link>
                </p>

                {/* Back to Home */}
                <div style={{ textAlign: "center", marginTop: "14px" }}>
                    <Link href={`/${locale}`} style={{ color: "var(--text-secondary)", fontSize: "12px", textDecoration: "none" }}>
                        ← {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
