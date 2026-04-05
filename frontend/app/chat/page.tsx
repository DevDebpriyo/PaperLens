"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./chat.css";
import NovaGlow from "./NovaGlow";
import GlassPlanSelector from "./GlassPlanSelector";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

/* ─── SVG Icon Components ─── */

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1m8.66-13.5-.87.5M4.21 16.5l-.87.5M20.66 16.5l-.87-.5M4.21 7.5l-.87-.5M16 12h1M7 12H6m10.5-4.5-.5.87M8 15.63l-.5.87m9-9-.5-.87M8 8.37l-.5-.87" />
  </svg>
);

const ExploreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const FilesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const ChevronDown = () => (
  <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MoreHoriz = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const DeeperResearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
);

const StarSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BulbSmall = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
  </svg>
);

const WandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M8 9h2" />
    <path d="M20 9h2" />
    <path d="M17.8 11.8L19 13" />
    <path d="M15 9h0" />
    <path d="M17.8 6.2L19 5" />
    <path d="m3 21 9-9" />
    <path d="M12.2 6.2L11 5" />
  </svg>
);

const TranslateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const QuestionIcon = () => (
  <span style={{ fontWeight: 600, fontSize: "14px" }}>?</span>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

type UploadState = "uploading" | "processing" | "ready" | "error";

type UploadedFileItem = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  progress: number;
  state: UploadState;
  included: boolean;
  uploadedAt?: string;
  errorMessage?: string;
};

type ChatMessageItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type ChatHistoryItem = {
  id: string;
  text: string;
  createdAt: string;
};

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

/* ─── Expand Icon (for collapsed sidebar) ─── */
const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M14 9l3 3-3 3" />
  </svg>
);

