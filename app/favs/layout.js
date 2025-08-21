import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Favorites | Royal Fold & Forge",
  description: "View your favorite Damascus handicraft products and culinary items at Royal Fold & Forge. Keep track of the items you love and plan your next purchase.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "favorites, wishlist, saved items, Royal Fold & Forge, Damascus handicraft, chef sets, culinary items",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Favorites | Royal Fold & Forge",
    description: "View your favorite Damascus handicraft products and culinary items at Royal Fold & Forge. Keep track of the items you love and plan your next purchase.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/favorites-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Favorites | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favorites | Royal Fold & Forge",
    description: "View your favorite Damascus handicraft products and culinary items at Royal Fold & Forge. Keep track of the items you love and plan your next purchase.",
    images: ["/favorites-banner.jpeg"],
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

