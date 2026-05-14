import { useState, useEffect, useRef } from "react";
import profile from "./assets/profile.jpg";
import ChatBot from "./components/ChatBot";

/* ─── Typing animation ─────────────────────────────────────────── */
const roles = ["Frontend Developer", "React Developer", "AI/ML Enthusiast", "Software Developer"];

function useTyping(words) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("typing");
  useEffect(() => {
    const word = words[wordIdx];
    let timer;
    if (phase === "typing") {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), 100);
      } else {
        timer = setTimeout(() => setPhase("deleting"), 2200);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText((p) => p.slice(0, -1)), 50);
      } else {
        timer = setTimeout(() => {
          setWordIdx((i) => (i + 1) % words.length);
          setPhase("typing");
        }, 0);
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, wordIdx, words]);
  return text;
}

/* ─── Scroll reveal ─────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(35px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section heading ───────────────────────────────────────────── */
function SectionHeading({ pre, highlight }) {
  return (
    <Reveal>
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {pre} <span className="text-cyan-400">{highlight}</span>
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
      </div>
    </Reveal>
  );
}

/* ─── Floating code editor ──────────────────────────────────────── */
const codeSnippets = [
  {
    filename: "SleepPredictor.py",
    lang: "Python",
    tokens: [
      { t: "from", c: "kw" }, { t: " sklearn.ensemble ", c: "plain" },
      { t: "import", c: "kw" }, { t: " RandomForest\n", c: "cls" },
      { t: "import", c: "kw" }, { t: " pandas ", c: "plain" },
      { t: "as", c: "kw" }, { t: " pd\n\n", c: "plain" },
      { t: "model", c: "var" }, { t: " = ", c: "plain" },
      { t: "RandomForestClassifier", c: "fn" }, { t: "(\n", c: "plain" },
      { t: "  n_estimators=", c: "plain" }, { t: "100", c: "num" },
      { t: ", max_depth=", c: "plain" }, { t: "8\n", c: "num" },
      { t: ")\n\n", c: "plain" },
      { t: "model", c: "var" }, { t: ".fit(X_train, y_train)\n", c: "plain" },
      { t: "acc", c: "var" }, { t: " = model.score(X_test, y_test)\n", c: "plain" },
      { t: "# Accuracy: 92.3%", c: "cmt" },
    ],
  },
  {
    filename: "GasTrack.jsx",
    lang: "React",
    tokens: [
      { t: "import", c: "kw" }, { t: " { useState, useEffect } ", c: "plain" },
      { t: "from", c: "kw" }, { t: " 'react'\n\n", c: "str" },
      { t: "function", c: "kw" }, { t: " ", c: "plain" },
      { t: "GasTracker", c: "fn" }, { t: "() {\n", c: "plain" },
      { t: "  const", c: "kw" }, { t: " [cylinders, set] = ", c: "plain" },
      { t: "useState", c: "fn" }, { t: "([])\n\n", c: "plain" },
      { t: "  useEffect", c: "fn" }, { t: "(() => {\n", c: "plain" },
      { t: "    fetchCylinders", c: "fn" }, { t: "().then(", c: "plain" },
      { t: "set", c: "var" }, { t: ")\n  }, [])\n\n", c: "plain" },
      { t: "  return", c: "kw" }, { t: " <", c: "plain" },
      { t: "Dashboard", c: "tag" }, { t: " data={cylinders} />\n}", c: "plain" },
    ],
  },
  {
    filename: "password_manager.py",
    lang: "Python",
    tokens: [
      { t: "import", c: "kw" }, { t: " json, os\n\n", c: "plain" },
      { t: "def", c: "kw" }, { t: " ", c: "plain" },
      { t: "save_password", c: "fn" }, { t: "(site, pwd):\n", c: "plain" },
      { t: "  with", c: "kw" }, { t: " open(", c: "plain" },
      { t: "'vault.json'", c: "str" }, { t: ", ", c: "plain" },
      { t: "'w'", c: "str" }, { t: ") as f:\n", c: "plain" },
      { t: "    json", c: "var" }, { t: ".dump({site: pwd}, f)\n\n", c: "plain" },
      { t: "def", c: "kw" }, { t: " ", c: "plain" },
      { t: "get_password", c: "fn" }, { t: "(site):\n", c: "plain" },
      { t: "  data", c: "var" }, { t: " = json.load(open(", c: "plain" },
      { t: "'vault.json'", c: "str" }, { t: "))\n", c: "plain" },
      { t: "  return", c: "kw" }, { t: " data.get(site)", c: "plain" },
    ],
  },
];

