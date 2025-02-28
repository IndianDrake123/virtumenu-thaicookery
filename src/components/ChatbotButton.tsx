
import React, { useState } from 'react';
import { MessageSquare, X, Search } from 'lucide-react';
import { menuCategories } from '@/data/menuData';

interface BotMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: 1, text: "Hello! I'm your Thai Cookery assistant. How can I help you today? You can ask me about dishes, ingredients, or nutrition info!", sender: "bot" }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { id: Date.now(), text: input, sender: "user" }]);
    const userQuery = input.toLowerCase();
    setInput('');

    // Handle different user queries
    setTimeout(() => {
      if (userQuery.includes('protein') || userQuery.includes('highest protein')) {
        handleProteinQuery();
      } else if (userQuery.includes('spanish') || userQuery === 'spanish') {
        handleSpanishQuery();
      } else if (userQuery.includes('spicy') || userQuery.includes('spiciest')) {
        handleSpicyQuery();
      } else if (userQuery.includes('vegetarian') || userQuery.includes('vegan')) {
        handleVegetarianQuery();
      } else if (userQuery.includes('gluten')) {
        handleGlutenFreeQuery();
      } else if (userQuery.includes('popular') || userQuery.includes('best seller')) {
        handlePopularQuery();
      } else {
        // Default responses
        const botResponses = [
          "Our menu offers a variety of authentic Thai dishes with the freshest ingredients.",
          "Our curries are a customer favorite and come in different spice levels to suit your taste.",
          "Pad Thai is our most popular noodle dish, made with traditional Thai recipe.",
          "All our dishes can be customized for your dietary preferences.",
          "Our chef recommends trying the Green Curry with chicken - it's a house specialty!"
        ];

        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            text: botResponses[Math.floor(Math.random() * botResponses.length)], 
            sender: "bot" 
          }
        ]);
      }
    }, 1000);
  };

  const handleProteinQuery = () => {
    // Sort all menu items by protein content
    const allItems = menuCategories.flatMap(category => category.items);
    const sortedByProtein = [...allItems]
      .filter(item => item.protein !== undefined)
      .sort((a, b) => (b.protein || 0) - (a.protein || 0))
      .slice(0, 5);

    const response = `Here are our highest protein dishes:\n\n${sortedByProtein.map((item, index) => 
      `${index + 1}. ${item.name} - ${item.protein}g protein`
    ).join('\n')}`;

    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
  };

  const handleSpicyQuery = () => {
    const spicyItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.spicy);

    const response = `Here are our spicy dishes that you might enjoy:\n\n${spicyItems.map((item, index) => 
      `${index + 1}. ${item.name}`
    ).join('\n')}\n\nYou can adjust the spice level for most dishes.`;

    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
  };

  const handleVegetarianQuery = () => {
    const vegItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.vegetarian);

    const response = `Here are our vegetarian options:\n\n${vegItems.map((item, index) => 
      `${index + 1}. ${item.name}`
    ).join('\n')}`;

    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
  };

  const handleGlutenFreeQuery = () => {
    const gfItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.glutenFree);

    const response = `Here are our gluten-free options:\n\n${gfItems.map((item, index) => 
      `${index + 1}. ${item.name}`
    ).join('\n')}`;

    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
  };

  const handlePopularQuery = () => {
    const popularItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.popular);

    const response = `Here are our most popular dishes:\n\n${popularItems.map((item, index) => 
      `${index + 1}. ${item.name}`
    ).join('\n')}`;

    setMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
  };

  const handleSpanishQuery = () => {
    const translations = {
      "Starters": "Entrantes",
      "Soups": "Sopas",
      "Curries": "Curry",
      "Noodles": "Fideos",
      "Rice Dishes": "Platos de Arroz",
      "Signature Specials": "Especialidades",
      "Desserts": "Postres",
      "Drinks": "Bebidas"
    };

    const spanishResponse = "¡Aquí está nuestro menú en español!\n\n" + 
      Object.entries(translations).map(([eng, spa]) => `${eng} → ${spa}`).join('\n');

    setMessages(prev => [...prev, { id: Date.now(), text: spanishResponse, sender: "bot" }]);
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-20 right-4 z-50 bg-[#CA3F3F] text-white rounded-full p-3 shadow-lg hover:opacity-90 transition-all"
        aria-label="Chat with us"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-72 sm:w-80 bg-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
          {/* Chat header */}
          <div className="bg-[#CA3F3F] text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">Thai Cookery Assistant</h3>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-gray-800">
            <div className="space-y-3">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`max-w-[85%] p-2 rounded-lg ${
                    msg.sender === 'bot' 
                      ? 'bg-gray-700 text-white rounded-tl-none ml-0 mr-auto' 
                      : 'bg-[#CA3F3F]/80 text-white rounded-tr-none ml-auto mr-0'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-700 p-2 flex bg-gray-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our menu..."
              className="flex-1 py-2 px-3 border-none rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#CA3F3F] bg-gray-800 text-white placeholder:text-gray-400"
            />
            <button 
              type="submit"
              className="bg-[#CA3F3F] text-white px-4 rounded-r-lg hover:opacity-90 flex items-center justify-center"
            >
              <Search size={16} className="mr-1" />
              Ask
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
