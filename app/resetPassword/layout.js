import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Reset Password | Royal Fold & Forge",
  description: "Reset your password securely at Royal Fold & Forge to regain access to your account and continue enjoying our premium products and services.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "reset password, forgot password, account recovery, Royal Fold & Forge, secure login",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Reset Password | Royal Fold & Forge",
    description: "Reset your password securely at Royal Fold & Forge to regain access to your account and continue enjoying our premium products and services.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/reset-password-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Reset Password | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Royal Fold & Forge",
    description: "Reset your password securely at Royal Fold & Forge to regain access to your account and continue enjoying our premium products and services.",
    images: ["/reset-password-banner.jpeg"],
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

