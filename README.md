# AI-Powered Personal Career & Learning System (CareerOS)

An intelligent, deterministic student career acceleration platform designed to bridge the gap between academic education and industry benchmarks. Built with Next.js 14, React, Tailwind CSS, and Supabase.

---

## 🌟 Key Features

- **Supabase Authentication**: Full student onboarding and session management with Email, Phone Number, Full Name, and Target Role selection.
- **Route Guard Protection (`AuthGuard`)**: Strict client-side route protection preventing unauthenticated access to dashboard analytics and roadmaps.
- **Academic Theme System**: Collegiate Royal Blue and Slate design tokens with integrated Light/Dark mode toggling.
- **3D Perspective Tilt Physics**: Interactive cards with cursor-tracking tilt angles and dynamic specular glare sheen.
- **Leftmost Tooltip System**: Golden-amber floating tooltips highlighting navigation fields on hover.
- **Daily AI Action Drills**: Priority tasks, milestone progress, and skill gap analysis.
- **Role Readiness Index**: Deterministic competency score tracking against live industry job requirements.
- **Responsive Architecture**: Fully responsive desktop, tablet, and mobile drawer views.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **State & Local Storage**: Native React Hooks & Browser Storage

---

## 🌐 Live Production Deployment

- **Production App**: [https://ai-powered-personal-cureer-and-lear.vercel.app](https://ai-powered-personal-cureer-and-lear.vercel.app)
- **Deployment Platform**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Local Installation & Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Sanchita-Malakar/Ai-powered-personal-cureer-and-learning-system.git
   cd Ai-powered-personal-cureer-and-learning-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_APP_URL="https://ai-powered-personal-cureer-and-lear.vercel.app"
   NEXT_PUBLIC_SUPABASE_URL="https://ksilwfcitxibstosdiqu.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   # GitHub App Production Credentials
   GITHUB_APP_ID="..."
   GITHUB_APP_SLUG="..."
   GITHUB_APP_CLIENT_ID="..."
   GITHUB_APP_CLIENT_SECRET="..."
   GITHUB_APP_PRIVATE_KEY="..."
   GITHUB_WEBHOOK_SECRET="..."
   GEMINI_API_KEY="..."
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) for local development, or access the live app directly at [https://ai-powered-personal-cureer-and-lear.vercel.app](https://ai-powered-personal-cureer-and-lear.vercel.app).

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & theme initialization
│   │   ├── page.tsx           # Main interactive student dashboard
│   │   ├── onboarding/        # Multi-step profile setup wizard
│   │   ├── roadmap/           # Skill & career milestones
│   │   ├── jobs/              # Application tracking pipeline
│   │   ├── resume/            # ATS resume analyzer & suggestions
│   │   ├── interview/         # Behavioral & technical question simulator
│   │   ├── dsa/               # Algorithm & data structures practice
│   │   ├── learning/          # Curated learning pathways
│   │   ├── mentor/            # AI career coach & action planner
│   │   ├── progress/          # Readiness analytics & metrics
│   │   ├── profile/           # Academic background & skills inventory
│   │   └── settings/          # Theme & preferences
│   ├── components/            # Reusable UI cards, tables, charts, & navigation
│   └── hooks/                 # Profile state, hydration & dashboard logic
└── ...
```

---

## 📄 License

This project is created for educational and career acceleration purposes.
