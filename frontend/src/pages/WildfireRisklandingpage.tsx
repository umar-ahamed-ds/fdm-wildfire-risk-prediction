import React from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  ClipboardList,
  BrainCircuit,
  Gauge,
  ShieldAlert,
  Thermometer,
  Gauge as GaugeIcon,
  History,
  FileBarChart2,
  Menu,
  X,
  Eye,
  Compass,
  ArrowDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Predict Risk", href: "/predict" },
  { label: "Prediction History", href: "/history" },
];

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Enter Conditions",
    description: "Provide the location, assessment date and environmental conditions.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Risk Analysis",
    description: "The trained XGBoost model analyzes the provided conditions.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Risk Assessment",
    description: "The system estimates the probability of wildfire ignition.",
  },
  {
    number: "04",
    icon: ShieldAlert,
    title: "Take Action",
    description: "Use the risk level and guidance to support preparedness.",
  },
];

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "Machine Learning Prediction",
    description: "Estimate wildfire ignition probability using the trained XGBoost model.",
    wide: true,
  },
  {
    icon: Thermometer,
    title: "Environmental Analysis",
    description: "Analyze geographical and environmental conditions associated with wildfire ignition.",
  },
  {
    icon: GaugeIcon,
    title: "Risk Classification",
    description: "Convert prediction probability into clear risk categories.",
  },
  {
    icon: ShieldAlert,
    title: "Actionable Guidance",
    description: "Provide practical guidance based on the predicted risk level.",
  },
  {
    icon: History,
    title: "Prediction History",
    description: "Review previously generated wildfire risk assessments.",
  },
  {
    icon: FileBarChart2,
    title: "Assessment Reports",
    description: "Download detailed prediction assessment reports.",
  },
];

const RISK_LEVELS = [
  {
    label: "No Risk",
    range: "0%",
    color: "#2F6B45",
    bg: "#EAF2EC",
    description: "No ignition probability detected for the given conditions.",
  },
  {
    label: "Low Risk",
    range: ">0% – 30%",
    color: "#E2631F",
    bg: "#FBEEE4",
    description: "Conditions are largely unfavorable for ignition.",
  },
  {
    label: "Medium Risk",
    range: "31% – 70%",
    color: "#D98C2B",
    bg: "#FBF1E1",
    description: "Conditions warrant closer monitoring.",
  },
  {
    label: "High Risk",
    range: "71% – 100%",
    color: "#B3261E",
    bg: "#FAEAE8",
    description: "Conditions are strongly associated with ignition.",
  },
];

const FLOW_STEPS = [
  { icon: Thermometer, label: "Environmental Conditions" },
  { icon: BrainCircuit, label: "Risk Prediction" },
  { icon: Eye, label: "Risk Awareness" },
  { icon: Compass, label: "Preparedness" },
];

