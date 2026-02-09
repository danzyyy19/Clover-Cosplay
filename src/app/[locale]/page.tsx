import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StepCard } from "@/components/ui/step-card";
import {
    Sparkles,
    ShoppingBag,
    ArrowRight,
    Star,
} from "lucide-react";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const steps = [
        {
            iconName: "ShoppingBag" as const,
            titleEn: "Choose Costume",
            titleTh: "เลือกชุด",
            descEn: "Browse and pick your favorite",
            descTh: "เลือกชุดคอสเพลย์ที่คุณชอบ",
        },
        {
            iconName: "CreditCard" as const,
            titleEn: "Book & Pay",
            titleTh: "จอง & ชำระ",
            descEn: "Select dates and complete payment",
            descTh: "เลือกวันที่และชำระเงิน",
        },
        {
            iconName: "MapPin" as const,
            titleEn: "Pick Up",
            titleTh: "มารับชุด",
            descEn: "Come to our store with receipt",
            descTh: "มารับชุดที่ร้านพร้อมใบเสร็จ",
        },
        {
            iconName: "RotateCcw" as const,
            titleEn: "Return",
            titleTh: "คืนชุด",
            descEn: "Return the costume on time",
            descTh: "คืนชุดตามกำหนด",
        },
    ];

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Hero Section */}
            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "80px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Animated Particles */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                width: `${4 + (i % 3) * 3}px`,
                                height: `${4 + (i % 3) * 3}px`,
                                left: `${(i * 7) % 100}%`,
                                top: `${(i * 11) % 100}%`,
                                borderRadius: "50%",
                                background: i % 2 === 0 ? "#DDA0DD" : "#7FFFD4",
                                opacity: 0.4,
                                animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                                animationDelay: `${(i * 0.2)}s`,
                            }}
                        />
                    ))}
                </div>

                <div style={{ textAlign: "center", maxWidth: "896px", margin: "0 auto", position: "relative", zIndex: 10 }}>
                    {/* Logo */}
                    <div style={{ width: "160px", height: "160px", margin: "0 auto 32px", position: "relative" }}>
                        <Image
                            src="/images/logo.png"
                            alt="Clover Cosplay"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "bold", marginBottom: "24px" }}>
                        <span className="text-gradient">
                            {locale === "th" ? "ยินดีต้อนรับสู่" : "Welcome to"}
                        </span>
                        <br />
                        <span style={{ color: "var(--text-primary)" }}>Clover Cosplay</span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
                        {locale === "th"
                            ? "บริการเช่าชุดคอสเพลย์ระดับพรีเมียม คุณภาพสูง ราคาย่อมเยา"
                            : "Your Premier Cosplay Costume Rental Service. High-quality costumes at affordable prices."}
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                        <Link href={`/${locale}/products`} className="btn-primary" style={{ width: "100%", maxWidth: "280px" }}>
                            <ShoppingBag size={20} />
                            {locale === "th" ? "ดูชุดคอสเพลย์" : "Browse Costumes"}
                        </Link>
                        <Link href={`/${locale}/rules`} className="btn-outline" style={{ width: "100%", maxWidth: "280px" }}>
                            {locale === "th" ? "วิธีเช่า" : "How to Rent"}
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: "80px 16px", backgroundColor: "var(--bg-secondary)" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Section Header */}
                    <div style={{ textAlign: "center", marginBottom: "64px" }}>
                        <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "bold", marginBottom: "16px" }}>
                            <span className="text-gradient">
                                {locale === "th" ? "วิธีการเช่า" : "How It Works"}
                            </span>
                        </h2>
                        <p style={{ color: "var(--text-secondary)" }}>
                            {locale === "th"
                                ? "เช่าชุดคอสเพลย์ง่ายๆ เพียง 4 ขั้นตอน"
                                : "Rent your cosplay costume in 4 simple steps"}
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "24px",
                        }}
                    >
                        {steps.map((step, index) => (
                            <StepCard
                                key={index}
                                number={index + 1}
                                iconName={step.iconName}
                                title={locale === "th" ? step.titleTh : step.titleEn}
                                description={locale === "th" ? step.descTh : step.descEn}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                style={{
                    padding: "80px 16px",
                    background: "linear-gradient(90deg, #9370DB, #DDA0DD, #7FFFD4)",
                }}
            >
                <div style={{ maxWidth: "896px", margin: "0 auto", textAlign: "center" }}>
                    {/* Sparkles Icon - Centered */}
                    <div style={{ marginBottom: "24px" }}>
                        <Sparkles size={48} color="white" style={{ display: "block", margin: "0 auto" }} />
                    </div>

                    <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
                        {locale === "th"
                            ? "พร้อมที่จะเป็นตัวละครในฝันของคุณ?"
                            : "Ready to become your dream character?"}
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.125rem", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
                        {locale === "th"
                            ? "สมัครวันนี้และเริ่มต้นการผจญภัยคอสเพลย์ของคุณกับเรา"
                            : "Join us today and start your cosplay adventure"}
                    </p>
                    <Link
                        href={`/${locale}/register`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            padding: "16px 32px",
                            borderRadius: "12px",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        <Star size={20} />
                        {locale === "th" ? "สมัครเลย" : "Get Started"}
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
