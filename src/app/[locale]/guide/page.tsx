import { useTranslations } from "next-intl";
import Link from "next/link";
import {
    BookOpen,
    User,
    ShoppingBag,
    CreditCard,
    LayoutDashboard,
    HelpCircle,
    FileText,
    ChevronRight,
    Search,
    CalendarCheck,
    CheckCircle2,
    Truck,
    RotateCcw,
    ShieldCheck,
    Info,
    ArrowRight
} from "lucide-react";

export default function GuidePage() {
    const t = useTranslations("guide");

    // Flowchart data
    const steps = [
        { id: "step1", icon: Search, label: t("flowchart.step1") },
        { id: "step2", icon: CalendarCheck, label: t("flowchart.step2") },
        { id: "step3", icon: CreditCard, label: t("flowchart.step3") },
        { id: "step4", icon: ShieldCheck, label: t("flowchart.step4") },
        { id: "step5", icon: Truck, label: t("flowchart.step5") },
        { id: "step6", icon: RotateCcw, label: t("flowchart.step6") },
    ];

    const glossary = [
        { term: t("glossary.deposit.term"), def: t("glossary.deposit.def") },
        { term: t("glossary.rentalPeriod.term"), def: t("glossary.rentalPeriod.def") },
        { term: t("glossary.verification.term"), def: t("glossary.verification.def") },
        { term: t("glossary.proof.term"), def: t("glossary.proof.def") },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D1A] text-white">
            {/* Hero Section */}
            <div className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-[#0D0D1A] pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <BookOpen size={16} className="text-[#9370DB]" />
                        <span className="text-sm font-medium text-gray-300">Official Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-6 bg-gradient-to-r from-white via-purple-200 to-[#9370DB] bg-clip-text text-transparent drop-shadow-lg">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-24 space-y-24">

                {/* 1. Visual Flowchart */}
                <section>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20">
                            <LayoutDashboard size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{t("flowchart.title")}</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-900/50 via-purple-600/50 to-purple-900/50 -translate-y-1/2 z-0 rounded-full" />

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative z-10">
                            {steps.map((step, index) => (
                                <div key={step.id} className="group relative flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E] border border-purple-500/30 group-hover:border-purple-500 group-hover:shadow-[0_0_20px_rgba(147,112,219,0.3)] flex items-center justify-center mb-4 transition-all duration-300 backdrop-blur-sm">
                                        <step.icon size={28} className="text-gray-400 group-hover:text-[#9370DB] transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-mono text-purple-400/80 mb-1">STEP 0{index + 1}</div>
                                        <div className="font-semibold text-sm md:text-base">{step.label}</div>
                                    </div>

                                    {/* Arrow for Mobile */}
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="md:hidden absolute -right-3 top-6 text-purple-500/30" size={16} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. Detailed Grid Guidelines */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Getting Started */}
                    <div className="bg-[#13132B]/60 border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <User size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">{t("account.title")}</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="pl-4 border-l-2 border-blue-500/20">
                                <h4 className="font-semibold text-blue-200 mb-2">{t("account.register")}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{t("account.registerDesc")}</p>
                            </div>
                            <div className="pl-4 border-l-2 border-blue-500/20">
                                <h4 className="font-semibold text-blue-200 mb-2">{t("account.login")}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{t("account.loginDesc")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Process */}
                    <div className="bg-[#13132B]/60 border border-white/5 rounded-2xl p-8 hover:border-purple-500/20 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">{t("booking.title")}</h3>
                        </div>
                        <ul className="space-y-4">
                            {[1, 2, 3].map((num) => (
                                <li key={num} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                        {num}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-pink-100 mb-1">{t(`booking.step${num}`)}</h4>
                                        <p className="text-gray-400 text-sm">{t(`booking.step${num}Desc`)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Glossary Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20">
                            <BookOpen size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{t("glossary.title")}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {glossary.map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Info className="flex-shrink-0 text-[#9370DB] mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-lg text-[#9370DB] mb-2">{item.term}</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{item.def}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. FAQ Accordion Style */}
                <section className="bg-gradient-to-b from-[#1A1A2E] to-[#0D0D1A] rounded-3xl p-8 md:p-12 border border-white/5">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">{t("faq.title")}</h2>
                        <p className="text-gray-400">Common questions answered for you</p>
                    </div>

                    <div className="grid gap-4 max-w-3xl mx-auto">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="bg-black/20 rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                                <h3 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-yellow-400" />
                                    {t(`faq.q${num}`)}
                                </h3>
                                <p className="text-gray-400 pl-7 leading-relaxed">
                                    {t(`faq.a${num}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="text-center">
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                    >
                        Start Your Cosplay Journey
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
