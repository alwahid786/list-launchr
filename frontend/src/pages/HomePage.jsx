import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    stepsSection: false,
    testimonials: false,
    stats: false,
    cta: false
  });
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);
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
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (stepsRef.current) observer.unobserve(stepsRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (statsRef.current) observer.unobserve(statsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);
  
  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      content: "ListLaunchr helped me grow my email list from 500 to over 3,000 subscribers in just two weeks! The viral sharing feature was a game-changer for my book launch.",
      author: "Sarah Johnson",
      role: "Author & Content Creator",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      content: "I've tried several giveaway tools before, but none were as effective as ListLaunchr. The analytics dashboard made it easy to track performance and optimize our campaign.",
      author: "Michael Rodriguez",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/men/47.jpg" 
    },
    {
      id: 3,
      content: "The referral system is brilliant! Our subscribers were excited to share and earn more entries, which helped us reach audiences we never could have accessed otherwise.",
      author: "Emma Wilson",
      role: "E-commerce Entrepreneur",
      image: "https://randomuser.me/api/portraits/women/26.jpg"
    }
  ];
  
  // Steps data for how it works
  const steps = [
    {
      number: 1,
      title: "Create Your Giveaway",
      description: "Set up your prize, customize your landing page, and choose entry methods.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Share & Promote",
      description: "Launch your campaign and promote it to your existing audience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Watch It Grow",
      description: "Monitor performance and see your email list grow through viral sharing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      number: 4,
      title: "Select Winners & Follow Up",
      description: "Randomly select winners and nurture your new subscriber relationships.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        className="relative pt-16 sm:pt-20 md:pt-24 pb-16 w-full"
      >
        {/* Background elements removed */}
        
        <div className="relative container px-4 sm:px-6 mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-12 items-center">
            <div className="lg:col-span-6 lg:pr-4 xl:pr-8 mb-12 lg:mb-0">
              <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-bounce">
                  🚀 Turn subscribers into promoters!
                </div>
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-neutral md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
                  <span className="block">Grow Your Email List</span>
                  <div className="relative mt-2 inline-block">
                    <span className="relative z-10 text-accent">With Viral Giveaways</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-4 bg-accent/20 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                  </div>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl text-neutral-600 font-medium max-w-3xl leading-relaxed">
                  ListLaunchr helps creators and sellers grow their email lists with engaging,
                  share-driven giveaway campaigns that turn every subscriber into a promoter.
                </p>
                <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full shadow-xl text-primary bg-white hover:bg-gray-50 hover:text-primary transform transition-all duration-300 hover:scale-105 hover:shadow-2xl md:text-lg lg:text-lg xl:text-lg md:px-10 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white bg-[length:400%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                  <Link
                    to="/examples"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full text-primary bg-transparent border-2 border-primary hover:bg-blue-50 transition-all duration-300 shadow-md md:text-lg lg:text-lg xl:text-lg md:px-10"
                  >
                    View Examples
                  </Link>
                </div>
                <div className="mt-6 sm:mt-8 space-y-2">
                  {[
                    'No credit card required',
                    'Free forever plan',
                    'Set up in minutes'
                  ].map((item, i) => (
                    <div key={i} className="text-neutral-600 text-sm sm:text-base font-medium flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 bg-accent rounded-full flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute inset-0 -m-3 sm:-m-4 rounded-2xl bg-gradient-to-r from-accent via-primary to-blue-600 opacity-70 blur-lg animate-pulse"></div>
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-accent to-primary blur-sm"></div>
                  
                  {/* Main image */}
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border-2 sm:border-4 border-white">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden max-w-full">
                      {/* Simulated giveaway app UI */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 p-3 sm:p-4 md:p-6">
                        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 h-full flex flex-col">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">LL</span>
                            </div>
                            <div className="ml-2 sm:ml-3">
                              <div className="h-2 sm:h-3 w-20 sm:w-32 bg-gray-200 rounded-md"></div>
                              <div className="h-1.5 sm:h-2 w-14 sm:w-20 bg-gray-100 rounded-md mt-1"></div>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                            <div className="h-3 sm:h-4 w-3/4 bg-gray-200 rounded-md mb-3 sm:mb-4"></div>
                            <div className="h-20 sm:h-24 md:h-32 bg-gray-100 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-primary rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                              <div className="h-8 sm:h-10 bg-gray-100 rounded-md"></div>
                            </div>

                            <div className="h-8 sm:h-10 w-full bg-primary rounded-lg mt-auto"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs text-white bg-primary px-2 sm:px-3 py-1 rounded-full shadow-sm">
                        Preview Mode
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats card - Hidden on smallest screens, visible from sm up */}
                  <div className="hidden sm:block absolute -bottom-6 right-0 sm:-right-4 transform translate-y-1/2 bg-white rounded-xl shadow-xl p-2 sm:p-3 md:p-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-1 sm:-space-x-2">
                        {[1, 2, 3].map(i => (
                          <img
                            key={i}
                            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border-2 border-white object-cover"
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                            alt="User"
                          />
                        ))}
                        <span className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-xs font-medium text-primary">+28</span>
                      </div>
                      <div className="ml-2 sm:ml-3 md:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-neutral">Growing email lists</p>
                        <div className="flex items-center text-xs text-neutral-500">
                          <span className="flex items-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            24.8%
                          </span>
                          <span className="mx-1 sm:mx-2">•</span>
                          <span>This month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity indicator - Hidden on smallest screens */}
                  <div className="hidden sm:flex absolute -top-2 left-0 sm:-left-2 bg-white rounded-lg shadow-lg p-2 items-center space-x-2">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-xs font-medium text-neutral-600">Live campaigns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        data-section="features"
        className="py-24 sm:py-32"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-primary text-sm font-medium">Powerful Features</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Everything You Need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Succeed</span>
              </h2>
              <p className="mt-6 text-base sm:text-lg lg:text-lg xl:text-xl text-neutral-600 max-w-3xl mx-auto">
                Create beautiful giveaway campaigns in minutes that convert more visitors into subscribers.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 opacity-5">
              <div className="absolute left-0 top-1/4 w-72 h-72 rounded-full bg-primary blur-3xl"></div>
              <div className="absolute right-0 bottom-1/4 w-72 h-72 rounded-full bg-accent blur-3xl"></div>
            </div>
            
            <div className="grid gap-8 lg:gap-12 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group">
                <div 
                  className={`h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-500 transform ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}
                  style={{ transitionDelay: '100ms' }}
                >
                  {/* Accent corner */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-blue-50 to-transparent -z-0 rounded-bl-3xl group-hover:from-blue-100 transition-colors duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral mb-4 group-hover:text-primary transition-colors duration-300">Email Collection</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base lg:text-base">
                      Beautifully designed opt-in forms with customizable fields, consent options, and easy integration with your favorite email tools.
                    </p>
                    
                    <ul className="mt-8 space-y-4">
                      {['Custom form fields', 'GDPR compliant', 'Email service integration'].map((item, i) => (
                        <li key={i} className="flex items-center text-neutral-600">
                          <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="group-hover:text-neutral-800 transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group">
                <div 
                  className={`h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-green-200 transition-all duration-500 transform ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}
                  style={{ transitionDelay: '300ms' }}
                >
                  {/* Accent corner */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-green-50 to-transparent -z-0 rounded-bl-3xl group-hover:from-green-100 transition-colors duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral mb-4 group-hover:text-accent transition-colors duration-300">Viral Sharing</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base lg:text-base">
                      Generate more entries with unique referral links and social sharing incentives that turn your subscribers into brand ambassadors.
                    </p>
                    
                    <ul className="mt-8 space-y-4">
                      {['Unique referral links', 'Social sharing bonuses', 'Viral entry multipliers'].map((item, i) => (
                        <li key={i} className="flex items-center text-neutral-600">
                          <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center mr-3 group-hover:bg-green-100 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="group-hover:text-neutral-800 transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group">
                <div 
                  className={`h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-red-200 transition-all duration-500 transform ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} relative overflow-hidden`}
                  style={{ transitionDelay: '500ms' }}
                >
                  {/* Accent corner */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-red-50 to-transparent -z-0 rounded-bl-3xl group-hover:from-red-100 transition-colors duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-cta"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral mb-4 group-hover:text-cta transition-colors duration-300">Analytics Dashboard</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base lg:text-base">
                      Track entries, measure conversion rates, and identify top referrers with our comprehensive analytics dashboard.
                    </p>
                    
                    <ul className="mt-8 space-y-4">
                      {['Real-time data', 'Conversion tracking', 'Top referrer insights'].map((item, i) => (
                        <li key={i} className="flex items-center text-neutral-600">
                          <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-cta" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="group-hover:text-neutral-800 transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to action button */}
            <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                to="/examples"
                className="inline-flex items-center px-8 py-4 rounded-full text-white bg-primary hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
              >
                <span>See Features in Action</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
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
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-primary text-sm font-medium">Simple Process</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                How <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">ListLaunchr</span> Works
              </h2>
              <p className="mt-6 text-base sm:text-lg lg:text-lg xl:text-xl text-neutral-600 max-w-3xl mx-auto">
                Creating and running viral giveaways has never been easier.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Desktop progress line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className={`h-full bg-primary transition-all duration-1500 ease-out ${isVisible.stepsSection ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            {/* Steps */}
            <div className="grid gap-8 lg:gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className={`relative ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                  style={{ transitionDelay: `${300 + index * 200}ms` }}
                >
                  {/* Step Number Indicator */}
                  <div className="hidden lg:flex absolute -top-9 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-primary text-primary font-bold text-lg flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Step content */}
                  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 h-full border border-gray-200 hover:border-blue-200">
                    {/* Mobile step number */}
                    <div className="lg:hidden w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mb-4">
                      {step.number}
                    </div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-neutral mb-4 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base md:text-base lg:text-base group-hover:text-neutral-800 transition-colors duration-300">{step.description}</p>
                    
                    {/* Decorative element */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-3xl -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Button */}
            <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 rounded-full text-white bg-primary hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
              >
                <span>Start Creating Your Giveaway</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        data-section="testimonials"
        className="py-24 sm:py-32 relative"
      >
        {/* Background decoration removed */}
        
        {/* Decorative elements removed */}
        
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-primary text-sm font-medium">Testimonials</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Users Say</span>
              </h2>
              <p className="mt-6 text-base sm:text-lg lg:text-lg xl:text-xl text-neutral-600 max-w-3xl mx-auto">
                See how creators and businesses have grown with ListLaunchr.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Quote decoration */}
            <div className="absolute -top-10 -left-6 opacity-10 text-7xl font-serif text-primary">"</div>
            <div className="absolute -bottom-10 -right-6 opacity-10 text-7xl font-serif text-primary">"</div>
            
            <div className="grid gap-10 lg:gap-14 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`group h-full transform transition-all duration-700 ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full flex flex-col group-hover:shadow-md group-hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
                    {/* Accent corner */}
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-blue-50 to-transparent -z-0 rounded-bl-3xl group-hover:from-blue-100 transition-colors duration-500"></div>
                    
                    {/* Quote mark */}
                    <div className="absolute -top-2 -left-1 text-4xl font-serif text-blue-100 opacity-30">"</div>
                    
                    <div className="relative mb-6 flex-1">
                      <p className="text-neutral-600 italic leading-relaxed text-sm sm:text-base md:text-base lg:text-base">{testimonial.content}</p>
                    </div>
                    
                    <div className="relative mt-auto pt-6 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="relative">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.author}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                          />
                          <div className="absolute -right-1 -bottom-1 bg-primary rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-neutral group-hover:text-primary transition-colors duration-300 text-base sm:text-base md:text-lg">{testimonial.author}</h4>
                          <p className="text-xs sm:text-sm md:text-sm text-neutral-600">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-400">Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View more button */}
            <div className={`mt-14 text-center transition-all duration-1000 delay-500 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                to="/examples"
                className="inline-flex items-center px-6 py-3 rounded-full text-primary border border-primary hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <span>View More Success Stories</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section
        ref={statsRef}
        data-section="stats"
        className="py-24 sm:py-32 relative"
      >
        {/* Background removed */}
        
        {/* Particles and decorative elements removed */}
        
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-accent mr-2"></div>
                <span className="text-primary text-sm font-medium">Our Impact</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Impressive <span className="relative inline-block">
                  <span className="relative z-10">Results</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-4 bg-accent/20 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                </span>
              </h2>
              <p className="mt-6 text-base sm:text-lg lg:text-lg xl:text-xl text-neutral-600 font-medium max-w-3xl mx-auto">
                Join thousands of creators who have grown their email lists with ListLaunchr.
              </p>
            </div>
          </div>
          
          <div 
            className={`grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {[
              { 
                value: '2.8M+', 
                label: 'Emails Collected',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              { 
                value: '15,000+', 
                label: 'Campaigns Created',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                )
              },
              { 
                value: '38%', 
                label: 'Avg. Conversion Rate',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              { 
                value: '4.2M+', 
                label: 'Social Shares',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className="bg-blue-50 rounded-full p-5 mb-6 group-hover:scale-110 transform transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 font-headline">{stat.value}</div>
                  <div className="text-neutral-600 text-sm sm:text-base md:text-base">{stat.label}</div>
                  
                  {/* Decorative accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent/40 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional element: Growth indicator */}
          <div className={`mt-16 flex justify-center transition-all duration-1000 delay-500 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center bg-blue-50 rounded-full py-2 px-4 border border-blue-100">
              <div className="flex items-center mr-3">
                <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-neutral-600 text-sm font-medium">Growing</span>
              </div>
              <div className="text-neutral-500 text-sm">+24.8% monthly growth</div>
            </div>
          </div>
        </div>
        
        {/* Wave decoration removed */}
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        data-section="cta"
        className="py-24 sm:py-32 relative"
      >
        {/* Background removed */}
        
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div 
            className={`relative overflow-hidden bg-white rounded-3xl shadow-md border border-gray-200 transform transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Background decorations removed */}
            
            {/* Animated particles removed */}
            
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-6">
                🚀 Limited Time Offer
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral mb-6">
                Ready to <span className="relative inline-block">
                  <span className="relative z-10">Grow</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-4 bg-accent/30 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                </span> Your Email List?
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-neutral-600 font-medium max-w-3xl mx-auto mb-10">
                Start creating your first giveaway campaign today. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                <Link
                  to="/register"
                  className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg md:text-lg font-medium rounded-full bg-white text-primary hover:bg-gray-100 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white bg-[length:400%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                
                <Link
                  to="/examples"
                  className="group px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg md:text-lg font-medium rounded-full bg-gray-100 border-2 border-blue-100 text-neutral hover:bg-gray-200 transition-all duration-300"
                >
                  <span>View Examples</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {['No credit card required', 'Free forever plan', 'Set up in minutes'].map((item, i) => (
                  <div key={i} className="flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-200 text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full border-4 border-accent/20 opacity-50 animate-spin" style={{ animationDuration: '15s' }}></div>
              <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full border-4 border-dashed border-gray-200 opacity-70 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
            </div>
          </div>
          
          {/* Trust badges */}
          <div className={`mt-16 text-center transition-all duration-1000 delay-300 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-neutral-500 text-sm uppercase tracking-wide font-medium mb-6">Trusted by creators worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {['ProductHunt', 'TechCrunch', 'CreatorWeekly', 'EmailInsider', 'MarketingPro'].map((badge, i) => (
                <div key={i} className="text-neutral-600 font-medium">{badge}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;