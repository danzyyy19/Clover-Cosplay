import { useTranslations } from "next-intl";
import Link from "next/link";
import { BookOpen, User, ShoppingBag, CreditCard, LayoutDashboard, HelpCircle, FileText, ChevronRight } from "lucide-react";

export default function GuidePage() {
    const t = useTranslations("guide");

    const sections = [
        {
            id: "intro",
            icon: <BookOpen className="w-8 h-8 text-primary" />,
            title: t("intro.title"),
            content: t("intro.content")
        },
        {
            id: "account",
            icon: <User className="w-8 h-8 text-primary" />,
            title: t("account.title"),
            subsections: [
                { title: t("account.register"), content: t("account.registerDesc") },
                { title: t("account.login"), content: t("account.loginDesc") }
            ]
        },
        {
            id: "booking",
            icon: <ShoppingBag className="w-8 h-8 text-primary" />,
            title: t("booking.title"),
            subsections: [
                { title: t("booking.step1"), content: t("booking.step1Desc") },
                { title: t("booking.step2"), content: t("booking.step2Desc") },
                { title: t("booking.step3"), content: t("booking.step3Desc") }
            ]
        },
        {
            id: "payment",
            icon: <CreditCard className="w-8 h-8 text-primary" />,
            title: t("payment.title"),
            intro: t("payment.instruction"),
            subsections: [
                { title: t("payment.bank"), content: t("payment.bankDesc") },
                { title: t("payment.proof"), content: t("payment.proofDesc") }
            ]
        },
        {
            id: "dashboard",
            icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
            title: t("dashboard.title"),
            intro: t("dashboard.overview"),
            subsections: [
                { title: t("dashboard.myRentals"), content: t("dashboard.myRentalsDesc") },
                { title: t("dashboard.receipts"), content: t("dashboard.receiptsDesc") }
            ]
        },
        {
            id: "faq",
            icon: <HelpCircle className="w-8 h-8 text-primary" />,
            title: t("faq.title"),
            subsections: [
                { title: t("faq.q1"), content: t("faq.a1") },
                { title: t("faq.q2"), content: t("faq.a2") },
                { title: t("faq.q3"), content: t("faq.a3") }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-outfit bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
                </div>

                {/* Table of Contents - Quick Links */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        {t("toc")}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
                            >
                                <ChevronRight size={14} />
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {sections.map((section, index) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="scroll-mt-24 relative"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold font-outfit mb-2">
                                        {section.title}
                                    </h2>
                                    {/* @ts-ignore */}
                                    {section.content && (
                                        // @ts-ignore
                                        <p className="text-lg text-text-secondary leading-relaxed">{section.content}</p>
                                    )}
                                    {/* @ts-ignore */}
                                    {section.intro && (
                                        // @ts-ignore
                                        <p className="text-lg text-text-secondary leading-relaxed text-muted-foreground">{section.intro}</p>
                                    )}
                                </div>
                            </div>

                            {/* Subsections Cards */}
                            {/* @ts-ignore */}
                            {section.subsections && (
                                <div className="grid md:grid-cols-2 gap-6 ml-0 md:ml-16">
                                    {/* @ts-ignore */}
                                    {section.subsections.map((sub, i) => (
                                        <div
                                            key={i}
                                            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors duration-300"
                                        >
                                            <h3 className="text-lg font-semibold mb-2 text-primary">
                                                {sub.title}
                                            </h3>
                                            <p className="text-text-secondary text-sm leading-relaxed">
                                                {sub.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Divider */}
                            {index < sections.length - 1 && (
                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-16" />
                            )}
                        </section>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center pt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                    >
                        Let's Start Renting!
                    </Link>
                </div>
            </div>
        </div>
    );
}
