import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getActiveSplashScreens,
  selectActiveSplashScreens,
  selectSplashLoading,
} from "../store/slices/splashSlice";

export default function SplashScreenDisplay() {
  const dispatch = useDispatch();
  const splashScreens = useSelector(selectActiveSplashScreens);
  const loading = useSelector(selectSplashLoading);

  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");

    if (!splashShown) {
      dispatch(getActiveSplashScreens());
    }
  }, [dispatch]);

  useEffect(() => {
    // Show splash after data is loaded and if not shown before
    const splashShown = sessionStorage.getItem("splashShown");

    if (!loading && splashScreens.length > 0 && !splashShown && !hasShown) {
      setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, 500); // Small delay for better UX
    }
  }, [loading, splashScreens, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("splashShown", "true");
  };

  const handleNext = () => {
    if (currentIndex < splashScreens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleButtonClick = (buttonLink) => {
    if (buttonLink) {
      if (buttonLink.startsWith("http")) {
        window.open(buttonLink, "_blank");
      } else {
        window.location.href = buttonLink;
      }
    }
    handleClose();
  };

  if (!isVisible || splashScreens.length === 0) {
    return null;
  }

  const currentSplash = splashScreens[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl mx-4 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition transform hover:scale-110"
          aria-label="Close splash screen"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Navigation Buttons - Only show if multiple splash screens */}
        {splashScreens.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition transform hover:scale-110"
                aria-label="Previous splash"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {currentIndex < splashScreens.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition transform hover:scale-110"
                aria-label="Next splash"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </>
        )}

        {/* Splash Content */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: currentSplash.background_color || "#ffffff",
            color: currentSplash.text_color || "#000000",
          }}
        >
          {/* Image */}
          {currentSplash.image_url && (
            <div className="w-full">
              <img
                src={currentSplash.image_url}
                alt={currentSplash.title}
                className="w-full h-auto max-h-[60vh] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {currentSplash.title}
            </h2>

            {currentSplash.description && (
              <p className="text-lg md:text-xl mb-6 opacity-90">
                {currentSplash.description}
              </p>
            )}

            {/* Button */}
            {currentSplash.button_text && (
              <button
                onClick={() => handleButtonClick(currentSplash.button_link)}
                className="px-8 py-3 rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: currentSplash.text_color || "#000000",
                  color: currentSplash.background_color || "#ffffff",
                }}
              >
                {currentSplash.button_text}
              </button>
            )}
          </div>

          {/* Pagination Dots */}
          {splashScreens.length > 1 && (
            <div className="flex justify-center gap-2 pb-6">
              {splashScreens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex
                      ? "w-8 opacity-100"
                      : "opacity-50 hover:opacity-75"
                  }`}
                  style={{
                    backgroundColor: currentSplash.text_color || "#000000",
                  }}
                  aria-label={`Go to splash ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Skip All Button */}
        {splashScreens.length > 1 &&
          currentIndex < splashScreens.length - 1 && (
            <button
              onClick={handleClose}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white text-sm underline hover:no-underline transition"
            >
              Skip all ({splashScreens.length - currentIndex} remaining)
            </button>
          )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
