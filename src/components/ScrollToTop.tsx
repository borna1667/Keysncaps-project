import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top when the route changes.
 * This component doesn't render anything visible - it just performs the scroll reset effect.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Immediate scrolling without animation
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
