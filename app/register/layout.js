import "../globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Register an Account | Royal Fold & Forge",
  description: "Create your account at Royal Fold & Forge to enjoy personalized experiences, exclusive offers, and a seamless shopping experience.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "register, sign up, create account, Royal Fold & Forge, user account, membership",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Register an Account | Royal Fold & Forge",
    description: "Create your account at Royal Fold & Forge to enjoy personalized experiences, exclusive offers, and a seamless shopping experience.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/register-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Register an Account | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register an Account | Royal Fold & Forge",
    description: "Create your account at Royal Fold & Forge to enjoy personalized experiences, exclusive offers, and a seamless shopping experience.",
    images: ["/register-banner.jpeg"],
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