function useReveal<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E3D9C6] bg-[#F6EFE4]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#E2631F] to-[#B3261E] text-white shadow-sm">
            <Flame className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[1.05rem] font-medium text-[#1E2330]">
              Wildfire Risk Dashboard
            </span>
            <span className="text-xs text-[#766F62]">
              Environmental Monitoring System
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`relative py-1 text-sm text-[#55524A] transition-colors duration-150 hover:text-[#1E2330] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#E2631F] after:transition-all after:duration-200 hover:after:w-full ${link.href === '/' ? 'aria-[current=page]:text-[#1E2330] aria-[current=page]:after:w-full' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/predict"
            className="rounded-full bg-gradient-to-r from-[#E2631F] to-[#C84A1A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:shadow-md hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F]"
          >
            Predict Wildfire Risk
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-[#1E2330] md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2631F]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-[#E3D9C6] bg-[#F6EFE4] px-6 pb-6 pt-2 md:hidden"
          aria-label="Primary mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-md px-2 py-3 text-sm text-[#55524A] hover:bg-[#EDE4D6] hover:text-[#1E2330] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2631F]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/predict"
              className="mt-2 rounded-full bg-gradient-to-r from-[#E2631F] to-[#C84A1A] px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Predict Wildfire Risk
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="wfd-hero relative overflow-hidden bg-[#171B22] px-6 py-24 md:py-32"
    >
      <div className="wfd-hero-glow pointer-events-none absolute inset-0" />
      <div className="wfd-particles pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`wfd-particle wfd-particle-${i + 1}`} />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h1 className="font-serif text-4xl font-medium leading-[1.12] text-[#F6EFE4] sm:text-5xl md:text-6xl">
            Predict wildfire risk before it becomes a threat
          </h1>
        </Reveal>
        <Reveal className="delay-150">
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F6EFE4]/70 sm:text-lg">
            Assess wildfire ignition probability using environmental and
            geographical conditions with a machine-learning-powered risk
            prediction system.
          </p>
        </Reveal>
        <Reveal className="delay-300">
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/predict"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#E2631F] to-[#B3261E] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-150 hover:shadow-xl hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F]"
            >
              Predict Wildfire Risk
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-medium text-[#F6EFE4] backdrop-blur-sm transition-all duration-150 hover:border-white/35 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              View Prediction History
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QuickIntro() {
  return (
    <section className="bg-[#F6EFE4] px-6 py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-2xl font-medium text-[#1E2330] sm:text-3xl">
          Understand wildfire risk from environmental conditions
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[#55524A] sm:text-base">
          Wildfire ignition can be influenced by temperature, humidity,
          precipitation, wind, fuel moisture and atmospheric conditions. Our
          system analyzes these conditions using a trained XGBoost model to
          estimate wildfire ignition probability.
        </p>
      </Reveal>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-y border-[#E3D9C6] bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium text-[#1E2330] sm:text-4xl">
            How wildfire risk assessment works
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[18px] hidden h-px bg-gradient-to-r from-transparent via-[#E2631F]/30 to-transparent lg:block"
            aria-hidden="true"
          />
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} className="relative">
                <div className="relative z-10 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6EFE4] text-[#E2631F] ring-4 ring-white">
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  </span>
                  <span
                    className="font-serif text-xl text-[#1E2330]/20"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-medium text-[#1E2330]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#766F62]">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="bg-[#EDE4D6] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium text-[#1E2330] sm:text-4xl">
            Built for wildfire risk assessment
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                className={item.wide ? "md:col-span-2" : ""}
              >
                <div className="group h-full rounded-2xl border border-[#E3D9C6] bg-white p-7 shadow-[0_1px_2px_rgba(30,35,48,0.04)] transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(30,35,48,0.08)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6EFE4] text-[#1E2330] transition-colors duration-150 group-hover:bg-gradient-to-br group-hover:from-[#E2631F] group-hover:to-[#B3261E] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-base font-medium text-[#1E2330]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#766F62]">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RiskLevels() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium text-[#1E2330] sm:text-4xl">
            Understand your risk level
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RISK_LEVELS.map((level) => (
            <Reveal key={level.label}>
              <div
                className="h-full rounded-2xl border border-black/5 p-6"
                style={{ backgroundColor: level.bg }}
              >
                <span
                  className="inline-flex h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: level.color }}
                  aria-hidden="true"
                />
                <p
                  className="mt-4 text-xs font-medium uppercase tracking-wide"
                  style={{ color: level.color }}
                >
                  {level.label}
                </p>
                <p className="mt-1 font-serif text-2xl text-[#1E2330]">
                  {level.range}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#55524A]">
                  {level.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <p className="max-w-2xl text-sm leading-relaxed text-[#766F62]">
            These risk categories are application-level classifications based
            on the predicted probability. They are not original labels from
            the dataset.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PredictionToPreparedness() {
  return (
    <section className="bg-[#F6EFE4] px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium leading-tight text-[#1E2330] sm:text-4xl">
            From prediction to preparedness
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#55524A] sm:text-base">
            Early identification of potentially high-risk conditions can help
            users improve monitoring, prepare resources and follow
            appropriate fire and disaster-management guidance.
          </p>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-[#766F62]">
            This does not guarantee the prevention of a wildfire — it
            supports awareness and preparedness based on the conditions
            provided.
          </p>
        </Reveal>

        <Reveal>
          <div className="mx-auto flex max-w-xs flex-col items-center">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === FLOW_STEPS.length - 1;
              return (
                <React.Fragment key={step.label}>
                  <div className="flex w-full items-center gap-4 rounded-xl border border-[#E3D9C6] bg-white px-5 py-4 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E2631F] to-[#B3261E] text-white">
                      <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-medium text-[#1E2330]">
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <ArrowDown
                      className="my-2 h-4 w-4 text-[#E2631F]/50"
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#171B22] via-[#7A2B14] to-[#E2631F] px-6 py-20">
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-medium text-white sm:text-4xl">
          Ready to assess wildfire risk?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
          Enter environmental and geographical conditions to generate a
          machine-learning-based wildfire risk assessment.
        </p>
        <Link
          to="/predict"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-[#1E2330] shadow-lg transition-all duration-150 hover:shadow-xl hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Predict Wildfire Risk
        </Link>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#171B22] px-6 pb-10 pt-8 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 border-t border-white/10 pt-8 text-center">
        <div className="flex items-center gap-2 text-white/80">
          <Flame className="h-4 w-4 text-[#E2631F]" strokeWidth={2} />
          <span className="text-sm font-medium">Wildfire Risk Dashboard</span>
        </div>
        <p className="text-xs text-white/50">
          Machine-Learning-Based Environmental Risk Assessment
        </p>
        <p className="text-xs text-white/35">FDM Mini Project © 2026</p>
      </div>
    </footer>
  );
}

export default function WildfireRiskLandingPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE4] font-sans text-[#1E2330] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <QuickIntro />
        <HowItWorks />
        <Capabilities />
        <RiskLevels />
        <PredictionToPreparedness />
        <FinalCTA />
      </main>
      <Footer />

      <style>{`
        .wfd-hero-glow {
          background:
            radial-gradient(circle at 20% 20%, rgba(226, 99, 31, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(179, 38, 30, 0.22) 0%, transparent 50%);
          animation: wfd-breathe 8s ease-in-out infinite;
        }
        @keyframes wfd-breathe {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .wfd-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(226, 99, 31, 0.55);
          animation: wfd-float 9s ease-in-out infinite;
        }
        .wfd-particle-1 { left: 8%;  top: 70%; animation-delay: 0s;   }
        .wfd-particle-2 { left: 18%; top: 40%; animation-delay: 1.2s; }
        .wfd-particle-3 { left: 28%; top: 80%; animation-delay: 2.4s; }
        .wfd-particle-4 { left: 42%; top: 25%; animation-delay: 0.6s; }
        .wfd-particle-5 { left: 58%; top: 65%; animation-delay: 1.8s; }
        .wfd-particle-6 { left: 72%; top: 35%; animation-delay: 3s;   }
        .wfd-particle-7 { left: 85%; top: 75%; animation-delay: 0.9s; }
        .wfd-particle-8 { left: 92%; top: 45%; animation-delay: 2.1s; }
        @keyframes wfd-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-28px) scale(1.4); opacity: 0.9; }
        }
        .delay-150 { transition-delay: 150ms; }
        .delay-300 { transition-delay: 300ms; }
        @media (prefers-reduced-motion: reduce) {
          .wfd-hero-glow, .wfd-particle { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
