import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "My Account | Royal Fold & Forge",
  description: "Manage your Royal Fold & Forge account to view orders, update personal details, and access your favorite Damascus handicraft and culinary products.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "account, profile, user account, Royal Fold & Forge, order history, favorites, settings, Damascus handicraft",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "My Account | Royal Fold & Forge",
    description: "Manage your Royal Fold & Forge account to view orders, update personal details, and access your favorite Damascus handicraft and culinary products.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/account-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "My Account | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Account | Royal Fold & Forge",
    description: "Manage your Royal Fold & Forge account to view orders, update personal details, and access your favorite Damascus handicraft and culinary products.",
    images: ["/account-banner.jpeg"],
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

