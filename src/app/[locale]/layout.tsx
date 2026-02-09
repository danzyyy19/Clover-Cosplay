import type { Metadata } from "next";
import { Outfit, Noto_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import "../globals.css";
import { Chatbot } from "@/components/chat/chatbot";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
    subsets: ["thai"],
    variable: "--font-noto-thai",
    display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return {
        title: locale === "th" ? "Clover Cosplay - เช่าชุดคอสเพลย์พรีเมียม" : "Clover Cosplay - Premium Costume Rental",
        description: locale === "th"
            ? "บริการเช่าชุดคอสเพลย์ชั้นนำ ชุดอนิเมะคุณภาพสูงสำหรับงานอีเวนต์ถัดไปของคุณ"
            : "Your premier cosplay costume rental service. High-quality anime costumes for your next event.",
        icons: {
            icon: "/images/logo.png",
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning className={`${outfit.variable} ${notoSansThai.variable}`}>
            <body className={locale === "th" ? "font-thai" : "font-outfit"}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange={false}
                    >
                        <NextIntlClientProvider messages={messages}>
                            {children}
                            <Toaster
                                position="top-right"
                                closeButton
                                toastOptions={{
                                    className: "anime-toast",
                                    classNames: {
                                        toast: "anime-toast",
                                        title: "text-primary font-semibold",
                                        description: "text-secondary text-sm",
                                    },
                                    duration: 4000,
                                }}
                            />
                            <Chatbot />
                        </NextIntlClientProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

