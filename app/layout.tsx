import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Recicladora en Ciudad Juárez | MARDOS Reciclados",
    template: "%s | MARDOS Reciclados",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    url: site.domain,
    title: "Recicladora en Ciudad Juárez | MARDOS Reciclados",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.domain,
  email: site.email,
  telephone: site.phones,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.colony}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: site.address.country,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
