import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Import here to avoid circular dependencies
      const emailService = await import('../utils/emailService');
      
      // Initialize EmailJS with improved error handling
      try {
        emailService.initEmailService();
      } catch (initError) {
        console.error('EmailJS initialization failed:', initError);
        throw new Error('Failed to initialize email service. Please try again later.');
      }
      
      // Send the email with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 2;
      let emailjsError = null;
      
      // Try primary email service (EmailJS)
      while (retryCount <= maxRetries) {
        result = await emailService.sendContactEmail(formData);
        
        if (result.success) {
          break; // Success, exit the retry loop
        }
        
        // If failed, retry up to maxRetries times
        retryCount++;
        emailjsError = result.error;
        
        if (retryCount <= maxRetries) {
          console.log(`Retrying email send (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }
      
      // If EmailJS failed after all retries, try the fallback service
      if (!result?.success) {
        console.warn('EmailJS failed after multiple attempts. Trying fallback service...');
        
        try {
          const fallbackEmailService = await import('../utils/fallbackEmailService');
          result = await fallbackEmailService.sendContactEmailFallback(formData);
          
          if (!result.success) {
            // Both primary and fallback methods failed
            throw new Error(`Failed to send message using both primary and fallback methods. Primary error: ${
              emailjsError instanceof Error ? emailjsError.message : 'Unknown error'
            }. Fallback error: ${
              result.error instanceof Error ? result.error.message : 'Unknown error'
            }`);
          }
          
          // If we got here, the fallback succeeded
          console.log('Fallback email service succeeded!');
        } catch (fallbackError) {
          console.error('Fallback email service failed:', fallbackError);
          throw new Error('All email sending methods failed. Please try again later.');
        }
      }
      
      // Successful submission - update UI
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Reset submission state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Failed to submit form:', err);
      // Detailed error logging to help diagnose the issue
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const supportEmail = 'support@keysncaps.com';
      
      // Create a direct mailto: link as a last resort
      const mailtoSubject = encodeURIComponent(formData.subject || 'Contact Form');
      const mailtoBody = encodeURIComponent(`Message from: ${formData.name} (${formData.email})\n\n${formData.message}`);
      const mailtoLink = `mailto:${supportEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      setError(
        <div>
          Failed to send your message. Please try: <br />
          <ul className="list-disc ml-5 mt-2">
            <li>Refreshing the page and trying again</li>
            <li>
              <a 
                href={mailtoLink} 
                className="text-primary underline hover:text-primary-dark"                onClick={() => {
                  // Wait a moment to ensure the link opens
                  setTimeout(() => {
                    setError(`If your email client didn't open, please manually send an email to ${supportEmail}`);
                  }, 500);
                }}
              >
                Click here to open your email client
              </a>
            </li>
            <li>Manually sending an email to {supportEmail}</li>
          </ul>
          <div className="mt-2">Error details: {errorMessage}</div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pt-40 pb-16 bg-background min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8 text-dark">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-light rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-medium mb-6 text-dark">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-dark">Our Location</h3>
                    <p className="mt-1 text-dark/70">
                      Zagreb, Croatia<br />
                      10000 Zagreb<br />
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-dark">Email Us</h3>
                    <p className="mt-1 text-dark/70">
                      info@keysncaps.com<br />
                      support@keysncaps.com
                      returns@keysncaps.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-dark">Call Us</h3>
                    <p className="mt-1 text-dark/70">
                      +385 99 469 7603<br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-light rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-medium mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="bg-success bg-opacity-10 border border-success rounded-md p-6 animate-fade-in">
                  <div className="flex items-center text-success mb-4">
                    <Send className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-medium">Message Sent!</h3>
                  </div>
                  <p>
                    Thank you for contacting us. We have received your message and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-dark mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Information</option>
                      <option value="support">Technical Support</option>
                      <option value="return">Return/Refund</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-dark mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="btn-primary flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'} <Send className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;