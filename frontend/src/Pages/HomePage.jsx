import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase/AuthProvider";

// Typewriter Component for each slide
const SlideTypewriter = ({ text, isActive, speed = 60 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      // Reset when slide becomes inactive
      setDisplayText("");
      setCurrentIndex(0);
      return;
    }

    // Start typing when slide becomes active
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      {isActive && currentIndex < text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  );
};

// Full Width Slider Component
const HeroSlider = ({ slides, currentIndex, onSlideChange, isWrapping }) => {
  return (
    <div className="relative w-full h-[617px] lg:h-[720px] overflow-hidden">
      <div 
        className={`flex h-full transition-transform duration-700 ease-in-out`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop";
                  }}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="relative h-full flex items-center">
              <div className="w-11/12 mx-auto">
                <div className="w-full space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight min-h-[4rem] lg:min-h-[5rem]">
                    <SlideTypewriter 
                      text={slide.title} 
                      isActive={index === currentIndex && !isWrapping}
                      speed={60}
                    />
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                    {slide.description}
                  </p>
                  {slide.cta && (
                    <div className="pt-4">
                      <Link
                        to={slide.cta.link}
                        className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {slide.cta.text}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.slice(0, 3).map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              (currentIndex % 3) === index
                ? "w-8 bg-primary" 
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWrapping, setIsWrapping] = useState(false);

  // Hero Slider Slides with images and messages
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop",
      alt: "Document Storage",
      title: "Store All Your Warranty Documents Securely",
      description: "Upload and organize all your warranty documents, receipts, and invoices in one secure place. Never lose important paperwork again.",
      cta: !user ? { text: "Get Started Free", link: "/registration" } : null
    },
    {
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop",
      alt: "Smart Notifications",
      title: "Get Smart Reminders Before Expiry Dates",
      description: "Never miss a warranty expiry with intelligent notification system. Get alerts before your warranties expire so you can take action.",
      cta: !user ? { text: "Get Started Free", link: "/registration" } : null
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop",
      alt: "Warranty Management",
      title: "Manage All Your Warranties in One Place",
      description: "Track, organize, and manage all your product warranties effortlessly. Access your warranty information anytime, anywhere.",
      cta: !user ? { text: "Get Started Free", link: "/registration" } : null
    }
  ];

  // Create extended slides: [1, 2, 3, 1, 2] for seamless infinite scroll
  const extendedSlides = [...heroSlides, heroSlides[0], heroSlides[1]];

  // Auto-advance slider - continuous loop (1→2→3→1→2→3...)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        
        // When we reach duplicate slide 1 (index 3), instantly jump to real slide 1 (index 0)
        if (nextSlide === 3) {
          setIsWrapping(true);
          setTimeout(() => {
            setCurrentSlide(0);
            setIsWrapping(false);
          }, 50); // Very short delay for instant jump
          return 3; // Show duplicate briefly
        }
        
        // When we reach duplicate slide 2 (index 4), wrap to slide 2
        if (nextSlide === 4) {
          setIsWrapping(true);
          setTimeout(() => {
            setCurrentSlide(1);
            setIsWrapping(false);
          }, 50);
          return 4; // Show duplicate briefly
        }
        
        return nextSlide;
      });
    }, 8000); // Change slide every 8 seconds to allow typewriter to complete
    return () => clearInterval(interval);
  }, []);

  // Stats data
  const stats = [
    { label: "Active Warranties", value: "1,234", icon: "📋" },
    { label: "Trusted Users", value: "5,678", icon: "👥" },
    { label: "Documents Stored", value: "12,345", icon: "📄" },
    { label: "Reminders Sent", value: "8,901", icon: "🔔" }
  ];

  // Features
  const features = [
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "Your data is encrypted and stored with enterprise-grade security measures."
    },
    {
      icon: "📱",
      title: "Access Anywhere",
      description: "Available on all devices. Your warranties sync seamlessly across platforms."
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description: "Never miss an expiry date with intelligent reminder systems."
    }
  ];

  // Steps
  const steps = [
    { number: "01", title: "Sign Up", description: "Create your free account in seconds" },
    { number: "02", title: "Add Warranties", description: "Upload warranty documents easily" },
    { number: "03", title: "Set Reminders", description: "Configure expiry notifications" },
    { number: "04", title: "Stay Organized", description: "Manage everything from dashboard" }
  ];

  return (
    <div className="min-h-screen bg-parrot-green-50">
      <Navbar />
      
      {/* Hero Section - Full Width Slider */}
      <section className="relative">
      <HeroSlider 
        slides={extendedSlides} 
        currentIndex={currentSlide} 
        isWrapping={isWrapping}
        onSlideChange={(index) => {
          // Normalize to 0-2 range for manual navigation
          const normalizedIndex = index % 3;
          setCurrentSlide(normalizedIndex);
          setIsWrapping(false);
        }}
      />
      </section>

      {/* Stats Section - Clean & Minimal */}
      <section className="py-20 bg-parrot-green-50">
        <div className="w-11/12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-parrot-green-50/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-20 bg-parrot-green-50">
        <div className="w-11/12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage warranties effectively, without the complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Minimal Steps */}
      <section className="py-20 bg-parrot-green-50">
        <div className="w-11/12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform translate-x-4"></div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Gradient */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary-dark">
        <div className="w-11/12 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already managing their warranties smarter and more efficiently.
          </p>
          {!user ? (
            <Link
              to="/registration"
              className="inline-block bg-white text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white"
            >
              Create Free Account
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block bg-white text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-white"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
