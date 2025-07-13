import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="relative pt-32 pb-24 bg-gradient-to-br from-background via-white to-secondary min-h-screen overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl z-0 animate-pulse-light" />
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Your privacy matters to us. Here’s how we protect and use your information at Keys 'n' Caps.</p>
        </div>
        <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 animate-fade-in max-w-3xl mx-auto text-gray-700 text-lg space-y-8">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Personal details (name, address, email, etc.) provided during checkout or account creation.</li>
              <li>Order and payment information (securely processed via trusted payment providers).</li>
              <li>Browsing data (cookies, device info, analytics) to improve your experience.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and deliver your orders.</li>
              <li>To communicate order updates, offers, and support.</li>
              <li>To personalize your shopping experience and improve our website.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">3. Data Sharing & Security</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We never sell your data. We only share it with partners (like shipping carriers and payment processors) to fulfill your order.</li>
              <li>Your data is protected with industry-standard encryption and security practices.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">4. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You can request, update, or delete your personal data at any time.</li>
              <li>Contact us at <a href="mailto:support@keysncaps.com" className="text-primary underline hover:text-accent">support@keysncaps.com</a> for privacy requests.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">5. Cookies</h2>
            <p>We use cookies to remember your preferences, keep your cart active, and analyze site traffic. You can manage cookies in your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">6. Updates</h2>
            <p>We may update this policy as our services evolve. Major changes will be communicated on this page.</p>
          </section>
          <div className="mt-8 text-center text-sm text-gray-500">Last updated: May 2025</div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
