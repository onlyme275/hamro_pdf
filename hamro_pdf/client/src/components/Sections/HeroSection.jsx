import { useState } from "react";
import { Link } from "react-router-dom";

// Advertisement Card Component
const AdCard = ({ title, description, image, link, badge }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">📢</span>
          </div>
        )}
        {badge && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          {title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data (for carousel functionality)
  const heroSlides = [
    {
      title: "Compress your PDF files in seconds",
      description: "Fast, secure and completely free PDF compression. Perfect for students, professionals, and businesses across Nepal.",
      buttonText: "Compress now",
      buttonLink: "/compress",
      image: "https://republicaimg.nagariknewscdn.com/shared/web/uploads/media/Prime-College-BSc-CSIT_20190912105905.jpg"
    },
    {
      title: "Merge multiple PDFs into one",
      description: "Combine PDF files easily for your projects, reports, or documents. Made for Nepal, works everywhere.",
      buttonText: "Merge now",
      buttonLink: "/merge",
      image: "https://oed.com.ph/wp-content/uploads/2023/04/shutterstock_2150253841-1-1.png"
    }
  ];

  const categories = [
    "All",
    "Workflow",
    "Organize PDF",
    "Optimize PDF",
    "Convert PDF",
    "Edit PDF",
    "Secure PDF"
  ];

  const tools = [
    {
      id: 1,
      icon: "🔗",
      title: "Merge PDF",
      description: "Combine multiple PDFs for your reports and assignments",
      category: ["All", "Organize PDF"],
      href: "/merge"
    },
    {
      id: 2,
      icon: "✂️",
      title: "Split PDF",
      description: "Extract specific pages from your documents easily",
      category: ["All", "Organize PDF"],
      href: "/split"
    },
    {
      id: 3,
      icon: "📦",
      title: "Compress PDF",
      description: "Reduce file size for easy sharing via email or Viber",
      category: ["All", "Optimize PDF"],
      href: "/compress"
    },
    {
      id: 4,
      icon: "W",
      title: "PDF to WORD",
      description: "Convert PDFs to editable Word documents instantly",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-word"
    },
    {
      id: 5,
      icon: "P",
      title: "PDF to POWERPOINT",
      description: "Transform PDFs into presentation slides for your meetings",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-ppt"
    },
    {
      id: 6,
      icon: "X",
      title: "PDF to EXCEL",
      description: "Extract data and tables into Excel spreadsheets",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-excel"
    },
    {
      id: 7,
      icon: "W",
      title: "WORD to PDF",
      description: "Convert Word documents to professional PDFs",
      category: ["All", "Convert PDF"],
      href: "/word-to-pdf"
    },
    {
      id: 8,
      icon: "P",
      title: "POWERPOINT to PDF",
      description: "Save your presentations as PDF documents",
      category: ["All", "Convert PDF"],
      href: "/ppt-to-pdf"
    },
    {
      id: 9,
      icon: "X",
      title: "EXCEL to PDF",
      description: "Convert spreadsheets and data tables to PDF",
      category: ["All", "Convert PDF"],
      href: "/excel-to-pdf"
    },
    {
      id: 10,
      icon: "✏️",
      title: "Edit PDF",
      description: "Modify text and images in your PDF files",
      category: ["All", "Edit PDF"],
      href: "/edit"
    },
    {
      id: 11,
      icon: "🖼️",
      title: "PDF to JPG",
      description: "Convert PDF pages to image files for sharing",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-jpg"
    },
    {
      id: 12,
      icon: "📷",
      title: "JPG to PDF",
      description: "Convert photos and images to PDF documents",
      category: ["All", "Convert PDF"],
      href: "/jpg-to-pdf"
    },
    {
      id: 13,
      icon: "✍️",
      title: "Sign PDF",
      description: "Add your digital signature to contracts and forms",
      category: ["All", "Edit PDF"],
      href: "/sign"
    },
    {
      id: 14,
      icon: "💧",
      title: "Watermark PDF",
      description: "Protect your documents with custom watermarks",
      category: ["All", "Edit PDF"],
      href: "/watermark"
    },
    {
      id: 15,
      icon: "🔄",
      title: "Rotate PDF",
      description: "Fix orientation of scanned documents and pages",
      category: ["All", "Organize PDF"],
      href: "/rotate"
    },
    {
      id: 16,
      icon: "🔓",
      title: "Unlock PDF",
      description: "Remove password protection from your PDFs",
      category: ["All", "Secure PDF"],
      href: "/unlock"
    },
    {
      id: 17,
      icon: "🔒",
      title: "Protect PDF",
      description: "Secure your important documents with passwords",
      category: ["All", "Secure PDF"],
      href: "/protect"
    },
    {
      id: 18,
      icon: "📂",
      title: "Organize PDF",
      description: "Reorder and arrange pages in your documents",
      category: ["All", "Organize PDF"],
      href: "/organize"
    },
    {
      id: 19,
      icon: "📄",
      title: "PDF to PDF/A",
      description: "Convert to archive format for long-term storage",
      category: ["All", "Convert PDF"],
      href: "/pdf-to-pdfa"
    },
    {
      id: 20,
      icon: "🔧",
      title: "Repair PDF",
      description: "Fix corrupted or damaged PDF files quickly",
      category: ["All", "Optimize PDF"],
      href: "/repair"
    },
    {
      id: 21,
      icon: "🔢",
      title: "Page Numbers",
      description: "Add professional page numbers to your documents",
      category: ["All", "Edit PDF"],
      href: "/page-number"
    },
    {
      id: 22,
      icon: "#",
      title: "Number Pages",
      description: "Customize page numbering for your PDFs",
      category: ["All", "Edit PDF"],
      href: "/number-pages"
    },
    {
      id: 23,
      icon: "👁️",
      title: "OCR PDF",
      description: "Make scanned documents searchable and editable",
      category: ["All", "Edit PDF"],
      href: "/ocr"
    },
    {
      id: 24,
      icon: "📊",
      title: "Compare PDF",
      description: "Compare two versions of documents side by side",
      category: ["All", "Workflow"],
      href: "/compare"
    },
    {
      id: 25,
      icon: "✔",
      title: "jpg to png",
      description: "Convert to jpg to png and png to jpg format for long-term storage",
      category: ["All", "convert iage"],
      href: "/jpg-png"
    }
  ];

  // Advertisement data
  const leftAds = [
    {
      title: "Quantum Tech",
      description: "For all your tech needs, visit Quantum Tech in Kathmandu",
      badge: "PRO",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "https://erp.hamropdf.com/"
    },
    {
      title: "Organic Fiber Store",
      description: "Sustainable and eco-friendly hemp-fabrics for your fashion needs",
      badge: "Hemp",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      link: "https://orgfiber.com/"
    },
    {
      title: "Sagarmatha Diagnostics",
      description: "Comprehensive health check-up packages at affordable prices",
      badge: "Health",
      image: "https://www.bellarmine.edu/sf-images/default-source/admitted-students/mls.jpg?sfvrsn=5a027880_3",
      link: "https://www.bellarmine.edu"
    },
    {
      title: "Nexus Collection",
      description: "Beaty and Fashion Accessories.",
      badge: "Shopping",
      image: "https://enexuscollection.com/uploads/logo-1757743360238-825628689.jpg",
      link: "https://enexuscollection.com/"
    }
  ];

  const rightAds = [
    {
      title: "Admi World",
      description: "Your Abroad Study Partner - Visit Admi World in Kathmandu",
      badge: "Study Abroad",
      image: "data:image/jpeg;base64,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",
      link: "#"
    },
    {
      title: "prepedo Nepal",
      description: "Luxury Ride Sharing in Nepal",
      buttonText: "Get Started",
      image: "https://www.netsolutions.com/wp-content/uploads/2024/12/How-to-Build-a-Ride-Sharing-App-from-Scratch_.webp",
      link: "https://www.netsolutions.com"
    },
    {
      title: "Padmashree International College",
      description: "Best I.T College in Nepal",
      badge: "BIT",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExIWFhUWFxYVFxcVFhUYHhcaGBUYFhgXGBUdHSggGh0lGxUXITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0vLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAgMEBQEGBwj/xABLEAACAQIDBAYFBgsFCAMAAAABAgMAEQQSIQUxQVEGEyJhcYEHFDKRoRZCUlSxwRUXIzNTYqKj0dLwcoKUsuEkQ2NzkpPT8bPC1P/EABsBAQADAQEBAQAAAAAAAAAAAAABAgMEBQYH/8QAPBEAAgECBAIHBwMDBAEFAAAAAAECAxEEEiExQVEFE2FxkaHRFBUiUoGxwTJC8CMz4QY0gvFyQ0RikrL/2gAMAwEAAhEDEQA/AOyOwAJO4Ak+AoBsYlefwPO1/fQCRi03ZtddLG+gudLUBk4pNddxIOh0tv8AtFAORuCLg3FAKoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoDRfSv0m9Ww/q8bWmnBFxvSPczdxPsj+8eFdGHp5nd7IyqysrHELV3HOFAYoAIoB7DR8fdXHiqumRfU+h6CwWaXtEtlt38/p9yVY/0a88+rPTLbjpfu591bHwBC2S3WwxyOi5nGY2A4m458LUA3gsRmbLlQC3AWI7u8an3jdqKARtbFdUUColjrqBrbSw1GvvoC0Tdutxt46mgM0AUAUAUAUAUAUAUAUAUAUAUAUAUAUAUBG2ljkgieaQ2SNSzHuHADiTuA4kipim3ZEN2Vzzh0g2u+LxEmIk3udB9BRoqDuA95ueNenCKirI427u7K6rAKAKAyq3NqpUqKEXJnRhcPLEVVSjx8lxZMUe6vIzOTcmfoFOlGlBQgtFoKoWPTVaHwQAUAWoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoDkHpg6TdZIMDGexGQ0xHzntdU8FBue8j6NduGp2WZnPVld2ObV1GIVAMUAUBKghsLnea83FTzystkfadDYLqKXWSXxS8lwX5YtTXLHc9gXpVwemaufAhQBQATQFf8Ah3C/WoP+7H/Ghr1FX5X4FgDxoZBQCIZ1cEoysASpKkGxG8G3EcqEuLW4uhAUBH2hjUhjaWVsqILk7+4AAbyTYAczQvCEpyUY7sh7M24sr9U0UsMmXOEmUKXS9iy2JBsSLi9xcXFDSpQcFmTTXNcy0oYBQBQBQBQBQDOLxSxqzuwVVFyWNgBzJoDlnSD0sMSVwkYKjTrHvr/ZXgPGpjG5VySKf5a45bFpCpYZgAb6HiQdBRQTDnbdFFLi45ibxrnJJJ3FiTcnNfeSTvuCT77qpUhxK5YS4FbicOF1UkjjcWI7j/Gu2lWU9OJhOGUj1sUCoA5BHc+FYYipkjpuz1uiMD7TWzS/THV9r4L+fknCvNWp9wIYVDWpDMZTSxGp6arQ+BCgCgG8V7Df2W+w0JjujknR3ZM0+zFjj2bh3ziRVxLyRhwesYZrZc113DXh5VJ9BiK0KeJzSqNWt8KTtt+S3xM02GMWCTEYjrIcMhcQjDZN5Fw0xDHeBYcAO+oOaKhVzVnFWcnvmv5Ctj7fxOJfBxPiuoD4VpnkVYgZHErR27YKjRQdBz8gq4elSjOSje0rW10Vr8CFsaafrMPhYsU8YmxW0A8irGxbq8rK1ittdd1vaqDSrGnllUlFO0YWWvEm7B2riwuCnkxbyLPPLFJGyR5QqdYLgqoN+wDUmVelSvUhGCVkmnrxt6kTC9KJ82FlSfENDLiEiY4hcIFKsxVtEOcHQ6mw098pGksJTtOMoq6i3pm3+ugvbWNfEQYjNjWE4nyw4SNYzfq5QYhlyl3JCh84NvIVFiKMI0pxtD4bayd+K17Oy24ziIsQ64Wd8ZP1hx7YMG8YyI7vGzKQg7RCDfcd1EXi6ac4KCtkzcd7J8+06hhYiiKhZnKqFLNbM1hbM1uJ30PDk7tu1hyhAUAUAUAUBx30nbYlx2LTZeGYBB2pm4EjWxP0VFtOJYVRySV2WjByeVE7Y/oyhjAMkzSW1sAFW/hqfjSM9DTqUnqQOnnRxcmaO+YWF78t1R1lnYmdG6ujlLSMrZWuCK1TucjVmW2B2hcgPbXsE/YfiP6veU7bEvXcxKlmI5G1enB3Vzlas7CLVLaSuy0ISnJRirtk6AAC1eTOp1krn6DgcLHDUVTX17XxFOffVGdTBBz30QSFWqSbHpWrH58FAFAJl3GwvodDx03UBr+DbFxII48DCiC9lSVVAubmwA5kmr/B2+RrO83eU7vuYxjcLPM2aXZuGkYC13aNjblcjvPvqfg7S8JzgrRqW7rjr7OEiLHNhIgES8cYjSRAxd8y5spCggJut7Z320m0bXMnXqwm3Gb71fUMJg0jkhKwBUTVSuHAKM8T9aAFS6i6x6jfmIubVOWLT5/5RR4irJ/FJtO1+3/oyIQEiVYcvVzzEWgsEH5fIy/kyATZNQNc361Soxv9F46X495V16j1u9dH3cPwRJ9jw/UosxYhv9mjsF69FH+7N7xktfXcdBawKMb/AM5d/M0eLxHzy8Xz9DEnQlJXR8/UotmRcNFHA4JUBs0wXMbm+gC6W0rF7nZTx84wta7e7k2/LYaj6LzCHDRC35HaIxJzPc9UJHYHNxazD41C0NPa4Z5yfGGXbjZeRulDzQoAoAoAoCt6R4/qMNLL9FSaiWwRxnoFOOsxGLeNnLMASpQWGrG2ZhzXQcqyqRTsjootq7SOkp0ii6oygNlGhBUgg8rGqqVtDa19SjxHSFJNeoYDd2niB8lDH41LjFq5XNLkaL002GsitiItCAWZT8fP4VMJcDGrC6uaLhn0I5WPurdHKbFihcI/BkX3gWP2V3Yd/DYyqrW4nDxcfdWWKqX+BH0fQOB/9xPuj+X+F9R0rauCx9IzKHnU3CY7arFxGbvqCPqel6ufn4UAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUBzX0zbZyQrh1Ni5N/7Itf7R76jd2JXM1L0ddGGnwZkJ9t3AGZlsBZCdON1OtZzcs2h0UYJx1N4k2NHFhFhXtdrM1jc2UWvqdd3jVdDe1tCG/QmKbI+ZcgGhBYGx1INiAfE1a+mj0KSgr3a1K3pXCkMDxoN6kaa8Kqtys18JyQYUqubnf4W/jXRF3ONxsrlzhu3Gq/QPwP8AqPjW9OrkubYfBvFVIwW3Hu/mg/u0rkcne7PuIxUIqMVogQcahFkjLR1LRLiIvUFLisw5VJa6PTFXPgAoAoCtxO1grSLlvkRmvmtdlUOUtbTsspv48q5amJUXJW2Tf1SvbwOunhHOMZX3aXcm7J+KflzE4jazR+3Hr2G7DFhkYkEjsg3GU6W101qs8TKH6o8tnwf03Vti1PCKprGWmu6tquG+zvv5GfwwDIUVMwDIoYN7WYSE5RbWxjtv1N+Ws+1JzypX21777eFiPY31eaTs7N25Wy79+a42m2SQpKKMzWa7sAminK5Md1c5vZIA037qrHFSaTaXi9Nt9NHrs/Es8Gk2szdlpotd9V8Wq03WvYLj2ozFgkQJTMWu+XQSOi27JuT1bG2gHOrRxMp3UI7Xvrbi1y7GVeFjBJzlva2l+Cbvrsrrn3CU26pJAU6mLISbZxJ1Vzu0KiUEjw77VWNi9l8tu29vtfYs8DJbv5r9mXN5PLv/ABvYraRUyEICkX5xs1iOyHOVcpzWVgdSK0qV3FyaWkd9ey+itrp2ozp4ZSypys5bK2m9tXfTVcmRpNukFhkU5WZdHOmWVY7uMnZvmuN+6snjGm9Fu1vydtdNL7o2WBvb4t0ntzi5aa622ewvEbayZgyDSLrAQxKse2QlyoIJEdwbc+QvM8XkvmW0b9nHTyKU8H1iTi/3W21W2u/C/P8AxbCu04goAoAoDDHSgOIemNrush9oMU8VIDL8Q1UjuTwHvRdtBjg3QH83I1xxs1nuPNm91ZVk1I68PJZSwlwqy3ndEXKTaOSRhax4gKVHPfUxpnU4Nq6T8iTs7FTyXOXq14WNw3gLC1UnFp3uZqVtCj6W4kRI2ZszW49/CphqzGo7K5z7E7ReRERgoWNSoyjU3NySeJv9tdcY23OKU8xaYGPLFc8Tp/XnVKmjPe6Eh+qXcKReJqiR9GkOFatYmwgknwqCNxYtUkpIRZaiyItE9L1c/PwoAoDU+k+39nYQ5JzeQ5nKRgtJ2wQczD2QQxFmI03bqiOAVVfp569/b9TT26dNr4uS8LW0+hRx+kzZwN+qxJN1N2CsezfKLmTcLnTdqa3XRrWv5b2Mnjm1bhrwXHf/ALFwekLZ7EdXhcUcoUWjiHZAz5dFfT239/dVX0aotPRfW21/Vlvb5u6u3f6729EIn6fYBAA+Hxq3N+2GGfQaNml7Yso0N91VXRaa0d/+T17+f1JfSE1rt/xWndppvwA+kDZ7Lm9XxmW7AsqkA52LFWYSWILMeyedS+i4vTTjxa3d9eaC6Qmte7gnsrK3J24kl+nWDO/BYz21kH5DcyBVUjtaaKBYVD6Oi/l3T34q1vsQsbNbX2a+jvf7jeN9IWBvnkw2MW9r5o8ivbdmXrAHt33qz6OU5X08XZ962f1IjjpQjZfTRXXc919BtvSfs4oU6rE5Sxc2VR2i+e4PWXHa1qz6Nbjl4Xvu973+5CxzUlLja23C1vsW2xOlezsaTCHYPIoTJPmBcKWYBWuQWBY2sb+6savR9ovOrpqz1vt/2XpY2WZODs07rS3K/wBjcaFQoAoAoBvESBVJO6ok7IHAfS9tZJsZGkbZljS7W3FifjoPjUQ11LNNaM1fox0hbCTFt6OAHUd24jvFz7zSrDOi1KeR9h1aDbOz5AJWYEnWxBH3VglZ6o7lNNaMqNqdL4wTkU2Gg0o02Z5kc/21tOSd7toN4HOtqUUjmqycnYhYhcoA431+2uh7HPbUv9myhkyEbgD58axnq7nt9EVctTLzHhUH1SEMb6CoKvXRC1FSWSEnXwpYjcOrpYZT0rVj8+CgK7pHtE4fCzzgXMcbuoPFgOyD3XtV6cc0lHmVk7Js80YidnZndizsSzMd7E6kmvZSSVkcDdxupIOlehpnCbRMV+s6iPJaxOe02WwOhN7Vx4u3w35+h0UOJc7JxuN9VxZ22P8AZuqsvWrEGLm4CoE3ndbS97W41lKMM0ep3LRcrPrCg2a5Xo3KRvGKQ+YlhP21tJXxC7vwVi7UvqX3o16YYzFtihPKG6uHOlkRbNc66AX3caxxFGEEsqLUqkpXuc2270rxeNVFxMocIcy2RFsSLH2QL12wowpv4UYSnKW5TVoUAG2oNiNQRpY8CDwoSejOgO12xWAhmkN3sUc/SZGKZvE2B868ivBQqNI7qcs0UzYKxLhQBQGoek3HmLC3F+0wU62vcE5fhWVVNo2oJZrs8/7Tf53zmHaPjy5afC1WpqysTV5jvRTY3rWLgi+azHOeSqpdr/8ATbzropxTlqc9T4Y3N7wmygUZXTtRvIhHcGJVgeRFiO41xYhOFRnbh7Sppidp9H0hgaecdWljlHzm5eArehhnJZ5uyXiZVa8U8kNX5HPYgWvY6neeCjxNO4hLmJCFiKve5TKbHszCXQsO/XmeQ8Bf31nK563RkF1mZ8Bpid1Vuz6e4pdOFSStAvfThUjcUTahOxjXnQj4j0pVj8+CgIW29nDEYeaAmwljZL8iwsD5Gx8qtCWWSlyIkrqx5o2jgJIJWhlUrIhswP2jmDvB4ivZjJSV1see007Mj1YHRvQ+LptBA4R3hRUJbL2iJgDfhYkaiuPF/tfb6G9HiXHRjCz7O66baWOjeBomTqevaYyMSDojcbAiwvfNroKzqSjVsqcde6xeKcdZMosJKvycnW4B9ZBC3F7dbF5mtX/uF3fgzX9oz6HZFV8bmIF8PpcgX1aoxe0e8UN2c7TcPCuxmAqhIuCFnZURSzsQqqouWJ3ACobSV2Ej0d0L2McHgocO3tqCz21Gd2LsAeIBNvKvIrTzzbO6EcsbF3WRcKAj7SxghikmbdGjOe8KpNvhUpXdgzz90l25LiArTuSXbMRwUcFVeGlUnbNpwOmkrQ13ZrOIIYkHedR3WGgNWihPUl7OwUiqEzZOvBHgh5nhmIArtpUXniua8jilUvB9jNt2b0wKnIYOsKLbMitmG+2YXt7Wg3d1ddWhSzKUldowp1KiWWLtcqemnSmbGBIZFVTH+cKm4ZhcHXdYchfUnU2vXDWnZZDooUle6NajkCnThu/ifuFciR1uSQLLqD3jXz1NXsVvdm54HEIUKC9xu0J0GnCtXFTjbiaUMR1E81tCBjsI0Zva6nUGx91c86cqejR9Tg8bTxEbwZGMl6pc7cxnMOVToLoyoG+9CVYzmPKhNz0pVz89CgCgNM6e7U2Uto8aizSAaIikyKDr7akFL8iwvRYh0tmdNHo+piVdLTm9DSsK+xJL9XsvHPa18jSta+69pzbdVveNR7X8EbS6Gcf1Siu9v0MYtthx263ZeNS+7OZVv4Xnp7xqLn4IiPQzl+mUX3N+gnrdhBOs/BmMCE2D5pMpO62br7X0NPeVTt8ET7llmy5o35Xd/sZw02wpCRHszGOQLnI0jEDmbT6Co941O3wQl0LKOspRXe36AkuwmQyDZmNZF9pg0hVfFuvsN4qfeNTt8EH0LJPK5Rv3v0Gvwj0f+oYr/uP/APoqPeU/4kW9xVOcfF+g9JPsNVDtszGhG9li0gVvBuvsdxp7xqfxIquhZN5VKN+9+htXQTa2x84TCRCCZtAJgc7fqrKzNe/0Q3lUPFOro2Z1ujKuHWa11zWv+Tf6HIFAFAaf6UtpCLBGPjMwjt+qO2/lYBf71StNSYq7saf0Y2VDNhVeaGORyX1ZFY+2wFq3pQi43aPdw9GEqccy5/cmfJzCb/VIb8+rFdGWK2Oh4TDv9qF4rZWHPtQodAuq8BuA5VdTle4j0fh5aZEYw2zVYdVHCLZjJlUb23FzxJ13ndwo58WyamAwVKOacUlz1GJOgykW9T07iw/+wrJqm9WZL3Za115jEvo9TKT6ow0J9t9P26q40ylT3bldmr25s5xtDZr4aXqpCpaysSpJBvuGoHKuZK58/SrKpDNEsMPPZbiuqmrIyqyuxMe0pM1rix0IOoPiKtJ6WZWk5Rlmi7PmP3UklQcpvbNvGpFvhXBUhkk0fe9G4r2qgqj32fevXcMo5VQ7rIx1QoRkQdSOZqB1a5npOtD89CgK/pFtA4fCzzgXMcbMoP0gOzfuvaqydk2a0KfWVIw5s81TzM7M7sWZiWZjvJJuSfOuA+yjFRSS2R0j0S9b6rtLqL9dkTq7WvnyS5bX03231vRvldjx+k8nW0s+3Huui1w+Ixq4DGnbAvGY8sQcR5i5DWy5N2uWxO4686snLK85hKNF14LC7313tb6ldhdlTYno9DFBGZH69myggaCWS51I51VRbpJI2lWhSx8pTdlb8Ilei3o1i8LPO+IgaNWgKgkqbnOptoTwBqaMJJu6KdJYmlVhFQlfUb9FmKij2ZiTOAYmxCxSX3ZZViiJPd29e69KLSg7k9JQlLExyb2uvpdmqHoTL+E/wfrbNmz/APB39ZutfLp/a0rLq3nynd7dH2brvLt5fzgbd6UsTFJs3DmAARLiGiS260Syxad3Y07q1qtOCscHRsZRxEs+7V/GzOTg21Gh5iuY93c9E9A9rNisDDLJq9ijn6RRimbxIAPnXfTlmimfI42kqVeUVt6l/VzlCgOJ+lTpEJsRkiNxCGjU7wWJ/KMPCwX+6a2dJ2S5/wAREKkU2+RtvouRo8KjOxXMhIbffNIW0328xW86NopLU3qdIUnRjTe635fzU3D18fpx/wBs1n1E/lOX2qhy82VXSHEFoGAYSEstlUHcCDuIFuPHjWtGhJztt3nXhMfhqNVTbaWvfqPbNwJjszLGDlAssYDLfUgyXOapk4vRHNVxVWq2pTbV/wCaECXC7Qkd2ixUaR52CqyAkAG2py870eSOjRhmFHB7QVSz4mJlUFmGQaqASw9niKq5U+QcrJs4X0tmzY2U8BkUAf8ALU/eapGGxjhZWoRt/NRUMOgLHwArdKxdu4ifDZxpo3Dv7qnLmIvYdwD5kJY6318gAb+6/nXDiNZan2X+nv8AbS/8vwiVmFYHv3RkEUFwsKE6HpCrn50FAQ9tbPGIw8sBNhIjJfkSLA+RsaiSurGlKo6c1NcGebNp7Pkw8rQyqVdDYg/aDxB3g157TTsz7GnUjUipx2Zvvot7WF2jEJUjkkRVjLuEsxSQA336EjUVvS/S0eV0k7VacmrpPXyLPYUZ2dFiJMfjopkeIosCTNNnY/qsN/zd1rMSd1Wj8CeZmNVrEyjGhTaae9rW8CofHZOj0ISXLIJzor2a3WScAb2ql/6SOhU1LHyzK6t+EOeiPajHET9dOSOoNuskNr513ZjvqaMtXdlelKUVCOWPHgiu2LMv4BxyFlzGeIhSRcjPBuG87j7qpH+2zasn7dTfY/yTV9ICjZ+XKfXxH6qJbf7q982e++2nPNrVut+HtM/dz6+/7L5rdvK380Ie15l/AOCQMuYYiUlbi4GafeN43iof9tGlJP26o+xfg03DYd5HWNFLOxAVVFySeAFZI9CUlFOUnZI9F9D9jnCYOHDsbsqkvbXtsSzWPIE28q7oRyxsfI4qt11aU0XNXOc1X0idI/VMNlQ2mluqc1HzpPIGw7yK3w9LPLXZGVWeVdpwsDUn6IsPP/0a7L3bZz20sdb6OQS+pxhW/wB0mXW1rgnfl8Oe6tVUprLf6nM8VRvKLTutybDh5WIIeyi9wSDfQDQ27ifOtVUp221M4YjD1P0lhJFYAVmpal5JcC0mfQeX2VyRR1xE7PU5L5yLs+7L9M91VqfqAvaQIhlOYm0b/R+ieIFZkTdoPuPNe2nz42Ujg579wC/dWlNbEUv7a7ibHztbxP3VsWG5DyOvnUogfw0ga7ZbEnXkTYXIrjxTTkj6z/TSap1OV19v+h+uU+mMFhzoLox1g51FxdHpCtD86CgCgK/a+w8NigBiIUktuLDUeDDUeRqrinujWlXqUneDsUv4udmfVf3k389U6mHI6feWJ+byXoH4udmfVf3k389T1MOQ95Yn5vJegfi52Z9V/eTfz06mHIe8sT83kvQPxc7M+q/vJv56dTDkPeWJ+byXoH4udmfVf3s389OphyHvLE/N5L0D8XOzPqv72b+enVQ5D3lifm8l6B+LnZn1X97N/PTqYch7yxPzeS9C22P0cwuF1ggRCRbMAS1uWc3Nu69WjCMdkYVcTVq/rk2WlWMBvEzrGjO5CqoLMTwAFyalJt2RDdkef+lG22xmJedtF9lFPzUF8o8dST3k160IdXCxwylmlcoWOh7z/X21gaHfti4dfVoAAPzUf+QUucsqEG38K1E7VmaIBIo8zsDlFtBwufEmmbibUMHDgkkU+ztoYlZlgxcOUyXMbi1myjMVNtNwP8K1Uk1oXrYZRWZGy42UAC5/rWsoLUQ1F7LkHVjUb24/rmqT/UGZ209sNOf+DL/kas+JnWf9OXc/secY1Bmnc/pH/wAxreC0LR0il2IlRSX0q1y1hE1ALOmg5A+8A/fXm4iX9Rn2/QsFDBxa43fnb8BesbnqmRUgzl/rWhNj0vWp+fBQBQBQBQBQATbfQGaAxQBQBQBQBQHNPSz0h3YKM8nmI96R/Yx/u8zXdhKX739Dmrz/AGnMG3H+u6uuppEwjuKwGAed1ijF2byA7y25R3nmK5JSUVdm0YuTsjvez5kSKOMsLpGinjYqoB18qw6+F9zV4SrvYiQYhc8uZiL6qbWIUWsOO46e6tbqSTidVOm1FIf64SNfOr9XutbMt1AJfvt9tXhG2pyYmVvhGtsPa39c60pmNIcw+zLqCHIuASLKdSKo6juWcxG2sEVws5zA2ic+zb5p76o6hlWd6Uu5nn/DzFcx0N2Y2Pexq0XZGltCekgI3fbVswtYhzTa+zp5/wAahyFh9ZM3ADW1xfUWFt5rz8Qo59D7HoKdWeH+PZOy+m4q3P8AryrA9sKEBb+tasD0zWp+fhQBQBQEPakU7JbDyxxvzkiaQe4OtvjUq3EhnLunzbZwsXXSY5TEWVLQWiILXtoEBtofnGrKxV3OVbUxUkpvLI0h5yMz/wCY1YhFh0e2vjxKsWHxMytJZEAlkyhrg3Km4AABubbqynpZ9v8AgvHU7d0d2XttLes7Qwzjl6v1hA5Zl6r3m9CTdB3/ANeVAFAFAVfSbbS4TDvO2pGiL9Jz7K/ee4GtKVNzllKTllVzgGJxDSO0jtmd2LMTxJNya9dJJWRw3vuRMXmy9m3fesa7drI0p24m1ej3EsryKHVSVQ24tYkGxvuF/iK83FrRM9DBvVo6Is1xrY+Q+3jXFc7mhvF4MOu8gjUMpsVPMGtqNXq5XM5wzKxzvDyth8S/a7Qc3Ktx1La/b519BSlCcdOJ50rXcWdIxGMjntlLbrgFTz5eYrNUZQV2c8Ph3NWxO31ileMxMxQ6kacv41DZtoTflCs0Msaq4bq3JB5Aa1jJqxnXj/Tl3HJdnOnzjrrvqkWg0yxlhLDskZe7W9XauQRZ0y2BN+6qvQbi4lIW1zbW3hv++uDEq0z7DoCblhnHlJ/ZCq5z2zIqUSZqw0PTFan58FAFAFAImlVFLMQFGpJoDUel2xl2jEIZMT6uRIrKlgxBCkflVzDtHrF0v2bgbzVk7FXqaNL6JFa5G1YSFUuT1NrKN7H8sdBzqXIZUTtgejKPD4hJW2nG5iLkoIgpvkddWMptbU+z801jXjKpTcVo9PJp/gvTajK/82OmbO2krnIXVmG5lItILXuORtvXhvGlaFUywqCQoAoDifpF6RetYjIhvDDdUtuZvnv8LDuF+NerhqWSN3uziqzzS7jXdn4JpXCKLk8BckncAAN5J/1sASL1aipxuysIObsjYdtdCcQIC3UnOoB7BWzC4B0zkhhe9tRYHXcK4FioS0Z1PDTjqhXQxJVMsZgJBCtdgFINwAAzW4ZiLcu+ssTZq6Z0YW6drG2K3L7bfCvPO8rukO3Xw8a5LZ2JGvBQNWt4lR51rSV3qYVpuK0NATHx3fRs7KwGazAElbtn0Ps5hu4769SnNSPLlFoIcQynssyn9UkfZXQpGdhQxLZ8xOYtoS2t9QdfcKi5KbRNPSKYZkVUC2YOxBPtb7a6VV67kylmVnxKT1DLbLYg6a6H3iquIuOLCBr7J5g/b/RqLE3EGaxIYC/Bu/hmHDxpntuRbkLkO4HTQacr6/fXn4iTc9T7XoSmoYRNcW3+PwIrA9czUkBepJPTNbH58FAFAFAUPSHbOHw0iPPMgVRcxk9oXNlmWMavbUWsbC5GosYckjSFGpPWKuipg6YbNllFpQ7u9rLBjCXAt1a5clmsQNN19QL1ipyvut+T24fU6PYqlr5fNeomTaGHBlOirFoQcNjCFv21WQGOyr7LZbWub79TtnRVYCs7WS12+KOvmKn25gIwesAVkUZs2HxlleS4JIMemYA62ubHlWU6krvLbbjff0LxwFRpXXhKPqY+WGzHUQYeZFYm6lkliWMgfnDI6rqLaAG50G4kjRTTMpYOsv2/Z/Y3LDuGVWDBgQCGFrMCPaFtNd+lWMGmnZi6EGn+krpF6th+pQ2lmBUW3om5m7idw8SeFdOFpZ5XeyMa07K3M4zavUOMvuiC2mEgOq3AHIsDY+5WH/uvMx92rHdgrKR0KDaMhPOvJSPW3Kjak0ROV3MLk3UBst9b9nnfurTvKacGK2Zh03ntKdQWeTh3A16EZYSqrZcr8TCUaq43IfSvZkEqI0EiJItxYsWVgbG1zqDdR8a6F0dU/av55nK6l92c/wAZs54SrSADPfLZlbRSLnQ6bx7qp1UqTtIpNaCFerpmNh+Lh76lMDcrhnC/NGp7zUN62CRMz3+6mbUWE40jKOe+321DYRXvbjrb7DVGywRDsjnu8bEgfAVwVl8bPtehpuWEjfhdeY4KzPUA0JCxoRY9M1ufn4UAUAUBzv0vRGVIoo8LLLKCX6yOORginQrdQQSxANuGW/EVnUPS6PeXM3JJcrrU5xsXZ2MimR/VcUmU3zjCu+W4IvkYBTv4kaXrNJ3OuVanlabXj6G9jZeJKZosFIuVZuqCHCqkvrGFjhMjhZrIMytJlXMO0ACLXq9nyM1iaf7pp3tfe6tJvTTXTQqulWHxDQ9VJhMQ0y9pCiK97lM0siQuQl7TAAqb3FmBDloadthTr01O8ZKz4a+F2u7j+LavsjZGISVHlwGJdAyl06iUZlBuVvlqqT5G6qxadppPndHoqCQMqsAQCAQCCpAI3FTqD3Gug8BqzsIxuLSKN5ZDZEUsx7h99TGLk7Iq2krs4Bt/az4qd530zHsr9FRoqjwHxJPGvZpwUIqKOCUszuyvq5Ucw2IdDmRsrWtfQgi97EHvANc1ek5ao1pzys3zYm0hNHnIIK+3l3qRvPhXiVKbi7HsUqqkiftV4iqNIiyhSJImABIYWYW4jcN2hpGTWxMoxkviNV2l0yWGwiw0Aa/aBDqQd+mVhbzFdDk6rvI521T0ixMfTgMnbwCOWzEsJ5E1JOtrEeVdlOpiIJZZ+SOWck5amubcxglykK6lQQAWVhrrvABHxpUqVajvN3Jbg1oVIxBHPhvHGqKTRW1x/wBauNKtmIsOwuKJkMsFYWqWBhzreqkjDjMQBppb/Wqykkrl6VOVSahHduwvw3VwN3dz9AoUY0Kapx2QUNQFBcLd1RoD01W5+fhQBQBQBQGaArnw8kZPUZcrk3RyQEY6mRbbxvJTS51BUk3kgk4PCiMEAlmJzO7b3bdmPusANAAALAVBJIoDFAa36RcO77PnVASQFew4hHV2A8lNa0JKNRNmdVXjY4YsqkXBFevdHEZzDmKXAZhzpcFnsPaLQN1qsL+yQToRbcffXHi4Z0kdGHnkdzOM21h306qZTr7EllBPFRfTXurz1SlfU7euhbia3HBc6mumMOw5Wywhi7IA33sPM8vOt0rIye5tWyOgskgDTt1Sn5oF38+C/E91eZPHObth45v/AJPSP04v6adp1Rw9tajt2cf8F0vo9wVrESt3l7fYAKzbxb3nFd0fVl8tHk/Erto+jOIgmCZ1bgJLMPDMACPHWnXYmH6oqS7NH4PR+I6unLZtd+qNJ2nsWbDv1cqlTvB3hhzVuIrsoVYV45qf1XFd64GE4ODtIZjDCtcr5FLkkqLC97nlWU5Si7WPTwPR8cTBzlUUdbfzUbI5A1hOU5LY9/BYDC4eWZTvLvXkgFYnrmKsiDNSQZt30B6ZrU+ACgCgK7b224cJF1075VvYAC5Yn5qrxOlVlJRV2bUaE60ssEah+NzBfocT/wBMX/krLr49p3+563OPn6GZfSzhFOVoMUpG8MkQI8jJTr48mQuiKzV1KPi/QG9LODABMGKAYXBKRWIva4PWa6gjyp18eTJ90Vvmj4v0FSelbCqAWw+LAO4mOMA3UMLEyfRZT4MDxp18eTIXRNV6KUfF+g3+N3BfocT/ANMX/kp18e0n3PX5rz9Cfsb0l4LESrF+ViZiAplVQpJ3DMrGx8bVaNaLdjOt0ZWpxzaPuNxdLgg8a1POPOvTvYJweLdALRv24/7J3r5HTwtXo0Z5onLOOVmvitSgoUAoVJAoGpAoGpIOhejvYAyjFyC5JIiB4AaF/Em4HcL8a8XG1HiKroL9Ef1dr3Ue5bv6I7aEFCPWPd7dnb6G0bf23HhIutkWRhyjQt729lfFiK0pUs7yxsiZStqzSMX0s2nKVeDDpDHvVZWjDSDh+cZSQf1R5mu1YejHSTu+wyc5PZGw9Gul/rDmCXDSwzLowyOyDxa10017Wmo1NYVcPkWaLTReMrl3tjZaYiIxP4q3FG4MP4ca8+op05dfS/Ut18y5P8PgzVJTWSe32fM5Hi8O0btG4syEqfLiO7j519BRrRrU41IbNXR5s4OEnF7obBrUo0ZqSLCJF4ivMxuGVusj9fU+n6D6Tln9nqu6f6XyfL68BsCvMsfWmRVtwFBc9M1qfn4UAUBzb02YCRoIJluUiZw4HDrAuVj3Apa/6wrCtByV0et0TXhCcoy0va3ocjgK5lLglbjMAbErfUA8Da9ctj6CWzs9Tc4+lkDsJJEKu7sZABmVSFhCSC4uTaIqBwzsdAddVNcUebLCTSyxd0tvO68/sVuO6QxyRSqIwGK5Y7gEgtJKXe4FhdJCCOZBG6ocrrY2hh5Rknfv8FZeK8B6HpauWNXhJ6tFQEFbsFXDjK1xuPUOpP0ZLa2sXWdn80Kywbu2pbu//wCvXxRXbX22s0SRiBUYFS7i13IUk6AaXkklbwKj5tVk7rY3o0Ork5OV+S5fxJLxKiKJnYIilnYhVVdSxO4Ac6mnSlN2RpWr06MXObPUWFVgiBzdwqhjzawzH33rve58Yal6T+jvrWFLILyxXdLbzp2l8x8QK0ozyyKVI5kcDBr0DlFA1IFA0AoGpIFDXQb6m9twzu8EawxKu5I0A8Aq/wClfO4NuVJTe8ryf1dz0qqtLKuGngMYnFI1hnK2ZWN0axAZQVuQBvZQeV9dxrrTsZmq4jongppJZpVlkeSQEnrmjt1jlEUxmElbWtqTuvoDauqOLlGKS0t2FHBN3Lzo/NDBho4xIzKitZirnsjO4BOUXIRDwFwt7C4Fc9SeeTkWSsrFrhcYkl8jXy2voR7QuN4105VQk596RMOFxKuPnxqT4glb+4L7q36JlaNSn8snbuaUvyzDGL4oy5r7aGsA16xyCgakgzRpNWZMZOLTW6G72091eBVp9VNwZ+kYHFrFUI1ee/etzDCs2jqMXqLsHpmtj8/CgCgMMoIIIuDoQdb+IoCpPRbAb/UcL/h4f5a066p8z8WVyrkHyVwH1DCf4aH+WnXVPmfiycq5B8lcB9Qwn+Gh/lp11T5n4sZVyD5K4D6hhP8ADQ/y066p8z8WMq5B8lcB9Qwn+Gh/lp11T5n4sZVyJGB2JhYWzQ4aCJt2aOKND4XVQaiVSUtG2MqJ9UJBhfSgPP3pK6PeqYslRaKa7pyBv2195v8A3u6u+hPNG3I5qkbM1MGtjMUDUgUKAUGtqOGtTvoyDuc+LDYfrFsRIi5bi4PWWVbjXS7C/devnsEmqKg943i+9Ox6VXWd1x18TXWIsEaIssYNtb2IyNJZsvNd/wBFjxIFdRmO52zSA6sMquQxHaRpFDAhe86fq624gMthouzEUJ3RoTk1D9YhucupQyhhcaZtONAXXR7RSMtiRGxN73DRjLrYbrMP/dAab6RsQDiVQfMjUHxYlre63vrbolXjUqcJTdv+KUfumY4x6xjyX31NWBr1jjFA1IFA1JAmReNcOOpZo51wPoP9P4vq6zoy2lt3/wCUJU15SZ9oKy1IO+9M8S8WBxEkbFXWMlWG8G41FWm7Rdj4fBwjOvCMlo2aftjGTRYXDzrjHtK+GETCV2abOt5xLGRlTKd2XwOtZttK9z0aVKEqsoOGylfTa21nx+puW0NsmF5c6ApGFbsm7G6yNbKbAG0R48RWx4ozF0mjLujKylCQb20ynIwvexIdWHZJsMpNsy3AUnSeMsq9XLdiLdlToXePPoxsA0bd9uFAOYzbgjmMRQ2CCTPfRrhrIl9C5tcLfcGPDUCIvSxb36p+rsTmul92GK9nNzxIH92gHpOk8agl45Fsba9Wb2z5iLOdwQnz8bAIxPSlFXN1T/NJuY/YJi7Qs+vZmFgOO+w1oC5wmKWRSy7gzpw3oxU7u8GgHqAKA1vp90dGNwrIPzi9uM8mHDwOoPjWlOeSVys45lY88TRMjFHUqymzKdCCOBFegnfVHKJFSQKBqQKFAdH9He3Vkj9SltcA9Xfc6G5KeI105eFeNi6fs9V1v2S/V2S2v3PZ9p2UZZ4qHFbdq5fQ3YYVLWyLaxFrDcQFI9ygeQq5IlMHGLWRdN2ngfuHuoDK4OMAAItlII0GhFyCO/U++gI208bFhYmlYAAAKALAsQDlRf601rCrKUpKjS/XLyXzPu4c2XSSWeWy8+w5BjcW0sjyv7TsWPnwHcBYeVe7Qoxo0404bJW/nfuebObnJye7Gga2KigaECgakCqNXVmTGThJSjutRvL768CrTyTcT9JweIWJoxqx4/fj5mMp5VnY6dT0L0pEfqc/XBmjEbM4Q2YqozEA8DpWkrWdz4XDZuujk3voc1xa4OJI+swWOCRWdA00ZCdYQ98t9MxsTfjWPw8mezF15SeWcLvfR6205HUcXtLDoxWWWNWydYQ7KLIAxzG+4WV9/wBFuRroPnxc08IQOxjyOUys2WzGRgEtfeWJW3M2oCOdp4Rgv5aAhjIF7aHMYgxky665AGJI3a0AgbawZFuuhtlJtddFXODpwAySC36rcjQD+Gx2HdzGjxl8uYoLXyjKfZ32GdD3Zl5igCTHYbP1bSRZ86x5CUvnZc6pl+llOa2+2tAJj2nhXMYWWJi5YR5WU3KHI2UjiCMvlagEx7awgAVZ4gMpYBWXcGZSQB+sjDvKnlQE7Dzq6q6MGVgCrKbgg7iDQDlAFAUW2uiOExRzSwqW+lax941q0ZyjsyHFPc1zbfoywvUP1EdpALr2mNyNcup47qt11TmWowpKazrTicv/AAYnKqe0VOZ7/urD/L9zP4NSntFTmT7qw/y/cyuz1BBFwQQQRoQRqCDwNHiJtWbI91Yf5fNm5bJ6XOgCzqZLfPWwbzG4nv0rz1SqUv7L0+V7fR7rzJrdGwnqtGXadKsKR7bDuKN9wIq/X11vT8JL8nE+iqnBkTGdMYgPyaM55t2R/H4VVyxM+UV/9n6fc2p9Fa/GzTNsYiTEvnle9vZUaKo5KPv310Yf+gnk3e74vvZ0z6NoztmWxA9TFdHtNTmZ+6cP8vmzBwduJ+FXWKntcq+iaC/b9yvmjZSRmPwr0Kc3OKdz5vFUOoquD+ndwGizfSPuH8KvrzOeyEmV/pn3D+FReXMmyH8JMxuDrusa8/Gq7T4n1P8ApyrK1Snw0f1f/RJ6o8648p9NZnoXpJhGlwmIiQXd4pEUXAuWUgandV5K6sfCYaahWjKWyaOfT9HtoSQGOTBq02VIxOMSFuiHs9ZEGyyMF7OY8LX3VlllyPXWJw8Z5oz01dsvF8nwRvuJ2EjzriCzZgoGUWy3VJo1bde4XEyjfbUcq3PCGcX0XhkjijZpPyRhKsJGGsIUKct8ouFsbAe0eNASJNirdSHYFJpZ1PZ9qWOWMixFiAJiQOYF760BATomuVVbESOqxulnSBgWkLF5WBjs0jFtSb8fpNcB/AbA6mRXSd2yosYWRYyFQEM4SygrmIF/BRuVQAFYbo3FG8jq0n5SZJ2DOWGdGLaZrkAljfyAsAKAxL0cViPysgQPPIUBUAtOzMxzAZgVDsFIIIzX32NAQ8J0NijIMc0otnK6xsAWM2vaU3suJkS261uIvQF7szBLBDHCpJWNQgLWuQBbWwA9woCTegCgCgCgOddKehEhlaXD2KucxQ6WJ327idazlB8D28H0nCMFCrfTiUHyQxf6L9oVXLI7feeG5vwD5IYv9F+0KZZD3nhub8A+SGL/AEX7QplkPeeG5vwD5IYv9F+0KZZD3nhub8A+SGL/AEX7QplkPeeG5vwD5IYv9F+0KZZD3nhub8BMnRHFgEmKwGpJYaDnemWRHvLDc34M1wzKL8eG40s2dfWwXB+BExRDc7+Br0MJJqWV8TwemIQqQVSO8ft/j1IjLXoWPmxplqr01ZeCcmoxV2ybhosoryatTrJX8D9A6NwSwlFR4vVvt/xsPVmegejp1JUhTZuB4XGov3aa916uj88IZwcttJjpfU3O6wW/xvzJ7qm6IsBwklzaU8St7mxBugOuo1YHnZeVLoWZh8LJlChye0e0XZSFyMq3I1JHZJ5m9LoWMHBSHe9xmvbM9hqhuB/dPZOnapdEWZg4GQLYSm5Frl307K2INzrmDHvv7l0TYU2BcljnIPzTmY2GYE33A6XsLafGl0RYw2Bk1tI1r/pGFxa1r5SVsdb63trvpcWHBhpNO1uJuc769oENbduBGXdr5UuhZkZcBIi2VybDQKxUe0SdLa6HfcHSpzIWHoMLJZruwLLlF3LZTlAvbLqQRe99bmouibMx6lJdTm9k5hd2P0uz7I0N/ate2ljal0LC5MNIQO3YjNuZtburC+7cAy686XQJGDjZV7R1ve2YtbQC2Y6nUE+dQyUPVACgCgCgCgCgCgCgOe+kXpLvwkR/5zD/AOMff7udZylwPd6MwX/rT+nr6HOJBVT1pIjTHhXpYOm38b+h830xilH+jHd7+hHZa7z58zFHrevOxda7yL6+h9Z0D0dZe01F/wCPr6EgCuM+oSChB6Rqx+ehQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQGRQHA9o/nZP8AmSf5zXO9z7il/bj3L7IhybqvwKSIb17mH/tR7j4TpD/d1O8bNanG9hcW7zP214L/AFPvZ+n4f+1HuX2HUqsjogJqQf/Z",
      link: "#"
    },
    {
      title: "Baskota Advocates",
      description: "Leading legal services in Nepal",
      badge: "legal",
      link: "https://www.totallylegal.com/",
      image: "https://www.totallylegal.com/getasset/c3ee2a89-b973-445f-9337-1ca05736c950/"
    }
  ];

  const filteredTools = activeCategory === "All"
    ? tools
    : tools.filter(tool => tool.category.includes(activeCategory));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <>
      {/* Hero Section with Image */}
      <section className="bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
                  🇳🇵 Made for Nepal
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                {heroSlides[currentSlide].description}
              </p>
              <Link
                to={heroSlides[currentSlide].buttonLink}
                className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                {heroSlides[currentSlide].buttonText}
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                ✓ 100% Free • ✓ No Registration • ✓ Fast & Secure
              </p>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Professional team working"
                  className="w-full h-full object-cover dark:opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-lg"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Tools Grid Section with Side Ads */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-20 transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              All your PDF tools in one place - Hamro PDF
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete PDF solutions for students, professionals, and businesses across Nepal
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === category
                    ? "bg-blue-600 dark:bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Main Content with Ads */}
          <div className="flex gap-6">
            {/* Left Advertisement Column */}
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                {leftAds.map((ad, index) => (
                  <AdCard key={index} {...ad} />
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.href}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-200 h-full flex flex-col items-center text-center border border-gray-100 dark:border-gray-700">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-red-100 dark:group-hover:from-gray-600 dark:group-hover:to-gray-500 transition-all">
                        <span className="text-3xl">{tool.icon}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        {tool.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                        {tool.description}
                      </p>

                      {/* Read More Link */}
                      <span className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Use tool →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Show More Button */}
              <div className="flex justify-center mt-10">
                <button className="p-4 bg-blue-600 dark:bg-blue-700 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Advertisement Column */}
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                {rightAds.map((ad, index) => (
                  <AdCard key={index} {...ad} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;