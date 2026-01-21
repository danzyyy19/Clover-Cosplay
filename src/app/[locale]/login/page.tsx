"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const locale = useLocale();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(locale === "th" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "Invalid email or password");
                toast.error(locale === "th" ? "เข้าสู่ระบบไม่สำเร็จ" : "Login failed");
            } else {
                // Get session to check user role
                const session = await getSession();
                const userRole = session?.user?.role;

                // Show success toast
                toast.success(
                    locale === "th" ? "เข้าสู่ระบบสำเร็จ!" : "Login successful!",
                    { description: locale === "th" ? `ยินดีต้อนรับ, ${session?.user?.name || ""}` : `Welcome, ${session?.user?.name || ""}` }
                );

                // Redirect based on role
                if (userRole === "ADMIN") {
                    router.push(`/${locale}/admin`);
                } else {
                    router.push(`/${locale}/customer`);
                }
                router.refresh();
            }
        } catch (err) {
            setError(locale === "th" ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Something went wrong. Please try again.");
            toast.error(locale === "th" ? "เกิดข้อผิดพลาด" : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

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
                    padding: "28px 32px",
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Link href={`/${locale}`} style={{ display: "inline-block" }}>
                        <div style={{ width: "60px", height: "60px", margin: "0 auto 12px", position: "relative" }}>
                            <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                        </div>
                    </Link>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>
                        <span className="text-gradient">{locale === "th" ? "เข้าสู่ระบบ" : "Welcome Back"}</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                        {locale === "th" ? "ลงชื่อเข้าใช้บัญชีของคุณ" : "Sign in to your account"}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            backgroundColor: "rgba(255, 182, 193, 0.2)",
                            border: "1px solid #FFB6C1",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            marginBottom: "16px",
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
                    {/* Email */}
                    <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "6px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                            {locale === "th" ? "อีเมล" : "Email"}
                        </label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                backgroundColor: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "10px",
                                padding: "11px 14px",
                            }}
                        >
                            <Mail size={18} color="var(--text-secondary)" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", marginBottom: "6px", color: "var(--text-primary)", fontWeight: "500", fontSize: "13px" }}>
                            {locale === "th" ? "รหัสผ่าน" : "Password"}
                        </label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                backgroundColor: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "10px",
                                padding: "11px 14px",
                            }}
                        >
                            <Lock size={18} color="var(--text-secondary)" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} color="var(--text-secondary)" />
                                ) : (
                                    <Eye size={18} color="var(--text-secondary)" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div style={{ textAlign: "right", marginBottom: "18px" }}>
                        <Link
                            href={`/${locale}/forgot-password`}
                            style={{ color: "var(--color-clover-purple)", fontSize: "13px", textDecoration: "none" }}
                        >
                            {locale === "th" ? "ลืมรหัสผ่าน?" : "Forgot password?"}
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "14px",
                            justifyContent: "center",
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                        {loading
                            ? (locale === "th" ? "กำลังเข้าสู่ระบบ..." : "Signing in...")
                            : (locale === "th" ? "เข้าสู่ระบบ" : "Sign In")
                        }
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                        {locale === "th" ? "หรือ" : "or"}
                    </span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-color)" }} />
                </div>

                {/* Register Link */}
                <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                    {locale === "th" ? "ยังไม่มีบัญชี?" : "Don't have an account?"}
                    <Link
                        href={`/${locale}/register`}
                        style={{
                            color: "var(--color-clover-purple)",
                            fontWeight: "600",
                            marginLeft: "6px",
                            textDecoration: "none",
                        }}
                    >
                        {locale === "th" ? "สมัครสมาชิก" : "Sign Up"}
                        <ArrowRight size={14} style={{ display: "inline", marginLeft: "3px", verticalAlign: "middle" }} />
                    </Link>
                </p>

                {/* Back to Home */}
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <Link
                        href={`/${locale}`}
                        style={{ color: "var(--text-secondary)", fontSize: "13px", textDecoration: "none" }}
                    >
                        ← {locale === "th" ? "กลับหน้าหลัก" : "Back to Home"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
