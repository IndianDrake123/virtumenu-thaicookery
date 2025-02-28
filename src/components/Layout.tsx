
import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";
import NavigationBar from "./NavigationBar";
import ChatbotButton from "./ChatbotButton";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  title?: string;
  showBackButton?: boolean;
  showChatbot?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showNavigation = true,
  title,
  showBackButton = true,
  showChatbot = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate a slight loading delay for the animation to be visible
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && <Header title={title} showBackButton={showBackButton} />}
      
      <main 
        className={`flex-1 px-4 pb-24 pt-4 transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </main>
      
      {showChatbot && <ChatbotButton />}
      {showNavigation && <NavigationBar />}
    </div>
  );
};

export default Layout;
