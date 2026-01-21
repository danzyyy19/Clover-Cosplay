import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CustomerLayout } from "@/components/layout/customer-layout";
import { User, Bell, Globe, Palette, Shield } from "lucide-react";

export default async function CustomerSettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user) {
        redirect(`/${locale}/login`);
    }

    const settingsSections = [
        {
            icon: User,
            title: locale === "th" ? "โปรไฟล์" : "Profile",
            description: locale === "th" ? "ข้อมูลส่วนตัวของคุณ" : "Your personal information",
            items: [
                { label: locale === "th" ? "ชื่อ" : "Name", value: session.user.name || "-" },
                { label: locale === "th" ? "อีเมล" : "Email", value: session.user.email || "-" },
            ],
        },
        {
            icon: Bell,
            title: locale === "th" ? "การแจ้งเตือน" : "Notifications",
            description: locale === "th" ? "จัดการการแจ้งเตือน" : "Manage your notifications",
            items: [
                { label: locale === "th" ? "อีเมลแจ้งเตือน" : "Email Notifications", type: "toggle", enabled: true },
                { label: locale === "th" ? "แจ้งเตือนการจอง" : "Booking Alerts", type: "toggle", enabled: true },
            ],
        },
        {
            icon: Globe,
            title: locale === "th" ? "ภาษา" : "Language",
            description: locale === "th" ? "เลือกภาษาที่ต้องการ" : "Choose your preferred language",
            items: [
                { label: locale === "th" ? "ภาษาปัจจุบัน" : "Current Language", value: locale === "th" ? "ภาษาไทย" : "English" },
            ],
        },
        {
            icon: Shield,
            title: locale === "th" ? "ความปลอดภัย" : "Security",
            description: locale === "th" ? "รหัสผ่านและความปลอดภัย" : "Password and security",
            items: [
                { label: locale === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password", type: "button" },
            ],
        },
    ];

    const pageTitle = locale === "th" ? "ตั้งค่า" : "Settings";

    return (
        <CustomerLayout pageTitle={pageTitle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "700px" }}>
                {settingsSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px",
                                padding: "18px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(147, 112, 219, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={16} color="#9370DB" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{section.title}</h3>
                                    <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{section.description}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {section.items.map((item: any, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
                                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.label}</span>
                                        {item.type === "toggle" ? (
                                            <div style={{
                                                width: "40px",
                                                height: "22px",
                                                borderRadius: "11px",
                                                backgroundColor: item.enabled ? "#7FFFD4" : "var(--border-color)",
                                                position: "relative",
                                                cursor: "pointer",
                                            }}>
                                                <div style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "white",
                                                    position: "absolute",
                                                    top: "3px",
                                                    left: item.enabled ? "21px" : "3px",
                                                }} />
                                            </div>
                                        ) : item.type === "button" ? (
                                            <button style={{
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid var(--border-color)",
                                                backgroundColor: "transparent",
                                                color: "#9370DB",
                                                fontSize: "11px",
                                                cursor: "pointer",
                                            }}>
                                                {locale === "th" ? "เปลี่ยน" : "Change"}
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-primary)" }}>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
                        {locale === "th" ? "บันทึกการเปลี่ยนแปลง" : "Save Changes"}
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
}
