"use client";

import React, { useState, useEffect } from "react";
import {
  ChatMessage,
  MentorAction,
  StudentGroundedContext,
} from "@/types/mentor";
import {
  INITIAL_CHAT_HISTORY,
  STUDENT_GROUNDED_CONTEXT,
  generatePersonalizedMentorResponse,
} from "@/data/mockMentorData";
import { MentorContextPills } from "./MentorContextPills";
import { MentorChatInterface } from "./MentorChatInterface";
import {
  Sparkles,
  ArrowLeft,
  Bot,
  Brain,
  CheckCircle2,
} from "lucide-react";

interface MentorSectionProps {
  onBackToDashboard?: () => void;
  onNavigateSection?: (sectionId: string, paramId?: string) => void;
}

export const MentorSection: React.FC<MentorSectionProps> = ({
  onBackToDashboard,
  onNavigateSection,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_HISTORY);
  const [isThinking, setIsThinking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("career_os_mentor_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      timestamp: "Just now",
      contentMarkdown: text,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setIsThinking(true);

    setTimeout(() => {
      const assistantResponse = generatePersonalizedMentorResponse(
        text,
        STUDENT_GROUNDED_CONTEXT
      );
      const updatedHistory = [...nextHistory, assistantResponse];
      setMessages(updatedHistory);
      setIsThinking(false);

      try {
        localStorage.setItem(
          "career_os_mentor_chat_history",
          JSON.stringify(updatedHistory)
        );
      } catch {
        // ignore
      }
    }, 700);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_CHAT_HISTORY);
    try {
      localStorage.removeItem("career_os_mentor_chat_history");
    } catch {
      // ignore
    }
    showToast("Chat reset to initial state.");
  };

  const handleTriggerAction = (action: MentorAction) => {
    if (onNavigateSection) {
      onNavigateSection(action.section, action.paramId);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="hover:text-white transition flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard Overview
            </button>
          )}
          <span>/</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Career Assistant
          </span>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Context: Alex • 78% Readiness
        </span>
      </div>

      {/* Top Live Profile Grounding Ribbon */}
      <MentorContextPills context={STUDENT_GROUNDED_CONTEXT} />

      {/* Chat Interface */}
      <MentorChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearHistory={handleClearHistory}
        onTriggerAction={handleTriggerAction}
        isThinking={isThinking}
      />
    </div>
  );
};
