import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Flame,
  ClipboardList,
  BrainCircuit,
  Gauge,
  ShieldAlert,
  Thermometer,
  History,
  FileBarChart2,
  Menu,
  X,
  Eye,
  Compass,
  ArrowDown,
} from "lucide-react";

/**
 * Wildfire Risk Dashboard — Landing Page
 * ---------------------------------------
 * Routes (existing app routes, nothing new is created):
 *   /          Home
 *   /predict   Predict Risk / Predict Wildfire Risk
 *   /history   Prediction History / View Prediction History
 *
 * IMAGES — loaded directly from Unsplash's image CDN (no local files needed).
 * All three are free to use under the Unsplash License:
 *   hero          Smoke plume from the Calwood Fire, Colorado — Malachi Brooks
 *                 https://unsplash.com/photos/-HVh7BRp3ls
 *   environment   Forested mountain terrain under smoke-filled sky — Malachi Brooks
 *                 https://unsplash.com/photos/EvJhJ75NwAc
 *   preparedness  Smoke rising through tall pine trees — Erik Morales
 *                 https://unsplash.com/photos/bvtfI41Hwj4
 *
 * Fallbacks: the hero keeps a charcoal -> ember gradient under the photo, and
 * the section images swap to a warm gradient placeholder if a URL fails.
 */

const IMG_PARAMS = "auto=format&fit=crop&q=70";

