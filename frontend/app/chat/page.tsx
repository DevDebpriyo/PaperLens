"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./chat.css";
import NovaGlow from "./NovaGlow";
import GlassPlanSelector from "./GlassPlanSelector";

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

/* ─── Data ─── */

const todayChats = [
  "Create a detailed 7-day sprint plan f...",
  "Draft a concise email to stakeholder...",
  "Analyze the 'Eisenhower Matrix' an...",
];

const yesterdayChats = [
  "Summarize the main differences be...",
  "I need to negotiate an extension for ...",
];

const sevenDayChats = [
  "Generate 5 effective morning habits...",
  "As a non-technical PM, list 5 crucial...",
  "Help me allocate 8 hours tomorrow:...",
  "We need a creative name for our ne...",
  "Write a 100-word positive feedback...",
];

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

  const isStoryOrPodcastMode = selectedMode !== "platinum";
  const hasUploadedFiles = uploadedFiles.length > 0;
  const hasTypedPrompt = promptText.trim().length > 0;
  const isInputLockedByUpload = isStoryOrPodcastMode && hasUploadedFiles;
  const isUploadLockedByPrompt = isStoryOrPodcastMode && hasTypedPrompt;

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

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploadLockedByPrompt) {
      event.target.value = "";
      return;
    }

    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const newItems = files.map(createUploadItem);
    setUploadedFiles((previous) => [...newItems, ...previous]);

    newItems.forEach((item) => {
      if (item.state === "uploading") {
        startUploadWorkflow(item.id);
      }
    });

    event.target.value = "";
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

  return (
    <div className="chat-page">
      {/* ===== SIDEBAR ===== */}
      <aside className={`chat-sidebar ${!sidebarOpen ? 'chat-sidebar-collapsed' : ''}`}>
        {sidebarOpen ? (
          <>
            {/* Header */}
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <img src="/paperlens.png" alt="PaperLens" className="sidebar-logo-img" />
              </div>
              <button className="sidebar-collapse-btn" aria-label="Collapse sidebar" onClick={() => setSidebarOpen(false)}>
                <CollapseIcon />
              </button>
            </div>

            {/* New Chat */}
            <button className="new-chat-btn">
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
              <div className="history-label">Today</div>
              {todayChats.map((text, i) => (
                <div key={`t-${i}`} className="history-item">{text}</div>
              ))}

              <div className="history-label">Yesterday</div>
              {yesterdayChats.map((text, i) => (
                <div key={`y-${i}`} className="history-item">{text}</div>
              ))}

              <div className="history-label">7 days</div>
              {sevenDayChats.map((text, i) => (
                <div key={`s-${i}`} className="history-item">{text}</div>
              ))}
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
            
            <button className="sidebar-collapsed-icon-btn" aria-label="New chat" title="New chat">
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

        {/* Center Content */}
        <div className="chat-center">
          {/* Greeting */}
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
            <div className="greeting-hello" style={{ color: '#ffa500' }}>Hello, Jackson</div>
            <div className="greeting-question">How can I assist you today?</div>
          </div>

          {/* Input Area */}
          <div className="chat-input-wrapper">
            <div className="chat-input-box">
              <input
                ref={fileInputRef}
                className="hidden-upload-input"
                type="file"
                multiple
                onChange={handleFileSelection}
                accept=".pdf,.txt,.md,.doc,.docx,.csv,.png,.jpg,.jpeg"
                disabled={isUploadLockedByPrompt}
              />
              <div className={`chat-input-field-shell ${isInputLockedByUpload ? "chat-input-field-shell-locked" : ""}`}>
                <input
                  className={`chat-input-field ${isInputLockedByUpload ? "chat-input-field-locked" : ""}`}
                  type="text"
                  value={promptText}
                  onChange={(event) => setPromptText(event.target.value)}
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
                      onClick={() => fileInputRef.current?.click()}
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
        </div>
      </main>
    </div>
  );
}
