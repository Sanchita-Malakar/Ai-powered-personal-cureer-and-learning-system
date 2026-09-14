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
- **Backend & Authentication**: [Supabase](https://supabase.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sanchita-Malakar/Ai-powered-personal-cureer-and-learning-system.git
   cd Ai-powered-personal-cureer-and-learning-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Supabase in `src/supabaseClient.js`:
   ```javascript
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_PUBLIC_KEY = "your-anon-public-key";
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) (or the active port reported by Next.js) in your browser.

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & theme initialization
│   │   ├── page.tsx           # Protected student dashboard
│   │   ├── signin/page.tsx    # Supabase email & phone sign in
│   │   └── signup/page.tsx    # Supabase student registration
│   ├── components/
│   │   ├── auth/              # AuthLayout & AuthGuard route protection
│   │   └── dashboard/         # Hero, Metrics, AiTodaysPlan, TiltCard, Sidebar, Navbar
│   ├── hooks/                 # Dashboard state and logic hooks
│   └── supabaseClient.js      # Supabase client initialization
└── ...
```

---

## 📄 License

This project is created for educational and career acceleration purposes.
