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
    Wallet,
    ChevronRight
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
        <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#0D0D1A] to-[#0a0a12] text-white">

            {/* ===== HERO SECTION ===== */}
            <header className="relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <BookOpen size={16} className="text-purple-400" />
                        <span className="text-sm font-medium text-gray-300">Official User Guide</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                        {t("title")}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">

                {/* ----- INTRODUCTION ----- */}
                <section className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 flex-shrink-0">
                            <Info size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">{t("intro.title")}</h2>
                            <p className="text-gray-300 leading-relaxed">{t("intro.content")}</p>
                        </div>
                    </div>
                </section>

                {/* ----- BOOKING PROCESS FLOWCHART ----- */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t("flowchart.title")}</h2>
                        <p className="text-gray-400">Follow these simple steps to rent your favorite costume</p>
                    </div>

                    {/* Flowchart Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {flowSteps.map((step, index) => (
                            <div key={step.id} className="relative group">
                                {/* Step Card */}
                                <div className="bg-[#151520] border border-white/5 rounded-2xl p-5 text-center hover:border-purple-500/50 hover:bg-[#1a1a28] transition-all duration-300 h-full flex flex-col items-center justify-start">

                                    {/* Step Number */}
                                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center mb-4 shadow-lg shadow-purple-600/30">
                                        {step.id}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-[#0D0D1A] border border-white/10 flex items-center justify-center mb-4 group-hover:border-purple-500/50 transition-colors">
                                        <step.icon size={24} className="text-purple-400" />
                                    </div>

                                    {/* Label */}
                                    <h3 className="font-bold text-white text-sm mb-1">{step.label}</h3>
                                    <p className="text-xs text-gray-500">{step.desc}</p>
                                </div>

                                {/* Arrow (hidden on last item and mobile) */}
                                {index < flowSteps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <ChevronRight size={20} className="text-purple-500/50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- DETAILED GUIDE SECTIONS ----- */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Getting Started */}
                    <section className="bg-[#12121e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/20 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <User size={20} className="text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{t("account.title")}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex gap-4">
                                <CheckCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-200 mb-1">{t("account.register")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("account.registerDesc")}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-200 mb-1">{t("account.login")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("account.loginDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How to Rent */}
                    <section className="bg-[#12121e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-600/20 to-pink-900/20 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-500/20 rounded-lg">
                                    <ShoppingBag size={20} className="text-pink-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{t("booking.title")}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {num}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-pink-200 mb-1">{t(`booking.step${num}`)}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{t(`booking.step${num}Desc`)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Payments & Verification */}
                    <section className="bg-[#12121e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600/20 to-green-900/20 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Wallet size={20} className="text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{t("payment.title")}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-sm text-gray-400">{t("payment.instruction")}</p>
                            <div className="flex gap-4">
                                <CreditCard size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-green-200 mb-1">{t("payment.bank")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("payment.bankDesc")}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Upload size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-green-200 mb-1">{t("payment.proof")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("payment.proofDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Customer Dashboard */}
                    <section className="bg-[#12121e] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-600/20 to-amber-900/20 px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <LayoutDashboard size={20} className="text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{t("dashboard.title")}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            <p className="text-sm text-gray-400">{t("dashboard.overview")}</p>
                            <div className="flex gap-4">
                                <Clock size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-200 mb-1">{t("dashboard.myRentals")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("dashboard.myRentalsDesc")}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Receipt size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-200 mb-1">{t("dashboard.receipts")}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{t("dashboard.receiptsDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ----- GLOSSARY OF TERMS ----- */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <BookOpen size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{t("glossary.title")}</h2>
                            <p className="text-gray-400 text-sm">Important terms you should know</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {glossaryTerms.map((item, idx) => (
                            <div key={idx} className="bg-[#12121e] border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                                <div className="flex gap-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg h-fit group-hover:bg-emerald-500/20 transition-colors">
                                        <item.icon size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-100 mb-1">{item.term}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{item.def}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- FAQ SECTION ----- */}
                <section className="bg-[#12121e] rounded-2xl border border-white/5 p-8 md:p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-400 mb-4">
                            <HelpCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{t("faq.title")}</h2>
                        <p className="text-gray-400 text-sm">Quick answers to common questions</p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqItems.map((item, idx) => (
                            <div key={idx} className="bg-[#0a0a12] border border-white/5 rounded-xl p-6 hover:border-yellow-500/20 transition-colors">
                                <div className="flex gap-4">
                                    <div className="text-yellow-500 font-mono font-bold text-sm mt-0.5">Q{idx + 1}</div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ----- IMPORTANT NOTES ----- */}
                <section className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-400 flex-shrink-0">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Important Reminders</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Always return costumes in clean, good condition to get your full deposit back.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Late returns incur additional fees. Please return on or before your rental end date.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Report any damage immediately to avoid penalties.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Keep your payment proof until your deposit is refunded.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ----- CTA SECTION ----- */}
                <section className="text-center py-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to start your cosplay journey?</h3>
                    <p className="text-gray-400 mb-8">Browse our collection and find your perfect costume today!</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5"
                        >
                            Browse Costumes
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                        >
                            Create Account
                        </Link>
                    </div>
                </section>

            </main>

            {/* ===== FOOTER NOTE ===== */}
            <footer className="border-t border-white/5 py-8 text-center">
                <p className="text-sm text-gray-500">
                    Need help? Contact us at{" "}
                    <a href="mailto:support@clovercosplay.com" className="text-purple-400 hover:underline">
                        support@clovercosplay.com
                    </a>
                </p>
            </footer>
        </div>
    );
}
