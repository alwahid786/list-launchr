import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/global/ContactForm';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    problemsSection: false,
    stepsSection: false,
    featuresSection: false,
    whoItsFor: false,
    testimonials: false,
    giveawayIdeas: false,
    trustBuilders: false,
    faq: false,
    cta: false
  });
  
  const [activeTab, setActiveTab] = useState('authors');
  const [openFaq, setOpenFaq] = useState(null);
  
  const heroRef = useRef(null);
  const problemsRef = useRef(null);
  const stepsRef = useRef(null);
  const featuresRef = useRef(null);
  const whoItsForRef = useRef(null);
  const testimonialsRef = useRef(null);
  const giveawayIdeasRef = useRef(null);
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
    if (whoItsForRef.current) observer.observe(whoItsForRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (giveawayIdeasRef.current) observer.observe(giveawayIdeasRef.current);
    if (trustBuildersRef.current) observer.observe(trustBuildersRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (problemsRef.current) observer.unobserve(problemsRef.current);
      if (stepsRef.current) observer.unobserve(stepsRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (whoItsForRef.current) observer.unobserve(whoItsForRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (giveawayIdeasRef.current) observer.unobserve(giveawayIdeasRef.current);
      if (trustBuildersRef.current) observer.unobserve(trustBuildersRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);
  
  // Updated testimonials data from client feedback
  const testimonials = [
    {
      id: 1,
      content: "I added 450 new subscribers in 10 days — and sold out my launch!",
      author: "Charlotte Raine",
      role: "Best selling author of \"Teacher Beware\"",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      content: "We booked 12 new clients in one month after just one giveaway. Game-changer.",
      author: "Connor",
      role: "HVAC Guyz, Atlanta Georgia",
      image: "https://randomuser.me/api/portraits/men/47.jpg" 
    },
    {
      id: 3,
      content: "I added 500+ subscribers in one week and had my best month ever in shop sales — all from one giveaway.",
      author: "Monisha",
      role: "Etsy Shop Owner (Printables & Logos)",
      image: "https://randomuser.me/api/portraits/women/26.jpg"
    },
    {
      id: 4,
      content: "My list exploded — over 800 new fans in five days. And brands took notice. This is now part of my content calendar.",
      author: "Jenna Neumann",
      role: "Wellness Influencer & Creator",
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];
  
  // Updated steps data from client feedback
  const steps = [
    {
      number: 1,
      title: "Create Your Giveaway",
      description: "Set up your prize, customize your landing page, and choose entry methods that fit your goals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Share & Promote",
      description: "Launch your campaign and share it with your audience — or let us help you run paid ads.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Watch It Grow",
      description: "Monitor entries in real-time and watch your list grow through viral sharing and referrals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      number: 4,
      title: "Select Winners & Follow Up",
      description: "Pick your winners and follow up with new subscribers to build lasting relationships.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  // Who It's For data
  const audiences = [
    {
      id: 'authors',
      title: 'For Authors',
      subtitle: 'Sell more books',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'shops',
      title: 'For Shop Owners',
      subtitle: 'Promote your products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'influencers',
      title: 'For Influencers',
      subtitle: 'Boost engagement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'local',
      title: 'For Local Businesses',
      subtitle: 'Book more appointments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];
  
  // Giveaway Ideas by audience
  const giveawayIdeas = {
    authors: [
      'Win a signed copy + Amazon gift card',
      'Name a character in my next book',
      'Early access to my next release + bonus chapter'
    ],
    shops: [
      'Win a gift box of bestselling products',
      '$50 shop credit + behind-the-scenes creation video',
      'Limited edition product bundle giveaway'
    ],
    influencers: [
      'Gift box of favorite tools/products',
      'Exclusive shoutout or collab opportunity',
      '"My Favorite Things" giveaway with affiliate links'
    ],
    local: [
      'Win 3 free service visits (lawncare, HVAC, etc.)',
      'Gift basket + free consult or estimate',
      'Local date night bundle with other local vendors'
    ]
  };
  
  // FAQ data
  const faqs = [
    {
      question: 'What kind of prize works best?',
      answer: 'Choose something relevant, enticing, and easy to fulfill — like a gift card, bestselling product, or exclusive item. If your audience would comment on it, they\'ll likely enter to win it.'
    },
    {
      question: 'Can I integrate this with my email list?',
      answer: 'Yes! Pro users can connect tools like Mailchimp, ConvertKit, MailerLite, and others. Free users can export leads via CSV.'
    },
    {
      question: 'How long should my giveaway run?',
      answer: '7–10 days is the sweet spot. It\'s long enough to build momentum without losing urgency. We recommend promoting hard the first 48 hours and again in the final push.'
    },
    {
      question: 'Do I have to run ads?',
      answer: 'Nope. Many users succeed by sharing to their current list or social platforms. But if you want faster results, we offer optional ad management.'
    },
    {
      question: 'What if I\'m not tech-savvy?',
      answer: 'ListLaunchr is built for non-tech users. If you can post to Instagram or send an email, you can launch a giveaway. And if you get stuck, we\'ve got you covered with help docs and support.'
    }
  ];
  
  return (
    <div className="pt-12 md:pt-16">
      {/* Hero Section */}
      <section
        ref={heroRef}
        data-section="hero"
        className="relative pt-16 sm:pt-20 md:pt-24 pb-16 w-full bg-gradient-to-br from-white via-blue-50/30 to-white"
      >
        <div className="relative container px-4 sm:px-6 mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-12 items-center">
            <div className="lg:col-span-6 lg:pr-4 xl:pr-8 mb-12 lg:mb-0">
              <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  🚀 Turn subscribers into promoters!
                </div>
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-neutral md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl">
                  <span className="block">Grow Your Reach —</span>
                  <div className="relative mt-2 inline-block">
                    <span className="relative z-10 text-primary">Own Your Audience</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-4 bg-accent/20 rounded-full -z-0 blur-sm transform -rotate-1"></span>
                  </div>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl text-neutral-600 font-medium max-w-3xl leading-relaxed">
                  Launch a viral giveaway campaign that builds your email list, boosts engagement, and helps you grow — whether you're selling online or serving your local community.
                </p>
                <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full shadow-xl text-white bg-primary hover:bg-blue-600 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl md:text-lg lg:text-lg xl:text-lg md:px-10 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Launch Your Giveaway Today</span>
                  </Link>
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-full text-primary bg-transparent border-2 border-primary hover:bg-blue-50 transition-all duration-300 shadow-md md:text-lg lg:text-lg xl:text-lg md:px-10"
                  >
                    Book a Call
                  </button>
                </div>
                <div className="mt-6 sm:mt-8 space-y-2">
                  <p className="text-neutral-500 text-sm">Try it free — or book a call to have us build it for you.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative">
                  <div className="absolute inset-0 -m-3 sm:-m-4 rounded-2xl bg-gradient-to-r from-accent via-primary to-blue-600 opacity-70 blur-lg animate-pulse"></div>
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-r from-accent to-primary blur-sm"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border-2 sm:border-4 border-white">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden max-w-full">
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
        className=" py-[40px] sm:py-[60px] bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.problemsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                The Problems We <span className="text-primary">Solve</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                title: "Unreliable Organic Reach",
                description: "Organic reach is unreliable and doesn't convert consistently",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )
              },
              {
                title: "Algorithm Dependency",
                description: "You're constantly competing with algorithms and competitors for attention — and you're dependent on platforms like Google, Instagram, and Facebook to even be seen",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.664 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )
              },
              {
                title: "Lack of Time & Tools",
                description: "Most small brands and businesses don't have the time or tools to build a list",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primary/20 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-primary mb-4">Our Promise</h3>
              <p className="text-lg text-neutral-700 leading-relaxed">
                ListLaunchr helps creators and local businesses run high-converting giveaway campaigns that generate real email subscribers and engaged followers — no tech skills needed.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section
        ref={stepsRef}
        data-section="stepsSection"
        className="py-[40px] sm:py-[60px]"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-primary text-sm font-medium">Simple Process</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Works</span>
              </h2>
            </div>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0">
              <div className={`h-full bg-primary transition-all duration-1500 ease-out ${isVisible.stepsSection ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="grid gap-8 lg:gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div 
                  key={step.number} 
                  className={`relative ${isVisible.stepsSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                  style={{ transitionDelay: `${300 + index * 200}ms` }}
                >
                  <div className="hidden lg:flex absolute -top-9 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-primary text-primary font-bold text-lg flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative z-0 h-full border border-gray-200 hover:border-blue-200">
                    <div className="lg:hidden w-10 h-10 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mb-4">
                      {step.number}
                    </div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-neutral mb-4 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
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
        className=" py-[40px] sm:py-[60px] bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.featuresSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Features & <span className="text-primary">Benefits</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Templates for creators, sellers, and local campaigns",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )
              },
              {
                title: "Viral sharing, referral bonuses, daily entry options",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )
              },
              {
                title: "Easy integration with email tools and CRMs",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Dashboard to view signups, shares, and campaign performance",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <p className="text-neutral-700 leading-relaxed font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section
        ref={whoItsForRef}
        data-section="whoItsFor"
        className=" py-[40px] sm:py-[60px]"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.whoItsFor ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Who It's <span className="text-primary">For</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience, index) => (
              <Link
                key={audience.id}
                to={`/${audience.id}`}
                className={`group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-500 text-center ${isVisible.whoItsFor ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary">
                    {audience.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral mb-2 group-hover:text-primary transition-colors duration-300">{audience.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-800 transition-colors duration-300">{audience.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Giveaway Ideas Section */}
      <section
        ref={giveawayIdeasRef}
        data-section="giveawayIdeas"
        className=" py-[40px] sm:py-[60px] bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Sample Giveaway <span className="text-primary">Ideas</span>
              </h2>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {audiences.map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => setActiveTab(audience.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === audience.id 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-white text-neutral-600 hover:bg-blue-50 hover:text-primary'
                  }`}
                >
                  {audience.title}
                </button>
              ))}
            </div>
            
            <div className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transition-all duration-500 ${isVisible.giveawayIdeas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <ul className="space-y-4">
                {giveawayIdeas[activeTab]?.map((idea, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-4"></div>
                    <span className="text-neutral-700 text-lg">{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        data-section="testimonials"
        className=" py-[40px] sm:py-[60px]"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-20">
            <div className={`transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span className="text-primary text-sm font-medium">Success Stories</span>
              </div>
              <h2 className="mt-8 text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">Users Say</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`group h-full transform transition-all duration-700 ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full flex flex-col group-hover:shadow-md group-hover:border-blue-200 transition-all duration-500">
                  <div className="mb-4">
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-neutral-700 font-medium leading-relaxed mb-4">"{testimonial.content}"</p>
                  </div>
                  
                  <div className="mt-auto flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="ml-3">
                      <h4 className="font-bold text-neutral text-sm">{testimonial.author}</h4>
                      <p className="text-xs text-neutral-600">{testimonial.role}</p>
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
        className=" py-[40px] sm:py-[60px] bg-gray-50"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.trustBuilders ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Why Choose <span className="text-primary">ListLaunchr</span>
              </h2>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Used by authors, Etsy shops, local service providers, and more",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "No coding required — built for non-tech users",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Transparent pricing, with DIY and managed options",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              {
                title: "Real support from real marketers",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25zm0 0V12m0 0l3.75-3.75M12 12l-3.75-3.75" />
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
        className=" py-[40px] sm:py-[60px]"
      >
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-neutral">
                Frequently Asked <span className="text-primary">Questions</span>
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
                    <h3 className="text-lg font-bold text-neutral pr-4">{faq.question}</h3>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 text-primary transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openFaq === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
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
        className=" py-[40px] sm:py-[60px] bg-gradient-to-br from-primary to-blue-600"
      >
        <div className="container px-4 sm:px-6 mx-auto relative">
          <div 
            className={`text-center transform transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-headline font-extrabold text-white mb-6">
              Launch Your Giveaway Today
            </h2>
            
            <p className="text-xl text-blue-100 font-medium max-w-3xl mx-auto mb-10">
              Try it free — or book a call to have us build it for you.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-medium rounded-full bg-white text-primary hover:bg-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              
              <button className="px-8 py-4 text-lg font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                Book a Call
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-blue-100">
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

      {/* Contact Form */}
      <ContactForm color="primary" />
    </div>
  );
};

export default HomePage;