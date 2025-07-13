import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="relative pt-32 pb-24 bg-gradient-to-br from-background via-white to-secondary min-h-screen overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Please read these terms and conditions carefully before using Keys 'n' Caps.</p>
        </div>
        <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 animate-fade-in max-w-3xl mx-auto text-gray-700 text-lg space-y-8">
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">1. General</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>By using our website and placing an order, you agree to these terms and conditions.</li>
              <li>We reserve the right to update these terms at any time. Changes will be posted on this page.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">2. Orders & Payment</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All orders are subject to acceptance and availability.</li>
              <li>Prices are listed in EUR and include VAT where applicable.</li>
              <li>Payment is processed securely via trusted providers. We do not store your payment details.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">3. Shipping</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We ship to most European countries and internationally. Delivery times are estimates and may vary.</li>
              <li>Shipping costs are calculated at checkout. Customs duties for non-EU orders are the buyer's responsibility.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">4. Returns & Refunds</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You may return unused products within 30 days for a refund or exchange. See our <a href="/shipping-returns" className="text-primary underline hover:text-accent">Shipping & Returns</a> page for details.</li>
              <li>Refunds are processed after inspection of returned items.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">5. Warranty</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All products are covered by a standard 2-year warranty against manufacturing defects, unless otherwise stated.</li>
              <li>Warranty does not cover accidental damage, misuse, or normal wear and tear.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-heading font-semibold text-primary mb-2">6. Contact</h2>
            <p>For questions or support, please <a href="/contact" className="text-primary underline hover:text-accent">contact us</a> or email <a href="mailto:support@keysncaps.com" className="text-primary underline hover:text-accent">support@keysncaps.com</a>.</p>
          </section>
          <div className="mt-8 text-center text-sm text-gray-500">Last updated: May 2025</div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
