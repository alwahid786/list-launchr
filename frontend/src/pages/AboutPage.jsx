import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/global/ContactForm';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    whyStarted: false,
    whoFor: false,
    values: false,
    cta: false
  });
  
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const whyStartedRef = useRef(null);
  const whoForRef = useRef(null);
  const valuesRef = useRef(null);
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
    
    [heroRef, missionRef, whyStartedRef, whoForRef, valuesRef, ctaRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [heroRef, missionRef, whyStartedRef, whoForRef, valuesRef, ctaRef].forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const values = [
    {
      title: 'Simplicity',
      description: 'We remove friction, not create more.'
    },
    {
      title: 'Results',
      description: 'Vanity metrics don\'t matter — conversions do.'
    },
    {
      title: 'Support',
      description: 'Real help from people who\'ve done this before.'
    },
    {
      title: 'Ownership',
      description: 'Your list. Your data. Your business.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        data-section="hero"
        className={`py-20 sm:py-32 bg-gradient-to-br from-purple-50 to-white transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-neutral mb-6">
              Built for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">Creators</span>.
              <br />
              Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">Entrepreneurs</span>.
              <br />
              Powered by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary">Results</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We help you build and own your audience, one email at a time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary text-white font-medium rounded-full hover:opacity-90 transition-all transform hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/demo" 
                className="px-8 py-3 border-2 border-primary text-primary font-medium rounded-full hover:bg-purple-50 transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        ref={missionRef}
        data-section="mission"
        className={`py-20 transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="text-primary text-sm font-medium">Our Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-neutral mb-6">
              We help creators and small businesses grow by giving them the one thing that changes everything: <span className="text-primary">ownership of their audience</span>.
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-6">
                ListLaunchr was built to solve a common (and frustrating) problem: growing an email list shouldn't be complicated, expensive, or dependent on social media algorithms.
              </p>
              <p>
                We believe your audience shouldn't belong to Facebook, Amazon, or Instagram — it should belong to you. That's why we made it simple to launch viral campaigns that build your list, increase your reach, and drive real engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Started */}
      <section 
        ref={whyStartedRef}
        data-section="whyStarted"
        className={`py-20 bg-gray-50 transition-all duration-1000 ${isVisible.whyStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="text-primary text-sm font-medium">Our Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-neutral mb-6">
              We've launched books, sold products, and run brands — and we were tired of expensive tools and slow list growth.
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                We created ListLaunchr to give ourselves the tool we wish existed: easy campaign creation, shareable giveaways, email capture that actually works, and the ability to promote to the right audience — whether you're an author, Etsy seller, local business, or influencer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We're For */}
      <section 
        ref={whoForRef}
        data-section="whoFor"
        className={`py-20 transition-all duration-1000 ${isVisible.whoFor ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="text-primary text-sm font-medium">Who We're For</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-neutral mb-12">
              Built for creators, entrepreneurs, and businesses of all sizes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Authors & Content Creators</h3>
                <p className="text-gray-600">Build launch teams, grow your reader community, and sell more books with targeted campaigns.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🛍</div>
                <h3 className="text-xl font-bold mb-2">E-commerce Sellers</h3>
                <p className="text-gray-600">Turn one-time buyers into repeat customers with automated email sequences and exclusive offers.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-bold mb-2">Influencers & Coaches</h3>
                <p className="text-gray-600">Monetize your audience with lead magnets, digital products, and premium content.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold mb-2">Local Businesses</h3>
                <p className="text-gray-600">Attract local customers, fill your calendar, and build loyalty with automated follow-ups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section 
        ref={valuesRef}
        data-section="values"
        className={`py-20 bg-purple-50 transition-all duration-1000 ${isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-purple-100 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="text-primary text-sm font-medium">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-neutral mb-12">
              What guides everything we do
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl border border-purple-100 hover:shadow-md transition-all"
                >
                  <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        data-section="cta"
        className={`py-20 bg-gradient-to-r from-primary to-primary text-white transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold mb-6">
              Ready to grow your audience?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of creators and businesses building their email lists with ListLaunchr.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="px-8 py-3 bg-white text-primary font-medium rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/demo" 
                className="px-8 py-3 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;