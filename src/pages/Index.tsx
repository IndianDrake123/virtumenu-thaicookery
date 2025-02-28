
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Award, Sparkles } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title="VirtuMenu" showHeader={true}>
      <div className={`space-y-8 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Hero Section */}
        <section className="py-8">
          <div className="premium-card p-8 bg-card-gradient">
            <span className="badge-accent mb-2">Revolutionary</span>
            <h1 className="text-3xl font-bold mb-3 text-virtumenu-900">
              Transform Your Dining Experience
            </h1>
            <p className="text-virtumenu-600 mb-6 leading-relaxed">
              Explore BCD Tofu House's menu with our innovative digital platform. 
              Order with ease, get personalized recommendations.
            </p>
            <Link to="/menu">
              <Button className="btn-primary mt-2 flex items-center">
                Explore Menu
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-virtumenu-900 mb-1">Why VirtuMenu?</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="premium-card p-6 flex items-start">
              <div className="mr-4 p-3 rounded-full bg-virtumenu-100 text-virtumenu-800">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="font-medium text-virtumenu-900 mb-1">Save Time</h3>
                <p className="text-sm text-virtumenu-600">
                  Digital ordering reduces wait times and streamlines your dining experience.
                </p>
              </div>
            </div>

            <div className="premium-card p-6 flex items-start">
              <div className="mr-4 p-3 rounded-full bg-virtumenu-100 text-virtumenu-800">
                <Award size={22} />
              </div>
              <div>
                <h3 className="font-medium text-virtumenu-900 mb-1">Personalized Experience</h3>
                <p className="text-sm text-virtumenu-600">
                  Get AI-powered recommendations based on your preferences and past orders.
                </p>
              </div>
            </div>

            <div className="premium-card p-6 flex items-start">
              <div className="mr-4 p-3 rounded-full bg-virtumenu-100 text-virtumenu-800">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="font-medium text-virtumenu-900 mb-1">Seamless Payment</h3>
                <p className="text-sm text-virtumenu-600">
                  Pay directly from your device with multiple payment options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="pb-4">
          <h2 className="text-xl font-semibold text-virtumenu-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/menu" className="no-underline">
              <div className="premium-card p-6 text-center hover:bg-virtumenu-50 transition-colors">
                <UtensilsCrossedIcon className="mx-auto mb-3 text-virtumenu-800" />
                <h3 className="font-medium text-virtumenu-800">Menu</h3>
              </div>
            </Link>
            
            <Link to="/chatbot" className="no-underline">
              <div className="premium-card p-6 text-center hover:bg-virtumenu-50 transition-colors">
                <MessageSquareIcon className="mx-auto mb-3 text-virtumenu-800" />
                <h3 className="font-medium text-virtumenu-800">AI Assistant</h3>
              </div>
            </Link>
            
            <Link to="/payment" className="no-underline">
              <div className="premium-card p-6 text-center hover:bg-virtumenu-50 transition-colors">
                <CreditCardIcon className="mx-auto mb-3 text-virtumenu-800" />
                <h3 className="font-medium text-virtumenu-800">Payment</h3>
              </div>
            </Link>
            
            <div className="premium-card p-6 text-center hover:bg-virtumenu-50 transition-colors cursor-not-allowed opacity-70">
              <UsersIcon className="mx-auto mb-3 text-virtumenu-800" />
              <h3 className="font-medium text-virtumenu-800">Share Table</h3>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Icons
const UtensilsCrossedIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
    <path d="m2.1 21.8 6.4-6.3" />
    <path d="m19 5-7 7" />
  </svg>
);

const MessageSquareIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CreditCardIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const UsersIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Index;
