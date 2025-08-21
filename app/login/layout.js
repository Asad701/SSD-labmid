import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Login | Royal Fold & Forge",
  description: "Access your account at Royal Fold & Forge to manage your orders, update your profile, and enjoy a personalized shopping experience.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "login, sign in, account access, Royal Fold & Forge, secure login, user account",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Login | Royal Fold & Forge",
    description: "Access your account at Royal Fold & Forge to manage your orders, update your profile, and enjoy a personalized shopping experience.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/login-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Login | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Royal Fold & Forge",
    description: "Access your account at Royal Fold & Forge to manage your orders, update your profile, and enjoy a personalized shopping experience.",
    images: ["/login-banner.jpeg"],
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

