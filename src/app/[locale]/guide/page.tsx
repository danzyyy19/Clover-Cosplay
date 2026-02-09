"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
    BookOpen,
    User,
    ShoppingBag,
    CreditCard,
    LayoutDashboard,
    HelpCircle,
    Search,
    CalendarCheck,
    Truck,
    RotateCcw,
    ShieldCheck,
    Info,
    ArrowRight,
    CheckCircle,
    Receipt,
    Upload,
    Clock,
    AlertCircle,
    Wallet
} from "lucide-react";

export default function GuidePage() {
    const t = useTranslations("guide");
    const locale = useLocale();

    // Flowchart steps
    const flowSteps = [
        { id: 1, icon: Search, label: t("flowchart.step1"), desc: locale === "th" ? "ค้นหาชุดที่ชอบ" : "Find your costume" },
        { id: 2, icon: CalendarCheck, label: t("flowchart.step2"), desc: locale === "th" ? "เลือกวันเช่า" : "Select rental dates" },
        { id: 3, icon: CreditCard, label: t("flowchart.step3"), desc: locale === "th" ? "ชำระเงิน" : "Complete payment" },
        { id: 4, icon: ShieldCheck, label: t("flowchart.step4"), desc: locale === "th" ? "แอดมินตรวจสอบ" : "Admin verification" },
        { id: 5, icon: Truck, label: t("flowchart.step5"), desc: locale === "th" ? "รับชุดของคุณ" : "Get your costume" },
        { id: 6, icon: RotateCcw, label: t("flowchart.step6"), desc: locale === "th" ? "คืนชุดตรงเวลา" : "Return on time" },
    ];

    // Glossary terms
    const glossaryTerms = [
        { term: t("glossary.deposit.term"), def: t("glossary.deposit.def"), icon: Wallet },
        { term: t("glossary.rentalPeriod.term"), def: t("glossary.rentalPeriod.def"), icon: Clock },
        { term: t("glossary.verification.term"), def: t("glossary.verification.def"), icon: ShieldCheck },
        { term: t("glossary.proof.term"), def: t("glossary.proof.def"), icon: Receipt },
    ];

    // FAQ items
    const faqItems = [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
    ];

    return (
        <>
            {/* Responsive CSS */}
            <style jsx>{`
                .guide-container {
                    min-height: 100vh;
                    background-color: #0D0D1A;
                    color: white;
                }
                
                .hero-section {
                    background: linear-gradient(to bottom, #1a1a2e, #0D0D1A);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding: 60px 20px;
                    text-align: center;
                }
                
                @media (min-width: 768px) {
                    .hero-section {
                        padding: 80px 24px;
                    }
                }
                
                .hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    background-color: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    margin-bottom: 20px;
                    font-size: 13px;
                    color: #9CA3AF;
                }
                
                .hero-title {
                    font-size: 32px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 12px;
                }
                
                @media (min-width: 768px) {
                    .hero-title {
                        font-size: 48px;
                    }
                }
                
                .hero-subtitle {
                    font-size: 16px;
                    color: #9CA3AF;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                @media (min-width: 768px) {
                    .hero-subtitle {
                        font-size: 18px;
                    }
                }
                
                .main-content {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px 80px;
                }
                
                @media (min-width: 768px) {
                    .main-content {
                        padding: 60px 24px 100px;
                    }
                }
                
                .section {
                    margin-bottom: 48px;
                }
                
                @media (min-width: 768px) {
                    .section {
                        margin-bottom: 64px;
                    }
                }
                
                .section-title {
                    font-size: 22px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 8px;
                }
                
                @media (min-width: 768px) {
                    .section-title {
                        font-size: 28px;
                    }
                }
                
                .section-subtitle {
                    font-size: 14px;
                    color: #9CA3AF;
                    margin-bottom: 24px;
                }
                
                /* Flowchart Grid - Mobile First */
                .flow-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                @media (min-width: 640px) {
                    .flow-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 16px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .flow-grid {
                        grid-template-columns: repeat(6, 1fr);
                        gap: 16px;
                    }
                }
                
                .flow-card {
                    background-color: #151520;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                    padding: 16px 12px;
                    text-align: center;
                }
                
                @media (min-width: 768px) {
                    .flow-card {
                        padding: 20px 16px;
                    }
                }
                
                .flow-number {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: #9370DB;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    box-shadow: 0 4px 12px rgba(147,112,219,0.3);
                }
                
                .flow-icon-box {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    background-color: #0D0D1A;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                }
                
                @media (min-width: 768px) {
                    .flow-icon-box {
                        width: 48px;
                        height: 48px;
                    }
                }
                
                .flow-label {
                    font-weight: bold;
                    font-size: 12px;
                    color: white;
                    margin-bottom: 2px;
                }
                
                @media (min-width: 768px) {
                    .flow-label {
                        font-size: 14px;
                    }
                }
                
                .flow-desc {
                    font-size: 10px;
                    color: #6B7280;
                }
                
                @media (min-width: 768px) {
                    .flow-desc {
                        font-size: 11px;
                    }
                }
                
                /* Cards Grid */
                .cards-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                
                @media (min-width: 768px) {
                    .cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                    }
                }
                
                .info-card {
                    background-color: #12121e;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    overflow: hidden;
                }
                
                .card-header {
                    padding: 14px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                @media (min-width: 768px) {
                    .card-header {
                        padding: 16px 20px;
                    }
                }
                
                .card-header-icon {
                    padding: 8px;
                    border-radius: 8px;
                }
                
                .card-header-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: white;
                }
                
                @media (min-width: 768px) {
                    .card-header-title {
                        font-size: 18px;
                    }
                }
                
                .card-body {
                    padding: 16px;
                }
                
                @media (min-width: 768px) {
                    .card-body {
                        padding: 20px;
                    }
                }
                
                .card-item {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 14px;
                }
                
                .card-item:last-child {
                    margin-bottom: 0;
                }
                
                .card-item-title {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                
                .card-item-desc {
                    font-size: 13px;
                    color: #9CA3AF;
                    line-height: 1.5;
                }
                
                /* Glossary Grid */
                .glossary-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                
                @media (min-width: 640px) {
                    .glossary-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                    }
                }
                
                .glossary-card {
                    background-color: #12121e;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 16px;
                }
                
                /* FAQ */
                .faq-card {
                    background-color: #12121e;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 24px 20px;
                }
                
                @media (min-width: 768px) {
                    .faq-card {
                        padding: 32px 24px;
                    }
                }
                
                .faq-item {
                    background-color: #0a0a12;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                }
                
                .faq-item:last-child {
                    margin-bottom: 0;
                }
                
                /* Alert Box */
                .alert-box {
                    background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1));
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid rgba(239,68,68,0.2);
                }
                
                @media (min-width: 768px) {
                    .alert-box {
                        padding: 24px;
                    }
                }
                
                /* CTA */
                .cta-section {
                    text-align: center;
                    padding: 32px 0;
                }
                
                .cta-buttons {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                
                @media (min-width: 480px) {
                    .cta-buttons {
                        flex-direction: row;
                        justify-content: center;
                    }
                }
                
                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 28px;
                    border-radius: 9999px;
                    background: linear-gradient(90deg, #9370DB, #EC4899);
                    color: white;
                    font-weight: bold;
                    text-decoration: none;
                    font-size: 14px;
                    width: 100%;
                    max-width: 220px;
                }
                
                @media (min-width: 480px) {
                    .btn-primary {
                        width: auto;
                    }
                }
                
                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px 28px;
                    border-radius: 9999px;
                    background-color: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    font-weight: bold;
                    text-decoration: none;
                    font-size: 14px;
                    width: 100%;
                    max-width: 220px;
                }
                
                @media (min-width: 480px) {
                    .btn-secondary {
                        width: auto;
                    }
                }
                
                .footer {
                    border-top: 1px solid rgba(255,255,255,0.05);
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #6B7280;
                }
                
                .intro-box {
                    background: linear-gradient(135deg, rgba(147,112,219,0.15), rgba(236,72,153,0.1));
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid rgba(147,112,219,0.2);
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }
                
                @media (min-width: 768px) {
                    .intro-box {
                        padding: 24px;
                    }
                }
                
                .intro-icon {
                    padding: 12px;
                    background-color: rgba(147,112,219,0.2);
                    border-radius: 12px;
                    flex-shrink: 0;
                }
            `}</style>

            <div className="guide-container">
                {/* HERO SECTION */}
                <header className="hero-section">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <BookOpen size={14} style={{ color: "#9370DB" }} />
                            <span>{locale === "th" ? "คู่มือการใช้งานอย่างเป็นทางการ" : "Official User Guide"}</span>
                        </div>
                        <h1 className="hero-title">{t("title")}</h1>
                        <p className="hero-subtitle">{t("subtitle")}</p>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="main-content">

                    {/* Introduction */}
                    <section className="section">
                        <div className="intro-box">
                            <div className="intro-icon">
                                <Info size={24} style={{ color: "#9370DB" }} />
                            </div>
                            <div>
                                <h2 style={{ fontWeight: "bold", fontSize: "18px", color: "white", marginBottom: "8px" }}>
                                    {t("intro.title")}
                                </h2>
                                <p style={{ color: "#D1D5DB", lineHeight: "1.6", fontSize: "14px" }}>
                                    {t("intro.content")}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Booking Process Flow */}
                    <section className="section">
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                            <h2 className="section-title">{t("flowchart.title")}</h2>
                            <p className="section-subtitle">{locale === "th" ? "ทำตามขั้นตอนง่ายๆ เหล่านี้เพื่อเช่าชุดคอสเพลย์ที่ชอบ" : "Follow these simple steps to rent your favorite costume"}</p>
                        </div>

                        <div className="flow-grid">
                            {flowSteps.map((step) => (
                                <div key={step.id} className="flow-card">
                                    <div className="flow-number">{step.id}</div>
                                    <div className="flow-icon-box">
                                        <step.icon size={20} style={{ color: "#9370DB" }} />
                                    </div>
                                    <div className="flow-label">{step.label}</div>
                                    <div className="flow-desc">{step.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Info Cards Grid */}
                    <section className="section">
                        <div className="cards-grid">
                            {/* Getting Started */}
                            <div className="info-card">
                                <div className="card-header" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))" }}>
                                    <div className="card-header-icon" style={{ backgroundColor: "rgba(59,130,246,0.2)" }}>
                                        <User size={18} style={{ color: "#60A5FA" }} />
                                    </div>
                                    <h3 className="card-header-title">{t("account.title")}</h3>
                                </div>
                                <div className="card-body">
                                    <div className="card-item">
                                        <CheckCircle size={16} style={{ color: "#60A5FA", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#93C5FD" }}>{t("account.register")}</div>
                                            <div className="card-item-desc">{t("account.registerDesc")}</div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <CheckCircle size={16} style={{ color: "#60A5FA", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#93C5FD" }}>{t("account.login")}</div>
                                            <div className="card-item-desc">{t("account.loginDesc")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* How to Rent */}
                            <div className="info-card">
                                <div className="card-header" style={{ background: "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))" }}>
                                    <div className="card-header-icon" style={{ backgroundColor: "rgba(236,72,153,0.2)" }}>
                                        <ShoppingBag size={18} style={{ color: "#F472B6" }} />
                                    </div>
                                    <h3 className="card-header-title">{t("booking.title")}</h3>
                                </div>
                                <div className="card-body">
                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="card-item">
                                            <div style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(236,72,153,0.2)",
                                                color: "#F472B6",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                marginTop: "2px"
                                            }}>
                                                {num}
                                            </div>
                                            <div>
                                                <div className="card-item-title" style={{ color: "#FBCFE8" }}>{t(`booking.step${num}`)}</div>
                                                <div className="card-item-desc">{t(`booking.step${num}Desc`)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payments */}
                            <div className="info-card">
                                <div className="card-header" style={{ background: "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))" }}>
                                    <div className="card-header-icon" style={{ backgroundColor: "rgba(34,197,94,0.2)" }}>
                                        <Wallet size={18} style={{ color: "#4ADE80" }} />
                                    </div>
                                    <h3 className="card-header-title">{t("payment.title")}</h3>
                                </div>
                                <div className="card-body">
                                    <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "14px" }}>{t("payment.instruction")}</p>
                                    <div className="card-item">
                                        <CreditCard size={16} style={{ color: "#4ADE80", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#86EFAC" }}>{t("payment.bank")}</div>
                                            <div className="card-item-desc">{t("payment.bankDesc")}</div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <Upload size={16} style={{ color: "#4ADE80", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#86EFAC" }}>{t("payment.proof")}</div>
                                            <div className="card-item-desc">{t("payment.proofDesc")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard */}
                            <div className="info-card">
                                <div className="card-header" style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))" }}>
                                    <div className="card-header-icon" style={{ backgroundColor: "rgba(251,191,36,0.2)" }}>
                                        <LayoutDashboard size={18} style={{ color: "#FBBF24" }} />
                                    </div>
                                    <h3 className="card-header-title">{t("dashboard.title")}</h3>
                                </div>
                                <div className="card-body">
                                    <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "14px" }}>{t("dashboard.overview")}</p>
                                    <div className="card-item">
                                        <Clock size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#FDE68A" }}>{t("dashboard.myRentals")}</div>
                                            <div className="card-item-desc">{t("dashboard.myRentalsDesc")}</div>
                                        </div>
                                    </div>
                                    <div className="card-item">
                                        <Receipt size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "2px" }} />
                                        <div>
                                            <div className="card-item-title" style={{ color: "#FDE68A" }}>{t("dashboard.receipts")}</div>
                                            <div className="card-item-desc">{t("dashboard.receiptsDesc")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Glossary */}
                    <section className="section">
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                            <div style={{ padding: "10px", backgroundColor: "rgba(16,185,129,0.2)", borderRadius: "10px" }}>
                                <BookOpen size={22} style={{ color: "#34D399" }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>{t("glossary.title")}</h2>
                                <p style={{ fontSize: "13px", color: "#9CA3AF" }}>{locale === "th" ? "คำศัพท์สำคัญที่คุณควรรู้" : "Important terms you should know"}</p>
                            </div>
                        </div>

                        <div className="glossary-grid">
                            {glossaryTerms.map((item, idx) => (
                                <div key={idx} className="glossary-card">
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <div style={{ padding: "6px", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "6px", height: "fit-content" }}>
                                            <item.icon size={14} style={{ color: "#34D399" }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: "bold", color: "#A7F3D0", marginBottom: "4px", fontSize: "14px" }}>{item.term}</h4>
                                            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: "1.5" }}>{item.def}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="section">
                        <div className="faq-card">
                            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(234,179,8,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px"
                                }}>
                                    <HelpCircle size={22} style={{ color: "#EAB308" }} />
                                </div>
                                <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "white", marginBottom: "6px" }}>{t("faq.title")}</h2>
                                <p style={{ fontSize: "13px", color: "#9CA3AF" }}>{locale === "th" ? "คำตอบสั้นๆ สำหรับคำถามทั่วไป" : "Quick answers to common questions"}</p>
                            </div>

                            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                                {faqItems.map((item, idx) => (
                                    <div key={idx} className="faq-item">
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <span style={{ color: "#EAB308", fontWeight: "bold", fontSize: "13px" }}>Q{idx + 1}</span>
                                            <div>
                                                <h4 style={{ fontWeight: "600", color: "white", marginBottom: "6px", fontSize: "14px" }}>{item.q}</h4>
                                                <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: "1.5" }}>{item.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Important Reminders */}
                    <section className="section">
                        <div className="alert-box">
                            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                <div style={{ padding: "10px", backgroundColor: "rgba(239,68,68,0.2)", borderRadius: "10px", flexShrink: 0 }}>
                                    <AlertCircle size={22} style={{ color: "#F87171" }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "white", marginBottom: "10px" }}>
                                        {locale === "th" ? "ข้อควรระวังสำคัญ" : "Important Reminders"}
                                    </h3>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {(locale === "th"
                                            ? [
                                                "คืนชุดในสภาพสะอาดและดีเพื่อรับเงินมัดจำคืนเต็มจำนวน",
                                                "การคืนล่าช้ามีค่าปรับเพิ่มเติม กรุณาคืนตรงเวลาหรือก่อนวันสิ้นสุดการเช่า",
                                                "แจ้งความเสียหายทันทีเพื่อหลีกเลี่ยงค่าปรับ",
                                                "เก็บหลักฐานการชำระเงินไว้จนกว่าเงินมัดจำจะคืน"
                                            ]
                                            : [
                                                "Always return costumes in clean, good condition to get your full deposit back.",
                                                "Late returns incur additional fees. Please return on or before your rental end date.",
                                                "Report any damage immediately to avoid penalties.",
                                                "Keep your payment proof until your deposit is refunded."
                                            ]
                                        ).map((text, i) => (
                                            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: i < 3 ? "6px" : 0 }}>
                                                <span style={{ color: "#F87171", marginTop: "3px" }}>•</span>
                                                <span style={{ fontSize: "13px", color: "#D1D5DB", lineHeight: "1.5" }}>{text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="cta-section">
                        <h3 style={{ fontSize: "22px", fontWeight: "bold", color: "white", marginBottom: "10px" }}>
                            {locale === "th" ? "พร้อมเริ่มต้นการเดินทางคอสเพลย์หรือยัง?" : "Ready to start your cosplay journey?"}
                        </h3>
                        <p style={{ color: "#9CA3AF", marginBottom: "20px", fontSize: "14px" }}>
                            {locale === "th" ? "เลือกชุดคอสเพลย์ที่ชอบใจและจองวันนี้!" : "Browse our collection and find your perfect costume today!"}
                        </p>

                        <div className="cta-buttons">
                            <Link href={`/${locale}/products`} className="btn-primary">
                                {locale === "th" ? "เลือกชุดคอสเพลย์" : "Browse Costumes"}
                                <ArrowRight size={16} />
                            </Link>
                            <Link href={`/${locale}/register`} className="btn-secondary">
                                {locale === "th" ? "สร้างบัญชี" : "Create Account"}
                            </Link>
                        </div>
                    </section>

                </main>

                {/* Footer */}
                <footer className="footer">
                    {locale === "th" ? "ต้องการความช่วยเหลือ? ติดต่อเราที่" : "Need help? Contact us at"}{" "}
                    <a href="mailto:support@clovercosplay.com" style={{ color: "#9370DB" }}>
                        support@clovercosplay.com
                    </a>
                </footer>
            </div>
        </>
    );
}
