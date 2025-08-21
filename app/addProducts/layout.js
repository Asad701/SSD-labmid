import "../globals.css";


export const metadata = {
  title: "Damascus Handicraft Chef Set and Culinary Items",
  description: "Explore our exquisite collection of Damascus handicraft chef sets and culinary items, perfect for household and decoration.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "Damascus handicraft, chef set, culinary items, household, decoration",
  metadataBase: new URL("https://yourwebsite.com"),
  openGraph: {
    title: "Damascus Handicraft Chef Set and Culinary Items",
    description: "Explore our exquisite collection of Damascus handicraft chef sets and culinary items, perfect for household and decoration.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/download.jpeg",
        width: 1200,
        height: 630,
        alt: "Damascus Handicraft Chef Set and Culinary Items",
      },
    ],
    siteName: "Royal Fold",
  },
  twitter: {
    card: "summary_large_image",
    title: "Damascus Handicraft Chef Set and Culinary Items",
    description: "Explore our exquisite collection of Damascus handicraft chef sets and culinary items, perfect for household and decoration.",
    images: ["/download.jpeg"],
  },
};


export default function RootLayout({ children }) {
  return (
      <div className="montserrat-font">
        {children}
      </div>
  );
}

