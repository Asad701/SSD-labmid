import "./globals.css";


export const metadata = {
  title: "Royal Fold & Forge | Premium Damascus Handicraft and Culinary Items",
  description: "Welcome to Royal Fold & Forge — explore our exquisite collection of Damascus handicraft products, chef sets, and culinary items for your home and decor.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "Damascus handicraft, chef set, culinary items, home decor, Royal Fold & Forge, handmade, premium quality",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Royal Fold & Forge | Premium Damascus Handicraft and Culinary Items",
    description: "Welcome to Royal Fold & Forge — explore our exquisite collection of Damascus handicraft products, chef sets, and culinary items for your home and decor.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/home-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Royal Fold & Forge - Premium Damascus Handicraft and Culinary Items",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Fold & Forge | Premium Damascus Handicraft and Culinary Items",
    description: "Welcome to Royal Fold & Forge — explore our exquisite collection of Damascus handicraft products, chef sets, and culinary items for your home and decor.",
    images: ["/home-banner.jpeg"],
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="montserrat-font">
        {children}
      </body>
    </html>
  );
}


