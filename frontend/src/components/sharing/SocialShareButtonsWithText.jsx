import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * SocialShareButtonsWithText - A reusable component for social media sharing with text labels
 * 
 * @param {Object} props
 * @param {string} props.url - The URL to share (required)
 * @param {string} props.title - The title to use in shares (required)
 * @param {string} [props.description] - Description for platforms that support it
 * @param {string} [props.hashtags] - Comma-separated hashtags
 * @param {Object} [props.platforms] - Object with boolean values for each platform (facebook, twitter, linkedin, etc.)
 * @param {string} [props.size] - Size of the buttons ('sm', 'md', 'lg')
 * @param {Function} [props.onShare] - Callback when share is initiated
 * @param {boolean} [props.showCopyLink] - Whether to show a "Copy Link" button
 * @param {string} [props.className] - Additional classes for the container
 */
const SocialShareButtonsWithText = ({
  url, 
  title,
  description = '',
  hashtags = '',
  platforms = {
    facebook: true,
    twitter: true,
    linkedin: true,
    whatsapp: false,
    telegram: false,
    pinterest: false,
    email: false,
  },
  size = 'md',
  onShare = null,
  showCopyLink = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  // Normalize URL (ensure it's properly encoded)
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);
  const shareHashtags = encodeURIComponent(hashtags);

  // Size classes for the buttons
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm py-2 px-3';
      case 'lg':
        return 'text-lg py-3 px-5';
      case 'md':
      default:
        return 'text-base py-2.5 px-4';
    }
  };
  
  const sizeClasses = getSizeClasses();

  // Button base classes
  const buttonClasses = `
    flex items-center justify-center gap-2 rounded-lg transition-all duration-300
    hover:shadow-md font-medium ${sizeClasses} w-full
  `;

  const handleShare = (platform) => {
    if (onShare) {
      onShare(platform);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Social media sharing URLs
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}${hashtags ? `&hashtags=${shareHashtags}` : ''}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareDescription}&media=`,
    email: `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`,
  };

  return (
    <div className={`social-share-buttons grid grid-cols-1 sm:grid-cols-2 gap-2 ${className}`}>
      {platforms.facebook && (
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('facebook')}
          className={`${buttonClasses} bg-[#1877F2] text-white hover:bg-[#0E65D9]`}
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          <span>Share on Facebook</span>
        </a>
      )}

      {platforms.twitter && (
        <a
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('twitter')}
          className={`${buttonClasses} bg-[#1DA1F2] text-white hover:bg-[#0C90DA]`}
          aria-label="Share on Twitter"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          <span>Share on Twitter</span>
        </a>
      )}

      {platforms.linkedin && (
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('linkedin')}
          className={`${buttonClasses} bg-[#0A66C2] text-white hover:bg-[#0952A0]`}
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span>Share on LinkedIn</span>
        </a>
      )}

      {platforms.whatsapp && (
        <a
          href={socialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('whatsapp')}
          className={`${buttonClasses} bg-[#25D366] text-white hover:bg-[#1da851]`}
          aria-label="Share on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>Share on WhatsApp</span>
        </a>
      )}

      {platforms.telegram && (
        <a
          href={socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('telegram')}
          className={`${buttonClasses} bg-[#0088cc] text-white hover:bg-[#0077b3]`}
          aria-label="Share on Telegram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <span>Share on Telegram</span>
        </a>
      )}

      {platforms.pinterest && (
        <a
          href={socialLinks.pinterest}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('pinterest')}
          className={`${buttonClasses} bg-[#E60023] text-white hover:bg-[#d00020]`}
          aria-label="Share on Pinterest"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
          <span>Share on Pinterest</span>
        </a>
      )}

      {platforms.email && (
        <a
          href={socialLinks.email}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare('email')}
          className={`${buttonClasses} bg-gray-600 text-white hover:bg-gray-700`}
          aria-label="Share via Email"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
          <span>Share via Email</span>
        </a>
      )}

      {showCopyLink && (
        <button
          onClick={copyLink}
          className={`${buttonClasses} bg-gray-200 hover:bg-gray-300 text-gray-800`}
          aria-label="Copy Link"
        >
          {copied ? (
            <>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-600">Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Link</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

SocialShareButtonsWithText.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  hashtags: PropTypes.string,
  platforms: PropTypes.shape({
    facebook: PropTypes.bool,
    twitter: PropTypes.bool,
    linkedin: PropTypes.bool,
    whatsapp: PropTypes.bool,
    telegram: PropTypes.bool,
    pinterest: PropTypes.bool,
    email: PropTypes.bool,
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onShare: PropTypes.func,
  showCopyLink: PropTypes.bool,
  className: PropTypes.string,
};

export default SocialShareButtonsWithText;