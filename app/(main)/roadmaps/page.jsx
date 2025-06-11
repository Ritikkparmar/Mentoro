'use client';

import { motion } from 'framer-motion';

const roles = [
  'Frontend', 'Backend', 'DevOps', 'Full Stack', 'AI Engineer',
  'Data Analyst', 'AI and Data Scientist', 'Android', 'iOS', 'PostgreSQL',
  'Blockchain', 'QA', 'Software Architect', 'Cyber Security', 'UX Design',
  'Game Developer', 'Technical Writer', 'MLOps', 'Product Manager',
  'Engineering Manager', 'Developer Relations', 'DSA', 'Prompt Engineering'
];

// Use Google Docs Viewer for better mobile compatibility
const pdfBase = 'https://roadmap.sh/pdfs/roadmaps/';
const roleLinks = {
  'Frontend': `https://docs.google.com/viewer?url=${pdfBase}frontend.pdf&embedded=true`,
  'Backend': `https://docs.google.com/viewer?url=${pdfBase}backend.pdf&embedded=true`,
  'DevOps': `https://docs.google.com/viewer?url=${pdfBase}devops.pdf&embedded=true`,
  'Full Stack': `https://docs.google.com/viewer?url=${pdfBase}full-stack.pdf&embedded=true`,
  'AI Engineer': `https://docs.google.com/viewer?url=${pdfBase}ai-engineer.pdf&embedded=true`,
  'Data Analyst': `https://docs.google.com/viewer?url=${pdfBase}data-analyst.pdf&embedded=true`,
  'AI and Data Scientist': `https://docs.google.com/viewer?url=${pdfBase}ai-data-scientist.pdf&embedded=true`,
  'Android': `https://docs.google.com/viewer?url=${pdfBase}android.pdf&embedded=true`,
  'iOS': `https://docs.google.com/viewer?url=${pdfBase}ios.pdf&embedded=true`,
  'PostgreSQL': `https://docs.google.com/viewer?url=${pdfBase}postgresql-dba.pdf&embedded=true`,
  'Blockchain': `https://docs.google.com/viewer?url=${pdfBase}blockchain.pdf&embedded=true`,
  'QA': `https://docs.google.com/viewer?url=${pdfBase}qa.pdf&embedded=true`,
  'Software Architect': `https://docs.google.com/viewer?url=${pdfBase}software-architect.pdf&embedded=true`,
  'Cyber Security': `https://docs.google.com/viewer?url=${pdfBase}cyber-security.pdf&embedded=true`,
  'UX Design': `https://docs.google.com/viewer?url=${pdfBase}ux-design.pdf&embedded=true`,
  'Game Developer': `https://docs.google.com/viewer?url=${pdfBase}game-developer.pdf&embedded=true`,
  'Technical Writer': `https://docs.google.com/viewer?url=${pdfBase}technical-writer.pdf&embedded=true`,
  'MLOps': `https://docs.google.com/viewer?url=${pdfBase}mlops.pdf&embedded=true`,
  'Product Manager': `https://docs.google.com/viewer?url=${pdfBase}product-manager.pdf&embedded=true`,
  'Engineering Manager': `https://docs.google.com/viewer?url=${pdfBase}engineering-manager.pdf&embedded=true`,
  'Developer Relations': `https://docs.google.com/viewer?url=${pdfBase}devrel.pdf&embedded=true`,
  'DSA': `https://docs.google.com/viewer?url=${pdfBase}datastructures-and-algorithms.pdf&embedded=true`,
  'Prompt Engineering': `https://docs.google.com/viewer?url=${pdfBase}prompt-engineering.pdf&embedded=true`
};

export default function Page() {
  const handleRoleClick = (role) => {
    window.location.replace(roleLinks[role]);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black to-neutral-900 text-white p-6 overflow-hidden">
      <div className="z-10 w-full max-w-6xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4"
        >
          Explore Role-Based Roadmaps
        </motion.h1>
        <p className="text-lg sm:text-xl mb-10 italic text-gray-300">
          "A roadmap is not a rulebook—it's your compass through chaos."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center px-4 font-semibold cursor-pointer transition-all hover:bg-purple-700"
              onClick={() => handleRoleClick(role)}
            >
              {role}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
