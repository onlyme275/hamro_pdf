import {
  FileText,
  FileIcon as FileSplit,
  FileDown,
  FileIcon as FileWord,
  FileIcon as FilePowerpoint,
  FileSpreadsheet,
  ImageIcon,
  RotateCw,
  Edit3,
  FileSignature,
  Stamp,
  FileCode,
  Unlock,
  Lock,
} from "lucide-react";

export const toolsData = [
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description:
      "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: (
      <FileText className="h-10 w-10 p-1 bg-red-100 text-red-500 rounded" />
    ),
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description:
      "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: (
      <FileSplit className="h-10 w-10 p-1 bg-red-100 text-red-500 rounded" />
    ),
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: (
      <FileDown className="h-10 w-10 p-1 bg-green-100 text-green-500 rounded" />
    ),
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description:
      "Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.",
    icon: (
      <FileWord className="h-10 w-10 p-1 bg-blue-100 text-blue-500 rounded" />
    ),
  },
  {
    id: "pdf-to-powerpoint",
    title: "PDF to PowerPoint",
    description:
      "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: (
      <FilePowerpoint className="h-10 w-10 p-1 bg-red-100 text-red-500 rounded" />
    ),
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    description:
      "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    icon: (
      <FileSpreadsheet className="h-10 w-10 p-1 bg-green-100 text-green-500 rounded" />
    ),
  },
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description:
      "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: (
      <FileWord className="h-10 w-10 p-1 bg-blue-100 text-blue-500 rounded" />
    ),
  },
  {
    id: "powerpoint-to-pdf",
    title: "PowerPoint to PDF",
    description:
      "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    icon: (
      <FilePowerpoint className="h-10 w-10 p-1 bg-red-100 text-red-500 rounded" />
    ),
  },
  {
    id: "excel-to-pdf",
    title: "Excel to PDF",
    description:
      "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    icon: (
      <FileSpreadsheet className="h-10 w-10 p-1 bg-green-100 text-green-500 rounded" />
    ),
  },
  {
    id: "edit-pdf",
    title: "Edit PDF",
    description:
      "Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.",
    icon: (
      <Edit3 className="h-10 w-10 p-1 bg-purple-100 text-purple-500 rounded" />
    ),
    isNew: true,
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description:
      "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: (
      <ImageIcon className="h-10 w-10 p-1 bg-yellow-100 text-yellow-500 rounded" />
    ),
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description:
      "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: (
      <ImageIcon className="h-10 w-10 p-1 bg-yellow-100 text-yellow-500 rounded" />
    ),
  },
  {
    id: "sign-pdf",
    title: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: (
      <FileSignature className="h-10 w-10 p-1 bg-blue-100 text-blue-500 rounded" />
    ),
  },
  {
    id: "watermark",
    title: "Watermark",
    description:
      "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
    icon: (
      <Stamp className="h-10 w-10 p-1 bg-purple-100 text-purple-500 rounded" />
    ),
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description:
      "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    icon: (
      <RotateCw className="h-10 w-10 p-1 bg-pink-100 text-pink-500 rounded" />
    ),
  },
  {
    id: "html-to-pdf",
    title: "HTML to PDF",
    description:
      "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.",
    icon: (
      <FileCode className="h-10 w-10 p-1 bg-yellow-100 text-yellow-500 rounded" />
    ),
  },
  {
    id: "unlock-pdf",
    title: "Unlock PDF",
    description:
      "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: (
      <Unlock className="h-10 w-10 p-1 bg-blue-100 text-blue-500 rounded" />
    ),
  },
  {
    id: "protect-pdf",
    title: "Protect PDF",
    description:
      "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: <Lock className="h-10 w-10 p-1 bg-teal-100 text-teal-500 rounded" />,
  },
];
