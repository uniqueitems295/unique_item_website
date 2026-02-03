import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Unique Items | Premium Watches Online",
  description:
    "Unique Items is an e-commerce store offering premium, stylish, and affordable watches. Discover modern designs and timeless classics for every occasion.",
  keywords: [
    "Unique Items",
    "watches",
    "buy watches online",
    "men watches",
    "women watches",
    "ecommerce watches",
    "stylish watches",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID // e.g. G-XXXXXXXXXX

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster />

        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
