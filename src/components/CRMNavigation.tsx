
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu as MenuIcon,
  Home,
  User,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCRM } from '@/context/CRMContext';
import { useCart } from '@/context/CartContext';

export const CRMNavigation = () => {
  const navigate = useNavigate();
  const { currentCustomer } = useCRM();
  const { itemCount } = useCart();
  
  return (
    <div className="bg-[#CA3F3F] text-white py-3 px-4 sm:px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Link to="/" className="text-white font-bold text-lg">Thai Cookery</Link>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/profile')}
          >
            <User size={18} className="mr-2" />
            {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Profile'}
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/support')}
          >
            <HelpCircle size={18} className="mr-2" />
            Support
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag size={18} className="mr-2" />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#CA3F3F] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            className="p-1 text-white hover:bg-white/10 relative mr-2"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#CA3F3F] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-1 text-white hover:bg-white/10">
                <MenuIcon size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-0">
              <div className="flex flex-col h-full">
                <div className="bg-[#CA3F3F] text-white p-4">
                  <h2 className="font-bold text-xl">Thai Cookery</h2>
                  {currentCustomer && (
                    <p className="text-sm opacity-80 mt-1">Hello, {currentCustomer.name}</p>
                  )}
                </div>
                
                <div className="p-4 flex flex-col gap-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/')}
                  >
                    <Home size={18} className="mr-2" />
                    Home
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/profile')}
                  >
                    <User size={18} className="mr-2" />
                    Profile
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/support')}
                  >
                    <HelpCircle size={18} className="mr-2" />
                    Support
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