const WILDFIRE_IMAGES = {
  hero: {
    src: `https://images.unsplash.com/photo-1602980085374-7e743fff3cc6?${IMG_PARAMS}&w=2000`,
    alt: "Smoke plume rising above a forested mountainside from a distant wildfire",
  },
  environment: {
    src: `https://images.unsplash.com/photo-1602980085421-578025fd903d?${IMG_PARAMS}&w=1200`,
    alt: "Forested mountain terrain under a smoke-filled sky",
  },
  preparedness: {
    src: `https://images.unsplash.com/photo-1764639568022-e78a62df2851?${IMG_PARAMS}&w=1200`,
    alt: "Smoke rising through tall pine trees in a dry forest",
  },
};

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

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
    description: "Provide location, assessment date and environmental conditions.",
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
    description:
      "The system estimates wildfire ignition probability and assigns a risk level.",
  },
  {
    number: "04",
    icon: ShieldAlert,
    title: "Take Action",
    description:
      "Use the assessment and guidance to support appropriate preparedness decisions.",
  },
];

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: "Machine Learning Prediction",
    description:
      "Estimate wildfire ignition probability using the trained XGBoost model.",
    wide: true,
  },
  {
    icon: Thermometer,
    title: "Environmental Condition Analysis",
    description:
      "Analyze geographical and environmental conditions associated with wildfire ignition.",
  },
  {
    icon: Gauge,
    title: "Risk Classification",
    description: "Convert prediction probability into clear risk categories.",
  },
  {
    icon: ShieldAlert,
    title: "Actionable Risk Guidance",
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
    description: "No ignition probability predicted for the given conditions.",
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

const HERO_TAGS = [
  "Environmental Conditions",
  "XGBoost Model",
  "Risk Classification",
  "Preparedness Guidance",
];

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

function useReveal<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
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

/* ------------------------------------------------------------------ */
/* Photo card: rounded, object-cover, lazy, hover zoom, graceful fail  */
/* ------------------------------------------------------------------ */

function PhotoCard({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B1A10] via-[#7A2B14] to-[#E2631F] shadow-[0_8px_28px_rgba(30,35,48,0.14)] ${className}`}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
      {/* soft warm tint so photos sit inside the cream/ember palette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171B22]/35 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar (exported, may be reused by other pages)                     */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E3D9C6] bg-[#F6EFE4]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F]"
        >
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
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors duration-150 hover:text-[#1E2330] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#E2631F] after:transition-all after:duration-200 ${
                  active
                    ? "font-medium text-[#1E2330] after:w-full"
                    : "text-[#55524A] after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/predict"
            className="rounded-full bg-gradient-to-r from-[#E2631F] to-[#C84A1A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F]"
          >
            Predict Wildfire Risk
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-[#1E2330] md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2631F]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-[#E3D9C6] bg-[#F6EFE4] px-6 pb-6 pt-2 md:hidden"
          aria-label="Primary mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E2631F] ${
                    active
                      ? "bg-[#EDE4D6] font-medium text-[#1E2330]"
                      : "text-[#55524A] hover:bg-[#EDE4D6] hover:text-[#1E2330]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
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

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="home"
      className="wfd-hero relative flex min-h-[34rem] items-center overflow-hidden bg-[#171B22] px-6 py-24 md:min-h-[42rem] md:py-32"
    >
      {/* 1. Background photo (slow zoom/pan). Gradient is the fallback layer. */}
      <div
        className="wfd-hero-bg absolute inset-0"
        style={{
          backgroundImage: `url("${WILDFIRE_IMAGES.hero.src}"), linear-gradient(135deg, #171B22 0%, #3B1A10 60%, #7A2B14 100%)`,
        }}
        role="img"
        aria-label={WILDFIRE_IMAGES.hero.alt}
      />

      {/* 2. Dark navy overlay fading into a subtle red/orange tone */}
      <div
        className="wfd-hero-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      {/* 3. Very subtle embers */}
      <div
        className="wfd-particles pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`wfd-particle wfd-particle-${i + 1}`} />
        ))}
      </div>

      {/* 4. Content */}
      <div className="relative mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <h1 className="font-serif text-4xl font-medium leading-[1.12] text-[#F6EFE4] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl">
            Predict wildfire risk before it becomes a threat
          </h1>
        </Reveal>
        <Reveal className="delay-150">
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F6EFE4]/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-lg">
            Assess wildfire ignition probability using environmental and
            geographical conditions with a machine-learning-powered risk
            prediction system.
          </p>
        </Reveal>
        <Reveal className="delay-300">
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/predict"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#E2631F] to-[#B3261E] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/30 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2631F] sm:w-auto"
            >
              Predict Wildfire Risk
            </Link>
            <Link
              to="/history"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-medium text-[#F6EFE4] transition-all duration-150 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
            >
              View Prediction History
            </Link>
          </div>
        </Reveal>
        <Reveal className="delay-300">
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#F6EFE4]/60">
            {HERO_TAGS.map((tag) => (
              <li key={tag} className="flex items-center gap-2">
                <span
                  className="h-1 w-1 rounded-full bg-[#E2631F]"
                  aria-hidden="true"
                />
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function QuickIntro() {
  return (
    <section className="bg-[#F6EFE4] px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <Reveal>
          <h2 className="font-serif text-2xl font-medium text-[#1E2330] sm:text-3xl">
            Understand wildfire risk from environmental conditions
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#55524A] sm:text-base">
            Wildfire ignition can be influenced by temperature, humidity,
            precipitation, wind, fuel moisture and atmospheric conditions.
            This system analyzes the conditions you provide using a trained
            XGBoost model to estimate wildfire ignition probability.
          </p>
        </Reveal>

        <Reveal>
          <PhotoCard
            src={WILDFIRE_IMAGES.environment.src}
            alt={WILDFIRE_IMAGES.environment.alt}
            className="aspect-[4/3] w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-y border-[#E3D9C6] bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium text-[#1E2330] sm:text-4xl">
            How Wildfire Risk Assessment Works
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
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
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
            Built for Wildfire Risk Assessment
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
                <div className="group h-full rounded-2xl border border-[#E3D9C6] bg-white p-7 shadow-[0_1px_2px_rgba(30,35,48,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(30,35,48,0.10)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6EFE4] text-[#1E2330] transition-colors duration-200 group-hover:bg-gradient-to-br group-hover:from-[#E2631F] group-hover:to-[#B3261E] group-hover:text-white">
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
            Understand the Risk Levels
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RISK_LEVELS.map((level) => (
            <Reveal key={level.label}>
              <div
                className="h-full rounded-2xl border border-black/5 p-6 transition-transform duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: level.bg,
                  borderTop: `4px solid ${level.color}`,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: level.color }}
                >
                  {level.label}
                </p>
                <p className="mt-2 font-serif text-3xl text-[#1E2330]">
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
            These categories are application-level classifications based on
            the predicted wildfire ignition probability.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PredictionToPreparedness() {
  return (
    <section className="bg-[#F6EFE4] px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <Reveal>
          <h2 className="font-serif text-3xl font-medium leading-tight text-[#1E2330] sm:text-4xl">
            From Prediction to Preparedness
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#55524A] sm:text-base">
            Early identification of potentially high-risk conditions can help
            users improve monitoring, prepare resources and follow
            appropriate fire and disaster-management guidance.
          </p>
          <p className="mt-4 max-w-lg text-xs leading-relaxed text-[#766F62]">
            This does not guarantee the prevention of a wildfire — it
            supports awareness and preparedness based on the conditions
            provided.
          </p>

          <PhotoCard
            src={WILDFIRE_IMAGES.preparedness.src}
            alt={WILDFIRE_IMAGES.preparedness.alt}
            className="mt-8 aspect-[16/10] w-full max-w-lg"
          />
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
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
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
          Ready to Assess Wildfire Risk?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
          Enter environmental and geographical conditions to generate a
          machine-learning-based wildfire risk assessment.
        </p>
        <Link
          to="/predict"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-[#1E2330] shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Predict Wildfire Risk
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer (exported, may be reused by other pages)                     */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="mt-auto bg-[#171B22] px-6 pb-10 pt-8">
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function WildfireRiskLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6EFE4] font-sans text-[#1E2330]">
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
        /* Hero background: image is set inline (remote URL); sizing + motion here */
        .wfd-hero-bg {
          background-size: cover;
          background-position: 62% center;
          background-repeat: no-repeat;
          transform-origin: 60% 50%;
          will-change: transform;
          animation: wfd-kenburns 32s ease-in-out infinite alternate;
        }
        @media (min-width: 768px) {
          .wfd-hero-bg { background-position: center; }
        }
        @keyframes wfd-kenburns {
          from { transform: scale(1); }
          to   { transform: scale(1.08) translate3d(-1%, -1%, 0); }
        }

        /* Navy/black -> dark -> subtle red/orange overlay (keeps text readable) */
        .wfd-hero-overlay {
          background:
            linear-gradient(to bottom,
              rgba(10, 14, 22, 0.80) 0%,
              rgba(10, 14, 22, 0.62) 45%,
              rgba(95, 28, 14, 0.62) 100%),
            radial-gradient(ellipse at 50% 100%,
              rgba(226, 99, 31, 0.20) 0%,
              transparent 60%);
        }

        /* Embers */
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
          .wfd-hero-bg, .wfd-particle { animation: none !important; }
        }
      `}</style>
    </div>
  );
}