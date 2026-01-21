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
    Menu,
    X,
    User,
    Globe,
    ChevronDown,
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
}

export function AdminLayout({ children, pageTitle = "Dashboard" }: AdminLayoutProps) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if mobile
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

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
        // Handle both with and without locale prefix
        const hrefWithoutLocale = href.replace(`/${locale}`, '');
        const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');

        if (hrefWithoutLocale === '/admin' || hrefWithoutLocale === '') {
            return pathnameWithoutLocale === '/admin' || pathnameWithoutLocale === '';
        }
        return pathnameWithoutLocale.startsWith(hrefWithoutLocale);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push(`/${locale}/login`);
    };

    const switchLocale = (newLocale: string) => {
        // Remove current locale from pathname if present
        let pathWithoutLocale = pathname;
        if (pathname.startsWith(`/${locale}/`)) {
            pathWithoutLocale = pathname.slice(locale.length + 1);
        } else if (pathname === `/${locale}`) {
            pathWithoutLocale = '/';
        }
        // Ensure path starts with /
        if (!pathWithoutLocale.startsWith('/')) {
            pathWithoutLocale = '/' + pathWithoutLocale;
        }
        // Build new path with new locale
        const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
        router.push(newPath);
        setLangMenuOpen(false);
    };

    const currentTheme = mounted ? resolvedTheme : "dark";

    // Sidebar content - reused for both mobile and desktop
    const SidebarContent = ({ showClose = false }: { showClose?: boolean }) => (
        <>
            {/* Sidebar Header */}
            <div style={{
                padding: "16px",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <Link href={`/${locale}/admin`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <div style={{ width: "32px", height: "32px", position: "relative" }}>
                        <Image src="/images/logo.png" alt="Clover" fill style={{ objectFit: "contain" }} />
                    </div>
                    <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "15px" }}>
                        Admin Panel
                    </span>
                </Link>
                {showClose && (
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                            padding: "8px",
                            display: "flex",
                        }}
                    >
                        <X size={20} />
                    </button>
                )}
            </div>



            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>
                    {locale === "th" ? "เมนู" : "Menu"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const label = locale === "th" ? item.labelTh : item.labelEn;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "11px 14px",
                                    borderRadius: "10px",
                                    backgroundColor: active ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                    textDecoration: "none",
                                }}
                            >
                                <Icon size={18} color={active ? "#9370DB" : "var(--text-secondary)"} />
                                <span style={{ fontSize: "13px", color: active ? "#9370DB" : "var(--text-primary)", fontWeight: active ? "600" : "400" }}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                {/* User Info - Moved to Bottom */}
                <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(127, 255, 212, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <User size={20} color="#7FFFD4" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>
                                {session?.user?.name || "Admin"}
                            </p>
                            <span style={{ fontSize: "11px", fontWeight: "600", color: "#9370DB", backgroundColor: "rgba(147, 112, 219, 0.2)", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginTop: "4px" }}>
                                ADMIN
                            </span>
                        </div>
                    </div>
                </div>

                {/* Language & Theme */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    {/* Language Switcher */}
                    <div style={{ position: "relative", flex: 1 }}>
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                padding: "10px",
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
                        {langMenuOpen && (
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
                                        padding: "10px",
                                        border: "none",
                                        background: locale === "en" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                >
                                    🇬🇧 English
                                </button>
                                <button
                                    onClick={() => switchLocale("th")}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "none",
                                        background: locale === "th" ? "rgba(147, 112, 219, 0.2)" : "transparent",
                                        color: "var(--text-primary)",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                >
                                    🇹🇭 ภาษาไทย
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                        style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            background: "var(--bg-primary)",
                            border: "1px solid var(--border-color)",
                            cursor: "pointer",
                            color: "var(--text-secondary)",
                        }}
                    >
                        {mounted && (currentTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
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
                        gap: "10px",
                        padding: "11px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 182, 193, 0.3)",
                        background: "rgba(255, 182, 193, 0.1)",
                        color: "#FFB6C1",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                    }}
                >
                    <LogOut size={16} />
                    {locale === "th" ? "ออกจากระบบ" : "Logout"}
                </button>
            </div>
        </>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--glass-layout)" }}>
            {/* Desktop Sidebar - Only on desktop */}
            {!isMobile && (
                <aside
                    style={{
                        width: "260px",
                        backgroundColor: "var(--glass-sidebar)",
                        backdropFilter: "blur(12px)",
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
                    <SidebarContent />
                </aside>
            )}

            {/* Mobile Header - Only on mobile */}
            {isMobile && (
                <header
                    style={{
                        height: "60px",
                        backgroundColor: "var(--bg-secondary)",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 16px",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 50,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-primary)",
                                padding: "8px",
                                display: "flex",
                            }}
                        >
                            <Menu size={24} />
                        </button>
                        <span className="text-gradient" style={{ fontWeight: "bold", fontSize: "14px" }}>
                            {pageTitle}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-color)",
                                cursor: "pointer",
                                color: "var(--text-secondary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {mounted && (currentTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
                        </button>
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(127, 255, 212, 0.2)",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <User size={16} color="#7FFFD4" />
                            </button>
                            {userMenuOpen && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    marginTop: "8px",
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    minWidth: "160px",
                                    zIndex: 100,
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                                }}>
                                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
                                        <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: 0 }}>
                                            {session?.user?.name || "Admin"}
                                        </p>
                                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#9370DB", backgroundColor: "rgba(147, 112, 219, 0.2)", padding: "2px 6px", borderRadius: "4px", display: "inline-block", marginTop: "4px" }}>
                                            ADMIN
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            width: "100%",
                                            padding: "12px 16px",
                                            border: "none",
                                            background: "transparent",
                                            color: "#FFB6C1",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            textAlign: "left",
                                        }}
                                    >
                                        <LogOut size={16} />
                                        {locale === "th" ? "ออกจากระบบ" : "Logout"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 55,
                    }}
                />
            )}

            {/* Mobile Sidebar */}
            {isMobile && (
                <aside
                    style={{
                        width: "280px",
                        maxWidth: "85vw",
                        backgroundColor: "var(--bg-secondary)",
                        borderRight: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        position: "fixed",
                        top: 0,
                        left: sidebarOpen ? 0 : "-100%",
                        bottom: 0,
                        zIndex: 60,
                        transition: "left 0.3s ease",
                        boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none",
                    }}
                >
                    <SidebarContent showClose />
                </aside>
            )}

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : "260px",
                paddingTop: isMobile ? "76px" : "24px",
                padding: isMobile ? "76px 16px 24px" : "24px",
                minHeight: "100vh",
                width: "100%",
                boxSizing: "border-box",
            }}>
                {/* Page Title - Only on Desktop */}
                {!isMobile && (
                    <h1 style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "var(--text-primary)",
                        marginBottom: "24px",
                    }}>
                        {pageTitle}
                    </h1>
                )}
                {children}
            </main>
        </div>
    );
}
