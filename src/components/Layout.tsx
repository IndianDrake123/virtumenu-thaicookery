
import React, { ReactNode, useState, useEffect } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  title,
  showBackButton = true,
  showSearch = true,
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
    <div className="min-h-screen flex flex-col bg-black">
      {showHeader && <Header title={title} showBackButton={showBackButton} />}
      
      <main 
        className={`flex-1 pt-2 transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
