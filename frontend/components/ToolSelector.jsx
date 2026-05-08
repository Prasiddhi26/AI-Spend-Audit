import { useState, useCallback } from "react";

const TOOLS = [
  { id: "cursor", label: "Cursor", icon: "⚡" },
  { id: "chatgpt", label: "ChatGPT", icon: "🤖" },
  { id: "claude", label: "Claude", icon: "🧠" },
  { id: "github-copilot", label: "GitHub Copilot", icon: "🐙" },
  { id: "gemini", label: "Gemini", icon: "✨" },
  { id: "windsurf", label: "Windsurf", icon: "🏄" },
];

function ToolSelector({ onChange }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      onChange?.(Array.from(next));
      return next;
    });
  }, [onChange]);

  const selectAll = () => {
    const all = new Set(TOOLS.map(t => t.id));
    setSelected(all);
    onChange?.(Array.from(all));
  };

  const clearAll = () => {
    setSelected(new Set());
    onChange?.([]);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">AI Tools</h2>
        <p className="text-sm text-gray-500 mt-0.5">Select the tools you use</p>
      </div>

      <ul className="space-y-2">
        {TOOLS.map(({ id, label, icon }) => {
          const checked = selected.has(id);
          return (
            <li key={id}>
              <label
                htmlFor={id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors select-none
                  ${checked
                    ? "bg-indigo-50 border border-indigo-200"
                    : "bg-gray-50 border border-transparent hover:bg-gray-100"
                  }`}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(id)}
                  className="w-4 h-4 accent-indigo-600 shrink-0"
                />
                <span className="text-lg leading-none">{icon}</span>
                <span className={`text-sm font-medium ${checked ? "text-indigo-700" : "text-gray-700"}`}>
                  {label}
                </span>
                {checked && (
                  <span className="ml-auto text-indigo-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2 mt-4">
        <button
          onClick={selectAll}
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">Selected ({selected.size})</p>
          <div className="flex flex-wrap gap-1.5">
            {Array.from(selected).map(id => {
              const tool = TOOLS.find(t => t.id === id);
              return (
                <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {tool.icon} {tool.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo parent wrapper
export default function App() {
  const [chosen, setChosen] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col items-center justify-center p-4 gap-4">
      <ToolSelector onChange={setChosen} />
      <div className="w-full max-w-sm rounded-xl bg-white border border-gray-200 shadow-sm p-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Parent callback output</p>
        <code className="text-xs text-gray-700 break-all">
          {chosen.length ? JSON.stringify(chosen) : "[]"}
        </code>
      </div>
    </div>
  );
}