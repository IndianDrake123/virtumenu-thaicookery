
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your BCD Tofu House assistant. How can I help you today?", sender: "bot" }
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
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'd be happy to help with that! Our menu offers a variety of authentic Korean dishes.",
        "Great question! The Soon Tofu is our signature dish and comes in different spice levels.",
        "Our most popular dishes are the Original Soon Tofu, Bulgogi, and the Tofu & BBQ Combo A.",
        "You can customize the spice level for most of our dishes according to your preference.",
        "Yes, we offer vegetarian options. The Vegetable Soon Tofu and Japchae are great choices."
      ];

      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: botResponses[Math.floor(Math.random() * botResponses.length)], 
          sender: "bot" 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="fixed bottom-20 right-4 z-50 bg-primary text-white rounded-full p-3 shadow-lg hover:opacity-90 transition-all"
        aria-label="Chat with us"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-72 sm:w-80 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col animate-fade-in">
          {/* Chat header */}
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">BCD Tofu House Assistant</h3>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-80">
            <div className="space-y-3">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`max-w-[85%] p-2 rounded-lg ${
                    msg.sender === 'bot' 
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none ml-0 mr-auto' 
                      : 'bg-primary/10 text-gray-800 rounded-tr-none ml-auto mr-0'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t p-2 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 py-2 px-3 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-4 rounded-r-lg hover:opacity-90"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
