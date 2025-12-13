// app/layout.js
import "../index.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "..//components/Providers"; // Import the Client Component

export const metadata = {
  title: "HAMRO | PDF - Free PDF Tools",
  description: "Every tool you need to work with PDFs in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
