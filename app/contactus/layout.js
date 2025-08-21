import "../globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";


export const metadata = {
  title: "Contact Us | Royal Fold & Forge",
  description: "Get in touch with Royal Fold & Forge for inquiries, support, or feedback. We're here to help with any questions about our Damascus handicraft and culinary products.",
  authors: [{ name: "ASAD KALEEM ULLAH" }],
  keywords: "contact us, support, inquiries, feedback, Royal Fold & Forge, customer service, Damascus handicraft",
  metadataBase: new URL("https://www.royalfoldforge.com"),
  openGraph: {
    title: "Contact Us | Royal Fold & Forge",
    description: "Get in touch with Royal Fold & Forge for inquiries, support, or feedback. We're here to help with any questions about our Damascus handicraft and culinary products.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/contact-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Contact Us | Royal Fold & Forge",
      },
    ],
    siteName: "Royal Fold & Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Royal Fold & Forge",
    description: "Get in touch with Royal Fold & Forge for inquiries, support, or feedback. We're here to help with any questions about our Damascus handicraft and culinary products.",
    images: ["/contact-banner.jpeg"],
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

