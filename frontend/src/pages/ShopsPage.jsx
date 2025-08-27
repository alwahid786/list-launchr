import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/global/ContactForm';

const ShopsPage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    problemsSection: false,
    stepsSection: false,
    featuresSection: false,
    giveawayIdeas: false,
    testimonials: false,
    trustBuilders: false,
    faq: false,
    cta: false
  });
  
  const [openFaq, setOpenFaq] = useState(null);
  
  const heroRef = useRef(null);
  const problemsRef = useRef(null);
  const stepsRef = useRef(null);
  const featuresRef = useRef(null);
  const giveawayIdeasRef = useRef(null);
  const testimonialsRef = useRef(null);
  const trustBuildersRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          setIsVisible(prev => ({
            ...prev,
            [sectionId]: true
          }));
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (problemsRef.current) observer.observe(problemsRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (giveawayIdeasRef.current) observer.observe(giveawayIdeasRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (trustBuildersRef.current) observer.observe(trustBuildersRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (problemsRef.current) observer.unobserve(problemsRef.current);
      if (stepsRef.current) observer.unobserve(stepsRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (giveawayIdeasRef.current) observer.unobserve(giveawayIdeasRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (trustBuildersRef.current) observer.unobserve(trustBuildersRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);
  
  // Shop-focused steps data
  const steps = [
    {
      number: 1,
      title: "Create Your Campaign",
      description: "Choose your product bundle, gift card, or store credit prize",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Share It Everywhere",
      description: "Promote your giveaway on Instagram, TikTok, email, and shop listings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Grow Your List",
      description: "Collect new subscribers, boost engagement, and drive traffic to your store",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];
  
  // Sample giveaway ideas for shops
  const giveawayIdeas = [
    {
      title: "$50 Etsy shop credit giveaway",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Bundle of bestsellers (planner, candle, handmade item)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "Limited edition product drop + early access bonus",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Win a \"Shop Owner's Favorite Things\" bundle",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];
  
  // Shop owner testimonials
  const testimonials = [
    {
      id: 1,
      content: "I added over 500 new email subscribers and sold out my restock in 3 days.",
      author: "Maya",
      role: "Digital Product Seller",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      content: "This was easier and cheaper than running Instagram ads. 100% worth it.",
      author: "Jason",
      role: "Etsy Store Owner",
      image: "https://randomuser.me/api/portraits/men/47.jpg" 
    }
  ];
  
  // Shop-specific FAQ data
  const faqs = [
    {
      question: 'What kinds of prizes work best?',
      answer: 'Shop credit, product bundles, or bestselling items work great. Choose something that represents your brand and has clear value to your target customers.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      question: 'Will this drive real customers or just freebie hunters?',
      answer: 'When you offer relevant prizes and require email signup, you attract genuine potential customers. Our targeting helps you reach people interested in your product category.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      question: 'Can I use this for digital products?',
      answer: 'Absolutely! Digital products like printables, templates, courses, and downloads work perfectly. Many of our most successful campaigns are for digital shops.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      question: 'Does it work with Etsy/Shopify?',
      answer: 'Yes! ListLaunchr integrates with all major platforms. You can link to your Etsy shop, Shopify store, or any other ecommerce platform.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      question: 'How long should a giveaway run?',
      answer: '7-10 days works best for shops. It gives you time to promote across platforms and build momentum without losing urgency.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="pt-12 md:pt-16">
      {/* Hero Section */}
      <section
        ref={heroRef}
        data-section="hero"
        className="relative pt-16 sm:pt-20 md:pt-24 pb-16 w-full bg-gradient-to-br from-white via-orange-50/30 to-white"
      >
        <div className="relative container px-4 sm:px-6 mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-12 items-center">
            <div className="lg:col-span-6 lg:pr-4 xl:pr-8 mb-12 lg:mb-0">
              <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-orange-50 border border-orange-100 text-cta text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  🛍️ Built for Shop Owners
                </div>
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-neutral md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
                  <span className="block">Turn Your Shoppers Into</span>
                  <div className="relative mt-2 inline-block">
                    <span className="relative z-10 text-cta">Subscribers</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-4 bg-cta/20 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                  </div>
                  <span className="block mt-2">— And Your Fans Into Repeat Buyers</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl text-neutral-600 font-medium max-w-3xl leading-relaxed">
                  Run a viral giveaway that helps grow your email list, drive traffic to your shop, and boost your customer loyalty — without complicated marketing funnels.
                </p>
                <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full shadow-xl text-white bg-cta hover:bg-orange-600 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl md:text-lg lg:text-lg xl:text-lg md:px-10 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Try It Free</span>
                  </Link>
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full text-cta bg-transparent border-2 border-cta hover:bg-orange-50 transition-all duration-300 shadow-md md:text-lg lg:text-lg xl:text-lg md:px-10"
                  >
                    Book a Call
                  </button>
                </div>
                <div className="mt-6 sm:mt-8 space-y-2">
                  <p className="text-neutral-500 text-sm">Try it free — or book a call to have us set up your first campaign with you.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative">
                  <div className="absolute inset-0 -m-3 sm:-m-4 rounded-2xl bg-gradient-to-r from-cta via-orange-500 to-red-500 opacity-70 blur-lg animate-pulse"></div>
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-cta to-orange-500 blur-sm"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border-2 sm:border-4 border-white">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden max-w-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-cta/5 to-cta/10 p-3 sm:p-4 md:p-6">
                        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 h-full flex flex-col">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-cta rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="h-2 sm:h-3 w-20 sm:w-32 bg-gray-200 rounded-md"></div>
                              <div className="h-1.5 sm:h-2 w-14 sm:w-20 bg-gray-100 rounded-md mt-1"></div>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                            <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded-md mb-3 sm:mb-4"></div>
                            <div className="h-20 sm:h-24 md:h-32 bg-gray-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-cta/10 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-cta/20 rounded-full flex items-center justify-center">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-cta rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                            </div>

                            <div className="h-8 sm:h-10 w-full bg-cta rounded-lg mt-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section
        ref={problemsRef}
        data-section="problemsSection"
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.problemsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Problems We <span className="text-cta">Solve</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                title: "Platform Dependency",
                description: "Most small shop owners rely too much on platform traffic they don't control (Etsy, Google, Instagram)",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.664 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )
              },
              {
                title: "Email List Building",
                description: "It's hard to build an email list from scratch without expensive ads",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "One-Time Customers",
                description: "Customers often buy once and disappear — no system to re-engage",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              }
            ].map((problem, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-200 transition-all duration-700 ${isVisible.problemsSection ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-6">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral mb-4">{problem.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible.problemsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-cta/20 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-cta mb-4">Our Promise</h3>
              <p className="text-lg text-neutral-700 leading-relaxed">
                With ListLaunchr, you'll run a targeted giveaway that attracts shoppers, turns them into subscribers, and helps you build your own repeat customer base. You control your audience — not the algorithm.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section
        ref={stepsRef}
        data-section="stepsSection"
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                <div className="h-2 w-2 rounded-full bg-cta mr-2"></div>
                <span className="text-cta text-sm font-medium">Three Step Plan</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-cta to-orange-600">Works</span>
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className={`h-full bg-cta transition-all duration-1500 ease-out ${isVisible.stepsSection ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="grid gap-8 lg:gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className={`relative ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                  style={{ transitionDelay: `${300 + index * 200}ms` }}
                >
                  <div className="hidden lg:flex absolute -top-9 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-cta text-cta font-bold text-lg flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 h-full border border-gray-200 hover:border-orange-200">
                    <div className="lg:hidden w-10 h-10 rounded-full bg-cta text-white font-bold text-lg flex items-center justify-center mb-4">
                      {step.number}
                    </div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-neutral mb-4 group-hover:text-cta transition-colors duration-300">{step.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base md:text-base lg:text-base group-hover:text-neutral-800 transition-colors duration-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section
        ref={featuresRef}
        data-section="featuresSection"
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.featuresSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Features & <span className="text-cta">Benefits</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Shop-friendly giveaway templates (printables, bundles, digital goods, physical items)",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )
              },
              {
                title: "Add referral bonuses, daily entry options, and viral sharing boosts",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Integrates with your email tools (MailerLite, Flodesk, Klaviyo, etc.)",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Easy-to-track dashboard to see leads and clicks",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-700 ${isVisible.featuresSection ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <p className="text-neutral-700 leading-relaxed font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Giveaway Ideas Section */}
      <section
        ref={giveawayIdeasRef}
        data-section="giveawayIdeas"
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Sample Giveaway <span className="text-cta">Ideas for Shops</span>
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {giveawayIdeas.map((idea, index) => (
                <div 
                  key={index}
                  className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-500 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mr-4">
                      {idea.icon}
                    </div>
                    <p className="text-neutral-700 font-medium leading-relaxed">{idea.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        data-section="testimonials"
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                <div className="h-2 w-2 rounded-full bg-cta mr-2"></div>
                <span className="text-cta text-sm font-medium">Success Stories</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                What Shop Owners <span className="bg-clip-text text-transparent bg-gradient-to-r from-cta to-orange-600">Say</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`group h-full transform transition-all duration-700 ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full flex flex-col group-hover:shadow-md group-hover:border-orange-200 transition-all duration-500">
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xl text-neutral-700 font-medium leading-relaxed mb-6">"{testimonial.content}"</p>
                  </div>
                  
                  <div className="mt-auto flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-neutral text-lg">{testimonial.author}</h4>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Builders Section */}
      <section
        ref={trustBuildersRef}
        data-section="trustBuilders"
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.trustBuilders ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Why Shop Owners Choose <span className="text-cta">ListLaunchr</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Used by hundreds of Etsy sellers and shop owners",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "No code or tech setup required",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Transparent pricing and built-in support",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              {
                title: "Works for physical or digital products alike",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              }
            ].map((trust, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-700 ${isVisible.trustBuilders ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6">
                  {trust.icon}
                </div>
                <p className="text-neutral-700 leading-relaxed font-medium">{trust.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        data-section="faq"
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Frequently Asked <span className="text-cta">Questions</span>
              </h2>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`mb-4 transition-all duration-700 ${isVisible.faq ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-4 text-cta">
                        {faq.icon}
                      </div>
                      <h3 className="text-lg font-bold text-neutral">{faq.question}</h3>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-cta transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openFaq === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100 ml-12">
                      <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={ctaRef}
        data-section="cta"
        className="py-24 sm:py-32 bg-gradient-to-br from-cta to-orange-600"
      >
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div 
            className={`text-center transform transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-white mb-6">
              Grow Your Shop the Smart Way
            </h2>
            
            <p className="text-xl text-orange-100 font-medium max-w-3xl mx-auto mb-10">
              Try it free or book a call to have us set up your first campaign with you.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-medium rounded-full bg-white text-cta hover:bg-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                Try It Free
              </Link>
              
              <button className="px-8 py-4 text-lg font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-cta transition-all duration-300">
                Book a Call
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-orange-100">
              {['No credit card required', 'Free forever plan', 'Set up in minutes'].map((item, i) => (
                <div key={i} className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ContactForm color="cta" />
    </div>
  );
};

export default ShopsPage;