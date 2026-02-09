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
    Package,
    ShoppingCart,
    CreditCard,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Sun,
    Moon,
    Globe,
    ChevronDown,
} from "lucide-react";

interface AdminSidebarProps {
    children: React.ReactNode;
}

export function AdminSidebar({ children }: AdminSidebarProps) {
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
        { icon: LayoutDashboard, labelEn: "Dashboard", labelTh: "แดชบอร์ด", href: `/${locale}/admin` },
        { icon: Package, labelEn: "Products", labelTh: "สินค้า", href: `/${locale}/admin/products` },
        { icon: ShoppingCart, labelEn: "Orders", labelTh: "คำสั่งซื้อ", href: `/${locale}/admin/orders` },
        { icon: CreditCard, labelEn: "Payments", labelTh: "การชำระเงิน", href: `/${locale}/admin/payments` },
        { icon: Users, labelEn: "Customers", labelTh: "ลูกค้า", href: `/${locale}/admin/customers` },
        { icon: BarChart3, labelEn: "Reports", labelTh: "รายงาน", href: `/${locale}/admin/reports` },
        { icon: Settings, labelEn: "Settings", labelTh: "ตั้งค่า", href: `/${locale}/admin/settings` },
    ];

    const isActive = (href: string) => {
        if (href === `/${locale}/admin`) {
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
                    width: "240px",
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
                <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)" }}>
                    <Link href={`/${locale}/admin`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        <div style={{ width: "36px", height: "36px", position: "relative" }}>
                            <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                        </div>
                        <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "16px" }}>
                            Clover Cosplay
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
                    <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px", marginBottom: "2px" }}>
                        {session?.user?.name || "Admin"}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {session?.user?.email}
                    </p>
                    <span style={{
                        display: "inline-block",
                        marginTop: "8px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "600",
                        backgroundColor: "rgba(255, 182, 193, 0.2)",
                        color: "#FFB6C1",
                    }}>
                        ADMIN
                    </span>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                    <p style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "12px", letterSpacing: "0.5px" }}>
                        {locale === "th" ? "เมนู" : "Menu"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        backgroundColor: active ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                        textDecoration: "none",
                                        transition: "background-color 0.15s",
                                    }}
                                >
                                    <Icon size={16} color={active ? "#9370DB" : "var(--text-secondary)"} />
                                    <span style={{ fontSize: "13px", color: active ? "#9370DB" : "var(--text-primary)", fontWeight: active ? "600" : "400" }}>
                                        {locale === "th" ? item.labelTh : item.labelEn}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer Actions */}
                <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        {/* Language */}
                        <div style={{ position: "relative", flex: 1 }}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    background: "var(--bg-primary)",
                                    border: "1px solid var(--border-color)",
                                    cursor: "pointer",
                                    color: "var(--text-secondary)",
                                    fontSize: "12px",
                                }}
                            >
                                <Globe size={14} />
                                {locale === "th" ? "TH" : "EN"}
                                <ChevronDown size={12} />
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
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    zIndex: 100,
                                }}>
                                    <button
                                        onClick={() => switchLocale("en")}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "none",
                                            background: locale === "en" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                            color: "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            textAlign: "left",
                                        }}
                                    >
                                        🇬🇧 English
                                    </button>
                                    <button
                                        onClick={() => switchLocale("th")}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "none",
                                            background: locale === "th" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                            color: "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "12px",
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
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-color)",
                                cursor: "pointer",
                                color: "var(--text-secondary)",
                            }}
                        >
                            {mounted && (currentTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />)}
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
                            gap: "8px",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 182, 193, 0.3)",
                            background: "rgba(255, 182, 193, 0.1)",
                            color: "#FFB6C1",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                        }}
                    >
                        <LogOut size={14} />
                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: "240px", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    );
}
