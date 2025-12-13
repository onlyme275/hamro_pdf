import { CheckCircle2, XCircle } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "/month",
      description: "Perfect for personal or casual use.",
      features: [
        "Create & view PDFs",
        "Basic editing tools",
        "Limited cloud storage",
        "E-signatures",
      ],
      notIncluded: ["Collaboration tools", "Priority support"],
      button: "Get Started",
      gradient: "from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950",
      color: "blue",
    },
    {
      name: "Pro",
      price: "500",
      period: "/month",
      description: "Best for professionals and small teams.",
      features: [
        "All Free features",
        "Unlimited PDF editing",
        "E-signatures & annotations",
        "Cloud sync",
        "Batch processing",
        "Priority support",
      ],
      notIncluded: ["Team admin controls"],
      button: "Start Pro Plan",
      highlight: true,
      gradient:
        "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-600",
      color: "blue",
    },
    {
      name: "Enterprise",
      price: "2000",
      period: "/month",
      description: "For organizations that need custom solutions.",
      features: [
        "All Pro features",
        "Team admin controls",
        "Dedicated cloud storage",
        "Custom integrations",
        "Advanced security & audit logs",
        "24/7 premium support",
      ],
      notIncluded: [],
      button: "Contact Sales",
      gradient:
        "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      color: "green",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-300 dark:from-slate-900 dark:to-blue-950 text-slate-800 dark:text-slate-100 transition-all">
      <section className="py-20 px-6 md:px-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent <span className="text-blue-600">Pricing</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 mb-12">
          Choose the plan that best fits your workflow. Upgrade or downgrade at any time.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-lg border transition-all duration-500 hover:scale-105 cursor-pointer
                bg-gradient-to-br ${plan.gradient} ${
                plan.highlight ? "border-blue-600 shadow-xl scale-105" : "border-slate-300/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow">
                  Most Popular
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {plan.description}
              </p>
              <div className="flex justify-center items-end mb-6">
                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  NPR {plan.price}
                </span>
                <span className="text-slate-500 ml-1">{plan.period}</span>
              </div>
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
                {plan.notIncluded.length > 0 && (
                  <div className="opacity-70 mt-2">
                    {plan.notIncluded.map((item, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </div>
                )}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border borders-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center py-16 bg-blue-600 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Need a Custom Plan?
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          We offer tailored pricing and integrations for large teams or specific business
          needs. Let's talk about how HAMROpdf can work for your company.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-slate-100 transition">
          Contact Us
        </button>
      </section>
    </main>
  );
}