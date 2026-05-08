const ResultCard = ({ tool, spend, recommendation, savings }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔧</span>
          <h3 className="text-base font-semibold text-gray-800 tracking-tight">{tool}</h3>
        </div>
        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase tracking-wide">
          Audit
        </span>
      </div>

      <hr className="border-gray-100" />

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Spend */}
        <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
            💸 Current Spend
          </span>
          <span className="text-lg font-bold text-gray-700">{spend}</span>
          <span className="text-xs text-gray-400">/ month</span>
        </div>

        {/* Monthly Savings */}
        <div className="bg-green-50 rounded-xl p-3 flex flex-col gap-1 border border-green-100">
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            📈 Est. Savings
          </span>
          <span className="text-lg font-bold text-green-600">{savings}</span>
          <span className="text-xs text-green-400">/ month</span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
        <span className="text-base mt-0.5">💡</span>
        <div>
          <p className="text-xs font-semibold text-blue-500 mb-0.5 uppercase tracking-wide">Recommendation</p>
          <p className="text-sm text-blue-800 leading-snug">{recommendation}</p>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-xl py-2.5 transition-colors duration-150">
        Take Action →
      </button>
    </div>
  );
};

// --- Demo ---
const sampleCards = [
  {
    tool: "Salesforce",
    spend: "$4,200",
    recommendation: "Downgrade 12 inactive seats to read-only licenses to cut overhead.",
    savings: "$840",
  },
  {
    tool: "Figma",
    spend: "$960",
    recommendation: "Consolidate 3 teams into a single org plan. Remove 8 unused seats.",
    savings: "$320",
  },
  {
    tool: "AWS",
    spend: "$11,500",
    recommendation: "Switch 4 dev instances to spot pricing and right-size 2 idle RDS clusters.",
    savings: "$2,300",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SaaS Spend Audit</h1>
          <p className="text-sm text-gray-400 mt-1">Review your tool subscriptions and optimize costs.</p>
        </div>

        {/* Summary Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium text-gray-600">Total Monthly Spend</span>
            <span className="text-base font-bold text-gray-800 ml-1">$16,660</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Potential Savings</span>
            <span className="text-base font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
              $3,460 / mo
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleCards.map((card, i) => (
            <ResultCard key={i} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}