const colorMap = {
  kw: "text-purple-400", str: "text-green-400", num: "text-orange-400",
  fn: "text-yellow-300", cls: "text-cyan-300", cmt: "text-gray-500",
  var: "text-blue-300", tag: "text-red-400", plain: "text-gray-200",
};

function FloatingCode() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setActive((i) => (i + 1) % codeSnippets.length); setVisible(true); }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const snippet = codeSnippets[active];
  const lineCount = snippet.tokens.map((t) => t.t).join("").split("\n").length;
  return (
    <div className="float-anim bg-[#1e1e2e] border border-gray-700/60 rounded-xl overflow-hidden w-80 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(34,211,238,0.08)]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#181825] border-b border-gray-700/50">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[11px] text-gray-400 font-mono flex-1 truncate">{snippet.filename}</span>
        <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded font-mono">{snippet.lang}</span>
      </div>
      <div className="flex p-3 font-mono text-[11px] leading-5 min-h-[160px]" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <div className="text-gray-600 text-right pr-3 select-none border-r border-gray-700/40 mr-3 min-w-[24px]">
          {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre className="overflow-hidden flex-1 whitespace-pre">
          {snippet.tokens.map((token, i) => (
            <span key={i} className={colorMap[token.c]}>{token.t}</span>
          ))}
        </pre>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {codeSnippets.map((_, i) => (
          <button key={i} onClick={() => { setActive(i); setVisible(true); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "bg-cyan-400 w-4" : "bg-gray-600 w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────── */
const skillCategories = [
  {
    name: "Languages",
    skills: ["Python", "Java", "C"],
    headerClass: "bg-cyan-400/10 border-b border-cyan-400/20",
    titleClass: "text-cyan-400",
    cardClass: "border-cyan-400/20 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]",
    badgeClass: "bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-400 hover:text-black",
  },
  {
    name: "Web Technologies",
    skills: ["HTML", "CSS", "React", "Next.js"],
    headerClass: "bg-blue-400/10 border-b border-blue-400/20",
    titleClass: "text-blue-400",
    cardClass: "border-blue-400/20 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(96,165,250,0.08)]",
    badgeClass: "bg-blue-400/10 border border-blue-400/20 text-blue-300 hover:bg-blue-400 hover:text-black",
  },
  {
    name: "Database & Core",
    skills: ["SQL", "PostgreSQL", "MySQL", "Data Structures", "OOPs", "Networking Basics"],
    headerClass: "bg-purple-400/10 border-b border-purple-400/20",
    titleClass: "text-purple-400",
    cardClass: "border-purple-400/20 hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(192,132,252,0.08)]",
    badgeClass: "bg-purple-400/10 border border-purple-400/20 text-purple-300 hover:bg-purple-400 hover:text-black",
  },
  {
    name: "Tools & Platforms",
    skills: ["Git", "VS Code", "Jupyter Notebook"],
    headerClass: "bg-green-400/10 border-b border-green-400/20",
    titleClass: "text-green-400",
    cardClass: "border-green-400/20 hover:border-green-400/50 hover:shadow-[0_0_25px_rgba(74,222,128,0.08)]",
    badgeClass: "bg-green-400/10 border border-green-400/20 text-green-300 hover:bg-green-400 hover:text-black",
  },
];

const projects = [
  {
    title: "GasTrack",
    desc: "Real-time gas cylinder tracking system with inventory management, live status updates, and an admin dashboard.",
    tech: ["React", "Spring Boot", "PostgreSQL"],
    github: "https://github.com/kSupreetha",
    icon: "⛽",
    accent: "cyan",
    hoverClass: "hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]",
  },
  {
    title: "Sleep Disorder Predictor",
    desc: "End-to-end ML pipeline classifying Insomnia & Sleep Apnea from health and lifestyle data — 92%+ accuracy.",
    tech: ["Python", "Scikit-Learn", "Random Forest"],
    github: "https://github.com/kSupreetha",
    icon: "🧠",
    accent: "purple",
    hoverClass: "hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(192,132,252,0.1)]",
  },
  {
    title: "Password Manager",
    desc: "Secure Python application for storing and retrieving credentials using file handling and encryption basics.",
    tech: ["Python", "File Handling", "Security"],
    github: "https://github.com/kSupreetha",
    icon: "🔐",
    accent: "green",
    hoverClass: "hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]",
  },
  {
    title: "SaaS Dashboard",
    desc: "Modern analytics dashboard UI with interactive charts, dark mode, and a fully responsive grid layout.",
    tech: ["React", "Next.js", "Tailwind CSS"],
    github: "https://github.com/kSupreetha",
    icon: "📊",
    accent: "blue",
    hoverClass: "hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.1)]",
  },
];

const certifications = [
  {
    icon: "☁️",
    title: "Azure AI Fundamentals",
    code: "AI-900",
    issuer: "Microsoft",
    year: "2026",
    desc: "Certified in core AI workloads, machine learning concepts, and Microsoft Azure AI services.",
    tags: ["AI", "Azure", "Cloud", "Machine Learning"],
    cardClass: "border-blue-400/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.1)]",
    badgeClass: "bg-blue-400/10 border border-blue-400/20 text-blue-300",
    labelClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    dotClass: "bg-blue-400",
  },
  {
    icon: "🚀",
    title: "Code to Cloud: DevOps & Deployment",
    code: "Bootcamp",
    issuer: "MeVi Technologies LLP",
    year: "2025",
    desc: "Hands-on exposure to cloud deployment workflows, CI/CD pipelines, and DevOps fundamentals.",
    tags: ["DevOps", "Cloud", "Deployment", "CI/CD"],
    cardClass: "border-purple-400/20 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(192,132,252,0.1)]",
    badgeClass: "bg-purple-400/10 border border-purple-400/20 text-purple-300",
    labelClass: "bg-purple-400/10 text-purple-400 border border-purple-400/20",
    dotClass: "bg-purple-400",
  },
];

const strengths = [
  { icon: "🧩", title: "Problem Solving", desc: "Breaks complex challenges into clear, step-by-step solutions with strong analytical thinking." },
  { icon: "⚡", title: "Quick Learner", desc: "Rapidly picks up new frameworks and technologies through focused hands-on practice." },
  { icon: "🤝", title: "Team Player", desc: "Collaborative and communicative — contributes effectively in group settings and projects." },
  { icon: "🎯", title: "Detail-Oriented", desc: "Committed to writing clean, precise code with attention to quality and user experience." },
];

const education = [
  {
    degree: "MCA — Master of Computer Applications",
    school: "REVA University, Bangalore",
    year: "2024 – Present",
    score: null,
    dot: "bg-cyan-400",
    yearColor: "text-cyan-400",
  },
  {
    degree: "BCA — Bachelor of Computer Applications",
    school: "Govt. First Grade College & Centre for PG Studies, Udupi",
    year: "2021 – 2024",
    score: "88.83%",
    dot: "bg-blue-400",
    yearColor: "text-blue-400",
  },
  {
    degree: "Pre-University (Science)",
    school: "Govt. PU College, Kundapura",
    year: "2021",
    score: "92.33%",
    dot: "bg-purple-400",
    yearColor: "text-purple-400",
  },
];

const GitHubIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

/* ─── App ───────────────────────────────────────────────────────── */
function App() {
  const typedRole = useTyping(roles);

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold font-mono shimmer-text">&lt;Supreetha /&gt;</h1>
          <ul className="hidden md:flex gap-7 text-sm">
            {["Home", "About", "Skills", "Projects", "Certifications", "Contact"].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a href="/resume.pdf" download className="hidden md:inline-flex items-center gap-1.5 border border-cyan-400/40 text-cyan-400 text-sm px-4 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300">
            Resume ↓
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-8 md:px-20 pt-24 pb-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Left */}
        <div className="flex-1 text-center lg:text-left z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 text-xs px-3 py-1.5 rounded-full mb-6 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Supreetha
            </span>
          </h2>

          <div className="h-10 flex items-center justify-center lg:justify-start mb-6">
            <span className="text-xl md:text-2xl text-gray-300 font-mono">
              {typedRole}
              <span className="cursor-blink text-cyan-400 ml-0.5">|</span>
            </span>
          </div>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            MCA student at REVA University, Bangalore — building modern web apps,
            AI-powered tools, and smooth digital experiences.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#projects" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300">
              View Projects →
            </a>
            <a href="mailto:supreetha.k.2004@gmail.com" className="border border-gray-700 text-gray-300 px-6 py-3 rounded-xl text-sm hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300">
              Contact Me
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 justify-center lg:justify-start">
            {[
              { num: "4+", label: "Projects Built" },
              { num: "15+", label: "Technologies" },
              { num: "2", label: "Certifications" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center lg:text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col items-center gap-5 z-10">
          <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64">
            {/* Pulse rings */}
            <div className="absolute w-52 h-52 md:w-60 md:h-60 rounded-full border border-cyan-400/40 ring-1" />
            <div className="absolute w-52 h-52 md:w-60 md:h-60 rounded-full border border-blue-400/30 ring-2" />
            <div className="absolute w-52 h-52 md:w-60 md:h-60 rounded-full border border-purple-400/20 ring-3" />
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-2xl opacity-15" />
            <img
              src={profile}
              alt="Supreetha"
              className="relative w-44 h-44 md:w-52 md:h-52 object-cover rounded-full border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(34,211,238,0.25)]"
            />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-400 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              ● Open to Work
            </div>
          </div>
          <FloatingCode />
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative px-8 md:px-20 py-24 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading pre="About" highlight="Me" />

          {/* Bio + soft skills */}
          <Reveal>
            <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 mb-10 backdrop-blur-sm">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                I&apos;m a passionate MCA student at <span className="text-cyan-400 font-medium">REVA University, Bangalore</span>, driven by a love for problem-solving and building real-world software. From crafting responsive UIs with React to training ML models in Python, I enjoy working across the stack.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                I hold a <span className="text-white font-medium">BCA (88.83%)</span> from Govt. First Grade College, Udupi, and am actively seeking entry-level Software Developer opportunities in Bangalore to grow in a dynamic IT environment.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Problem Solving", "Quick Learner", "Teamwork", "Communication", "Adaptability"].map((s) => (
                  <span key={s} className="border border-gray-700 text-gray-400 text-sm px-3 py-1 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Education timeline */}
          <Reveal delay={100}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5 text-center">Education</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-900/40 border border-gray-800/60 rounded-2xl p-5 hover:border-gray-700 transition-colors backdrop-blur-sm">
                  <div className={`w-3 h-3 rounded-full ${edu.dot} flex-shrink-0 shadow-[0_0_8px_currentColor]`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-200">{edu.degree}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{edu.school}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-mono ${edu.yearColor}`}>{edu.year}</div>
                    {edu.score && <div className="text-xs text-gray-500 mt-0.5">{edu.score}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="px-8 md:px-20 py-24">
        <SectionHeading pre="Technical" highlight="Skills" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 80}>
              <div className={`bg-gray-900/40 border rounded-2xl overflow-hidden transition-all duration-300 h-full backdrop-blur-sm ${cat.cardClass}`}>
                <div className={`px-4 py-3 ${cat.headerClass}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${cat.titleClass}`}>{cat.name}</span>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span key={skill} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-default ${cat.badgeClass}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Strengths ── */}
      <section className="px-8 md:px-20 py-20 bg-black/30">
        <SectionHeading pre="My" highlight="Strengths" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {strengths.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="group bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(34,211,238,0.06)] transition-all duration-300 h-full backdrop-blur-sm">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="px-8 md:px-20 py-24">
        <SectionHeading pre="Featured" highlight="Projects" />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 80}>
              <div className={`group bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col backdrop-blur-sm ${project.hoverClass}`}>
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{project.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span key={t} className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-mono px-2 py-1 rounded-md">{t}</span>
                  ))}
                </div>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors mt-auto">
                  <GitHubIcon />View on GitHub →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── AI/ML ── */}
      <section id="ai" className="px-8 md:px-20 py-24 bg-black/30">
        <SectionHeading pre="AI &" highlight="Machine Learning" />
        <Reveal>
          <div className="max-w-5xl mx-auto bg-gray-900/40 border border-purple-400/20 rounded-3xl p-8 hover:border-purple-400/40 hover:shadow-[0_0_40px_rgba(192,132,252,0.08)] transition-all duration-500 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-xl font-bold text-white">Sleep Disorder Prediction</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                  Built an end-to-end ML pipeline to classify sleep disorders (Normal, Insomnia, Sleep Apnea) using health and lifestyle data. Performed EDA, feature engineering, and hyperparameter tuning achieving 92%+ accuracy with Random Forest.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Random Forest", "Python", "Scikit-Learn", "Pandas", "Matplotlib", "EDA"].map((tag) => (
                    <span key={tag} className="bg-purple-400/10 border border-purple-400/20 text-purple-300 px-3 py-1 rounded-lg text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:min-w-[180px]">
                {[{ v: "92.3%", l: "Accuracy" }, { v: "RF", l: "Algorithm" }, { v: "13+", l: "Features" }, { v: "3", l: "Classes" }].map(({ v, l }) => (
                  <div key={l} className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center hover:border-purple-400/30 transition-colors">
                    <div className="text-lg font-bold text-cyan-400">{v}</div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Certifications ── */}
      <section id="certifications" className="px-8 md:px-20 py-24">
        <SectionHeading pre="Certifications &" highlight="Workshops" />
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 100}>
              <div className={`group bg-gray-900/40 border rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 h-full backdrop-blur-sm ${cert.cardClass}`}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{cert.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-base leading-tight">{cert.title}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${cert.labelClass}`}>{cert.code}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{cert.issuer}</span>
                      <span>•</span>
                      <span className={cert.labelClass.replace("bg-", "text-").split(" ")[0]}>{cert.year}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{cert.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cert.tags.map((tag) => (
                    <span key={tag} className={`text-xs px-2.5 py-1 rounded-lg ${cert.badgeClass}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="px-8 md:px-20 py-24 bg-black/30">
        <SectionHeading pre="Get In" highlight="Touch" />
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-400 text-center mb-10">Open for internships, collaborations, and exciting opportunities 🚀</p>

            {/* Contact info cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Email", value: "supreetha.k.2004", icon: "📧", href: "mailto:supreetha.k.2004@gmail.com" },
                { label: "Location", value: "Bangalore, Karnataka", icon: "📍", href: null },
                { label: "Status", value: "Open to Work", icon: "✅", href: null },
              ].map(({ label, value, icon, href }) => (
                <div key={label} className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-4 text-center hover:border-gray-700 transition-colors backdrop-blur-sm">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                  {href ? (
                    <a href={href} className="text-xs text-cyan-400 hover:underline break-all">{value}</a>
                  ) : (
                    <div className="text-xs text-gray-300">{value}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:supreetha.k.2004@gmail.com" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-4 rounded-xl font-bold text-sm hover:opacity-90 hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300">
                📧 Email Me
              </a>
              <a href="https://github.com/kSupreetha" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border border-gray-700 text-gray-300 px-6 py-4 rounded-xl text-sm hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-300">
                <GitHubIcon />GitHub
              </a>
              <a href="https://www.linkedin.com/in/supreetha-k-924aab28b/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border border-gray-700 text-gray-300 px-6 py-4 rounded-xl text-sm hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all duration-300">
                🔗 LinkedIn
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 text-center bg-black border-t border-gray-800/50">
        <p className="text-gray-600 text-sm font-mono">
          © 2026 <span className="text-cyan-400">K. Supreetha</span> • Built with React & Tailwind CSS
        </p>
        <p className="text-gray-700 text-xs mt-1">Open to Bangalore Opportunities</p>
      </footer>

      <ChatBot />
    </div>
  );
}

export default App;
