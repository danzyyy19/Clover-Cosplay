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
        <div className="min-h-screen bg-[#0D0D1A] text-white selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0D0D1A] to-[#0D0D1A] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

                <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-lg shadow-purple-500/10">
                        <BookOpen size={16} className="text-[#9370DB]" />
                        <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">Official Documentation</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-8 bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-32 space-y-32">

                {/* 1. Visual Flowchart */}
                <section className="relative">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-16 text-center md:text-left">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20 transform rotate-3">
                            <LayoutDashboard size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{t("flowchart.title")}</h2>
                            <p className="text-gray-400 mt-1">Follow these simple steps to rent your favorite costume</p>
                        </div>
                    </div>

                    <div className="relative py-8">
                        {/* Connecting Line (Desktop) - Aligned with Icons */}
                        <div className="hidden md:block absolute top-[4.5rem] left-[4%] right-[4%] h-0.5 bg-gradient-to-r from-transparent via-purple-600/50 to-transparent z-0" />

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
                            {steps.map((step, index) => (
                                <div key={step.id} className="group relative flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-[#1A1A2E]/80 border border-white/10 group-hover:border-purple-500 group-hover:shadow-[0_0_30px_rgba(147,112,219,0.25)] flex items-center justify-center mb-6 transition-all duration-300 backdrop-blur-xl relative z-10 group-hover:-translate-y-2">
                                        <step.icon size={32} className="text-gray-400 group-hover:text-[#9370DB] transition-colors duration-300" />

                                        {/* Step Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#13132B] border border-purple-500/50 flex items-center justify-center text-xs font-bold text-purple-400 shadow-lg">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="text-center px-2">
                                        <div className="font-bold text-base md:text-lg text-gray-200 group-hover:text-white transition-colors">{step.label}</div>
                                    </div>

                                    {/* Arrow for Mobile */}
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="md:hidden absolute -right-4 top-10 text-purple-500/30 animate-pulse" size={20} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. Detailed Grid Guidelines */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Getting Started */}
                    <div className="bg-gradient-to-b from-[#1A1A2E] to-[#13132B] border border-white/5 rounded-3xl p-10 hover:border-blue-500/30 transition-all duration-500 group h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform duration-500 ring-1 ring-blue-500/20">
                                <User size={28} />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{t("account.title")}</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-500 before:to-transparent before:rounded-full">
                                <h4 className="text-lg font-semibold text-blue-300 mb-3 block">{t("account.register")}</h4>
                                <p className="text-gray-400 text-base leading-relaxed">{t("account.registerDesc")}</p>
                            </div>
                            <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-500/50 before:to-transparent before:rounded-full">
                                <h4 className="text-lg font-semibold text-blue-300 mb-3 block">{t("account.login")}</h4>
                                <p className="text-gray-400 text-base leading-relaxed">{t("account.loginDesc")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Process */}
                    <div className="bg-gradient-to-b from-[#1A1A2E] to-[#13132B] border border-white/5 rounded-3xl p-10 hover:border-pink-500/30 transition-all duration-500 group h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:scale-110 transition-transform duration-500 ring-1 ring-pink-500/20">
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{t("booking.title")}</h3>
                        </div>
                        <ul className="space-y-6">
                            {[1, 2, 3].map((num) => (
                                <li key={num} className="flex gap-5 group/item">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm font-bold mt-1 shadow-[0_0_15px_rgba(236,72,153,0.15)] group-hover/item:bg-pink-500 group-hover/item:text-white transition-all duration-300">
                                        {num}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-pink-200 mb-2 text-lg">{t(`booking.step${num}`)}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{t(`booking.step${num}Desc`)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Glossary Section */}
                <section>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-12 text-center md:text-left">
                        <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-lg shadow-emerald-500/20 transform -rotate-2">
                            <BookOpen size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{t("glossary.title")}</h2>
                            <p className="text-gray-400 mt-1">Understand the key terms used in our service</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {glossary.map((item, idx) => (
                            <div key={idx} className="bg-[#1A1A2E]/50 border border-white/5 rounded-2xl p-6 hover:bg-[#1A1A2E] hover:border-emerald-500/30 transition-all duration-300 group">
                                <div className="flex items-start gap-4">
                                    <Info className="flex-shrink-0 text-emerald-500 mt-1 group-hover:text-emerald-400" size={24} />
                                    <div>
                                        <h4 className="font-bold text-lg text-emerald-100 mb-2 group-hover:text-white transition-colors">{item.term}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">{item.def}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. FAQ Accordion Style */}
                <section className="relative rounded-3xl overflow-hidden border border-white/5">
                    <div className="absolute inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />

                    <div className="relative p-8 md:p-16 z-10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
                                <HelpCircle size={14} />
                                <span>Support</span>
                            </div>
                            <h2 className="text-4xl font-bold mb-4">{t("faq.title")}</h2>
                            <p className="text-gray-400">Everything else you need to know</p>
                        </div>

                        <div className="grid gap-6 max-w-4xl mx-auto">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="bg-[#0D0D1A] rounded-2xl p-8 border border-white/5 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.05)]">
                                    <h3 className="font-bold text-xl text-white mb-4 flex items-start gap-3">
                                        <span className="text-yellow-500 mt-1">Q{num}.</span>
                                        {t(`faq.q${num}`)}
                                    </h3>
                                    <p className="text-gray-400 pl-10 leading-relaxed text-lg">
                                        {t(`faq.a${num}`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="text-center py-10">
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1"
                    >
                        Start Your Cosplay Journey
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
