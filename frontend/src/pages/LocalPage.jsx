import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LocalPage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    problemsSection: false,
    localProSection: false,
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
  const localProRef = useRef(null);
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
    if (localProRef.current) observer.observe(localProRef.current);
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
      if (localProRef.current) observer.unobserve(localProRef.current);
      if (stepsRef.current) observer.unobserve(stepsRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (giveawayIdeasRef.current) observer.unobserve(giveawayIdeasRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (trustBuildersRef.current) observer.unobserve(trustBuildersRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);
  
  // Local business steps data
  const steps = [
    {
      number: 1,
      title: "Pick Your Prize",
      description: "Choose a giveaway that local customers care about",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Launch the Campaign",
      description: "Use our tool or let us do the work",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Grow Your List",
      description: "Gain leads through viral sharing and referrals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      number: 4,
      title: "Stay Top of Mind",
      description: "Send monthly offers with our built-in email tools or service",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];
  
  // Sample giveaway ideas for local businesses
  const giveawayIdeas = [
    {
      title: "Win 3 free service visits (lawncare, HVAC, etc.)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Gift basket + free consult or estimate",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: "Local date night bundle with other local vendors",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Free family photo session + frame (photographers)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      )
    },
    {
      title: "$100 off your first visit (dentists, salons, etc.)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: "Use Local Pro+ to do this monthly with zero effort",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];
  
  // Local business testimonials
  const testimonials = [
    {
      id: 1,
      content: "We booked 12 new HVAC clients from just one campaign.",
      author: "Mike",
      role: "ServicePro Heating",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      content: "Our list went from 120 to 800 in two weeks — now we actually use email!",
      author: "Sarah",
      role: "Local Boutique Owner",
      image: "https://randomuser.me/api/portraits/women/47.jpg" 
    }
  ];
  
  // Local-specific FAQ data
  const faqs = [
    {
      question: 'How do you run the ads?',
      answer: 'We create and manage Facebook and Instagram ads that target your ideal local customer based on location, interests, and behavior. Everything is tracked and optimized by our team.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      question: 'Can I choose the prize?',
      answer: 'Yes! You know your customers best. We\'ll help you brainstorm high-performing ideas, but you get final say — and can change it monthly if you\'d like.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      question: 'Do I need a website?',
      answer: 'Nope. We create a custom giveaway landing page for you — mobile-friendly, fast-loading, and branded with your info (or ours if you\'re using the free version).',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      question: 'Will this help me get repeat customers?',
      answer: 'Yes. Once you collect emails, you can follow up with offers, reminders, seasonal promos — or let us send a polished newsletter each month if you\'re on Local Pro+.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      question: 'What\'s included in the Local Pro+ plan?',
      answer: 'Campaign creation, ad management, monthly email newsletters, and growth reporting. All you do is tell us the prize and send us a few bullet points for your monthly newsletter — we handle everything else.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
        className="relative pt-16 sm:pt-20 md:pt-24 pb-16 w-full bg-gradient-to-br from-white via-purple-50/30 to-white"
      >
        <div className="relative container px-4 sm:px-6 mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-12 items-center">
            <div className="lg:col-span-6 lg:pr-4 xl:pr-8 mb-12 lg:mb-0">
              <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  🏪 Built for Local Businesses
                </div>
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-neutral md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
                  <span className="block">Build Your Local Customer List —</span>
                  <div className="relative mt-2 inline-block">
                    <span className="relative z-10 text-purple-600">Without Lifting a Finger</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-4 bg-purple-600/20 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                  </div>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl text-neutral-600 font-medium max-w-3xl leading-relaxed">
                  We run the campaign. You get more emails, followers, and leads from local customers who want what you offer.
                </p>
                <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full shadow-xl text-white bg-purple-600 hover:bg-purple-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl md:text-lg lg:text-lg xl:text-lg md:px-10 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Launch Free Giveaway</span>
                  </Link>
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full text-purple-600 bg-transparent border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 shadow-md md:text-lg lg:text-lg xl:text-lg md:px-10"
                  >
                    Book a Call
                  </button>
                </div>
                <div className="mt-6 sm:mt-8 space-y-2">
                  <p className="text-neutral-500 text-sm">Try it free or let us run everything for you with our Local Pro+ service.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative">
                  <div className="absolute inset-0 -m-3 sm:-m-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 opacity-70 blur-lg animate-pulse"></div>
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 blur-sm"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border-2 sm:border-4 border-white">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden max-w-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/10 p-3 sm:p-4 md:p-6">
                        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 h-full flex flex-col">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-600/10 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-purple-600 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                            </div>

                            <div className="h-8 sm:h-10 w-full bg-purple-600 rounded-lg mt-auto"></div>
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
                Problems We <span className="text-purple-600">Solve</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                title: "No Time or Tech Skills",
                description: "Most local business owners don't have time, tech skills, or a dedicated team to grow their email list",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Expensive Traditional Marketing",
                description: "They're stuck relying on expensive, hard-to-track print ads and home shows",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              {
                title: "Big Brand Competition",
                description: "They're competing with bigger brands — and are dependent on Google and social media algorithms to be seen",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
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
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-purple-600/20 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Our Promise</h3>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We'll run a turnkey giveaway campaign that builds your email list, boosts your social presence, and helps your business stay top-of-mind with local customers — all for less than a single print ad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Pro+ Section */}
      <section
        ref={localProRef}
        data-section="localProSection"
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.localProSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-sm font-medium mb-6">
                ⭐ NEW: Local Pro+ Plan
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Want Us to <span className="text-purple-600">Run It For You?</span>
              </h2>
              <p className="mt-6 text-lg text-neutral-600 max-w-3xl mx-auto">
                Our premium Local Pro+ service includes everything you need — we handle the heavy lifting.
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 md:p-12 transition-all duration-1000 ${isVisible.localProSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "We build your campaigns from scratch",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )
                  },
                  {
                    title: "We create and manage Facebook and Instagram ads targeting your area",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    )
                  },
                  {
                    title: "We write and send your monthly newsletters using AI + your input",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                  {
                    title: "You get lead reports, growth tracking, and insights — delivered monthly",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  }
                ].map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 mx-auto shadow-sm">
                      {feature.icon}
                    </div>
                    <p className="text-neutral-700 font-medium leading-relaxed">{feature.title}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8 pt-8 border-t border-purple-200">
                <p className="text-lg text-neutral-700 mb-2"><strong>All you do?</strong> Pick a prize and send us basic bullet points — we handle the rest.</p>
                <p className="text-purple-600 font-semibold">It's like hiring a full marketing team for less than one home show booth.</p>
                <button className="mt-6 px-8 py-4 text-lg font-medium rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                  Ask About Local Pro+
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section
        ref={stepsRef}
        data-section="stepsSection"
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
                <div className="h-2 w-2 rounded-full bg-purple-600 mr-2"></div>
                <span className="text-purple-600 text-sm font-medium">Four Step Plan</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">Works</span>
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className={`h-full bg-purple-600 transition-all duration-1500 ease-out ${isVisible.stepsSection ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="grid gap-8 lg:gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className={`relative ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                  style={{ transitionDelay: `${300 + index * 200}ms` }}
                >
                  <div className="hidden lg:flex absolute -top-9 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-purple-600 text-purple-600 font-bold text-lg flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 h-full border border-gray-200 hover:border-purple-200">
                    <div className="lg:hidden w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                      {step.number}
                    </div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-neutral mb-4 group-hover:text-accent transition-colors duration-300">{step.title}</h3>
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
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.featuresSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Features & <span className="text-purple-600">Benefits</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Fully managed campaigns or DIY options",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Geo-targeted ad spend to reach your ideal local customer",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Includes design, copy, giveaway prize setup, and landing page",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                )
              },
              {
                title: "Real-time dashboard to track leads, entries, and campaign performance",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6">
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
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Sample Giveaway Ideas for <span className="text-purple-600">Local Businesses</span>
              </h2>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {giveawayIdeas.map((idea, index) => (
                <div 
                  key={index}
                  className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-500 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
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
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
                <div className="h-2 w-2 rounded-full bg-purple-600 mr-2"></div>
                <span className="text-purple-600 text-sm font-medium">Success Stories</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                What Local Business Owners <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">Say</span>
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
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full flex flex-col group-hover:shadow-md group-hover:border-purple-200 transition-all duration-500">
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
        className="py-24 sm:py-32 bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.trustBuilders ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Why Local Businesses Choose <span className="text-purple-600">ListLaunchr</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Trusted by HVAC pros, dentists, landscapers, boutiques, and more",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "No tech skills required",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Transparent pricing — no hidden fees",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              {
                title: "Support from real humans, not bots",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              }
            ].map((trust, index) => (
              <div 
                key={index}
                className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-700 ${isVisible.trustBuilders ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mb-6">
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
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Frequently Asked <span className="text-purple-600">Questions</span>
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
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-4 text-purple-600">
                        {faq.icon}
                      </div>
                      <h3 className="text-lg font-bold text-neutral">{faq.question}</h3>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-purple-600 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
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
        className="py-24 sm:py-32 bg-gradient-to-br from-purple-600 to-purple-800"
      >
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div 
            className={`text-center transform transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-white mb-6">
              Let's Build Your Local List
            </h2>
            
            <p className="text-xl text-purple-100 font-medium max-w-3xl mx-auto mb-10">
              Try it free or let us run everything for you with our Local Pro+ service.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-medium rounded-full bg-white text-purple-600 hover:bg-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                Launch Free Giveaway
              </Link>
              
              <button className="px-8 py-4 text-lg font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300">
                Book a Call
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-purple-100">
              {['No tech skills needed', 'Fully managed option', 'Local targeting'].map((item, i) => (
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
    </div>
  );
};

export default LocalPage;