import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark, shadesOfPurple } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mentoro-AI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            {/* Modern Creative Footer */}
            <footer className="relative bg-muted/50 py-12 overflow-hidden">
              {/* Animated gradient orbs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="container mx-auto px-4 text-center relative z-10">
                {/* Main text with gradient */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-2xl animate-bounce">🚀</span>
                  <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Made by Team Mentoro AI
                  </p>
                  <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                </div>

                {/* Team members with hover effect */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400">
                  <span className="group cursor-default">
                    <span className="inline-block transition-transform group-hover:scale-110 group-hover:text-purple-400">
                      👨‍💻 Ritik Parmar
                    </span>
                  </span>
                  
                  <span className="text-gray-600">•</span>
                  
                  <span className="group cursor-default">
                    <span className="inline-block transition-transform group-hover:scale-110 group-hover:text-pink-400">
                      👨‍💻 Raghav Laad
                    </span>
                  </span>
                  
                  <span className="text-gray-600">•</span>
                  
                  <span className="group cursor-default">
                    <span className="inline-block transition-transform group-hover:scale-110 group-hover:text-blue-400">
                      👨‍💻 Rahul Chouhan
                    </span>
                  </span>
                  
                  <span className="text-gray-600">•</span>
                  
                  <span className="group cursor-default">
                    <span className="inline-block transition-transform group-hover:scale-110 group-hover:text-green-400">
                      👨‍💻 Rishabh Malviya
                    </span>
                  </span>
                </div>

                {/* Decorative line */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                  <span className="text-xl">💜</span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}