import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Cairo, IBM_Plex_Serif, Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-ibm-plex-serif",
});
const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["200", "300", "400", "500"],
    variable: "--font-cairo",
});

export const metadata: Metadata = {
    title: "Word Memorizing",
    description: "app to help you to memorize word",
    icons: {
        icon: "/favicon.ico",
    },
};
export default async function LocaleLayout({
    children,
    params: { locale },
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const messages = await getMessages();
    return (
        <html
            lang={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="dark"
        >
            <body
                className={`${inter.variable} ${ibmPlexSerif.variable} ${cairo.variable}`}
            >
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
