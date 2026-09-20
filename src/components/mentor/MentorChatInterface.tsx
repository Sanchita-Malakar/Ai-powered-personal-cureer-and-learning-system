"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  PromptPreset,
  MentorAction,
  StudentGroundedContext,
} from "@/types/mentor";
import {
  PROMPT_PRESETS,
  STUDENT_GROUNDED_CONTEXT,
} from "@/data/mockMentorData";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Mic,
  MicOff,
  Briefcase,
  FileText,
  BookOpen,
  Code2,
  MessageSquareCode,
  Route,
  Zap,
} from "lucide-react";

interface MentorChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onTriggerAction: (action: MentorAction) => void;
  isThinking: boolean;
}

export const MentorChatInterface: React.FC<MentorChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
  onTriggerAction,
  isThinking,
}) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "" || isThinking) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    if (isThinking) return;
    onSendMessage(preset.query);
  };

  const handleSimulateVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText("Which jobs should I apply for based on my skills?");
      }, 1500);
    }
  };

  const getActionIcon = (section: string) => {
    switch (section) {
      case "jobs":
        return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
      case "resume":
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case "learning":
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case "dsa":
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "interview":
        return <MessageSquareCode className="w-3.5 h-3.5 text-rose-400" />;
      case "roadmap":
        return <Route className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-accent" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-col h-[740px] overflow-hidden shadow-2xl">
      {/* Top Mentor Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">AI Career Assistant</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Coaching student Alex • NIT Computer Science (7th Sem)
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="p-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition flex items-center gap-1.5"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isUser
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800 text-indigo-400 border border-slate-700"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 rounded-tr-none text-xs leading-relaxed"
                    : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none text-xs leading-relaxed shadow-md"
                }`}
              >
                {/* Content */}
                <div className="prose prose-invert max-w-none text-xs whitespace-pre-wrap leading-relaxed">
                  {msg.contentMarkdown}
                </div>

                {/* Embedded Interactive Action Cards */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Recommended Next Actions:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => onTriggerAction(action)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-indigo-500/60 transition text-left flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 shrink-0">
                              {getActionIcon(action.section)}
                            </div>
                            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition truncate">
                              {action.label}
                            </span>
                          </div>

                          {action.badgeText && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                              {action.badgeText}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] ${
                    isUser ? "text-indigo-200/70" : "text-slate-500"
                  } text-right`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 rounded-tl-none flex items-center gap-2 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing your career profile and benchmarks...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Preset Chips Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Suggested Prompts (Grounding Shortcuts):
          </span>
          <span className="text-[10px] text-indigo-400">Click to ask</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {PROMPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              disabled={isThinking}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-xs font-medium text-slate-300 hover:text-white shrink-0 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>&ldquo;{preset.query}&rdquo;</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleSimulateVoice}
          className={`p-2.5 rounded-xl border transition shrink-0 ${
            isRecording
              ? "bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800"
          }`}
          title={isRecording ? "Listening..." : "Dictate query"}
        >
          {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isRecording
              ? "Listening to voice input..."
              : "Ask your AI mentor about jobs, resume score, DSA, or interview prep..."
          }
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />

        <button
          type="submit"
          disabled={inputText.trim() === "" || isThinking}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
