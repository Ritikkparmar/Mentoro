
"use client";// ...existing code...
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || (typeof body === "object" && typeof body.input !== "string")) {
      return NextResponse.json(
        { error: "Invalid request. Send { input: string, mode?: string }" },
        { status: 400 }
      );
    }

    const payload = typeof body === "string" ? { input: body } : body;
    const result = await getReview(payload);

    return NextResponse.json(result);
  } catch (err) {
    console.error("get-review route error:", err);
    const message = err?.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
// ...existing code...
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const OutputDisplay = ({ output, active, warnings = {} }) => {
  const [activeTab, setActiveTab] = useState(active);

  const tabs = [
    { 
      id: "review", 
      label: "Code Review", 
      content: output.review,
      warning: warnings.review
    },
    {
      id: "simple",
      label: "Quick Summary",
      content: output.explanationSimple,
      warning: warnings.explanationSimple
    },
    {
      id: "technical",
      label: "Deep Dive",
      content: output.explanationTechnical,
      warning: warnings.explanationTechnical
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.content);

  return (
    <div className="text-white h-fit">
      <div className="max-w-5xl">
        <div className="flex space-x-0.5">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm flex-1 cursor-pointer  ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-800 text-gray-200 hover:bg-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {availableTabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id}>
                {tab.warning && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-yellow-200 text-sm font-medium">
                        {tab.warning}
                      </span>
                    </div>
                  </div>
                )}
                <MDEditor.Markdown
                  source={tab.content}
                  className="bg-gray-700 p-4 sm:p-8 markdown-output"
                />
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;