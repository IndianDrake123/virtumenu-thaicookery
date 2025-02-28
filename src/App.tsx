
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { CRMProvider } from "@/context/CRMContext";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Category from "./pages/Category";
import ItemDetail from "./pages/ItemDetail";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import AboutRestaurant from "./pages/AboutRestaurant";
import CustomerProfile from "./pages/CustomerProfile";
import SupportHistory from "./pages/SupportHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <CRMProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/about" element={<AboutRestaurant />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/support" element={<SupportHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </CRMProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
