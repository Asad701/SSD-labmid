import "../globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | Royal Fold & Forge",
  description: "Read the Privacy Policy of Royal Fold & Forge to understand how we collect, use, and protect your personal information when you visit our website.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "privacy policy, data protection, personal information, Royal Fold & Forge, website security",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Privacy Policy | Royal Fold & Forge",
    description: "Read the Privacy Policy of Royal Fold & Forge to understand how we collect, use, and protect your personal information when you visit our website.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/privacy-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Royal Fold & Forge",
    description: "Read the Privacy Policy of Royal Fold & Forge to understand how we collect, use, and protect your personal information when you visit our website.",
    images: ["/privacy-banner.jpeg"],
  },
};



export default function RootLayout({ children }) {
  return (
    <div className="montserrat-font">
        <Nav/>
        {children}
        <Footer/>
    </div>
  );
}

