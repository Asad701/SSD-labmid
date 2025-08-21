import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Damascus Handicraft Chef Set and Culinary Items | Royal Fold & Forge",
  description: "Discover our premium Damascus handicraft chef sets and culinary items at Royal Fold & Forge — perfect for culinary enthusiasts and elegant household decor.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "Damascus handicraft, chef set, culinary items, household, decoration, Royal Fold & Forge",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Damascus Handicraft Chef Set and Culinary Items | Royal Fold & Forge",
    description: "Discover our premium Damascus handicraft chef sets and culinary items at Royal Fold & Forge — perfect for culinary enthusiasts and elegant household decor.",
    type: "website", // <-- valid type
    locale: "en_US",
    images: [
      {
        url: "/download.jpeg",
        width: 1200,
        height: 630,
        alt: "Damascus Handicraft Chef Set and Culinary Items | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },

  twitter: {
    card: "summary_large_image",
    title: "Damascus Handicraft Chef Set and Culinary Items | Royal Fold & Forge",
    description: "Discover our premium Damascus handicraft chef sets and culinary items at Royal Fold & Forge — perfect for culinary enthusiasts and elegant household decor.",
    images: ["/download.jpeg"],
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

