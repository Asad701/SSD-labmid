import "../globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "About Us | Royal Fold & Forge",
  description: "Learn about Royal Fold & Forge, our commitment to craftsmanship, and our exquisite collection of Damascus handicraft and culinary products for your home.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "about us, Royal Fold & Forge, Damascus handicraft, chef sets, culinary products, craftsmanship, brand story",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "About Us | Royal Fold & Forge",
    description: "Learn about Royal Fold & Forge, our commitment to craftsmanship, and our exquisite collection of Damascus handicraft and culinary products for your home.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/about-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "About Us | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Royal Fold & Forge",
    description: "Learn about Royal Fold & Forge, our commitment to craftsmanship, and our exquisite collection of Damascus handicraft and culinary products for your home.",
    images: ["/about-banner.jpeg"],
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

