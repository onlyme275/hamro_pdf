import { useState } from "react";
import { Link } from "react-router-dom";

const HeroCarousel = () => {
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Christmas Animation Component - Falling Snowflakes
  const FallingSnowflake = ({ delay, duration, left }) => (
    <div
      className="absolute animate-fall-snow opacity-80"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <div className="text-3xl">❄️</div>
    </div>
  );

  // Ornament Component
  const FloatingOrnament = ({ delay, duration, left, emoji }) => (
    <div
      className="absolute animate-float-ornament opacity-70"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <div className="text-3xl">{emoji}</div>
    </div>
  );

  // Snowflake Pattern Component
  const SnowflakePattern = () => (
    <div className="absolute opacity-20 animate-spin-slow">
      <svg width="80" height="80" viewBox="0 0 100 100" className="text-blue-400">
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle}>
            <line
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="3"
            />
            <line
              x1={50 + 25 * Math.cos((angle * Math.PI) / 180)}
              y1={50 + 25 * Math.sin((angle * Math.PI) / 180)}
              x2={50 + 35 * Math.cos(((angle + 30) * Math.PI) / 180)}
              y2={50 + 35 * Math.sin(((angle + 30) * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1={50 + 25 * Math.cos((angle * Math.PI) / 180)}
              y1={50 + 25 * Math.sin((angle * Math.PI) / 180)}
              x2={50 + 35 * Math.cos(((angle - 30) * Math.PI) / 180)}
              y2={50 + 35 * Math.sin(((angle - 30) * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
    </div>
  );

  // Twinkling Stars
  const TwinklingStar = ({ delay, top, left, size }) => (
    <div
      className="absolute animate-twinkle"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${delay}s`
      }}
    >
      <span style={{ fontSize: `${size}px` }}>⭐</span>
    </div>
  );

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 relative overflow-hidden transition-colors duration-200">
      {/* Christmas Decoration Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Falling Snowflakes */}
        <FallingSnowflake delay={0} duration={8} left={10} />
        <FallingSnowflake delay={1.5} duration={10} left={20} />
        <FallingSnowflake delay={3} duration={9} left={30} />
        <FallingSnowflake delay={0.5} duration={11} left={40} />
        <FallingSnowflake delay={2} duration={8.5} left={50} />
        <FallingSnowflake delay={4} duration={10.5} left={60} />
        <FallingSnowflake delay={1} duration={9.5} left={70} />
        <FallingSnowflake delay={3.5} duration={8} left={80} />
        <FallingSnowflake delay={2.5} duration={11} left={90} />

        {/* Floating Christmas Ornaments */}
        <FloatingOrnament delay={0} duration={6} left={15} emoji="🎄" />
        <FloatingOrnament delay={2} duration={7} left={35} emoji="🎁" />
        <FloatingOrnament delay={4} duration={6.5} left={55} emoji="🔔" />
        <FloatingOrnament delay={1} duration={7.5} left={75} emoji="⛄" />
        <FloatingOrnament delay={3} duration={6} left={85} emoji="🎅" />

        {/* Snowflake Patterns */}
        <div className="absolute top-10 left-10">
          <SnowflakePattern />
        </div>
        <div className="absolute bottom-20 right-20">
          <SnowflakePattern />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <SnowflakePattern />
        </div>

        {/* Twinkling Stars */}
        <TwinklingStar delay={0} top={10} left={25} size={20} />
        <TwinklingStar delay={1} top={15} left={60} size={16} />
        <TwinklingStar delay={2} top={25} left={85} size={18} />
        <TwinklingStar delay={1.5} top={35} left={10} size={22} />
        <TwinklingStar delay={0.5} top={45} left={95} size={16} />
      </div>

      {/* Christmas Banner */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white px-8 py-3 rounded-full shadow-2xl animate-pulse-slow">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🎄</span>
            <span className="font-bold text-lg">Merry Christmas 2025! 🎅</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</span>
          </div>
        </div>
      </div>

      {/* Glowing effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/20 via-transparent to-red-100/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24 mt-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border-2 border-red-300 dark:border-red-700">
                <span className="mr-2">🎄</span>
                Made for Nepal
                <span className="ml-2">🇳🇵</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6 drop-shadow-lg">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              {heroSlides[currentSlide].description}
            </p>
            <Link
              to={heroSlides[currentSlide].buttonLink}
              className="inline-block bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 dark:from-red-600 dark:to-green-600 dark:hover:from-red-700 dark:hover:to-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-2xl shadow-lg"
            >
              {heroSlides[currentSlide].buttonText}
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              ✓ 100% Free • ✓ No Registration • ✓ Fast & Secure
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-r from-red-400 to-green-400">
              <img
                src={heroSlides[currentSlide].image}
                alt="Professional team working"
                className="w-full h-full object-cover dark:opacity-90"
              />
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)]"></div>
            </div>
            {/* Decorative Christmas elements in corners */}
            <div className="absolute -top-4 -left-4 text-5xl animate-bounce">🎄</div>
            <div className="absolute -top-4 -right-4 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
            <div className="absolute -bottom-4 -left-4 text-5xl animate-bounce" style={{ animationDelay: '1s' }}>⛄</div>
            <div className="absolute -bottom-4 -right-4 text-5xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎅</div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows with Christmas theme */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-green-600 dark:from-red-700 dark:to-green-700 text-white p-3 rounded-full hover:from-red-700 hover:to-green-700 dark:hover:from-red-600 dark:hover:to-green-600 transition-all shadow-lg hover:shadow-2xl transform hover:scale-110 z-20"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-green-600 dark:from-red-700 dark:to-green-700 text-white p-3 rounded-full hover:from-red-700 hover:to-green-700 dark:hover:from-red-600 dark:hover:to-green-600 transition-all shadow-lg hover:shadow-2xl transform hover:scale-110 z-20"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Register CTA Section */}
      <div className="relative z-10 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-red-200 dark:border-red-800">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Login to save your important PDFs and signatures for free.
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 dark:from-red-600 dark:to-green-600 dark:hover:from-red-700 dark:hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fall-snow {
          0% {
            transform: translateY(-100px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float-ornament {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(50vh) rotate(180deg);
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        .animate-fall-snow {
          animation: fall-snow 10s infinite linear;
        }

        .animate-float-ornament {
          animation: float-ornament 8s infinite linear;
        }

        .animate-spin-slow {
          animation: spin-slow 20s infinite linear;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }

        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;
