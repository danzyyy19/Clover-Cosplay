"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Menu,
    X,
    Sun,
    Moon,
    Globe,
    LogIn,
    LogOut,
    ShoppingBag,
    Home,
    BookOpen,
    ChevronDown,
    User,
    LayoutDashboard,
} from "lucide-react";

export function Navbar() {
    const t = useTranslations("nav");
    const locale = useLocale();
    const { resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setLangOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const navLinks = [
        { href: `/${locale}`, label: t("home"), icon: Home },
        { href: `/${locale}/products`, label: t("products"), icon: ShoppingBag },
        { href: `/${locale}/rules`, label: t("rules"), icon: BookOpen },
    ];

    const switchLocale = (newLocale: string) => {
        // Replace the current locale in the path
        const segments = pathname.split('/');
        segments[1] = newLocale; // Replace locale segment
        const newPath = segments.join('/');
        router.push(newPath);
        setLangOpen(false);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push(`/${locale}/login`);
        setUserMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (session?.user?.role === "ADMIN") {
            return `/${locale}/admin`;
        }
        return `/${locale}/customer`;
    };

    const isActive = (href: string) => pathname === href;
    const currentTheme = mounted ? resolvedTheme : "dark";
    const isLoggedIn = status === "authenticated" && session?.user;

    return (
        <>
            {/* Main Navbar */}
            <nav style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                backgroundColor: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border-color)",
            }}>
                <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
                        {/* Logo */}
                        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                            <div style={{ width: "36px", height: "36px", position: "relative", flexShrink: 0 }}>
                                <Image src="/images/logo.png" alt="Clover Cosplay" fill style={{ objectFit: "contain" }} />
                            </div>
                            <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "16px" }}>
                                Clover Cosplay
                            </span>
                        </Link>

                        {/* Desktop Navigation - Hidden on mobile */}
                        <div className="desktop-nav" style={{ alignItems: "center", gap: "20px" }}>
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                            textDecoration: "none",
                                            color: isActive(link.href) ? "#9370DB" : "var(--text-secondary)",
                                            backgroundColor: isActive(link.href) ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                            fontWeight: "500",
                                        }}
                                    >
                                        <Icon size={15} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Section */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {/* Language Switcher - Desktop only */}
                            <div className="desktop-only" style={{ position: "relative" }}>
                                <button
                                    onClick={() => { setLangOpen(!langOpen); setUserMenuOpen(false); }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        background: "none",
                                        border: "1px solid var(--border-color)",
                                        cursor: "pointer",
                                        color: "var(--text-secondary)",
                                        fontSize: "12px",
                                    }}
                                >
                                    <Globe size={14} />
                                    <span>{locale === "th" ? "TH" : "EN"}</span>
                                    <ChevronDown size={12} />
                                </button>
                                {langOpen && (
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: 0,
                                        marginTop: "6px",
                                        backgroundColor: "var(--bg-card)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        minWidth: "130px",
                                        zIndex: 100,
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                    }}>
                                        <button
                                            onClick={() => switchLocale("en")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                width: "100%",
                                                padding: "10px 14px",
                                                border: "none",
                                                background: locale === "en" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                                color: "var(--text-primary)",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                textAlign: "left",
                                            }}
                                        >
                                            🇬🇧 English
                                        </button>
                                        <button
                                            onClick={() => switchLocale("th")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                width: "100%",
                                                padding: "10px 14px",
                                                border: "none",
                                                background: locale === "th" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                                color: "var(--text-primary)",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                textAlign: "left",
                                            }}
                                        >
                                            🇹🇭 ภาษาไทย
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle - Desktop only */}
                            <button
                                className="desktop-only"
                                onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                                style={{
                                    padding: "8px",
                                    borderRadius: "8px",
                                    background: "none",
                                    border: "1px solid var(--border-color)",
                                    cursor: "pointer",
                                    color: "var(--text-secondary)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {mounted && (currentTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />)}
                            </button>

                            {/* User Section - Desktop only */}
                            <div className="desktop-only">
                                {isLoggedIn ? (
                                    <div style={{ position: "relative" }}>
                                        <button
                                            onClick={() => { setUserMenuOpen(!userMenuOpen); setLangOpen(false); }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                background: "rgba(147, 112, 219, 0.15)",
                                                border: "1px solid rgba(147, 112, 219, 0.3)",
                                                cursor: "pointer",
                                                color: "#9370DB",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            <User size={14} />
                                            <span>{session.user.name?.split(' ')[0] || "User"}</span>
                                            <ChevronDown size={12} />
                                        </button>
                                        {userMenuOpen && (
                                            <div style={{
                                                position: "absolute",
                                                top: "100%",
                                                right: 0,
                                                marginTop: "6px",
                                                backgroundColor: "var(--bg-card)",
                                                border: "1px solid var(--border-color)",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                minWidth: "180px",
                                                zIndex: 100,
                                                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                            }}>
                                                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border-color)" }}>
                                                    <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "13px" }}>
                                                        {session.user.name}
                                                    </p>
                                                    <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                                        {session.user.email}
                                                    </p>
                                                    <span style={{
                                                        display: "inline-block",
                                                        marginTop: "6px",
                                                        padding: "2px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "10px",
                                                        fontWeight: "600",
                                                        backgroundColor: session.user.role === "ADMIN" ? "rgba(255, 182, 193, 0.2)" : "rgba(127, 255, 212, 0.2)",
                                                        color: session.user.role === "ADMIN" ? "#FFB6C1" : "#7FFFD4",
                                                    }}>
                                                        {session.user.role}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={getDashboardLink()}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        padding: "10px 14px",
                                                        textDecoration: "none",
                                                        color: "var(--text-primary)",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    <LayoutDashboard size={14} />
                                                    {locale === "th" ? "แดชบอร์ด" : "Dashboard"}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        width: "100%",
                                                        padding: "10px 14px",
                                                        border: "none",
                                                        background: "transparent",
                                                        color: "#FFB6C1",
                                                        cursor: "pointer",
                                                        fontSize: "13px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <LogOut size={14} />
                                                    {locale === "th" ? "ออกจากระบบ" : "Logout"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={`/${locale}/login`}
                                        className="btn-primary"
                                        style={{ padding: "8px 16px", fontSize: "13px" }}
                                    >
                                        <LogIn size={14} />
                                        <span>{t("login")}</span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Button - Visible only on mobile */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="mobile-menu-btn"
                                style={{
                                    padding: "8px",
                                    borderRadius: "8px",
                                    background: "none",
                                    border: "1px solid var(--border-color)",
                                    cursor: "pointer",
                                    color: "var(--text-secondary)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Menu size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar (simplified) */}
            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 100,
                        }}
                    />
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: "280px",
                            maxWidth: "80vw",
                            backgroundColor: "var(--bg-secondary)",
                            borderLeft: "1px solid var(--border-color)",
                            zIndex: 101,
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            borderBottom: "1px solid var(--border-color)",
                        }}>
                            <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "16px" }}>
                                {locale === "th" ? "เมนู" : "Menu"}
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    padding: "8px",
                                    borderRadius: "8px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
                            {/* Navigation Links */}
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            textDecoration: "none",
                                            marginBottom: "8px",
                                            color: isActive(link.href) ? "#9370DB" : "var(--text-primary)",
                                            backgroundColor: isActive(link.href) ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                        }}
                                    >
                                        <Icon size={18} />
                                        <span style={{ fontWeight: "500" }}>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {/* Divider */}
                            <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "16px 0" }} />

                            {/* Language Switcher in Sidebar */}
                            <div style={{ marginBottom: "12px" }}>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: "500" }}>
                                    {locale === "th" ? "ภาษา" : "Language"}
                                </p>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        onClick={() => { switchLocale("en"); setIsOpen(false); }}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: locale === "en" ? "2px solid #9370DB" : "1px solid var(--border-color)",
                                            background: locale === "en" ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                            color: locale === "en" ? "#9370DB" : "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        🇬🇧 English
                                    </button>
                                    <button
                                        onClick={() => { switchLocale("th"); setIsOpen(false); }}
                                        style={{
                                            flex: 1,
                                            padding: "10px",
                                            borderRadius: "8px",
                                            border: locale === "th" ? "2px solid #9370DB" : "1px solid var(--border-color)",
                                            background: locale === "th" ? "rgba(147, 112, 219, 0.15)" : "transparent",
                                            color: locale === "th" ? "#9370DB" : "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        🇹🇭 ไทย
                                    </button>
                                </div>
                            </div>

                            {/* Theme Toggle in Sidebar */}
                            <div>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: "500" }}>
                                    {locale === "th" ? "ธีม" : "Theme"}
                                </p>
                                <button
                                    onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid var(--border-color)",
                                        background: "transparent",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {mounted && (currentTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
                                    {mounted && (currentTheme === "dark"
                                        ? (locale === "th" ? "โหมดสว่าง" : "Light Mode")
                                        : (locale === "th" ? "โหมดมืด" : "Dark Mode")
                                    )}
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                            {isLoggedIn ? (
                                <div>
                                    <Link
                                        href={getDashboardLink()}
                                        className="btn-primary"
                                        style={{ width: "100%", justifyContent: "center", marginBottom: "8px" }}
                                    >
                                        <LayoutDashboard size={16} />
                                        {locale === "th" ? "แดชบอร์ด" : "Dashboard"}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: "1px solid #FFB6C1",
                                            background: "rgba(255, 182, 193, 0.1)",
                                            color: "#FFB6C1",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        <LogOut size={16} />
                                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href={`/${locale}/login`}
                                    className="btn-primary"
                                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                                >
                                    <LogIn size={16} />
                                    <span>{t("login")}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
