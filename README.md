# 🔭 PaperLens

**PaperLens** is an AI-powered educational and research tool. It ingests user-provided content (either via direct prompt or PDF upload) and transforms that information into highly digestible, multimodal formats. The platform utilizes Large Language Models (LLMs) to ensure content validity before processing it into customized stories, two-speaker podcasts, or answering context-specific questions.

## 📑 Table of Contents
- [Core Scope](#core-scope)
- [System Architecture & Workflow](#system-architecture-workflow)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

<a id="core-scope"></a>
## 🚀 Core Scope

The current MVP (Minimum Viable Product) for the hackathon focuses on three primary pillars of content transformation:

- **Adaptive Story Generation:** Translating documents into narratives tailored to different comprehension levels (Beginner, Intermediate, Advanced).
- **Podcast Generation:** Converting research into an audio discussion featuring a simulated "Host" and "Guest."
- **Context-Aware Q&A:** A localized chat interface that strictly answers questions based on the uploaded research paper, preventing irrelevant tangents.

---

<a id="system-architecture-workflow"></a>
## 🏗 System Architecture & Workflow

The application follows a linear authentication flow before branching into three parallel feature sets from the main dashboard.

```mermaid
graph TD
    Start((Login via Clerk)) --> Dash{Main Dashboard}
    
    Dash -->|Select Flow| ModA[Module A: Story Gen]
    Dash -->|Select Flow| ModB[Module B: Podcast Gen]
    Dash -->|Select Flow| ModC[Module C: Local Q&A]
    
    %% Story Generator Flow
    ModA --> InputA[Upload Document / Prompt]
    InputA --> ValA{System Legit Check}
    ValA -- Invalid --> BreakA((REJECTED))
    ValA -- Valid --> ProcA[Extrapolate Details]
    ProcA --> GenA[LLM: Beginner/Int/Adv]
    GenA --> TTSA[Text-to-Speech Engine]
    TTSA --> OutA(((Final Audio Story)))

    %% Podcast Generation Flow
    ModB --> InputB[Upload Document / Prompt]
    InputB --> ValB{System Legit Check}
    ValB -- Invalid --> BreakB((REJECTED))
    ValB -- Valid --> ProcB[Extrapolate Details]
    ProcB --> GenB[LLM: Host Profile]
    GenB --> TTSB[TTS: Dual Voice Engine]
    TTSB --> OutB(((Final Audio Podcast)))

    %% Q&A Flow
    ModC --> InputC[Prompt Specifying Topic]
    InputC --> ValC{Context Bounds Check}
    ValC -- Invalid --> BreakC((REJECTED))
    ValC -- Valid --> GenC[LLM: Context Targeted Resp]
    GenC --> OutC(((On-topic Response Output)))
```

### 1. Entry Protocol
- **Login:** User authentication layer via **Clerk** (Completed ✅).
- **Dashboard:** The central hub where the user selects their desired content transformation path.

### 2. Module A: Story Generation
- **Input / Extraction:** The user can either manually upload a PDF, or enter a text prompt. 
  - *ArXiv Hook:* If a text prompt is supplied, the backend (`search_arxiv`) dynamically scrapes the latest academic paper matching the topic and automatically downloads the PDF.
- **Validation:** The system runs a Legit Check to ensure the paper meets necessary knowledge limits.
- **Processing:** **PyMuPDF** extracts and sanitizes the source text from the paper.
- **Generation:** An LLM engine parses the text and constructs an adaptive narrative based on the requested complexity curve (*Beginner*, *Intermediate*, or *Advanced*).
- **Audio Conversion:** The finalized story script is handed over to the **ElevenLabs API**, generating a high-quality, seamlessly spoken MP3 file.
- **Output:** The final audio-story is presented on the client via native Audio playback.

### 3. Module B: Podcast Generation
- **Input / Extraction:** Follows the exact robust pipeline as Module A (direct PDF / automated ArXiv retrieval).
- **Generation:** The LLM structures the core concepts from the text into a colloquial, conversational two-party script featuring a standard "Host" and "Guest".
- **Audio Conversion:** This is routed directly into an advanced implementation (`multi_podcast_labs`) powered by the **ElevenLabs API**, carefully mapping distinct voice profiles to the Host and Guest strings for an automated, multi-character auditory experience.
- **Output:** The compiled dialogue is delivered as a generated MP3 podcast.

### 4. Module C: Local Q/A Agent
- **Input:** The user asks a specific, localized question based on their uploaded content.
- **Validation (Context Check):** Hallucinations are actively mitigated. The chat module checks if the query strictly pertains to the active research paper bounds.
  - *If Off-topic:* The LLM rejects the request and breaks the loop.
  - *If On-topic:* The system proceeds.
- **Output:** A generated, targeted response is displayed based purely on the document's extracted knowledge graph.

---

<a id="tech-stack"></a>
## 💻 Tech Stack

| Layer | Category | Technologies |
| :--- | :--- | :--- |
| **Frontend** | Framework | Next.js 16 (React 19) |
| **Frontend** | Styling | Tailwind CSS 4, Shadcn UI |
| **Frontend** | Animations | Framer Motion, GSAP, Lenis |
| **Frontend** | Authentication | Clerk |
| **Frontend** | AI Integration | Vercel AI SDK |
| **Frontend** | Utilities | Monaco Editor, Razorpay |
| **Backend** | Framework | FastAPI (Python) |
| **Backend** | Database | Motor (MongoDB), Asyncpg (PostgreSQL) |
| **Backend** | Document Processing| PyMuPDF |
| **Backend** | LLM Integrations | Groq, OpenAI, Gemini |

---

<a id="getting-started"></a>
## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB / PostgreSQL Instances

### Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on development port `6969` (as configured).

### Backend Setup
Navigate to the `backend` directory, set up your Python environment, and start the FastAPI server:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
---
