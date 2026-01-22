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
        <div className="min-h-screen bg-[#0D0D1A] text-white font-sans pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0D0D1A] py-16 px-4 text-center border-b border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                        <BookOpen size={14} className="text-[#9370DB]" />
                        <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Official Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 mt-12">

                {/* 1. Visual Flowchart */}
                <section>
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">{t("flowchart.title")}</h2>
                        <div className="h-1 w-16 bg-purple-600 mx-auto rounded-full" />
                    </div>

                    {/* Desktop & Mobile Grid - simplified */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center text-center p-4 bg-[#151525] rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors">
                                <div className="relative mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1A1A2E] flex items-center justify-center border border-white/10 text-purple-400">
                                        <step.icon size={20} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-600 text-[10px] font-bold flex items-center justify-center text-white">
                                        {index + 1}
                                    </div>
                                </div>
                                <span className="font-semibold text-sm text-gray-200">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Main Guide Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Account Section */}
                    <div className="bg-[#151525] rounded-2xl p-6 md:p-8 border border-white/5">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <User size={24} />
                            </div>
                            <h3 className="text-xl font-bold">{t("account.title")}</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-blue-300 font-medium mb-1">{t("account.register")}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("account.registerDesc")}</p>
                            </div>
                            <div>
                                <h4 className="text-blue-300 font-medium mb-1">{t("account.login")}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{t("account.loginDesc")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="bg-[#151525] rounded-2xl p-6 md:p-8 border border-white/5">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="text-xl font-bold">{t("booking.title")}</h3>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex gap-4">
                                    <div className="flex-shrink-0 w-6 h-6 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                        {num}
                                    </div>
                                    <div>
                                        <h4 className="text-pink-200 font-medium mb-1">{t(`booking.step${num}`)}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{t(`booking.step${num}Desc`)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Glossary */}
                <section>
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">{t("glossary.title")}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {glossary.map((item, idx) => (
                            <div key={idx} className="bg-[#151525] p-5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                <div className="flex gap-3">
                                    <Info className="flex-shrink-0 text-emerald-500 mt-0.5" size={18} />
                                    <div>
                                        <h4 className="font-bold text-emerald-100 mb-1">{item.term}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{item.def}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. FAQ */}
                <section className="bg-[#151525] rounded-2xl p-6 md:p-10 border border-white/5">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
                            <HelpCircle size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-white max-w-lg mx-auto mb-2">{t("faq.title")}</h2>
                        <p className="text-gray-400 text-sm">Everything you need to know</p>
                    </div>

                    <div className="grid gap-4 max-w-3xl mx-auto">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="bg-[#0D0D1A] rounded-xl p-5 border border-white/5">
                                <h3 className="font-semibold text-white mb-2 flex gap-3">
                                    <span className="text-yellow-500 font-mono text-sm mt-1">0{num}</span>
                                    {t(`faq.q${num}`)}
                                </h3>
                                <p className="text-sm text-gray-400 pl-8 leading-relaxed">
                                    {t(`faq.a${num}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="text-center pt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        Start Booking
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
