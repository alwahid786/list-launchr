import { Link } from 'react-router-dom';

// Full width footer that breaks out of any container constraints
const Footer = () => {
  // Use position absolute and negative margins to break out
  return (
<footer className="bg-neutral text-white w-full">
  {/* Main Footer Section */}
  <div className="border-b border-white/10">
    <div className="mx-auto max-w-[2000px] px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Brand & Intro */}
        <div className="lg:w-2/5">
          <Link to="/" className="inline-block mb-6">
            <h3 className="text-2xl sm:text-3xl font-headline font-extrabold">
              List<span className="text-accent">Launchr</span>
            </h3>
          </Link>
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
            Grow your email list and following with our powerful, share-driven giveaway campaigns. 
            Turn every subscriber into a promoter and watch your audience grow virally.
          </p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16 flex-1">
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">Company</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Examples', path: '/examples' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-accent transition-all duration-200 flex items-center group text-sm sm:text-base"
                  >
                    <span className="h-0.5 w-0 bg-accent mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    <span className='whitespace-nowrap'>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rounded-xl border border-primary/20 w-full lg:max-w-sm">
          <h4 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">Get weekly growth tips</h4>
          <p className="text-gray-300 text-sm sm:text-base mb-4">Join 25,000+ marketers receiving our weekly insights.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 sm:py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm sm:text-base"
            />
            <button className="whitespace-nowrap px-5 sm:px-6 py-2.5 sm:py-3 bg-accent hover:bg-accent/90 text-neutral font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Section */}
  <div>
    <div className="mx-auto max-w-[2000px] px-4 sm:px-6 md:px-12 lg:px-16 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} ListLaunchr. All rights reserved.
        </p>

        {/* Socials */}
        <div className="flex gap-4 sm:gap-5">
          {[
            { name: 'Twitter', url: 'https://twitter.com', icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 ..."/></svg> },
            { name: 'Facebook', url: 'https://facebook.com', icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523 ..."/></svg> },
            { name: 'Instagram', url: 'https://instagram.com', icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12.315 2c2.43 ..."/></svg> },
            { name: 'LinkedIn', url: 'https://linkedin.com', icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 ..."/></svg> },
          ].map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="group"
            >
              <div className="p-2 text-gray-400 hover:text-accent hover:bg-white/5 rounded-full transition-all duration-300">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
</footer>

  );
};

export default Footer;