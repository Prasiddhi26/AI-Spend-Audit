import { useState } from "react";

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

function PlanCard({ toolName, plans, selectedPlan, onSelect }) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">
          Pricing
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{toolName}</h2>
        <p className="text-sm text-gray-500 mt-1">Choose a plan that fits your workflow.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`
                relative text-left rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                ${isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-md scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm hover:scale-[1.01]"
                }
              `}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-indigo-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow">
                  <BoltIcon /> {plan.badge}
                </span>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>
                  {plan.name}
                </span>
                <span className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200
                  ${isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300"}
                `}>
                  {isSelected && <CheckIcon />}
                </span>
              </div>

              <div className="mb-4">
                <span className={`text-3xl font-extrabold ${isSelected ? "text-indigo-600" : "text-gray-900"}`}>
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                {plan.price !== 0 && (
                  <span className="text-xs text-gray-400 ml-1">/ mo</span>
                )}
              </div>

              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className={`mt-0.5 flex-shrink-0 ${isSelected ? "text-indigo-500" : "text-gray-400"}`}>
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Demo ---
const demoPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["10 requests / day", "Standard speed", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    badge: "Popular",
    features: ["Unlimited requests", "Priority speed", "Email support", "API access"],
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    features: ["Everything in Pro", "5 team seats", "Admin dashboard", "SSO & audit logs"],
  },
];

export default function App() {
  const [selected, setSelected] = useState("pro");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <PlanCard
          toolName="Claude AI"
          plans={demoPlans}
          selectedPlan={selected}
          onSelect={setSelected}
        />
        <div className="px-6 pb-6">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-150 shadow-sm">
            Continue with {demoPlans.find(p => p.id === selected)?.name}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">No credit card required for Free plan.</p>
        </div>
      </div>
    </div>
  );
}