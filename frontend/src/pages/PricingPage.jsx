import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PricingPage = () => {
  const { currentUser, isPro } = useAuth();
  const [annualBilling, setAnnualBilling] = useState(true);
  const [isVisible, setIsVisible] = useState({
    header: false,
    pricing: false,
    enterprise: false,
    faq: false
  });

  const headerRef = useRef(null);
  const pricingRef = useRef(null);
  const enterpriseRef = useRef(null);
  const faqRef = useRef(null);

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
    if (pricingRef.current) observer.observe(pricingRef.current);
    if (enterpriseRef.current) observer.observe(enterpriseRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    
    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
      if (enterpriseRef.current) observer.unobserve(enterpriseRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
    };
  }, []);

  const features = {
    free: [
      'One active campaign',
      '500 max entries',
      'Basic entry methods (email opt-in)',
      'Share to earn entries',
      'ListLaunchr branding on giveaways',
      'Standard support',
    ],
    pro: [
      'Unlimited campaigns',
      '10,000 entries per campaign',
      'All entry methods unlocked',
      'Customizable design & branding',
      'No ListLaunchr branding',
      'Integrations with email platforms',
      'Advanced analytics & reporting',
      'Priority support',
    ],
  };

  const comparisons = [
    { title: 'Number of Campaigns', free: '1', pro: 'Unlimited' },
    { title: 'Entries per Campaign', free: '500', pro: '10,000' },
    { title: 'Custom Branding', free: 'Limited', pro: 'Full Control' },
    { title: 'Email Integrations', free: 'Basic', pro: '20+ Platforms' },
    { title: 'Analytics', free: 'Basic', pro: 'Advanced' },
    { title: 'Support', free: 'Email', pro: 'Priority' }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Can I upgrade anytime?',
      answer: 'Yes, you can upgrade to the Pro plan at any time. Your new features will be available immediately.'
    },
    {
      question: 'What happens when I reach my entry limit?',
      answer: 'Your giveaway will continue to run, but new entries won\'t be accepted until you upgrade your plan or until the next billing cycle.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day money-back guarantee. If you\'re not satisfied with our service, contact us for a full refund.'
    },
    {
      question: 'Can I export my email list?',
      answer: 'Yes, you can export your collected emails at any time in CSV format. This feature is available on both Free and Pro plans.'
    },
    {
      question: 'How do I select winners?',
      answer: 'Our platform includes a random winner selection tool that ensures fair and transparent picking of winners based on valid entries.'
    }
  ];

  return (
    <div className="pt-24 bg-gray-50">
      {/* Pricing Header */}
      <section
        ref={headerRef}
        data-section="header"
        className="relative overflow-hidden py-20"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl"></div>
          <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent opacity-10 blur-3xl"></div>
        </div>

        <div className="relative container px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <div className={`transition-all duration-1000 ${isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Pricing Plans</span>
            <h1 className="mt-6 text-4xl font-headline font-extrabold text-neutral sm:text-5xl md:text-6xl">
              Grow Your Business with <span className="text-primary">ListLaunchr</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-neutral-600 mx-auto">
              Choose the plan that's right for your growing business. No hidden fees or surprises.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Cards */}
      <section
        ref={pricingRef}
        data-section="pricing"
        className="py-20"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-extrabold text-neutral mb-2">
              Select Your <span className="text-primary">Plan</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              Choose the billing option that works best for you
            </p>
          </div>
          <div className={`flex justify-center mb-12 transition-all duration-700 delay-100 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative bg-gray-50 rounded-full inline-flex p-1.5 border border-gray-200 shadow-inner">
              <button
                onClick={() => setAnnualBilling(true)}
                className={`${
                  annualBilling 
                    ? 'text-white bg-primary shadow-md hover:bg-blue-700 hover:text-white' 
                    : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                } group relative py-2.5 px-6 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none`}
              >
                Annual
                <span className="absolute -top-3 right-0 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold shadow-md animate-pulse">
                  Save 20%
                </span>
                {!annualBilling && (
                  <span className="absolute inset-0 bg-primary rounded-full opacity-0 transform scale-0 group-hover:opacity-10 group-hover:scale-100 transition-all duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setAnnualBilling(false)}
                className={`${
                  !annualBilling 
                    ? 'text-white bg-primary shadow-md hover:bg-blue-700 hover:text-white' 
                    : 'text-neutral-600 hover:text-primary hover:bg-gray-100'
                } group relative py-2.5 px-6 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none`}
              >
                Monthly
                {annualBilling && (
                  <span className="absolute inset-0 bg-primary rounded-full opacity-0 transform scale-0 group-hover:opacity-10 group-hover:scale-100 transition-all duration-300"></span>
                )}
              </button>
            </div>
          </div>
          <div className="md:flex md:space-x-12 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div 
              className={`flex-1 mb-8 md:mb-0 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-500 transform hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 ${
                isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="p-8 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral">Free Plan</h2>
                  <p className="mt-1 text-neutral-600">Perfect for just getting started</p>
                </div>
                <div className="mt-6 flex items-baseline justify-center">
                  <p className="text-5xl font-bold text-primary">$0</p>
                  <span className="ml-1 text-xl font-normal text-neutral-600">/mo</span>
                </div>
                <p className="mt-1 text-sm text-neutral-600 text-center">Free forever, no credit card required</p>
                <div className="mt-8">
                  {currentUser ? (
                    isPro() ? (
                      <span className="inline-block w-full py-3 px-4 text-center text-sm font-medium text-neutral-600 bg-gray-100 rounded-full shadow-sm">
                        Current Plan
                      </span>
                    ) : (
                      <span className="inline-block w-full py-3 px-4 text-center text-sm font-medium text-primary bg-blue-50 rounded-full border border-blue-100 shadow-sm">
                        Your Current Plan
                      </span>
                    )
                  ) : (
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-sm font-medium text-neutral-600 uppercase tracking-wider mb-4 text-center">What's included:</h3>
                <ul className="space-y-4 mt-6">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div 
              className={`flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 relative transition-all duration-500 transform ${
                isVisible.pricing ? 'opacity-100' : 'opacity-0 translate-y-10'
              } hover:shadow-xl hover:-translate-y-1 hover:border-blue-200`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="p-8 border-b bg-gradient-to-r from-blue-50/50 to-white">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-primary">Pro Plan</h2>
                  <p className="mt-1 text-neutral-600">Recommended for businesses</p>
                </div>
                <div className="mt-6 flex items-baseline justify-center">
                  <p className="text-5xl font-bold text-primary">
                    ${annualBilling ? '8' : '9'}
                  </p>
                  <span className="ml-1 text-xl font-normal text-neutral-600">/mo</span>
                </div>
                <p className="mt-1 text-sm text-neutral-600 text-center">
                  {annualBilling ? 'Billed annually ($96/year)' : 'Billed monthly'}
                </p>
                <div className="mt-8">
                  {currentUser ? (
                    isPro() ? (
                      <span className="inline-block w-full py-3 px-4 text-center text-sm font-medium text-white bg-primary rounded-full shadow-md">
                        Your Current Plan
                      </span>
                    ) : (
                      <Link
                        to="/dashboard/upgrade"
                        className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        Upgrade Now
                      </Link>
                    )
                  ) : (
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-sm font-medium text-neutral-600 uppercase tracking-wider mb-4 text-center">What's included:</h3>
                <ul className="space-y-4 mt-6">
                  {features.pro.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-headline font-extrabold text-neutral">
              Compare <span className="text-primary">Plans</span>
            </h2>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              See which plan is right for your needs
            </p>
          </div>

          <div className={`overflow-x-auto transition-all duration-1000 delay-300 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-gray-50 text-left text-sm font-medium text-neutral-600 uppercase tracking-wider border-b">
                    Feature
                  </th>
                  <th className="py-4 px-6 bg-gray-50 text-center text-sm font-medium text-neutral-600 uppercase tracking-wider border-b w-1/4">
                    Free
                  </th>
                  <th className="py-4 px-6 bg-primary bg-opacity-10 text-center text-sm font-medium text-primary uppercase tracking-wider border-b w-1/4">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comparison, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 text-left text-sm font-medium text-neutral-800 border-b border-gray-100">
                      {comparison.title}
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-neutral-600 border-b border-gray-100">
                      {comparison.free}
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-medium text-neutral-800 border-b border-gray-100 bg-primary bg-opacity-5">
                      {comparison.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section
        ref={enterpriseRef}
        data-section="enterprise"
        className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`md:flex md:items-center md:justify-between md:space-x-12 transition-all duration-1000 ${isVisible.enterprise ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="md:w-1/2 mb-10 md:mb-0">
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm">Enterprise Solutions</span>
              <h2 className="mt-6 text-3xl font-headline font-extrabold text-white sm:text-4xl">
                Need a custom plan for your business?
              </h2>
              <p className="mt-4 text-xl text-white max-w-2xl font-medium">
                We offer custom solutions for high-volume users, agencies, and enterprise customers. Our team will work with you to create a plan that fits your specific needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-full shadow-lg text-base font-medium text-primary bg-white hover:bg-gray-50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Contact Sales
                </Link>
                <a 
                  href="mailto:enterprise@listlaunchr.com" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-full text-base font-medium text-white hover:bg-white/10 transition-all duration-300"
                >
                  Email Us
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Enterprise features include:</h3>
                <ul className="space-y-4">
                  {[
                    'Unlimited entries per campaign',
                    'White-label solution',
                    'Advanced API access',
                    'Custom integrations',
                    'Dedicated account manager',
                    '24/7 priority support',
                    'Custom analytics & reporting'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        data-section="faq"
        className="py-24 bg-gray-50"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Questions & Answers</span>
            <h2 className="mt-8 text-3xl font-headline font-extrabold text-neutral sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              Everything you need to know about our pricing plans and features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 transition-all duration-700 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="font-bold text-xl mb-4 text-neutral">{faq.question}</h3>
                <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Still have questions? We're here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-full shadow-md text-base font-medium text-white bg-primary hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className={`bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-12 text-center shadow-xl overflow-hidden relative transition-all duration-1000 delay-700 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Background Design Elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
              <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-accent blur-2xl"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-3xl font-headline font-extrabold text-white sm:text-4xl mb-6">
                Ready to Grow Your Email List?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                Start creating your first giveaway campaign today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 text-base font-medium rounded-full bg-white text-primary hover:bg-gray-50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/examples"
                  className="px-8 py-4 text-base font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300 shadow-md"
                >
                  View Examples
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;