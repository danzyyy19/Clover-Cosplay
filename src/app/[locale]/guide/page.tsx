"use client";

import { useTranslations } from "next-intl";
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

    // Flowchart steps
    const flowSteps = [
        { id: 1, icon: Search, label: t("flowchart.step1"), desc: "Find your costume" },
        { id: 2, icon: CalendarCheck, label: t("flowchart.step2"), desc: "Select rental dates" },
        { id: 3, icon: CreditCard, label: t("flowchart.step3"), desc: "Complete payment" },
        { id: 4, icon: ShieldCheck, label: t("flowchart.step4"), desc: "Admin verification" },
        { id: 5, icon: Truck, label: t("flowchart.step5"), desc: "Get your costume" },
        { id: 6, icon: RotateCcw, label: t("flowchart.step6"), desc: "Return on time" },
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
        <div
            className="min-h-screen text-white"
            style={{ backgroundColor: "#0D0D1A" }}
        >
            {/* ===== HERO SECTION ===== */}
            <header
                className="relative overflow-hidden"
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "linear-gradient(to bottom, #1a1a2e, #0D0D1A)"
                }}
            >
                <div
                    className="mx-auto text-center"
                    style={{
                        maxWidth: "1000px",
                        padding: "80px 24px 60px 24px"
                    }}
                >
                    <div
                        className="inline-flex items-center gap-2 mb-6"
                        style={{
                            padding: "8px 16px",
                            borderRadius: "9999px",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        <BookOpen size={16} style={{ color: "#9370DB" }} />
                        <span style={{ fontSize: "14px", color: "#9CA3AF" }}>Official User Guide</span>
                    </div>

                    <h1
                        className="font-bold mb-4"
                        style={{
                            fontSize: "clamp(32px, 5vw, 48px)",
                            color: "white"
                        }}
                    >
                        {t("title")}
                    </h1>

                    <p style={{ fontSize: "18px", color: "#9CA3AF", maxWidth: "600px", margin: "0 auto" }}>
                        {t("subtitle")}
                    </p>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main
                className="mx-auto"
                style={{
                    maxWidth: "1000px",
                    padding: "48px 24px 80px 24px"
                }}
            >
                {/* ----- INTRODUCTION ----- */}
                <section
                    className="mb-16"
                    style={{
                        background: "linear-gradient(135deg, rgba(147,112,219,0.15), rgba(236,72,153,0.1))",
                        borderRadius: "16px",
                        padding: "24px",
                        border: "1px solid rgba(147,112,219,0.2)"
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="flex-shrink-0"
                            style={{
                                padding: "12px",
                                backgroundColor: "rgba(147,112,219,0.2)",
                                borderRadius: "12px"
                            }}
                        >
                            <Info size={24} style={{ color: "#9370DB" }} />
                        </div>
                        <div>
                            <h2 className="font-bold mb-2" style={{ fontSize: "20px", color: "white" }}>
                                {t("intro.title")}
                            </h2>
                            <p style={{ color: "#D1D5DB", lineHeight: "1.7" }}>
                                {t("intro.content")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ----- BOOKING PROCESS FLOWCHART ----- */}
                <section className="mb-16">
                    <div className="text-center mb-10">
                        <h2 className="font-bold mb-2" style={{ fontSize: "28px", color: "white" }}>
                            {t("flowchart.title")}
                        </h2>
                        <p style={{ color: "#9CA3AF" }}>Follow these simple steps to rent your favorite costume</p>
                    </div>

                    {/* Flowchart Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "16px"
                        }}
                    >
                        {flowSteps.map((step) => (
                            <div
                                key={step.id}
                                style={{
                                    backgroundColor: "#151520",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "16px",
                                    padding: "20px 16px",
                                    textAlign: "center"
                                }}
                            >
                                {/* Step Number */}
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: "#9370DB",
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px auto",
                                        boxShadow: "0 4px 12px rgba(147,112,219,0.3)"
                                    }}
                                >
                                    {step.id}
                                </div>

                                {/* Icon */}
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        backgroundColor: "#0D0D1A",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px auto"
                                    }}
                                >
                                    <step.icon size={22} style={{ color: "#9370DB" }} />
                                </div>

                                {/* Label */}
                                <h3 style={{ fontWeight: "bold", fontSize: "14px", color: "white", marginBottom: "4px" }}>
                                    {step.label}
                                </h3>
                                <p style={{ fontSize: "12px", color: "#6B7280" }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- DETAILED GUIDE SECTIONS ----- */}
                <div
                    className="mb-16"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "24px"
                    }}
                >
                    {/* Getting Started */}
                    <section
                        style={{
                            backgroundColor: "#12121e",
                            borderRadius: "16px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))",
                                padding: "16px 20px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div style={{ padding: "8px", backgroundColor: "rgba(59,130,246,0.2)", borderRadius: "8px" }}>
                                    <User size={20} style={{ color: "#60A5FA" }} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                                    {t("account.title")}
                                </h3>
                            </div>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <div className="flex gap-3 mb-5">
                                <CheckCircle size={18} style={{ color: "#60A5FA", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#93C5FD", marginBottom: "4px" }}>
                                        {t("account.register")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("account.registerDesc")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle size={18} style={{ color: "#60A5FA", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#93C5FD", marginBottom: "4px" }}>
                                        {t("account.login")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("account.loginDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How to Rent */}
                    <section
                        style={{
                            backgroundColor: "#12121e",
                            borderRadius: "16px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))",
                                padding: "16px 20px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div style={{ padding: "8px", backgroundColor: "rgba(236,72,153,0.2)", borderRadius: "8px" }}>
                                    <ShoppingBag size={20} style={{ color: "#F472B6" }} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                                    {t("booking.title")}
                                </h3>
                            </div>
                        </div>
                        <div style={{ padding: "20px" }}>
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex gap-3" style={{ marginBottom: num < 3 ? "16px" : 0 }}>
                                    <div
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(236,72,153,0.2)",
                                            color: "#F472B6",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginTop: "2px"
                                        }}
                                    >
                                        {num}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: "600", color: "#FBCFE8", marginBottom: "4px" }}>
                                            {t(`booking.step${num}`)}
                                        </h4>
                                        <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                            {t(`booking.step${num}Desc`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Payments & Verification */}
                    <section
                        style={{
                            backgroundColor: "#12121e",
                            borderRadius: "16px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
                                padding: "16px 20px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div style={{ padding: "8px", backgroundColor: "rgba(34,197,94,0.2)", borderRadius: "8px" }}>
                                    <Wallet size={20} style={{ color: "#4ADE80" }} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                                    {t("payment.title")}
                                </h3>
                            </div>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <p style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "16px" }}>
                                {t("payment.instruction")}
                            </p>
                            <div className="flex gap-3 mb-4">
                                <CreditCard size={18} style={{ color: "#4ADE80", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#86EFAC", marginBottom: "4px" }}>
                                        {t("payment.bank")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("payment.bankDesc")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Upload size={18} style={{ color: "#4ADE80", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#86EFAC", marginBottom: "4px" }}>
                                        {t("payment.proof")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("payment.proofDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Customer Dashboard */}
                    <section
                        style={{
                            backgroundColor: "#12121e",
                            borderRadius: "16px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            overflow: "hidden"
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))",
                                padding: "16px 20px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div style={{ padding: "8px", backgroundColor: "rgba(251,191,36,0.2)", borderRadius: "8px" }}>
                                    <LayoutDashboard size={20} style={{ color: "#FBBF24" }} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                                    {t("dashboard.title")}
                                </h3>
                            </div>
                        </div>
                        <div style={{ padding: "20px" }}>
                            <p style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "16px" }}>
                                {t("dashboard.overview")}
                            </p>
                            <div className="flex gap-3 mb-4">
                                <Clock size={18} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#FDE68A", marginBottom: "4px" }}>
                                        {t("dashboard.myRentals")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("dashboard.myRentalsDesc")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Receipt size={18} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "2px" }} />
                                <div>
                                    <h4 style={{ fontWeight: "600", color: "#FDE68A", marginBottom: "4px" }}>
                                        {t("dashboard.receipts")}
                                    </h4>
                                    <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                        {t("dashboard.receiptsDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ----- GLOSSARY OF TERMS ----- */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div style={{ padding: "12px", backgroundColor: "rgba(16,185,129,0.2)", borderRadius: "12px" }}>
                            <BookOpen size={24} style={{ color: "#34D399" }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
                                {t("glossary.title")}
                            </h2>
                            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Important terms you should know</p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "16px"
                        }}
                    >
                        {glossaryTerms.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: "#12121e",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "12px",
                                    padding: "20px"
                                }}
                            >
                                <div className="flex gap-3">
                                    <div style={{ padding: "8px", backgroundColor: "rgba(16,185,129,0.1)", borderRadius: "8px", height: "fit-content" }}>
                                        <item.icon size={16} style={{ color: "#34D399" }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: "bold", color: "#A7F3D0", marginBottom: "6px" }}>
                                            {item.term}
                                        </h4>
                                        <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                            {item.def}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- FAQ SECTION ----- */}
                <section
                    className="mb-16"
                    style={{
                        backgroundColor: "#12121e",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        padding: "32px 24px"
                    }}
                >
                    <div className="text-center mb-10">
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(234,179,8,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px auto"
                            }}
                        >
                            <HelpCircle size={24} style={{ color: "#EAB308" }} />
                        </div>
                        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                            {t("faq.title")}
                        </h2>
                        <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Quick answers to common questions</p>
                    </div>

                    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                        {faqItems.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: "#0a0a12",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    marginBottom: idx < faqItems.length - 1 ? "12px" : 0
                                }}
                            >
                                <div className="flex gap-3">
                                    <span style={{ color: "#EAB308", fontWeight: "bold", fontSize: "14px" }}>
                                        Q{idx + 1}
                                    </span>
                                    <div>
                                        <h4 style={{ fontWeight: "600", color: "white", marginBottom: "8px" }}>
                                            {item.q}
                                        </h4>
                                        <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.6" }}>
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- IMPORTANT NOTES ----- */}
                <section
                    className="mb-16"
                    style={{
                        background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))",
                        borderRadius: "16px",
                        padding: "24px",
                        border: "1px solid rgba(239,68,68,0.2)"
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div
                            style={{
                                padding: "12px",
                                backgroundColor: "rgba(239,68,68,0.2)",
                                borderRadius: "12px",
                                flexShrink: 0
                            }}
                        >
                            <AlertCircle size={24} style={{ color: "#F87171" }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "12px" }}>
                                Important Reminders
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {[
                                    "Always return costumes in clean, good condition to get your full deposit back.",
                                    "Late returns incur additional fees. Please return on or before your rental end date.",
                                    "Report any damage immediately to avoid penalties.",
                                    "Keep your payment proof until your deposit is refunded."
                                ].map((text, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2"
                                        style={{ marginBottom: i < 3 ? "8px" : 0 }}
                                    >
                                        <span style={{ color: "#F87171", marginTop: "4px" }}>•</span>
                                        <span style={{ fontSize: "14px", color: "#D1D5DB", lineHeight: "1.6" }}>
                                            {text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ----- CTA SECTION ----- */}
                <section className="text-center" style={{ paddingTop: "24px" }}>
                    <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "12px" }}>
                        Ready to start your cosplay journey?
                    </h3>
                    <p style={{ color: "#9CA3AF", marginBottom: "24px" }}>
                        Browse our collection and find your perfect costume today!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2"
                            style={{
                                padding: "14px 28px",
                                borderRadius: "9999px",
                                background: "linear-gradient(90deg, #9370DB, #EC4899)",
                                color: "white",
                                fontWeight: "bold",
                                textDecoration: "none"
                            }}
                        >
                            Browse Costumes
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2"
                            style={{
                                padding: "14px 28px",
                                borderRadius: "9999px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: "bold",
                                textDecoration: "none"
                            }}
                        >
                            Create Account
                        </Link>
                    </div>
                </section>

            </main>

            {/* ===== FOOTER NOTE ===== */}
            <footer
                className="text-center"
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    padding: "24px"
                }}
            >
                <p style={{ fontSize: "14px", color: "#6B7280" }}>
                    Need help? Contact us at{" "}
                    <a href="mailto:support@clovercosplay.com" style={{ color: "#9370DB" }}>
                        support@clovercosplay.com
                    </a>
                </p>
            </footer>
        </div>
    );
}
