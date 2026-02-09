"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";

export function Footer() {
    const locale = useLocale();

    return (
        <footer style={{
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-color)",
            padding: "20px 0",
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    {/* Logo & Brand */}
                    <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                        <div style={{ width: "24px", height: "24px", position: "relative" }}>
                            <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                        </div>
                        <span className="text-gradient" style={{ fontWeight: "600", fontSize: "14px" }}>
                            Clover Cosplay
                        </span>
                    </Link>

                    {/* Links */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <Link href={`/${locale}/products`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "12px" }}>
                            {locale === "th" ? "สินค้า" : "Products"}
                        </Link>
                        <Link href={`/${locale}/rules`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "12px" }}>
                            {locale === "th" ? "กฎการเช่า" : "Rental Rules"}
                        </Link>
                        <Link href={`/${locale}/guide`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "12px" }}>
                            {locale === "th" ? "คู่มือการใช้งาน" : "User Guide"}
                        </Link>
                        <Link href={`/${locale}/login`} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "12px" }}>
                            {locale === "th" ? "เข้าสู่ระบบ" : "Login"}
                        </Link>
                    </div>

                    {/* Copyright */}
                    <p style={{ color: "var(--text-secondary)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                        © 2026 Clover Cosplay • Made with <Heart size={11} color="#FFB6C1" fill="#FFB6C1" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
