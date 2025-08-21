import "../globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Email Verification | Royal Fold & Forge",
  description: "Verify your email address to activate your account at Royal Fold & Forge and start enjoying our premium products and services securely.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "email verification, confirm email, account activation, Royal Fold & Forge, secure registration",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Email Verification | Royal Fold & Forge",
    description: "Verify your email address to activate your account at Royal Fold & Forge and start enjoying our premium products and services securely.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/email-verification-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Email Verification | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Verification | Royal Fold & Forge",
    description: "Verify your email address to activate your account at Royal Fold & Forge and start enjoying our premium products and services securely.",
    images: ["/email-verification-banner.jpeg"],
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

