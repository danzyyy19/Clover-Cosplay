import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { User, Bell, Shield, Globe, Palette } from "lucide-react";

export default async function AdminSettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect(`/${locale}/login`);
    }

    const settingsSections = [
        {
            icon: User,
            title: "Profile",
            description: "Update your personal information",
            items: [
                { label: "Name", value: session.user.name || "-" },
                { label: "Email", value: session.user.email || "-" },
            ],
        },
        {
            icon: Bell,
            title: "Notifications",
            description: "Manage notification preferences",
            items: [
                { label: "Email Notifications", type: "toggle", enabled: true },
                { label: "Order Alerts", type: "toggle", enabled: true },
                { label: "Payment Alerts", type: "toggle", enabled: true },
            ],
        },
        {
            icon: Globe,
            title: "Language",
            description: "Set your preferred language",
            items: [
                { label: "Current Language", value: locale === "th" ? "ภาษาไทย" : "English" },
            ],
        },
        {
            icon: Palette,
            title: "Appearance",
            description: "Customize the look and feel",
            items: [
                { label: "Theme", value: "Dark Mode" },
            ],
        },
    ];

    return (
        <AdminLayout pageTitle="Settings">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
                {settingsSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "12px",
                                padding: "20px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(147, 112, 219, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={18} color="#9370DB" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{section.title}</h3>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{section.description}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {section.items.map((item: any, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
                                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.label}</span>
                                        {item.type === "toggle" ? (
                                            <div style={{
                                                width: "44px",
                                                height: "24px",
                                                borderRadius: "12px",
                                                backgroundColor: item.enabled ? "#7FFFD4" : "var(--border-color)",
                                                position: "relative",
                                                cursor: "pointer",
                                            }}>
                                                <div style={{
                                                    width: "18px",
                                                    height: "18px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "white",
                                                    position: "absolute",
                                                    top: "3px",
                                                    left: item.enabled ? "23px" : "3px",
                                                    transition: "left 0.2s",
                                                }} />
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-primary)" }}>{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Save Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button className="btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>
                        Save Changes
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
