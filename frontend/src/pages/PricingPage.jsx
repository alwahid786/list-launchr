import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ContactForm from '../components/global/ContactForm';

const PricingPage = () => {
  const { currentUser, isPro } = useAuth();
  const [isVisible, setIsVisible] = useState({
    header: false,
    pricing: false,
    comparison: false,
    testimonials: false,
    faq: false,
    cta: false
  });
  const [openFaq, setOpenFaq] = useState(null);

  const headerRef = useRef(null);
  const pricingRef = useRef(null);
  const comparisonRef = useRef(null);
  const testimonialsRef = useRef(null);
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
    
    if (headerRef.current) observer.observe(headerRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);
    if (comparisonRef.current) observer.observe(comparisonRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (faqRef.current) observer.observe(faqRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
      if (comparisonRef.current) observer.unobserve(comparisonRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (faqRef.current) observer.unobserve(faqRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  // Plan data
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      description: 'Great for testing things out or running a small launch. Collects emails but with limited customization.',
      price: '$0',
      period: '/mo',
      color: 'gray',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: {
        campaignCreation: 'DIY builder',
        entryMethods: 'Basic only',
        giveawayLandingPage: 'LL-branded only',
        couponCodeReveal: false,
        emailIntegrations: 'CSV download only',
        adCampaigns: false,
        monthlyNewsletter: false,
        monthlyReporting: false,
        support: 'Help Center Only'
      },
      cta: 'Get Started Free',
      ctaLink: '/register'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Unlocks all platform features so you can run professional, branded giveaways and grow your audience fast.',
      price: '$29',
      period: '/mo',
      color: 'blue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: {
        campaignCreation: 'DIY builder',
        entryMethods: 'All unlocked',
        giveawayLandingPage: 'Branded + customized',
        couponCodeReveal: true,
        emailIntegrations: 'Mailchimp, MailerLite, ConvertKit, etc.',
        adCampaigns: false,
        monthlyNewsletter: 'Optional via DIY',
        monthlyReporting: 'Real-time dashboard',
        support: 'Priority Support'
      },
      cta: 'Upgrade to Pro',
      ctaLink: '/dashboard/upgrade',
      testimonial: {
        content: "Pro plan helped me launch 5 successful campaigns last month. The custom branding made all the difference!",
        author: "Sarah M.",
        role: "Author & Creator"
      }
    },
    {
      id: 'local',
      name: 'Local Pro+ Plan',
      description: 'We do it all for you. Perfect for local businesses that want results without the tech or time commitment.',
      price: 'Custom Quote',
      period: '',
      color: 'purple',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      features: {
        campaignCreation: 'Fully managed by us',
        entryMethods: 'All unlocked',
        giveawayLandingPage: 'Custom & fully managed',
        couponCodeReveal: true,
        emailIntegrations: 'Full setup + sync',
        adCampaigns: 'Done-for-you, targeted ads',
        monthlyNewsletter: 'Written & sent for you',
        monthlyReporting: 'Full reporting provided',
        support: 'Dedicated Support Team'
      },
      cta: 'Ask About Local Pro+',
      ctaLink: '/contact',
      testimonial: {
        content: "Local Pro+ saved me 20 hours a week and brought in 50 new leads this month. Worth every penny!",
        author: "Mike R.",
        role: "Local HVAC Business"
      }
    }
  ];

  // Feature comparison data
  const comparisonFeatures = [
    { name: 'Campaign Creation', key: 'campaignCreation' },
    { name: 'Entry Methods', key: 'entryMethods' },
    { name: 'Giveaway Landing Page', key: 'giveawayLandingPage' },
    { name: 'Coupon Code Reveal', key: 'couponCodeReveal' },
    { name: 'Email Integrations', key: 'emailIntegrations' },
    { name: 'Ad Campaigns', key: 'adCampaigns' },
    { name: 'Monthly Newsletter Emails', key: 'monthlyNewsletter' },
    { name: 'Monthly Reporting', key: 'monthlyReporting' },
    { name: 'Support', key: 'support' }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you\'ll be charged pro-rated amounts.'
    },
    {
      question: 'What\'s included in the Local Pro+ custom quote?',
      answer: 'Local Pro+ pricing depends on your needs - campaign frequency, ad spend, list size, and additional services. Most businesses invest $500-2000/month for full-service campaign management.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel anytime from your dashboard. You\'ll continue to have access to features until the end of your billing period.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for convenient monthly or annual billing.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for Free or Pro plans. Local Pro+ may include a one-time setup fee depending on the complexity of your campaigns.'
    }
  ];

  const getColorClasses = (color, variant = 'primary') => {
    const colors = {
      gray: {
        primary: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        button: 'bg-gray-600 hover:bg-gray-700',
        accent: 'bg-gray-100'
      },
      blue: {
        primary: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        accent: 'bg-blue-100'
      },
      purple: {
        primary: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700',
        accent: 'bg-purple-100'
      }
    };
    return colors[color]?.[variant] || colors.gray[variant];
  };

  return (
    <div className="pt-24 bg-gray-50">
      {/* Header Section */}
      <section
        ref={headerRef}
        data-section="header"
        className="relative overflow-hidden py-20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl"></div>
          <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-accent opacity-10 blur-3xl"></div>
        </div>

        <div className="relative container px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <div className={`transition-all duration-1000 ${isVisible.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">Pricing Plans</span>
            <h1 className="mt-6 text-4xl font-headline font-extrabold text-neutral sm:text-5xl md:text-6xl">
              Plans That <span className="text-primary">Grow With You</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-neutral-600 mx-auto">
              Whether you're just getting started or need a team to do it for you, there's a ListLaunchr plan designed to fit your goals.
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
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-700 transform hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                } ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`p-8 ${getColorClasses(plan.color, 'bg')} border-b`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 ${getColorClasses(plan.color, 'accent')} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <div className={getColorClasses(plan.color, 'primary')}>
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">{plan.name}</h3>
                    <p className="text-neutral-600 text-sm mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-neutral">{plan.price}</span>
                      {plan.period && <span className="text-xl text-neutral-600">{plan.period}</span>}
                    </div>
                    <Link
                      to={plan.ctaLink}
                      className={`block w-full py-3 px-6 text-center font-medium rounded-full text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${getColorClasses(plan.color, 'button')}`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>

                {/* Testimonial for Pro and Local Pro+ */}
                {plan.testimonial && (
                  <div className="p-6 bg-gray-50 border-b">
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-neutral-700 text-sm italic mb-2">"{plan.testimonial.content}"</p>
                    <p className="text-neutral-600 text-xs font-medium">
                      {plan.testimonial.author} - {plan.testimonial.role}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section
        ref={comparisonRef}
        data-section="comparison"
        className="py-20 bg-white"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.comparison ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-headline font-extrabold text-neutral sm:text-4xl">
              Plan <span className="text-primary">Comparison</span>
            </h2>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              See exactly what's included in each plan
            </p>
          </div>

          <div className={`overflow-x-auto transition-all duration-1000 delay-300 ${isVisible.comparison ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-neutral-800 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-neutral-800 uppercase tracking-wider">
                    Free Plan
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-50">
                    Pro Plan
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-purple-600 uppercase tracking-wider bg-purple-50">
                    Local Pro+
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-semibold text-neutral-800">Price</td>
                  <td className="py-4 px-6 text-center text-neutral-600">$0/mo</td>
                  <td className="py-4 px-6 text-center font-medium text-neutral-800 bg-blue-50/50">$29/mo</td>
                  <td className="py-4 px-6 text-center font-medium text-neutral-800 bg-purple-50/50">Custom Quote</td>
                </tr>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 font-medium text-neutral-800">{feature.name}</td>
                    <td className="py-4 px-6 text-center text-sm">
                      {typeof plans[0].features[feature.key] === 'boolean' ? (
                        plans[0].features[feature.key] ? (
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-neutral-600">{plans[0].features[feature.key]}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-sm bg-blue-50/50">
                      {typeof plans[1].features[feature.key] === 'boolean' ? (
                        plans[1].features[feature.key] ? (
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="font-medium text-neutral-800">{plans[1].features[feature.key]}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-sm bg-purple-50/50">
                      {typeof plans[2].features[feature.key] === 'boolean' ? (
                        plans[2].features[feature.key] ? (
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="font-medium text-neutral-800">{plans[2].features[feature.key]}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Downsell Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible.comparison ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-neutral mb-4">Not quite ready for Local Pro+?</h3>
              <p className="text-lg text-neutral-600 mb-6">
                Try our Pro Plan first — it unlocks everything you need to run powerful local campaigns yourself, without the full service commitment.
              </p>
              <Link
                to="/dashboard/upgrade"
                className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start with Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        ref={faqRef}
        data-section="faq"
        className="py-24 bg-white"
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-headline font-extrabold text-neutral sm:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="mt-4 text-xl text-neutral-600 max-w-3xl mx-auto">
              Everything you need to know about our pricing plans
            </p>
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

      {/* CTA Section */}
      <section
        ref={ctaRef}
        data-section="cta"
        className="py-24 bg-gradient-to-br from-primary to-blue-700" id='launch'
      >
        <div className="container px-6 sm:px-8 md:px-12 lg:px-16">
          <div className={`text-center transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-headline font-extrabold text-white sm:text-4xl mb-6">
              Ready to Launch Your First Giveaway?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Choose the plan that fits your needs and start growing your audience today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="px-8 py-4 text-lg font-medium rounded-full bg-white text-primary hover:bg-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/dashboard/upgrade"
                className="px-8 py-4 text-lg font-medium rounded-full bg-blue-600 hover:bg-blue-800 text-white shadow-lg transition-all duration-300"
              >
                Upgrade to Pro
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 text-lg font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
              >
                Ask About Local Pro+
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ContactForm color="primary" />
    </div>
  );
};

export default PricingPage;