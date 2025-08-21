import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Your Cart | Royal Fold & Forge",
  description: "Review the items in your cart at Royal Fold & Forge before completing your purchase. Ensure your selection of premium Damascus handicraft and culinary products is perfect.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "shopping cart, cart items, review order, Royal Fold & Forge, Damascus handicraft, chef sets, culinary items",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Your Cart | Royal Fold & Forge",
    description: "Review the items in your cart at Royal Fold & Forge before completing your purchase. Ensure your selection of premium Damascus handicraft and culinary products is perfect.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/cart-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Your Cart | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Cart | Royal Fold & Forge",
    description: "Review the items in your cart at Royal Fold & Forge before completing your purchase. Ensure your selection of premium Damascus handicraft and culinary products is perfect.",
    images: ["/cart-banner.jpeg"],
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

