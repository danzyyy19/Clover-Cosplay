import type { Metadata } from "next";
import { Outfit, Noto_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import "../globals.css";

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

export const metadata: Metadata = {
    title: "Clover Cosplay - Premium Costume Rental",
    description: "Your premier cosplay costume rental service. High-quality anime costumes for your next event.",
    icons: {
        icon: "/images/logo.png",
    },
};

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
                        </NextIntlClientProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

