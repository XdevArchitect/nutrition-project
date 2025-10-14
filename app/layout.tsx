import type {Metadata} from "next";
import "./globals.css";
import {Poppins, Inter} from "next/font/google";
import {Navigation} from "../components/navigation";
import {Footer} from "../components/footer";

const heading = Poppins({subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-heading"});
const body = Inter({subsets: ["latin"], variable: "--font-body"});

export const metadata: Metadata = {
  title: {
    default: "Dinh Dưỡng Tối Ưu",
    template: "%s | Dinh Dưỡng Tối Ưu"
  },
  description: "Kiến thức dinh dưỡng toàn diện và khoá học chuyên sâu giúp bạn xây dựng lối sống lành mạnh.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable}`}>
      <body className="bg-white text-neutral-900 antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
