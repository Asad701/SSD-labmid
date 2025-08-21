import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Checkout | Royal Fold & Forge",
  description: "Complete your purchase securely at Royal Fold & Forge. Review your order, enter payment details, and enjoy our premium Damascus handicraft and culinary products.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "checkout, order, payment, secure purchase, Royal Fold & Forge, Damascus handicraft, chef sets, culinary items",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Checkout | Royal Fold & Forge",
    description: "Complete your purchase securely at Royal Fold & Forge. Review your order, enter payment details, and enjoy our premium Damascus handicraft and culinary products.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/checkout-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Checkout | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | Royal Fold & Forge",
    description: "Complete your purchase securely at Royal Fold & Forge. Review your order, enter payment details, and enjoy our premium Damascus handicraft and culinary products.",
    images: ["/checkout-banner.jpeg"],
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

