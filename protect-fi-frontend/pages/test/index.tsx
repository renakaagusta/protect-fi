import React from 'react';
import { Shield, Link, Users, Wallet, ArrowRight, ChevronDown, Scale, FileCheck, Building } from 'lucide-react';

const LandingPage = () => {
  return (
    <section className="relative bg-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Trusted By Section */}
      <div className="text-center mb-12">
        <h4 className="text-sm tracking-wide text-gray-400 uppercase">
          Trusted by teams from around the world
        </h4>
        <div className="flex justify-center mt-4 space-x-8">
          <img src="/logos/google.png" alt="Google" className="h-6" />
          <img src="/logos/microsoft.png" alt="Microsoft" className="h-6" />
          <img src="/logos/github.png" alt="GitHub" className="h-6" />
          <img src="/logos/uber.png" alt="Uber" className="h-6" />
          <img src="/logos/notion.png" alt="Notion" className="h-6" />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Simple pricing for everyone.</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Choose an <span className="text-white font-medium">affordable plan</span> thats packed
          with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
      </div>
      
      {/* Background Accent */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent h-64" />
    </section>
  );
};

export default LandingPage;