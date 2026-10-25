"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, ArrowRight, Loader2, MapPin, Search, FileText, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  link?: string;
  linkText?: string;
  options?: { label: string; value: string; iconName?: string }[];
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getIcon = (name?: string) => {
  switch (name) {
    case "map-pin": return <MapPin className="w-4 h-4" />;
    case "file-text": return <FileText className="w-4 h-4" />;
    case "sparkles": return <Sparkles className="w-4 h-4" />;
    case "search": return <Search className="w-4 h-4" />;
    case "user": return <User className="w-4 h-4" />;
    case "refresh": return <RefreshCw className="w-4 h-4" />;
    default: return null;
  }
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expectingInput, setExpectingInput] = useState<string | null>(null); // AM, THESI, SURNAME
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Φόρτωση αρχικής οθόνης (αν δεν υπάρχει ιστορικό)
  useEffect(() => {
    const saved = localStorage.getItem("asep_chat_history_v6");
    if (saved) {
      try { 
        setMessages(JSON.parse(saved)); 
      } catch { 
        handleAction("START"); 
      }
    } else {
      handleAction("START");
    }
  }, []);

  // Αποθήκευση στο localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("asep_chat_history_v6", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll στο τέλος όταν έρχονται νέα μηνύματα
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  // Κύριο action handler που καλεί το API
  const handleAction = async (action: string, payload?: any, userText?: string) => {
    if (isLoading) return;
    setIsLoading(true);

    if (userText) {
      const userMsg: Message = { id: generateId(), role: "user", text: userText };
      setMessages((prev) => [...prev, userMsg]);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      const data = await response.json();
      setIsLoading(false);

      // Αν το API ζητάει input, ενεργοποιούμε το input mode
      if (data.expectingInput) {
        setExpectingInput(data.expectingInput);
      } else {
        setExpectingInput(null);
      }

      const botMsg: Message = {
        id: generateId(),
        role: "bot",
        text: data.reply || data.error || "Κάτι πήγε στραβά.",
        link: data.link,
        linkText: data.linkText,
        options: data.options,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { id: generateId(), role: "bot", text: "Σφάλμα σύνδεσης." }]);
    }
  };

  // Χειρισμός κλικ στα κουμπιά (είτε του μενού είτε των αποτελεσμάτων)
  const handleOptionClick = (value: string, label: string) => {
    // 1. Απευθείας link για υποψήφιο
    if (value.startsWith("DIRECT_AM_")) {
      const am = value.replace("DIRECT_AM_", "");
      handleAction("DIRECT_LINK", { link: `/ypopsifios/${am}`, linkText: "👤 Προβολή Υποψηφίου" }, label);
      return;
    }

    // 2. "Προβολή Όλων"
    if (value.startsWith("SEARCH_ALL_")) {
      const searchTerm = decodeURIComponent(value.replace("SEARCH_ALL_", ""));
      handleAction("DIRECT_LINK", { link: `/search?q=${encodeURIComponent(searchTerm)}`, linkText: "🔍 Προβολή Όλων" }, label);
      return;
    }

    // 3. Στατιστικά με Context (Με βάση το ΟΝΟΜΑ της ειδικότητας)
    if (value.startsWith("MENU_STATS_NAME_")) {
      const eidikotitaName = decodeURIComponent(value.replace("MENU_STATS_NAME_", ""));
      handleAction("MENU_STATS", { eidikotitaName }, label);
      return;
    }

    // 4. Κανονικό action
    handleAction(value, undefined, label);
  };

  // Υποβολή κειμένου (ΑΜ, Θέση, Επώνυμο)
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !expectingInput) return;

    const payload = { type: expectingInput, text: inputText.trim() };
    const userText = inputText.trim();
    
    setInputText("");
    setExpectingInput(null); // Κλείνουμε το input mode
    
    handleAction("SUBMIT_INPUT", payload, userText);
  };

  // Καθαρισμός συνομιλίας
  const handleReset = () => {
    setMessages([]);
    setExpectingInput(null);
    localStorage.removeItem("asep_chat_history_v6");
    setTimeout(() => handleAction("START"), 100);
  };

  if (messages.length === 0) return null;

  return (
    <main className="h-screen pt-20 sm:pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col overflow-hidden">
      <Link href="/" className="text-sm text-slate-400 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2 mb-4 flex-shrink-0">
        ← Επιστροφή στην Αρχική
      </Link>

      <div className="flex-1 glass rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl bg-slate-950/50 min-h-0">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                ASEP AI Assistant
                <span className="text-[10px] font-mono bg-[#00E5FF]/20 text-[#00E5FF] px-1.5 py-0.5 rounded border border-[#00E5FF]/30">BETA</span>
              </h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Συνδεδεμένο με τα δεδομένα
              </p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Καθαρισμός συνομιλίας"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Καθαρισμός
          </button>
        </div>

        {/* Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === "user" ? "bg-slate-700 text-slate-300" : "bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-white rounded-tr-sm" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm"
                }`}>
                  {/* Αφαίρεση των ** για να μην φαίνονται τα αστεράκια */}
                  <p className="whitespace-pre-wrap">{msg.text.replace(/\*\*/g, '')}</p>
                  
                  {/* Link Button */}
                  {msg.link && msg.linkText && (
                    <Link href={msg.link} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold transition-colors">
                      {msg.linkText} <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {/* Options (Κουμπιά επιλογών) */}
                  {msg.options && (
                    <div className="mt-3 flex flex-col gap-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOptionClick(opt.value, opt.label)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 hover:bg-[#00E5FF]/20 border border-slate-700 hover:border-[#00E5FF]/40 text-xs text-slate-300 hover:text-white transition-all text-left"
                        >
                          {getIcon(opt.iconName)} {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                <span className="text-xs text-slate-400">Αναλύω...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area (Εμφανίζεται μόνο όταν ζητηθεί από το API) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex-shrink-0">
          {expectingInput ? (
            <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  expectingInput === "AM" ? "Γράψε τον Αριθμό Αίτησης (Α.Μ.)..." :
                  expectingInput === "THESI" ? "Γράψε τον κωδικό θέσης..." :
                  "Γράψε το επώνυμο..."
                }
                className="flex-1 bg-slate-950 border border-[#00E5FF]/50 ring-1 ring-[#00E5FF]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] hover:bg-[#00E5FF]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <p className="text-center text-[11px] text-slate-500 py-2">
              Διάλεξε μια από τις παραπάνω επιλογές για να συνεχίσεις.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}