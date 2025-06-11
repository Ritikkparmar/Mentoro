# 🔮 Mentoro AI – Full Stack AI Career Coach

**Mentoro AI** is an AI-powered career platform built using modern full-stack tools. It helps job seekers with AI-generated resumes, cover letters, interview prep, career insights, and personalized roadmaps using **Google Gemini AI**.



## 🚀 Features

- 📄 **AI Resume & Cover Letter Generator** using Gemini
- 🧠 **Mock Interviews** with instant feedback
- 📈 **Industry Insights** – salary, skill demand, growth rate
- 🗺️ **Explore Roadmap** – personalized learning paths for roles
- 🔐 **Secure Auth** using Clerk
- 🌀 **Serverless Flows** using Inngest
- 💅 **Modern UI** with Tailwind & Shadcn UI

---

## 🧰 Tech Stack

- **Framework:** Next.js (JavaScript, App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** Neon DB (PostgreSQL) + Prisma
- **Authentication:** Clerk
- **AI Model:** Gemini AI (Google Generative AI)
- **Background Jobs:** Inngest
- **Hosting:** Vercel

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mentoro-ai.git
cd mentoro-ai
2. Install dependencies
bash
Copy
Edit
npm install
3. Create .env file
env
Copy
Edit
DATABASE_URL=your_neon_db_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=your_google_gemini_api_key
4. Push schema and start dev server
bash
Copy
Edit
npx prisma db push
npm run dev