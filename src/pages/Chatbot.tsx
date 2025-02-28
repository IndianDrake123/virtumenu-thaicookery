
import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Bot, User, X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your VirtuMenu AI assistant. I can help you with menu recommendations, dietary questions, or information about dishes. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What's popular here?",
    "I'm vegetarian, what do you recommend?",
    "Tell me about Soon Tofu",
    "Any spicy dishes?",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = {
        "What's popular here?": "Our most popular dishes are the Original Soon Tofu, Bulgogi, and the Tofu & BBQ Combo A. These are customer favorites and highly recommended for first-time visitors!",
        "I'm vegetarian, what do you recommend?": "For vegetarians, I recommend our Vegetable Soon Tofu, Japchae (ask for no meat), Pa Jun (green onion pancake), and our various vegetable side dishes. All can be prepared without animal products!",
        "Tell me about Soon Tofu": "Soon Tofu (Sundubu-jjigae) is a Korean soft tofu stew that's typically served bubbling hot. At BCD, we prepare it with silken tofu in a spicy broth, and you can choose various protein options like seafood, beef, or keep it vegetarian.",
        "Any spicy dishes?": "Yes! Most of our Soon Tofu dishes are spicy by default. The Kimchi Pancake and Spicy Pork Bulgogi are also excellent spicy options. You can request your preferred spice level from mild to extra spicy.",
      };

      const defaultResponses = [
        "That's a great question! Based on your interest, I'd recommend trying our signature Soon Tofu or BBQ Combo plates for a complete Korean dining experience.",
        "I'd be happy to help with that! Our menu offers a variety of authentic Korean dishes, from spicy stews to savory BBQ options, all prepared with traditional methods.",
        "Great choice! That's one of our most flavorful options. Would you like to know about any sides that would complement it well?",
      ];

      let botResponse = botResponses[inputValue as keyof typeof botResponses] || 
                        defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Update suggestions based on context
      if (inputValue.toLowerCase().includes("vegetarian")) {
        setSuggestions([
          "Any vegan options?",
          "Is the Japchae vegetarian?",
          "Do you have tofu dishes?",
          "Any non-spicy vegetarian options?",
        ]);
      } else if (inputValue.toLowerCase().includes("spicy")) {
        setSuggestions([
          "What's your spiciest dish?",
          "Can I adjust spice levels?",
          "Are all Soon Tofu dishes spicy?",
          "Any mild options?",
        ]);
      } else {
        setSuggestions([
          "What comes with the BBQ?",
          "Tell me about your combos",
          "Any desserts?",
          "Most authentic Korean dish?",
        ]);
      }
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Small delay to see the suggestion in the input before sending
    setTimeout(() => {
      const userMessage: Message = {
        id: messages.length + 1,
        text: suggestion,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI response for suggestion
      setTimeout(() => {
        const botResponses = {
          "What's popular here?": "Our most popular dishes are the Original Soon Tofu, Bulgogi, and the Tofu & BBQ Combo A. These are customer favorites and highly recommended for first-time visitors!",
          "I'm vegetarian, what do you recommend?": "For vegetarians, I recommend our Vegetable Soon Tofu, Japchae (ask for no meat), Pa Jun (green onion pancake), and our various vegetable side dishes. All can be prepared without animal products!",
          "Tell me about Soon Tofu": "Soon Tofu (Sundubu-jjigae) is a Korean soft tofu stew that's typically served bubbling hot. At BCD, we prepare it with silken tofu in a spicy broth, and you can choose various protein options like seafood, beef, or keep it vegetarian.",
          "Any spicy dishes?": "Yes! Most of our Soon Tofu dishes are spicy by default. The Kimchi Pancake and Spicy Pork Bulgogi are also excellent spicy options. You can request your preferred spice level from mild to extra spicy.",
          "What comes with the BBQ?": "Our BBQ dishes come with steamed rice, assorted banchan (side dishes) including kimchi, and soup. It's a complete meal experience!",
          "Tell me about your combos": "Our combo meals are designed to give you the best of both worlds - you get to try our famous Soon Tofu along with a BBQ option like Bulgogi or Galbi. They're perfect for first-time visitors who want to experience different Korean flavors.",
          "Any desserts?": "We offer traditional Korean desserts like patbingsu (shaved ice with sweet toppings) and hotteok (sweet pancakes with brown sugar filling) on our seasonal menu. Ask your server about today's special dessert options!",
          "Most authentic Korean dish?": "Our Soon Tofu is prepared using traditional Korean methods and is considered one of our most authentic dishes. The Banchan (side dishes) that come with all meals are also quintessentially Korean and made using traditional recipes.",
        };

        let botResponse = botResponses[suggestion as keyof typeof botResponses] || 
                          "That's a great question! Our menu offers a variety of authentic Korean dishes, from spicy stews to savory BBQ options. Would you like a specific recommendation?";

        const botMessage: Message = {
          id: messages.length + 2,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Layout title="AI Assistant" showHeader={true}>
      <div className={`flex flex-col h-[calc(100vh-160px)] ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-virtumenu-800 text-white rounded-tr-none"
                      : "bg-white shadow-sm border border-gray-100 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === "bot" ? (
                      <Bot size={16} className="mr-1 text-virtumenu-accent-500" />
                    ) : (
                      <User size={16} className="mr-1 text-white" />
                    )}
                    <span className={`text-xs ${message.sender === "user" ? "text-white/80" : "text-virtumenu-500"}`}>
                      {message.sender === "user" ? "You" : "VirtuMenu AI"}
                    </span>
                  </div>
                  <p className={message.sender === "user" ? "text-white" : "text-virtumenu-900"}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl px-4 py-3 bg-white shadow-sm border border-gray-100 rounded-tl-none">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-virtumenu-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-virtumenu-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-virtumenu-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="pb-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-white px-3 py-1.5 rounded-full text-sm border border-virtumenu-200 text-virtumenu-700 hover:bg-virtumenu-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="glass-card p-2 flex items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about menu items, ingredients..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-virtumenu-300 bg-white text-virtumenu-900 placeholder:text-virtumenu-400"
            />
            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-virtumenu-400 hover:text-virtumenu-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`ml-2 p-3 rounded-full flex items-center justify-center transition-colors ${
              inputValue.trim()
                ? "bg-virtumenu-800 text-white hover:bg-virtumenu-700"
                : "bg-virtumenu-200 text-virtumenu-400 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center py-2 text-xs text-virtumenu-500">
          <Sparkles size={12} className="mr-1 text-virtumenu-accent-500" />
          <span>Powered by VirtuMenu AI</span>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;
