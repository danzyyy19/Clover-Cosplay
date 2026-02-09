"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Calendar,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Sun,
    Moon,
    Globe,
    ChevronDown,
    Home,
} from "lucide-react";

interface CustomerSidebarProps {
    children: React.ReactNode;
}

export function CustomerSidebar({ children }: CustomerSidebarProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, labelEn: "Dashboard", labelTh: "แดชบอร์ด", href: `/${locale}/customer` },
        { icon: Calendar, labelEn: "My Bookings", labelTh: "การจองของฉัน", href: `/${locale}/customer/bookings` },
        { icon: CreditCard, labelEn: "Payments", labelTh: "การชำระเงิน", href: `/${locale}/customer/payments` },
        { icon: FileText, labelEn: "Receipts", labelTh: "ใบเสร็จ", href: `/${locale}/customer/receipts` },
        { icon: Settings, labelEn: "Settings", labelTh: "ตั้งค่า", href: `/${locale}/customer/settings` },
    ];

    const isActive = (href: string) => {
        if (href === `/${locale}/customer`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push(`/${locale}/login`);
    };

    const switchLocale = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
        setLangOpen(false);
    };

    const currentTheme = mounted ? resolvedTheme : "dark";

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: "220px",
                    backgroundColor: "var(--bg-secondary)",
                    borderRight: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 40,
                }}
            >
                {/* Logo */}
                <div style={{ padding: "16px", borderBottom: "1px solid var(--border-color)" }}>
                    <Link href={`/${locale}/customer`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        <div style={{ width: "32px", height: "32px", position: "relative" }}>
                            <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                        </div>
                        <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "14px" }}>
                            Clover Cosplay
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)" }}>
                    <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "13px", marginBottom: "2px" }}>
                        {session?.user?.name || "User"}
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {session?.user?.email}
                    </p>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
                    <p style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "10px", letterSpacing: "0.5px" }}>
                        {locale === "th" ? "เมนู" : "Menu"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "9px 10px",
                                        borderRadius: "8px",
                                        backgroundColor: active ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                        textDecoration: "none",
                                    }}
                                >
                                    <Icon size={15} color={active ? "#9370DB" : "var(--text-secondary)"} />
                                    <span style={{ fontSize: "12px", color: active ? "#9370DB" : "var(--text-primary)", fontWeight: active ? "600" : "400" }}>
                                        {locale === "th" ? item.labelTh : item.labelEn}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer Actions */}
                <div style={{ padding: "14px", borderTop: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                        {/* Language */}
                        <div style={{ position: "relative", flex: 1 }}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "5px",
                                    padding: "7px",
                                    borderRadius: "6px",
                                    background: "var(--bg-primary)",
                                    border: "1px solid var(--border-color)",
                                    cursor: "pointer",
                                    color: "var(--text-secondary)",
                                    fontSize: "11px",
                                }}
                            >
                                <Globe size={12} />
                                {locale === "th" ? "TH" : "EN"}
                                <ChevronDown size={10} />
                            </button>
                            {langOpen && (
                                <div style={{
                                    position: "absolute",
                                    bottom: "100%",
                                    left: 0,
                                    right: 0,
                                    marginBottom: "4px",
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    zIndex: 100,
                                }}>
                                    <button
                                        onClick={() => switchLocale("en")}
                                        style={{
                                            width: "100%",
                                            padding: "7px 10px",
                                            border: "none",
                                            background: locale === "en" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                            color: "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "11px",
                                            textAlign: "left",
                                        }}
                                    >
                                        🇬🇧 English
                                    </button>
                                    <button
                                        onClick={() => switchLocale("th")}
                                        style={{
                                            width: "100%",
                                            padding: "7px 10px",
                                            border: "none",
                                            background: locale === "th" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                            color: "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "11px",
                                            textAlign: "left",
                                        }}
                                    >
                                        🇹🇭 ภาษาไทย
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Theme */}
                        <button
                            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                            style={{
                                padding: "7px 10px",
                                borderRadius: "6px",
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-color)",
                                cursor: "pointer",
                                color: "var(--text-secondary)",
                            }}
                        >
                            {mounted && (currentTheme === "dark" ? <Sun size={12} /> : <Moon size={12} />)}
                        </button>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "9px",
                            borderRadius: "6px",
                            border: "1px solid rgba(255, 182, 193, 0.3)",
                            background: "rgba(255, 182, 193, 0.1)",
                            color: "#FFB6C1",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500",
                        }}
                    >
                        <LogOut size={13} />
                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: "220px", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    );
}
