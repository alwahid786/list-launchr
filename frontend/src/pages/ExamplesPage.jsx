import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ExamplesPage = () => {
  const [isVisible, setIsVisible] = useState({
    header: false,
    examples: false,
    cta: false,
    tips: false
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredExample, setHoveredExample] = useState(null);
  
  const headerRef = useRef(null);
  const examplesRef = useRef(null);
  const ctaRef = useRef(null);
  const tipsRef = useRef(null);
  
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
    
    if (headerRef.current) observer.observe(headerRef.current);
    if (examplesRef.current) observer.observe(examplesRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    if (tipsRef.current) observer.observe(tipsRef.current);
    
    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (examplesRef.current) observer.unobserve(examplesRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
      if (tipsRef.current) observer.unobserve(tipsRef.current);
    };
  }, []);

  // Sample campaign examples
  const examples = [
    {
      id: 1,
      title: 'Book Launch Giveaway',
      description: 'Win a signed copy of "Amazing Book Title" plus exclusive reader bonuses!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Book+Giveaway',
      entries: 1432,
      days: 14,
      category: 'books',
      stats: {
        conversion: '38%',
        sharing: '75%',
        growth: '215%'
      }
    },
    {
      id: 2,
      title: 'Photography Course Bundle',
      description: 'Enter to win our complete photography course bundle worth $499!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Photography+Bundle',
      entries: 2189,
      days: 21,
      category: 'courses',
      stats: {
        conversion: '42%',
        sharing: '68%',
        growth: '184%'
      }
    },
    {
      id: 3,
      title: 'Fitness Equipment Package',
      description: 'Win a complete home gym setup with weights, resistance bands, and more!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Fitness+Package',
      entries: 3567,
      days: 30,
      category: 'fitness',
      stats: {
        conversion: '47%',
        sharing: '83%',
        growth: '320%'
      }
    },
    {
      id: 4,
      title: 'Skincare Collection',
      description: 'Win our entire organic skincare collection plus a 1-year subscription!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Skincare+Collection',
      entries: 1876,
      days: 14,
      category: 'beauty',
      stats: {
        conversion: '41%',
        sharing: '72%',
        growth: '195%'
      }
    },
    {
      id: 5,
      title: 'Kitchen Gadget Bundle',
      description: 'Enter to win a complete set of premium kitchen gadgets worth over $350!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Kitchen+Bundle',
      entries: 2453,
      days: 21,
      category: 'home',
      stats: {
        conversion: '39%',
        sharing: '65%',
        growth: '176%'
      }
    },
    {
      id: 6,
      title: 'Digital Art Course',
      description: 'Win lifetime access to our premium digital art course and tablet!',
      image: 'https://placehold.co/600x400/0066FF/FFFFFF?text=Art+Course',
      entries: 1245,
      days: 14,
      category: 'courses',
      stats: {
        conversion: '36%',
        sharing: '71%',
        growth: '168%'
      }
    }
  ];

  // Extract unique categories
  const categories = ['all', ...new Set(examples.map(example => example.category))];
  
  // Filter examples by selected category
  const filteredExamples = selectedCategory === 'all' 
    ? examples 
    : examples.filter(example => example.category === selectedCategory);

  return (
    <div className="pt-24 bg-gray-50">
      {/* Header Section */}
      <section
        ref={headerRef}
        data-section="header"
        className="relative overflow-hidden py-16"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-1/4 -top-40 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl"></div>
          <div className="absolute left-1/3 -bottom-20 h-60 w-60 rounded-full bg-accent opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative container px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <div className={`transition-all duration-1000 ${isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Browse Examples</span>
            <h1 className="mt-6 text-4xl font-headline font-extrabold text-neutral sm:text-5xl md:text-6xl">
              Inspiring Giveaway Examples
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-neutral-600 mx-auto">
              Explore successful campaigns created with ListLaunchr and get inspiration for your next viral giveaway.
            </p>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section
        ref={examplesRef}
        data-section="examples"
        className="py-16"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          {/* Category Filter */}
          <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 ${isVisible.examples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gray-50 rounded-full inline-flex p-1.5 border border-gray-200 shadow-inner">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative group px-5 py-2 mx-1 text-sm font-medium rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? 'text-white bg-primary shadow-md hover:bg-blue-700 hover:text-white' 
                      : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <span className="relative z-10">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  {selectedCategory !== category && (
                    <span className="absolute inset-0 bg-primary rounded-full opacity-0 transform scale-0 group-hover:opacity-10 group-hover:scale-100 transition-all duration-300"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExamples.map((example, index) => (
              <div 
                key={example.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 transform hover:-translate-y-2 hover:shadow-xl flex flex-col h-full ${
                  isVisible.examples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredExample(example.id)}
                onMouseLeave={() => setHoveredExample(null)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={example.image}
                    alt={example.title}
                    className="w-full h-full object-cover transition-transform duration-700 transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white w-full">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className="text-sm font-medium">{example.entries.toLocaleString()} entries</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">{example.days} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-neutral">{example.title}</h3>
                    <span className="bg-blue-50 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      {example.category}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4 flex-grow">{example.description}</p>
                  
                  {/* Stats Section - Always visible but with transition effect */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-primary font-bold">{example.stats.conversion}</div>
                      <div className="text-xs text-neutral-600">Conversion</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-green-600 font-bold">{example.stats.sharing}</div>
                      <div className="text-xs text-neutral-600">Sharing</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <div className="text-purple-600 font-bold">{example.stats.growth}</div>
                      <div className="text-xs text-neutral-600">List Growth</div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <Link
                    to="/register"
                    className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    Create Similar Giveaway
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible.examples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Success Stories</span>
            <h2 className="mt-6 text-3xl font-headline font-extrabold text-neutral">
              Real Results from Real Creators
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-600 mx-auto">
              See how creators like you have achieved impressive growth with ListLaunchr
            </p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isVisible.examples ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                name: 'Sarah J.',
                role: 'Author & Course Creator',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                quote: '"I grew my email list from 500 to over 3,200 subscribers in just three weeks using ListLaunchr. The viral sharing feature was a game-changer!"',
                stats: { before: '500', after: '3,200', growth: '540%' }
              },
              {
                name: 'Michael T.',
                role: 'Fitness Entrepreneur',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                quote: '"With ListLaunchr, we generated over 5,000 leads for our new fitness program launch at a fraction of what we would have spent on ads."',
                stats: { before: '1,200', after: '6,300', growth: '425%' }
              },
              {
                name: 'Emma L.',
                role: 'E-commerce Shop Owner',
                image: 'https://randomuser.me/api/portraits/women/68.jpg',
                quote: '"Our product launch giveaway collected over 4,700 emails, resulting in our biggest product launch ever with a 32% conversion rate!"',
                stats: { before: '2,800', after: '7,500', growth: '168%' }
              }
            ].map((story, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-bold text-neutral">{story.name}</h3>
                    <p className="text-sm text-neutral-600">{story.role}</p>
                  </div>
                </div>
                <p className="italic text-neutral-700 mb-4 flex-grow">{story.quote}</p>
                <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center mt-auto">
                  <div className="text-center">
                    <span className="block text-neutral-600 text-sm">Before</span>
                    <span className="block font-bold text-lg text-neutral">{story.stats.before}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="text-center">
                    <span className="block text-neutral-600 text-sm">After</span>
                    <span className="block font-bold text-lg text-neutral">{story.stats.after}</span>
                  </div>
                  <div className="text-center bg-accent bg-opacity-20 py-1 px-3 rounded-full">
                    <span className="block font-bold text-sm text-neutral">+{story.stats.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        data-section="cta"
        className="py-20 bg-gradient-to-r from-primary to-blue-700 relative overflow-hidden"
      >
        {/* Background Design Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-accent opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative container px-6 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-headline font-extrabold text-white sm:text-4xl md:text-5xl">
              Ready to Create Your Own Viral Giveaway?
            </h2>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto font-medium">
              Start growing your email list with a giveaway that converts visitors into subscribers and turns subscribers into promoters.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 text-base font-medium rounded-full bg-white text-primary hover:bg-gray-50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl sm:text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 text-base font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-black/20 transition-all duration-300 shadow-md sm:text-lg"
              >
                View Pricing
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {['No credit card required', 'Free forever plan', 'Set up in minutes'].map((item, i) => (
                <div key={i} className="flex items-center text-white font-medium drop-shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section
        ref={tipsRef}
        data-section="tips"
        className="py-24 bg-gray-50"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible.tips ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Expert Advice</span>
            <h2 className="mt-6 text-3xl font-headline font-extrabold text-neutral">
              Tips for Creating Successful Giveaways
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-600 mx-auto">
              Follow these proven strategies to maximize your giveaway performance
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-1000 delay-300 ${isVisible.tips ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="space-y-8">
                {[
                  {
                    title: 'Choose a Valuable Prize',
                    description: 'Offer something that your target audience truly wants. It should be relevant to your brand and valuable enough to motivate participation.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    )
                  },
                  {
                    title: 'Keep Entry Simple',
                    description: 'Don\'t make the entry process too complicated. Start with email and then offer additional entry methods for bonus points.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )
                  },
                  {
                    title: 'Encourage Sharing',
                    description: 'Incentivize participants to share your giveaway with their friends by offering bonus entries for referrals.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Set the Right Duration',
                    description: '2-3 weeks is usually optimal. Too short and you won\'t get enough entries; too long and you\'ll lose momentum.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Promote Across Channels',
                    description: 'Share your giveaway on all your social media platforms, email list, and website to maximize visibility.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Follow Up After the Giveaway',
                    description: 'Send a welcome sequence to new subscribers and provide value beyond the giveaway to build a lasting relationship.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )
                  }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start transition-all duration-500 hover:bg-blue-50 p-4 rounded-xl -mx-4 hover:border-blue-100 border border-transparent">
                    <div className="flex-shrink-0 mr-4 bg-blue-50 rounded-lg p-3">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-neutral mb-2">{index + 1}. {tip.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                <p className="text-neutral-600 mb-4">
                  Ready to put these tips into action? Start creating your first giveaway today!
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-primary hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Create Your First Giveaway
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamplesPage;