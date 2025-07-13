// Security configuration utilities
import helmet from 'helmet';

export const getSecurityConfig = (isDevelopment = false) => {
  const config = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net"
        ],
        scriptSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://checkout.stripe.com",
          "https://maps.googleapis.com",
          ...(isDevelopment ? ["'unsafe-eval'"] : [])
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:"
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://checkout.stripe.com",
          "https://emailjs.com",
          "https://api.emailjs.com",
          ...(isDevelopment ? ["ws:", "wss:"] : [])
        ],
        frameSrc: [
          "https://js.stripe.com",
          "https://checkout.stripe.com"
        ],
        objectSrc: ["'none'"]
      },
      ...(isDevelopment ? {} : { upgradeInsecureRequests: [] })
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  };

  return config;
};

export const setupSecurityMiddleware = (app, isDevelopment = false) => {
  const securityConfig = getSecurityConfig(isDevelopment);
  
  app.use(helmet(securityConfig));
  
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    next();
  });
};

export const inputValidation = {
  sanitizeEmail: (email) => {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim().slice(0, 254);
  },
  
  sanitizeString: (str, maxLength = 255) => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength).replace(/[<>]/g, '');
  },
  
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  validatePhone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },
  
  validateAmount: (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num < 1000000;
  }
}; 