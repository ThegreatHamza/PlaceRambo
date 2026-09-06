import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { StoreProvider } from "@/lib/store";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "PlaceRambo — Djibouti's Modern Marketplace",
    template: "%s | PlaceRambo",
  },
  description:
    "Buy, sell, rent and discover products, properties, vehicles and services in Djibouti. The #1 digital marketplace.",
  keywords: [
    "Djibouti marketplace",
    "buy sell Djibouti",
    "cars Djibouti",
    "real estate Djibouti",
    "services Djibouti",
    "PlaceRambo",
  ],
  openGraph: {
    title: "PlaceRambo — Djibouti's Modern Marketplace",
    description:
      "The premium marketplace for products, properties, vehicles and local services in Djibouti.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark:bg-slate-950">
      <body>
        <I18nProvider>
          <AuthProvider>
            <StoreProvider>
              <div className="min-h-screen flex flex-col bg-[var(--bg)]">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </StoreProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
