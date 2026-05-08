import { useState } from "react";

const NAV_LINKS = [
  { label: "Home",  href: "/" },
  { label: "Audit", href: "/audit" },
  { label: "Docs",  href: "/docs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none">
            AI
          </span>
          <span className="text-gray-900 font-semibold text-base tracking-tight group-hover:text-indigo-600 transition-colors">
            AI Spend Audit
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) =>
            label === "Audit" ? (
              <a
                key={label}
                href={href}
                className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                {label}
              </a>
            ) : (
              <a
                key={label}
                href={href}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {label}
              </a>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) =>
            label === "Audit" ? (
              <a
                key={label}
                href={href}
                className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              >
                {label}
              </a>
            ) : (
              <a
                key={label}
                href={href}
                className="px-4 py-2.5 rounded-lg text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
}