/* ─── Page Component ─── */

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMode, setSelectedMode] = useState<"silver" | "gold" | "platinum">("silver");
  const [promptText, setPromptText] = useState("");
  const [selectedTone, setSelectedTone] = useState<
    "beginner" | "intermediate" | "advanced" | "friend" | "teacher" | "scientist"
  >("beginner");
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [hoveredTone, setHoveredTone] = useState<
    "beginner" | "intermediate" | "advanced" | "friend" | "teacher" | "scientist" | null
  >(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimersRef = useRef<Record<string, { intervalId?: number; timeoutId?: number }>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [chatClientId, setChatClientId] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploadDragActive, setIsUploadDragActive] = useState(false);
  const [uploadDialogError, setUploadDialogError] = useState<string | null>(null);

  const chatEndpoint = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (!baseUrl) return "";
    return `${baseUrl.replace(/\/+$/, "")}/chat`;
  }, []);

  const isStoryOrPodcastMode = selectedMode !== "platinum";
  const hasUploadedFiles = uploadedFiles.length > 0;
  const hasTypedPrompt = promptText.trim().length > 0;
  const isInputLockedByUpload = isStoryOrPodcastMode && hasUploadedFiles;
  const isUploadLockedByPrompt = isStoryOrPodcastMode && hasTypedPrompt;
  const hasConversation = chatMessages.length > 0 || isSendingChat || Boolean(chatError);

  const groupedHistory = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);

    const startSevenDays = new Date(startToday);
    startSevenDays.setDate(startSevenDays.getDate() - 7);

    const groups = {
      today: [] as ChatHistoryItem[],
      yesterday: [] as ChatHistoryItem[],
      sevenDays: [] as ChatHistoryItem[],
    };

    chatHistory.forEach((item) => {
      const createdAt = new Date(item.createdAt);

      if (Number.isNaN(createdAt.getTime())) {
        groups.sevenDays.push(item);
        return;
      }

      if (createdAt >= startToday) {
        groups.today.push(item);
        return;
      }

      if (createdAt >= startYesterday) {
        groups.yesterday.push(item);
        return;
      }

      if (createdAt >= startSevenDays) {
        groups.sevenDays.push(item);
      }
    });

    return groups;
  }, [chatHistory]);

  const storyTones = useMemo(
    () => [
      {
        value: "beginner" as const,
        label: "Beginner",
        description: "Simple and easy explanation for first-time readers.",
      },
      {
        value: "intermediate" as const,
        label: "Intermediate",
        description: "Balanced clarity with moderate technical depth.",
      },
      {
        value: "advanced" as const,
        label: "Advanced",
        description: "Detailed, nuanced explanation with deeper context.",
      },
    ],
    [],
  );

  const podcastTones = useMemo(
    () => [
      {
        value: "friend" as const,
        label: "Friend",
        description: "Casual and warm, like a smart friend chatting.",
      },
      {
        value: "teacher" as const,
        label: "Teacher",
        description: "Structured and clear, like a guided lesson.",
      },
      {
        value: "scientist" as const,
        label: "Scientist",
        description: "Evidence-first and precise with technical rigor.",
      },
    ],
    [],
  );

  const activeToneOptions = selectedMode === "gold" ? podcastTones : storyTones;

  const activeTone =
    activeToneOptions.find((option) => option.value === selectedTone) ?? activeToneOptions[0];

  const previewTone =
    activeToneOptions.find((option) => option.value === (hoveredTone ?? activeTone.value)) ?? activeTone;

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatHistoryPreview = (text: string, maxChars = 52) => {
    const compactText = text.trim().split(/\s+/).join(" ");
    if (compactText.length <= maxChars) return compactText;
    return `${compactText.slice(0, maxChars).trimEnd()}...`;
  };

  const getOrCreateClientId = () => {
    const storageKey = "paperlens_chat_client_id";
    const existingClientId = localStorage.getItem(storageKey);
    if (existingClientId) return existingClientId;

    const generatedClientId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem(storageKey, generatedClientId);
    setChatClientId(generatedClientId);
    return generatedClientId;
  };

  const createMessageId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const isPdfFile = (file: File) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  const extractReplyText = (value: unknown): string | null => {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const candidate = extractReplyText(item);
        if (candidate) return candidate;
      }
      return null;
    }

    if (value && typeof value === "object") {
      const responseObject = value as Record<string, unknown>;
      const priorityKeys = ["response", "reply", "message", "text", "answer", "output"];

      for (const key of priorityKeys) {
        const candidate = extractReplyText(responseObject[key]);
        if (candidate) return candidate;
      }

      for (const nestedValue of Object.values(responseObject)) {
        const candidate = extractReplyText(nestedValue);
        if (candidate) return candidate;
      }
    }

    return null;
  };

  const parseAssistantReply = (payload: unknown) => {
    const extractedText = extractReplyText(payload);
    if (extractedText) return extractedText;

    if (payload && typeof payload === "object") {
      return JSON.stringify(payload, null, 2);
    }

    if (typeof payload === "number" || typeof payload === "boolean") {
      return String(payload);
    }

    return "The server returned an empty response.";
  };

  const formatMessageTime = (isoTimestamp: string) =>
    new Date(isoTimestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const parseErrorMessage = (status: number, payload: unknown) => {
    if (payload && typeof payload === "object") {
      const responseObject = payload as Record<string, unknown>;
      const detail = responseObject.detail;
      const error = responseObject.error;
      const message = responseObject.message;

      if (typeof detail === "string" && detail.trim()) return detail;
      if (typeof error === "string" && error.trim()) return error;
      if (typeof message === "string" && message.trim()) return message;
    }

    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    return `Request failed with status ${status}.`;
  };

  const sendChatMessage = async () => {
    const message = promptText.trim();

    if (!message || isInputLockedByUpload || isSendingChat) return;

    if (!chatEndpoint) {
      setChatError("Backend URL is missing. Set NEXT_PUBLIC_BACKEND_URL in your environment.");
      return;
    }

    const userMessage: ChatMessageItem = {
      id: createMessageId(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((previous) => [...previous, userMessage]);
    setChatHistory((previous) => [
      {
        id: userMessage.id,
        text: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      ...previous,
    ]);
    setPromptText("");
    setChatError(null);
    setIsSendingChat(true);

    try {
      const effectiveClientId = chatClientId || getOrCreateClientId();

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          client_id: effectiveClientId,
        }),
      });

      const rawBody = await response.text();
      let payload: unknown = rawBody;

      if (rawBody) {
        try {
          payload = JSON.parse(rawBody);
        } catch {
          payload = rawBody;
        }
      }

      if (!response.ok) {
        throw new Error(parseErrorMessage(response.status, payload));
      }

      const assistantMessage: ChatMessageItem = {
        id: createMessageId(),
        role: "assistant",
        content: parseAssistantReply(payload),
        createdAt: new Date().toISOString(),
      };

      setChatMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to connect to the backend.";
      setChatError(errorMessage);
    } finally {
      setIsSendingChat(false);
    }
  };

  const clearUploadTimers = (uploadId: string) => {
    const timerPair = uploadTimersRef.current[uploadId];
    if (!timerPair) return;
    if (timerPair.intervalId) window.clearInterval(timerPair.intervalId);
    if (timerPair.timeoutId) window.clearTimeout(timerPair.timeoutId);
    delete uploadTimersRef.current[uploadId];
  };

  const startUploadWorkflow = (uploadId: string) => {
    const intervalId = window.setInterval(() => {
      let didEnterProcessing = false;

      setUploadedFiles((previous) =>
        previous.map((item) => {
          if (item.id !== uploadId || item.state !== "uploading") return item;

          const nextProgress = Math.min(item.progress + Math.floor(Math.random() * 12) + 7, 96);

          if (nextProgress >= 96) {
            didEnterProcessing = true;
            return { ...item, progress: 96, state: "processing" };
          }

          return { ...item, progress: nextProgress };
        }),
      );

      if (!didEnterProcessing) return;

      const currentTimers = uploadTimersRef.current[uploadId];
      if (currentTimers?.intervalId) {
        window.clearInterval(currentTimers.intervalId);
      }

      const timeoutId = window.setTimeout(() => {
        setUploadedFiles((previous) =>
          previous.map((item) => {
            if (item.id !== uploadId) return item;

            const timestamp = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              ...item,
              progress: 100,
              state: "ready",
              uploadedAt: timestamp,
              errorMessage: undefined,
            };
          }),
        );

        clearUploadTimers(uploadId);
      }, 900 + Math.floor(Math.random() * 800));

      uploadTimersRef.current[uploadId] = { timeoutId };
    }, 170);

    uploadTimersRef.current[uploadId] = { intervalId };
  };

  const createUploadItem = (file: File): UploadedFileItem => {
    const uploadId = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const oversize = file.size > MAX_FILE_SIZE_BYTES;

    return {
      id: uploadId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || "unknown",
      progress: oversize ? 0 : 5,
      state: oversize ? "error" : "uploading",
      included: !oversize,
      errorMessage: oversize
        ? `Too large. Max file size is ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`
        : undefined,
    };
  };

  const processSelectedFiles = (files: File[]) => {
    if (!files.length) return;

    if (files.some((file) => !isPdfFile(file))) {
      setUploadDialogError("Only PDF files are supported. Please upload a .pdf file.");
      return;
    }

    const newItems = files.map(createUploadItem);
    setUploadedFiles((previous) => [...newItems, ...previous]);

    newItems.forEach((item) => {
      if (item.state === "uploading") {
        startUploadWorkflow(item.id);
      }
    });

    setUploadDialogError(null);
    setIsUploadDragActive(false);
    setIsUploadDialogOpen(false);
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploadLockedByPrompt) {
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files ?? []);
    processSelectedFiles(files);
    event.target.value = "";
  };

  const handleUploadDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsUploadDragActive(false);

    if (isUploadLockedByPrompt) return;

    const files = Array.from(event.dataTransfer.files ?? []);
    processSelectedFiles(files);
  };

  const openUploadDialog = () => {
    if (isUploadLockedByPrompt) return;
    setUploadDialogError(null);
    setIsUploadDragActive(false);
    setIsUploadDialogOpen(true);
  };

  const closeUploadDialog = () => {
    setIsUploadDialogOpen(false);
    setIsUploadDragActive(false);
    setUploadDialogError(null);
  };

  const removeUploadedFile = (uploadId: string) => {
    clearUploadTimers(uploadId);
    setUploadedFiles((previous) => previous.filter((item) => item.id !== uploadId));
  };

  const retryUpload = (uploadId: string) => {
    clearUploadTimers(uploadId);

    setUploadedFiles((previous) =>
      previous.map((item) => {
        if (item.id !== uploadId) return item;
        return {
          ...item,
          state: "uploading",
          progress: 4,
          errorMessage: undefined,
          included: true,
        };
      }),
    );

    startUploadWorkflow(uploadId);
  };

  const clearAllUploads = () => {
    Object.keys(uploadTimersRef.current).forEach(clearUploadTimers);
    setUploadedFiles([]);
  };

  const handleNewChat = () => {
    clearAllUploads();
    setPromptText("");
    setChatMessages([]);
    setChatError(null);
    setIsSendingChat(false);
    setIsModeDropdownOpen(false);
    setHoveredTone(null);
    setIsUploadDialogOpen(false);
    setUploadDialogError(null);
  };

  const toggleIncludeInPrompt = (uploadId: string) => {
    setUploadedFiles((previous) =>
      previous.map((item) =>
        item.id === uploadId ? { ...item, included: !item.included } : item,
      ),
    );
  };

  useEffect(() => {
    if (selectedMode === "platinum") {
      setIsModeDropdownOpen(false);
      setHoveredTone(null);
      return;
    }

    const isCurrentToneValid = activeToneOptions.some((option) => option.value === selectedTone);
    if (!isCurrentToneValid) {
      setSelectedTone(activeToneOptions[0].value);
    }
  }, [activeToneOptions, selectedMode, selectedTone]);

  useEffect(() => {
    if (isStoryOrPodcastMode && hasUploadedFiles && hasTypedPrompt) {
      setPromptText("");
    }
  }, [hasTypedPrompt, hasUploadedFiles, isStoryOrPodcastMode]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!modeDropdownRef.current?.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
        setHoveredTone(null);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(
    () => () => {
      Object.keys(uploadTimersRef.current).forEach(clearUploadTimers);
    },
    [],
  );

  useEffect(() => {
    const persistedTheme = localStorage.getItem("theme");

    if (persistedTheme === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }

    if (persistedTheme === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    if (!chatMessagesRef.current) return;
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [chatMessages, isSendingChat]);

  useEffect(() => {
    setChatClientId(getOrCreateClientId());
  }, []);

  useEffect(() => {
    if (!chatClientId || !chatEndpoint) return;

    let canceled = false;

    const loadChatHistory = async () => {
      setIsHistoryLoading(true);
      setHistoryError(null);

      try {
        const query = `client_id=${encodeURIComponent(chatClientId)}&limit=60`;
        const response = await fetch(`${chatEndpoint}?${query}`);

        if (!response.ok) {
          throw new Error(`Unable to fetch history (status ${response.status}).`);
        }

        const payload = (await response.json()) as {
          history?: Array<{ id?: string; text?: string; createdAt?: string }>;
        };

        const items = Array.isArray(payload.history) ? payload.history : [];
        const normalizedHistory = items
          .map((item, index) => {
            const text = typeof item.text === "string" ? item.text.trim() : "";
            const createdAt =
              typeof item.createdAt === "string" && item.createdAt
                ? item.createdAt
                : new Date().toISOString();

            const fallbackId = `${chatClientId}-${createdAt}-${index}`;
            const id = typeof item.id === "string" && item.id ? item.id : fallbackId;

            return { id, text, createdAt };
          })
          .filter((item) => item.text.length > 0);

        if (!canceled) {
          setChatHistory(normalizedHistory);
        }
      } catch (error) {
        if (!canceled) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load chat history right now.";
          setHistoryError(message);
          setChatHistory([]);
        }
      } finally {
        if (!canceled) {
          setIsHistoryLoading(false);
        }
      }
    };

    void loadChatHistory();

    return () => {
      canceled = true;
    };
  }, [chatClientId, chatEndpoint]);

  useEffect(() => {
    if (!isUploadDialogOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeUploadDialog();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isUploadDialogOpen]);

  useEffect(() => {
    if (!isUploadDialogOpen || !isUploadLockedByPrompt) return;
    closeUploadDialog();
  }, [isUploadDialogOpen, isUploadLockedByPrompt]);

  return (
    <div className="chat-page">
      {/* ===== SIDEBAR ===== */}
      <aside className={`chat-sidebar ${!sidebarOpen ? 'chat-sidebar-collapsed' : ''}`}>
        {sidebarOpen ? (
          <>
            {/* Header */}
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <img
                  src="/paperlens.png"
                  alt="PaperLens"
                  className="sidebar-logo-img sidebar-logo-img-light"
                />
                <img
                  src="/paperlens-dark.png"
                  alt="PaperLens"
                  className="sidebar-logo-img sidebar-logo-img-dark"
                />
              </div>
              <button className="sidebar-collapse-btn" aria-label="Collapse sidebar" onClick={() => setSidebarOpen(false)}>
                <CollapseIcon />
              </button>
            </div>

            {/* New Chat */}
            <button className="new-chat-btn" onClick={handleNewChat}>
              <PlusIcon /> New chat
            </button>

            {/* Search */}
            <div className="sidebar-search">
              <SearchIcon />
              <input type="text" placeholder="Search" />
              <SparkleIcon />
            </div>

            {/* Chat History */}
            <div className="sidebar-history">
              {isHistoryLoading && <div className="history-item">Loading chat history...</div>}

              {!isHistoryLoading && historyError && (
                <div className="history-item">{historyError}</div>
              )}

              {!isHistoryLoading && !historyError && chatHistory.length === 0 && (
                <div className="history-item">No saved chats yet. Start a conversation.</div>
              )}

              {groupedHistory.today.length > 0 && (
                <>
                  <div className="history-label">Today</div>
                  {groupedHistory.today.map((item) => (
                    <div key={item.id} className="history-item" title={item.text}>
                      {formatHistoryPreview(item.text)}
                    </div>
                  ))}
                </>
              )}

              {groupedHistory.yesterday.length > 0 && (
                <>
                  <div className="history-label">Yesterday</div>
                  {groupedHistory.yesterday.map((item) => (
                    <div key={item.id} className="history-item" title={item.text}>
                      {formatHistoryPreview(item.text)}
                    </div>
                  ))}
                </>
              )}

              {groupedHistory.sevenDays.length > 0 && (
                <>
                  <div className="history-label">7 days</div>
                  {groupedHistory.sevenDays.map((item) => (
                    <div key={item.id} className="history-item" title={item.text}>
                      {formatHistoryPreview(item.text)}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* User Footer */}
            <div className="sidebar-footer">
              <div className="sidebar-avatar">ES</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Emerson Sterling</div>
                <div className="sidebar-user-email">sterlingr@gmail.com</div>
              </div>
              <button className="sidebar-logout-btn" aria-label="Logout">
                <LogoutIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="sidebar-collapsed-content">
            <button className="sidebar-expand-btn" onClick={() => setSidebarOpen(true)} aria-label="Expand sidebar">
              <ExpandIcon />
            </button>
            
            <button className="sidebar-collapsed-icon-btn" aria-label="New chat" title="New chat" onClick={handleNewChat}>
              <PlusIcon />
            </button>
            
            <button className="sidebar-collapsed-icon-btn" aria-label="Search" title="Search">
              <SearchIcon />
            </button>
          </div>
        )}
      </aside>

      {/* ===== MAIN ===== */}
      <main className="chat-main">
        <div className="chat-theme-toggle-wrap">
          <AnimatedThemeToggler className="chat-theme-toggle-btn" aria-label="Toggle theme" />
        </div>

        {/* Center Content */}
        <div className={`chat-center ${hasConversation ? "chat-center-active" : ""}`}>
          {!hasConversation && (
            <div className="chat-greeting">
              <div className="chat-orb">
                <NovaGlow
                  hue={0}
                  hoverIntensity={0.2}
                  rotateOnHover={true}
                />
              </div>
              <div className="chat-plan-selector">
                <GlassPlanSelector onPlanChange={(plan) => setSelectedMode(plan)} />
              </div>
              <div className="greeting-hello" style={{ color: "#ffa500" }}>Hello, Jackson</div>
              <div className="greeting-question">How can I assist you today?</div>
            </div>
          )}

          {hasConversation && (
            <section className="chat-thread-shell">
              <div className="chat-thread-header">
                <div className="chat-thread-title-wrap">
                  <span className="chat-thread-title">PaperLens Chat</span>
                  <span className="chat-thread-subtitle">AI conversation stream</span>
                </div>
                <span className={`chat-endpoint-badge ${chatEndpoint ? "chat-endpoint-badge-on" : "chat-endpoint-badge-off"}`}>
                  {chatEndpoint ? "Backend connected" : "Backend missing"}
                </span>
              </div>

              <div className="chat-thread-list" ref={chatMessagesRef}>
                {chatMessages.map((item) => (
                  <div key={item.id} className={`chat-turn chat-turn-${item.role}`}>
                    {item.role === "assistant" && <div className="chat-turn-avatar">PL</div>}

                    <div className={`chat-bubble chat-bubble-${item.role}`}>
                      <p className="chat-bubble-content">{item.content}</p>
                      <span className="chat-bubble-time">{formatMessageTime(item.createdAt)}</span>
                    </div>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="chat-turn chat-turn-assistant">
                    <div className="chat-turn-avatar">PL</div>
                    <div className="chat-bubble chat-bubble-assistant chat-bubble-thinking">
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                      <span className="chat-typing-dot" />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Input Area */}
          <div className={`chat-input-wrapper ${hasConversation ? "chat-input-wrapper-active" : ""}`}>
            <div className="chat-input-box">
              <input
                ref={fileInputRef}
                className="hidden-upload-input"
                type="file"
                multiple
                onChange={handleFileSelection}
                accept=".pdf,application/pdf"
                disabled={isUploadLockedByPrompt}
              />
              <div className={`chat-input-field-shell ${isInputLockedByUpload ? "chat-input-field-shell-locked" : ""}`}>
                <input
                  className={`chat-input-field ${isInputLockedByUpload ? "chat-input-field-locked" : ""}`}
                  type="text"
                  value={promptText}
                  onChange={(event) => {
                    setPromptText(event.target.value);
                    if (chatError) setChatError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void sendChatMessage();
                    }
                  }}
                  placeholder={
                    isInputLockedByUpload
                      ? "Remove attached files to type a prompt"
                      : "Ask me anything..."
                  }
                  disabled={isInputLockedByUpload}
                />
                {isInputLockedByUpload && (
                  <div className="input-lock-tooltip" role="status">
                    A file is already attached. Remove it if you want to type a text prompt.
                  </div>
                )}
              </div>
              <div className="chat-input-actions">
                <div className="input-actions-left">
                  {selectedMode !== "platinum" && (
                    <div className="mode-dropdown" ref={modeDropdownRef}>
                      <button
                        type="button"
                        className={`mode-dropdown-trigger ${isModeDropdownOpen ? "mode-dropdown-trigger-open" : ""}`}
                        aria-label="Choose tone"
                        aria-expanded={isModeDropdownOpen}
                        onClick={() => setIsModeDropdownOpen((previous) => !previous)}
                      >
                        <span className="mode-dropdown-trigger-content">
                          <span className="mode-dropdown-context">
                            {selectedMode === "gold" ? "Podcast style" : "Story level"}
                          </span>
                          <span className="mode-dropdown-value">{activeTone.label}</span>
                        </span>
                        <span className={`mode-dropdown-caret ${isModeDropdownOpen ? "mode-dropdown-caret-open" : ""}`} />
                      </button>

                      {isModeDropdownOpen && (
                        <div className="mode-dropdown-menu" role="listbox">
                          {activeToneOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={`mode-dropdown-item ${activeTone.value === option.value ? "mode-dropdown-item-active" : ""}`}
                              role="option"
                              aria-selected={activeTone.value === option.value}
                              onMouseEnter={() => setHoveredTone(option.value)}
                              onMouseLeave={() => setHoveredTone(null)}
                              onClick={() => {
                                setSelectedTone(option.value);
                                setIsModeDropdownOpen(false);
                                setHoveredTone(null);
                              }}
                            >
                              <span className="mode-dropdown-item-title">{option.label}</span>
                              <span className="mode-dropdown-item-description">{option.description}</span>
                            </button>
                          ))}

                          <div className="mode-dropdown-preview">{previewTone.description}</div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
                <div className="input-actions-right">
                  <div className={`attach-file-trigger-wrap ${isUploadLockedByPrompt ? "attach-file-trigger-wrap-locked" : ""}`}>
                    <button
                      className={`input-action-icon attach-file-trigger ${uploadedFiles.length ? "attach-file-trigger-active" : ""} ${isUploadLockedByPrompt ? "attach-file-trigger-disabled" : ""}`}
                      aria-label="Upload file"
                      onClick={openUploadDialog}
                      type="button"
                      disabled={isUploadLockedByPrompt}
                    >
                      <PaperclipIcon />
                      {uploadedFiles.length > 0 && (
                        <span className="attach-file-count">{uploadedFiles.length}</span>
                      )}
                    </button>

                    {isUploadLockedByPrompt && (
                      <div className="upload-lock-tooltip" role="status">
                        Clear your typed prompt first, then you can upload a file.
                      </div>
                    )}
                  </div>

                  <button
                    className={`chat-send-btn ${!promptText.trim() || isInputLockedByUpload || isSendingChat ? "chat-send-btn-disabled" : ""}`}
                    aria-label="Send message"
                    onClick={() => void sendChatMessage()}
                    type="button"
                    disabled={!promptText.trim() || isInputLockedByUpload || isSendingChat}
                  >
                    {isSendingChat ? <span className="chat-send-spinner" /> : <SendIcon />}
                  </button>

                  <button className="mic-btn" style={{ backgroundColor: '#ffa500' }} aria-label="Voice input">
                    <MicIcon />
                  </button>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="upload-workflow-panel">
                  <div className="upload-workflow-header">
                    <div className="upload-workflow-title">
                      <span className="upload-title-dot" />
                      Files attached ({uploadedFiles.length})
                    </div>
                    <button
                      type="button"
                      className="upload-clear-all-btn"
                      onClick={clearAllUploads}
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="upload-workflow-list">
                    {uploadedFiles.map((item) => (
                      <div key={item.id} className={`upload-file-card upload-file-${item.state}`}>
                        <div className="upload-file-row">
                          <div className="upload-file-chip">
                            {(item.fileName.split(".").pop() || "FILE").slice(0, 4).toUpperCase()}
                          </div>

                          <div className="upload-file-info">
                            <div className="upload-file-name" title={item.fileName}>{item.fileName}</div>
                            <div className="upload-file-meta">
                              {formatFileSize(item.fileSize)} • {item.fileType || "file"}
                              {item.uploadedAt ? ` • Uploaded ${item.uploadedAt}` : ""}
                            </div>
                          </div>

                          <span className={`upload-file-status upload-file-status-${item.state}`}>
                            {item.state === "uploading" && "Uploading"}
                            {item.state === "processing" && "Processing"}
                            {item.state === "ready" && "Ready"}
                            {item.state === "error" && "Failed"}
                          </span>
                        </div>

                        {(item.state === "uploading" || item.state === "processing") && (
                          <div className="upload-progress-track">
                            <div
                              className="upload-progress-fill"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}

                        <div className="upload-file-actions">
                          {item.state === "ready" && (
                            <button
                              type="button"
                              className={`upload-include-btn ${item.included ? "upload-include-btn-on" : ""}`}
                              onClick={() => toggleIncludeInPrompt(item.id)}
                            >
                              {item.included ? "Included in prompt" : "Include in prompt"}
                            </button>
                          )}

                          {item.state === "error" && (
                            <>
                              <span className="upload-error-copy">
                                {item.errorMessage || "Upload failed. Try again."}
                              </span>
                              <button
                                type="button"
                                className="upload-retry-btn"
                                onClick={() => retryUpload(item.id)}
                              >
                                Retry
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            className="upload-remove-btn"
                            onClick={() => removeUploadedFile(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {chatError && <div className="chat-inline-error">{chatError}</div>}
        </div>

        {isUploadDialogOpen && (
          <div
            className="upload-dialog-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-dialog-title"
            onClick={closeUploadDialog}
          >
            <div className="upload-dialog-card" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="upload-dialog-close"
                aria-label="Close upload dialog"
                onClick={closeUploadDialog}
              >
                ×
              </button>

              <div className="upload-dialog-badge">PDF</div>
              <h3 className="upload-dialog-title" id="upload-dialog-title">Upload your PDF</h3>
              <p className="upload-dialog-description">
                Drag and drop your file here, or browse from your computer.
              </p>

              <div
                className={`upload-drop-zone ${isUploadDragActive ? "upload-drop-zone-active" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsUploadDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                  setIsUploadDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  const related = event.relatedTarget as Node | null;
                  if (related && event.currentTarget.contains(related)) return;
                  setIsUploadDragActive(false);
                }}
                onDrop={handleUploadDrop}
              >
                <p className="upload-drop-title">Drag and drop your PDF here</p>
                <p className="upload-drop-note">
                  Only .pdf files are supported. Max size {formatFileSize(MAX_FILE_SIZE_BYTES)}.
                </p>
                <button
                  type="button"
                  className="upload-dialog-browse-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse
                </button>
              </div>

              {uploadDialogError && (
                <div className="upload-dialog-error" role="status">{uploadDialogError}</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
