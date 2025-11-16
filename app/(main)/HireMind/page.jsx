"use client";

import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Rocket,
  Zap,
  Bell,
  Brain,
  Code,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Linkedin,
  Send,
  Sheet,
  ArrowRight,
  ExternalLink,
  Download,
  ChevronRight,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function Page() {
  const [activeSection, setActiveSection] = useState("intro");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const Section = ({ children, id }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUp}
        id={id}
        className="mb-16"
      >
        {children}
      </motion.div>
    );
  };

  const techStack = [
    { name: "n8n", color: "from-pink-500 to-rose-500" },
    { name: "LinkedIn", color: "from-blue-500 to-cyan-500" },
    { name: "Telegram", color: "from-sky-500 to-blue-500" },
    { name: "Google AI", color: "from-purple-500 to-pink-500" },
  ];

  const features = [
    {
      icon: <Linkedin className="w-8 h-8" />,
      title: "Automated LinkedIn Scraping",
      description:
        "Daily job searches matching your exact criteria with smart filtering",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Resume Matching",
      description:
        "Intelligent scoring system that matches jobs to your experience",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Custom Cover Letters",
      description:
        "AI-generated personalized cover letters for each opportunity",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Instant Telegram Alerts",
      description: "Real-time notifications for high-scoring job matches",
    },
  ];

  const tableOfContents = [
    { id: "intro", title: "What We're Building", step: 0 },
    { id: "prerequisites", title: "Prerequisites", step: 0 },
    { id: "foundation", title: "Setting Up Foundation", step: 1 },
    { id: "resume", title: "Resume Storage", step: 2 },
    { id: "sheets", title: "Google Sheets Setup", step: 3 },
    { id: "linkedin", title: "LinkedIn Search", step: 4 },
    { id: "fetch", title: "Fetching Jobs", step: 5 },
    { id: "processing", title: "Processing Jobs", step: 6 },
    { id: "parsing", title: "Parsing Job Info", step: 7 },
    { id: "ai", title: "AI Resume Matching", step: 8 },
    { id: "aioutput", title: "Processing AI Output", step: 9 },
    { id: "storing", title: "Storing Results", step: 10 },
    { id: "filtering", title: "Filtering Matches", step: 11 },
    { id: "telegram", title: "Telegram Notifications", step: 12 },
    { id: "loop", title: "Closing the Loop", step: 13 },
    { id: "testing", title: "Testing & Deploy", step: 14 },
    { id: "troubleshooting", title: "Troubleshooting", step: 0 },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-32 pb-20 px-6 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <Rocket className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">
              Automation Tutorial
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight"
          >
            Build an AI-Powered Job Search Bot with n8n
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-300 mb-8 leading-relaxed"
          >
            Automate your job search with LinkedIn scraping, AI-powered resume
            matching, and instant Telegram notifications. Never miss the perfect
            opportunity again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>October 14, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>25 min read</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            {techStack.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} bg-opacity-20 backdrop-blur-sm border border-white/10`}
              >
                {tech.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-12">
        {/* Sticky TOC - Desktop Only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {item.step > 0 && (
                    <span className="text-xs opacity-60">
                      Part {item.step} ·{" "}
                    </span>
                  )}
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article Content */}
        <article className="flex-1 max-w-3xl">
          <Section id="intro">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              What We're Building
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              An intelligent workflow that automates your entire job search
              process. Here's what it does:
            </p>
            <div className="space-y-4 bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              {[
                "Searches LinkedIn for jobs matching your criteria (daily at 5 PM)",
                "Uses AI to score how well each job matches your resume",
                "Generates custom cover letters for each position",
                "Stores everything in Google Sheets for easy tracking",
                "Sends Telegram notifications for high-scoring opportunities",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          <Section id="prerequisites">
            <h2 className="text-4xl font-bold mb-6">Prerequisites</h2>
            <p className="text-slate-300 mb-6">Before we begin, you'll need:</p>
            <ul className="space-y-3">
              {[
                "An n8n instance (Click here to see installation tutorial)",
                "A Google account (for Drive & Sheets)",
                "A Telegram account",
                "A Google Gemini API key (free tier available)",
                "Your resume in PDF format",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="foundation">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-4xl font-bold">Setting Up the Foundation</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 1:</span> Create a New
                  Workflow in n8n
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Log into your n8n instance</li>
                  <li>Click "Create new workflow"</li>
                  <li>
                    Name it:{" "}
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded">
                      AI Job Application Assistant
                    </span>
                  </li>
                  <li>Save the workflow</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 2:</span> Add the
                  Schedule Trigger
                </h3>
                <p className="text-slate-300 mb-4">
                  This triggers the workflow daily at 5 PM.
                </p>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside mb-4">
                  <li>Click the "+" button to add a node</li>
                  <li>Search for and select "Schedule Trigger"</li>
                  <li>Configure it:</li>
                </ol>
                <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm space-y-1 text-cyan-300">
                  <div>
                    Mode: <span className="text-white">Interval</span>
                  </div>
                  <div>
                    Interval: <span className="text-white">Days</span>
                  </div>
                  <div>
                    Days Between Triggers: <span className="text-white">1</span>
                  </div>
                  <div>
                    Trigger at Hour:{" "}
                    <span className="text-white">17 (5 PM)</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="resume">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-4xl font-bold">Resume Storage Setup</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 3:</span> Upload Your
                  Resume to Google Drive
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Go to Google Drive</li>
                  <li>Upload your resume PDF</li>
                  <li>Right-click the file → "Get link"</li>
                  <li>Copy the file ID from the URL</li>
                </ol>
                <div className="mt-4 bg-slate-900 p-4 rounded-lg">
                  <code className="text-cyan-300 text-sm break-all">
                    https://drive.google.com/file/d/[FILE_ID_HERE]/view
                  </code>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 5:</span> Add the
                  "Download file" Node
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Add a new node after Schedule Trigger</li>
                  <li>Search for "Google Drive"</li>
                  <li>
                    Configure: Credential: Select your Google Drive account
                  </li>
                  <li>Operation: Download</li>
                  <li>File ID (By URL): Enable "Expression"</li>
                  <li>Test the node, it should download your resume</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 6:</span> Add "Extract
                  from File" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This extracts text from your PDF resume.
                </p>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Add a new node after "Download file"</li>
                  <li>Search for "Extract from File"</li>
                  <li>Configure Operation: PDF</li>
                  <li>Binary Property: data (default)</li>
                  <li>
                    Execute the node - You should see your resume text in the
                    output
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-xl">
                <div className="flex gap-3">
                  <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-300 mb-2">Pro Tip</h4>
                    <p className="text-slate-300 text-sm">
                      Keep your resume file ID handy. You'll need it when
                      configuring the Google Drive node in n8n.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="sheets">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-4xl font-bold">
                Job Search Preferences with Google Sheets
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 7:</span> Create Your
                  Google Sheets Database
                </h3>
                <p className="text-slate-300 mb-4">
                  Create two sheets in a new Google Spreadsheet:
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-cyan-300 mb-2">
                      Sheet 1: "Filter" (Job Search Criteria)
                    </h4>
                    <div className="overflow-x-auto bg-slate-900 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-cyan-400 border-b border-slate-700">
                            <th className="text-left p-2">Keyword</th>
                            <th className="text-left p-2">Location</th>
                            <th className="text-left p-2">Experience Level</th>
                            <th className="text-left p-2">Remote</th>
                            <th className="text-left p-2">Job Type</th>
                            <th className="text-left p-2">Easy Apply</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-slate-300">
                            <td className="p-2">React JS</td>
                            <td className="p-2">Gurugram</td>
                            <td className="p-2 text-xs">
                              Entry level, Mid-Senior
                            </td>
                            <td className="p-2">Remote, Hybrid</td>
                            <td className="p-2">Full-time</td>
                            <td className="p-2">TRUE</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-cyan-300 mb-2">
                      Sheet 2: "Result" (Job Storage)
                    </h4>
                    <div className="overflow-x-auto bg-slate-900 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-cyan-400 border-b border-slate-700">
                            <th className="text-left p-2">Title</th>
                            <th className="text-left p-2">Company</th>
                            <th className="text-left p-2">Location</th>
                            <th className="text-left p-2">link</th>
                            <th className="text-left p-2">description</th>
                            <th className="text-left p-2">score</th>
                            <th className="text-left p-2">Cover Letter</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-slate-500 text-xs">
                            <td className="p-2" colSpan="7">
                              (empty, will be filled automatically)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 9:</span> Add "Get row(s)
                  in sheet" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This reads your job search preferences.
                </p>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Add a new node after "Extract from File"</li>
                  <li>Search for "Google Sheets"</li>
                  <li>Configure: Operation: Get Many</li>
                  <li>Document: Select your spreadsheet</li>
                  <li>Sheet: Filter</li>
                  <li>Execute - You should see your search criteria</li>
                </ol>
              </div>
            </div>
          </Section>

          <Section id="linkedin">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-4xl font-bold">
                Building the LinkedIn Search URL
              </h2>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">Step 10:</span> Add "Create
                search URL" Code Node
              </h3>
              <p className="text-slate-300 mb-4">
                This converts your preferences into a LinkedIn search URL.
              </p>

              <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs text-cyan-300">
                  {`let url = "https://www.linkedin.com/jobs/search/?f_TPR=r86400"

const keyword = $input.first().json.Keyword
const location = $input.first().json.Location
const experienceLevel = $input.first().json['Experience Level']
// ... transformation logic for LinkedIn codes`}
                </pre>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                This code transforms your filter criteria into LinkedIn's URL
                parameters for experience levels, remote options, and job types.
              </p>
            </div>
          </Section>

          <Section id="fetch">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-4xl font-bold">
                Fetching Jobs from LinkedIn
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 11:</span> Add "Fetch
                  Jobs from LinkedIn" HTTP Request
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Add a new node after "Create search URL"</li>
                  <li>Search for "HTTP Request"</li>
                  <li>Configure: Method: GET</li>
                  <li>URL: {"={{ $json.url }}"}</li>
                  <li>Execute - You should see LinkedIn's HTML response</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 12:</span> Add "Extract
                  Job Links" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This extracts all job URLs from the search results.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg space-y-2 text-sm">
                  <div className="text-cyan-300">
                    Operation: Extract HTML Content
                  </div>
                  <div className="text-slate-300">
                    CSS Selector:{" "}
                    <code className="bg-slate-950 px-2 py-1 rounded">
                      ul.jobs-search__results-list li div a
                    </code>
                  </div>
                  <div className="text-slate-300">
                    Return Value: Attribute (href)
                  </div>
                  <div className="text-slate-300">Return Array: ✅ Enabled</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 13:</span> Add "Split
                  Out" Node
                </h3>
                <p className="text-slate-300">
                  This converts the array of URLs into individual items so we
                  can process each job separately.
                </p>
              </div>
            </div>
          </Section>

          <Section id="processing">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                6
              </div>
              <h2 className="text-4xl font-bold">
                Processing Jobs with Rate Limiting
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 14:</span> Add "Loop Over
                  Items" Node
                </h3>
                <p className="text-slate-300">
                  This processes jobs one at a time with Batch Size: 1
                </p>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 15:</span> Add "Wait"
                  Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This adds an 8-second delay between requests to avoid rate
                  limiting.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg space-y-1 text-sm">
                  <div className="text-cyan-300">
                    Resume: After Time Interval
                  </div>
                  <div className="text-slate-300">Wait Amount: 8</div>
                  <div className="text-slate-300">Unit: Seconds</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 16:</span> Add "Fetch Job
                  Page" HTTP Request
                </h3>
                <p className="text-slate-300 mb-4">
                  This fetches the full job description page.
                </p>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Add a new node after "Wait"</li>
                  <li>Search for "HTTP Request"</li>
                  <li>Configure: Method: GET</li>
                  <li>URL: {"={{ $json.links }}"}</li>
                  <li>Options → Retry On Fail: ✅ Enabled</li>
                  <li>Wait Between Tries: 5000 ms</li>
                </ol>
              </div>
            </div>
          </Section>

          <Section id="parsing">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                7
              </div>
              <h2 className="text-4xl font-bold">Parsing Job Information</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 17:</span> Add "Parse Job
                  Attributes" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This extracts structured data from the job page HTML.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm bg-slate-900 rounded-lg">
                    <thead>
                      <tr className="text-cyan-400 border-b border-slate-700">
                        <th className="text-left p-3">Key</th>
                        <th className="text-left p-3">CSS Selector</th>
                        <th className="text-left p-3">Return Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-slate-800">
                        <td className="p-3">title</td>
                        <td className="p-3 text-xs">div h1</td>
                        <td className="p-3">Text</td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td className="p-3">company</td>
                        <td className="p-3 text-xs">div span a</td>
                        <td className="p-3">Text</td>
                      </tr>
                      <tr className="border-b border-slate-800">
                        <td className="p-3">location</td>
                        <td className="p-3 text-xs">
                          div span[class*='topcard__flavor']
                        </td>
                        <td className="p-3">Text</td>
                      </tr>
                      <tr>
                        <td className="p-3">description</td>
                        <td className="p-3 text-xs">div.description__text</td>
                        <td className="p-3">Text</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 18:</span> Add "Modify
                  Job Attributes" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This cleans up and formats the extracted data.
                </p>
                <div className="bg-slate-900 p-4 rounded-lg space-y-3 text-sm">
                  <div>
                    <div className="text-cyan-300 mb-1">
                      Assignment 1: Clean description
                    </div>
                    <code className="text-slate-300 text-xs">
                      {'{{ $json.description.replaceAll(/\\s+/g, " ") }}'}
                    </code>
                  </div>
                  <div>
                    <div className="text-cyan-300 mb-1">
                      Assignment 2: Extract job ID
                    </div>
                    <code className="text-slate-300 text-xs">
                      {'{{ $json.jobid.split(":").last() }}'}
                    </code>
                  </div>
                  <div>
                    <div className="text-cyan-300 mb-1">
                      Assignment 3: Create apply link
                    </div>
                    <code className="text-slate-300 text-xs">
                      {
                        '{{ "https://www.linkedin.com/jobs/view/" + $json.jobid }}'
                      }
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="ai">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold">
                8
              </div>
              <h2 className="text-4xl font-bold">AI-Powered Resume Matching</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-400">Step 19:</span> Get Your
                  Google Gemini API Key
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Go to Google AI Studio</li>
                  <li>Click "Create API Key"</li>
                  <li>Copy the key and save it securely</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-purple-400">Step 22:</span> Add "AI
                  Agent" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  This is where the magic happens – AI analyzes the job fit.
                </p>

                <div className="bg-slate-900 p-6 rounded-lg space-y-4">
                  <p className="text-sm text-slate-400">AI Prompt Template:</p>
                  <div className="bg-slate-950 p-4 rounded text-xs text-slate-300 leading-relaxed overflow-x-auto">
                    <p className="mb-3">
                      You are an assistant that helps match candidates to job
                      opportunities. Your task is to review my resume, then
                      analyze both the resume and job description to calculate a
                      job matching score.
                    </p>
                    <p className="mb-3">
                      Additionally, create a cover letter based on my resume and
                      the job description. The cover letter should contain at
                      least 2 paragraphs and should exclude the name, address,
                      and signature sections.
                    </p>
                    <p className="mb-3">
                      When using special characters like quotation marks ("),
                      ensure they are properly escaped with a backslash. The
                      output must be formatted as valid JSON that can be parsed
                      without errors.
                    </p>
                    <p className="text-cyan-300">
                      Example response: {"{"}&#34;score&#34;: 80,
                      &#34;coverLetter&#34;: &#34;sample cover letter&#34;{"}"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 rounded-lg">
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-purple-400">Note:</span> The
                    AI will take 10-30 seconds to process each job. This is
                    normal for complex analysis tasks.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="aioutput">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                9
              </div>
              <h2 className="text-4xl font-bold">Processing AI Output</h2>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">Step 23:</span> Add "Parse AI
                Output" Node
              </h3>
              <p className="text-slate-300 mb-4">
                The AI returns JSON wrapped in markdown code blocks, we need to
                clean it.
              </p>
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-sm text-cyan-300 mb-2">Configure:</p>
                <code className="text-slate-300 text-xs">
                  {'{{ $json.output.replaceAll(/```(?:json)?/g, "") }}'}
                </code>
                <p className="text-slate-400 text-xs mt-3">
                  This removes ``` and ```json markers to get clean JSON
                </p>
              </div>
            </div>
          </Section>

          <Section id="storing">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                10
              </div>
              <h2 className="text-4xl font-bold">
                Storing Results in Google Sheets
              </h2>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">Step 24:</span> Add "Append or
                update row in sheet" Node
              </h3>
              <p className="text-slate-300 mb-4">
                This saves job data to your spreadsheet and prevents duplicates.
              </p>
              <div className="space-y-3">
                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-sm text-cyan-300 mb-2">Configuration:</p>
                  <div className="text-slate-300 text-sm space-y-1">
                    <div>Operation: Append or Update</div>
                    <div>Sheet: Result</div>
                    <div>Matching Columns: link (prevents duplicates)</div>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">
                  Map columns: Title, Company, Location, link, description,
                  score, Cover Letter
                </div>
              </div>
            </div>
          </Section>

          <Section id="filtering">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                11
              </div>
              <h2 className="text-4xl font-bold">
                Filtering High-Quality Matches
              </h2>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">Step 25:</span> Add "Score
                Filter" Node
              </h3>
              <p className="text-slate-300 mb-4">
                Only notify you about jobs with good match scores.
              </p>
              <div className="bg-slate-900 p-4 rounded-lg">
                <p className="text-sm text-cyan-300 mb-2">Condition:</p>
                <div className="text-slate-300 text-sm space-y-1">
                  <div>Value 1: {"{{ $json.score }}"}</div>
                  <div>Operation: Larger or Equal</div>
                  <div>Value 2: 50</div>
                </div>
              </div>
              <div className="mt-4 text-slate-400 text-sm">
                <p>This creates two branches:</p>
                <p className="text-green-400">
                  ✓ True: Score ≥ 50 (send notification)
                </p>
                <p className="text-slate-500">
                  ✗ False: Score &lt; 50 (continue to next job)
                </p>
              </div>
            </div>
          </Section>

          <Section id="telegram">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center font-bold">
                12
              </div>
              <h2 className="text-4xl font-bold">Telegram Notifications</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 26:</span> Create a
                  Telegram Bot
                </h3>
                <ol className="space-y-3 text-slate-300 list-decimal list-inside">
                  <li>
                    Open Telegram and search for{" "}
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded">
                      @BotFather
                    </span>
                  </li>
                  <li>
                    Send{" "}
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded">
                      /newbot
                    </span>
                  </li>
                  <li>Follow the prompts to name your bot</li>
                  <li>Copy the API Token (looks like 123456789:ABCdef...)</li>
                  <li>Start a chat with your bot</li>
                  <li>Get your Chat ID from the getUpdates endpoint</li>
                </ol>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">Step 28:</span> Add "Send a
                  text message" Node
                </h3>
                <p className="text-slate-300 mb-4">
                  Notification Message Template:
                </p>
                <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm text-cyan-300 space-y-1">
                  <div>Title: {"{{ title }}"}</div>
                  <div>Company: {"{{ company }}"}</div>
                  <div>Location: {"{{ location }}"}</div>
                  <div>Job Score: {"{{ score }}"}</div>
                  <div>Apply: {"{{ applyLink }}"}</div>
                  <div className="text-slate-500 text-xs mt-2">
                    Copy Cover Letter from Google Sheets →
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="loop">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                13
              </div>
              <h2 className="text-4xl font-bold">Closing the Loop</h2>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-400">Step 29:</span> Connect
                Everything Together
              </h3>
              <p className="text-slate-300 mb-4">
                Now we need to complete the loop so the workflow processes all
                jobs.
              </p>
              <ul className="space-y-2 text-slate-300 list-disc list-inside">
                <li>
                  Connect the "Send a text message" output back to "Loop Over
                  Items"
                </li>
                <li>
                  Connect the "False" output of "Score Filter" back to "Loop
                  Over Items"
                </li>
                <li>Connect "Loop Over Items" second output to "Wait"</li>
              </ul>

              <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-4 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-bold text-cyan-400">
                    Complete Flow:
                  </span>{" "}
                  Schedule → Download → Extract → Get Sheets → Create URL →
                  Fetch Jobs → Extract Links → Split → Loop → Wait → Fetch Page
                  → Parse → Modify → AI Agent → Parse Output → Save to Sheets →
                  Filter → Telegram → Loop Back
                </p>
              </div>
            </div>
          </Section>

          <Section id="testing">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold">
                14
              </div>
              <h2 className="text-4xl font-bold">Testing & Deployment</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-green-300">
                  Step 31: Test the Complete Workflow
                </h3>
                <p className="text-slate-300 mb-4">
                  Click "Execute Workflow" and verify:
                </p>
                <div className="space-y-2">
                  {[
                    "Google Sheets populated with job data",
                    "Telegram notifications received for high-scoring jobs",
                    "Cover letters generated correctly",
                    "All nodes execute without errors",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-slate-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4">
                  Step 32: Activate the Workflow
                </h3>
                <p className="text-slate-300 mb-3">
                  Toggle the "Active" switch in the top-right corner.
                </p>
                <p className="text-cyan-400 font-semibold">
                  The workflow will now run automatically every day at 5 PM! 🎉
                </p>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-2xl font-bold mb-4">
                  Step 33: Monitor & Optimize
                </h3>
                <p className="text-slate-300 mb-4">Common adjustments:</p>
                <ul className="space-y-2 text-slate-300 list-disc list-inside">
                  <li>Lower the score threshold to get more notifications</li>
                  <li>Adjust keywords for better job matches</li>
                  <li>Modify the AI prompt for better cover letters</li>
                  <li>Change the schedule trigger time</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="troubleshooting">
            <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
              <AlertCircle className="w-10 h-10 text-yellow-400" />
              Troubleshooting
            </h2>
            <div className="space-y-4">
              {[
                {
                  issue: "No jobs found",
                  solution:
                    "Check your LinkedIn search URL. Visit it in a browser to verify jobs exist.",
                },
                {
                  issue: "AI agent fails",
                  solution:
                    "Verify your Google Gemini API key is valid and has remaining quota.",
                },
                {
                  issue: "Rate limit errors",
                  solution: 'Increase the "Wait" time from 8 to 15 seconds.',
                },
                {
                  issue: "Malformed JSON from AI",
                  solution:
                    'The "Parse AI Output" node should handle markdown formatting. Verify the regex is correct.',
                },
                {
                  issue: "Telegram messages not sending",
                  solution:
                    "Verify your chat ID is correct by sending /start to your bot first.",
                },
                {
                  issue: "Google Sheets not updating",
                  solution:
                    "Check that column names match exactly (case-sensitive).",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-yellow-500/30 transition-colors"
                >
                  <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span className="text-red-500">●</span> Issue: {item.issue}
                  </h4>
                  <p className="text-slate-300 text-sm pl-5">
                    <span className="text-green-400 font-semibold">
                      Solution:
                    </span>{" "}
                    {item.solution}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm p-10 rounded-2xl border border-cyan-500/20 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <Rocket className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-4">
              Ready to Automate Your Job Search?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Start building your intelligent job search assistant today and
              never miss another opportunity that matches your skills!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://n8n.io", "_blank")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 border border-slate-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:border-cyan-500/50 transition-colors"
              >
                <Download className="w-5 h-5" /> Download Workflow
              </motion.button> */}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Built with n8n, Google Gemini AI, and lots of ☕</p>
            <p className="mt-2">Happy Automating! 🚀</p>
          </div>
        </article>
      </div>
    </div>
  );
}
