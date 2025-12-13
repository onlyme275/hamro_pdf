import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/UserDashboard";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import OcrPdf from "./pages/OcrPdf";
import PdfToWord from "./pages/PdfToWord";
import WordToPdf from "./pages/WordToPdf";
import PdfToExcel from "./pages/PdfToExcel";
import ExcelToPdf from "./pages/ExcelToPdf";
import PdftoPpt from "./pages/PdftoPpt";
import PdfToJpg from "./pages/PdfToJpg";
import JpgToPdf from "./pages/JpgToPdf";
import RotatePdf from "./pages/RotatePdf";
import WatermarkPdf from "./pages/WatermarkPdf";
import ProtectPdf from "./pages/ProtectPdf";
import Compare from "./pages/Compare";
import Compress from "./pages/Compress";
import OrganizePdf from "./pages/OrganizePdf";
import PageNumberPdf from "./pages/PageNumberPdf";
import SignPdf from "./pages/SignPdf";
import PdfToPdfa from "./pages/PdfToPdfa";
import PremiumUserDashboard from "./pages/PremiumUserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./components/Providers";
import OAuthCallback from "./pages/OAuthCallback.jsx"; // Adjust the path based on where you saved it
import Contact from "./pages/Contact.jsx";
import SplashAdminPage from "./pages/SplashAdminPage";
import Education from "./pages/Education.jsx";
import Business from "./pages/Business.jsx";
import AdsManagement from "./pages/admin/AdsManagement.jsx";
import PdfEditor from "./pages/EditPdf.jsx";
import PDFRepairTool from "./pages/PdfRepair.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-grow">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />

              {/* Contact */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              {/* Auth */}
              <Route
                path="/dashboard/admin/splash"
                element={<SplashAdminPage />}
              />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Dashboards */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/premium-dashboard"
                element={<PremiumUserDashboard />}
              />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/ads" element={<AdsManagement />} />

              {/* PDF Tools */}
              <Route path="/edit" element={<PdfEditor />} />
              <Route path="/merge" element={<MergePdf />} />
              <Route path="/split" element={<SplitPdf />} />
              <Route path="/ocr" element={<OcrPdf />} />
              <Route path="/pdf-to-word" element={<PdfToWord />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />
              <Route path="/pdf-to-excel" element={<PdfToExcel />} />
              <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
              <Route path="/pdf-to-ppt" element={<PdftoPpt />} />
              <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
              <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
              <Route path="/rotate" element={<RotatePdf />} />
              <Route path="/watermark" element={<WatermarkPdf />} />
              <Route path="/protect" element={<ProtectPdf />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/compress" element={<Compress />} />
              <Route path="/organize" element={<OrganizePdf />} />
              <Route path="/page-number" element={<PageNumberPdf />} />
              <Route path="/sign" element={<SignPdf />} />
              <Route path="/pdf-to-pdfa" element={<PdfToPdfa />} />
              <Route path="/Education" element={<Education />} />
              <Route path="/Business" element={<Business />} />
              <Route path="/repair" element={<PDFRepairTool />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </Providers>
  </StrictMode>
);
