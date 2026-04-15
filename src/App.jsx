import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { 
  Moon, Sun, Mail, Phone, MapPin, Download, 
  ExternalLink, ChevronUp, Code2, Server, Database, BrainCircuit,
  MessageSquare, X, Send, User, ChevronRight, GraduationCap
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import profileImg from './assets/profile.jpg';
import resumePDF from './assets/resume.pdf';

const Linkedin = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Guvi = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M424.1 283.5c-11.8 45.4-44.5 91.1-98.1 112.4-53.6 21.3-118.4 12.3-162.7-24.1-44.3-36.4-61.9-97.1-43.7-151.7 18.2-54.6 69.1-97.6 126.1-105.1 57-7.5 113.8 17.5 146.4 61.2 11.2 15 17.9 32.8 19.3 51.1h-123.6v45.4h175.4c.5-5.6.8-11.3.8-17 0-46.7-14.8-92.4-41.9-129.2-27.1-36.8-65.6-64.6-110.1-79.6C306.9 46.9 258 43 210.8 55.4 163.6 67.8 120.3 96.1 86.8 135.2c-33.5 39.1-55.5 87.3-60.8 138.8-5.3 51.5 5.5 103.4 30.2 148.6 24.7 45.2 62.4 81.6 107.8 104.2 45.4 22.6 96.8 30.4 146.7 22.4 49.9-8 96.3-32.9 132.8-70.1 36.5-37.2 60.1-84.8 67.5-136.6h-46.9z" fill="currentColor"/>
  </svg>
);

// --- DATA ---
const PORTFOLIO_DATA = {
  name: "Barath.S",
  role: "Website Developer",
  tagline: "Full Stack & Cybersecurity Student",
  email: "skbarath424@gmail.com",
  phone: "6374618833",
  location: "Thiruvarur, India",
  education: {
    degree: "BE Computer Science (Cyber Security)",
    year: "2024-2028",
    institution: "Peri IT"
  },
  social: {
    guvi: "https://www.guvi.in/skbarath42426299",
    linkedin: "www.linkedin.com/in/sk-barath-1a8a0132b"
  },
  about: "I am a passionate Website Developer and Cybersecurity student with a knack for building secure, scalable, and beautifully designed web applications. Currently pursuing my BE(cyber security) at Peri IT, I thrive on turning complex problems into elegant, user-centric solutions.",
  skills: {
    Frontend: ["HTML", "CSS", "JavaScript", "Bootstrap", "React"],
    Backend: ["Spring Boot","Node.js"],
    Databases: ["MySQL", "MongoDB"],
    Languages: ["Python", "Java"],
    AITools: ["Antigravity", "Supabase", "VS Code", "github","Figma"],
    Specialized: ["Cybersecurity Fundamentals", "UI/UX Design"],
    SoftSkills: ["Teamwork", "Time Management", "Leadership", "Communication"]
  },
  projects: [
    {
      title: "Whisk Bakery Website",
      description: "A modern bakery website with interactive UI, product showcase, and responsive design.",
      tech: ["HTML", "CSS", "JavaScript"],
      demoLink: "https://whisk-backery.vercel.app/",
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "Password Strength Analyzer",
      description: "A real-time password strength checker that analyzes security, provides visual feedback, and suggests strong passwords.",
      tech: ["HTML", "CSS", "JavaScript"],
      demoLink: "https://barathsk-424.github.io/Password-Strength-Analyzer/",
      color: "from-blue-500 to-cyan-500"
    }
  ],
  experience: [
    {
      role: "Entry Level Web Developer",
      company: "Academic & Personal Projects",
      duration: "2024 - Present",
      description: "Successfully completed multiple academic and personal projects in web development, specializing in building responsive websites with HTML, CSS, and JavaScript. Notable works include the Whisk Bakery Website and Password Strength Analyzer. Currently expanding expertise in Full Stack Development and Cybersecurity while actively seeking internship and career opportunities."
    }
  ]
};

// --- CHATBOT CONFIG ---
const BOT_RESPONSES = {
  greetings: ["Hello! I'm Barath's AI assistant. Do you want to know about his skills, projects, education, or contact info?"],
  skills: ["Barath is skilled in React, Node.js, Spring Boot, MySQL, MongoDB, Java, and Python. He's also great with Figma and Supabase!"],
  projects: ["Barath has built awesome projects like the 'Backer Website' for crowdfunding, and a 'Password Strength Checker' tool! Check the Projects section for more."],
  education: ["Barath is currently pursuing his BE in Computer Science (Cyber Security) at Peri IT, expected to graduate in 2028."],
  contact: ["You can reach Barath at skbarath424@gmail.com or call him at 6374618833. He is based in Thiruvarur, India."],
  default: ["I'm a simple AI. I can answer questions about Barath's skills, projects, education, or contact details. Try asking about one of those!"]
};

// --- COMPONENTS ---

const TypewriterText = ({ texts, delay = 150 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[textIndex];
      
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);

        if (currentIndex === fullText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(fullText.substring(0, currentIndex - 1));
        setCurrentIndex(prev => prev - 1);

        if (currentIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? delay / 2 : delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, texts, textIndex, delay]);

  return (
    <span className="font-semibold text-gradient border-r-2 border-blue-500 pr-1 animate-pulse">
      {currentText}
    </span>
  );
};

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;
    setStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => setStyle({ rotateX: 0, rotateY: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: style.rotateX, rotateY: style.rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`perspective-1000 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

const SectionHeading = ({ children, subtitle }) => (
  <div className="text-center mb-16">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-4"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full"
      />
    )}
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: BOT_RESPONSES.greetings[0], isBot: true }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      let response = BOT_RESPONSES.default[0];

      if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
        response = BOT_RESPONSES.skills[0];
      } else if (lowerInput.includes('project') || lowerInput.includes('work')) {
        response = BOT_RESPONSES.projects[0];
      } else if (lowerInput.includes('edu') || lowerInput.includes('study') || lowerInput.includes('degree')) {
        response = BOT_RESPONSES.education[0];
      } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone')) {
        response = BOT_RESPONSES.contact[0];
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
        response = BOT_RESPONSES.greetings[0];
      }

      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl hover:shadow-cyan-500/30 transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 glass-card rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style={{ height: '450px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BrainCircuit size={20} />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full text-white/90">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide dark:bg-navy-900/60 bg-white/70">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.isBot 
                    ? 'bg-slate-200 dark:bg-navy-800 text-slate-800 dark:text-slate-200 rounded-tl-none' 
                    : 'bg-blue-500 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white/80 dark:bg-navy-950/80 border-t border-slate-200 dark:border-navy-700/50 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my skills..."
              className="flex-1 bg-transparent px-3 py-2 outline-none text-sm dark:text-white"
            />
            <button type="submit" className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors">
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const onSubmitContact = (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Replace these with your actual EmailJS credentials
    const SERVICE_ID = 'service_qrd9fhl';
    const TEMPLATE_ID = 'template_ahyv0zj';
    const PUBLIC_KEY = '9SybhA2da93ikIGXf';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setSubmitStatus('success');
          reset();
      }, (error) => {
          console.log(error.text);
          setSubmitStatus('error');
      })
      .finally(() => {
          setIsSubmitting(false);
          setTimeout(() => setSubmitStatus(null), 5000);
      });
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className="fixed w-full z-40 top-0 glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#" className="text-2xl font-bold text-gradient tracking-tight">BARATH.S</a>
            <div className="hidden md:flex space-x-8">
              {['About', 'Skills', 'Projects', 'Experience', 'Social Media', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center relative">
          {/* Decorative blur elements */}
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col md:flex-row items-center md:justify-between gap-12 relative z-10"
          >
            {/* Left Column: Text Content */}
            <div className="flex flex-col max-w-2xl text-center md:text-left order-2 md:order-1">
              <h3 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-cyan-400 mb-2 tracking-wide">
                Hey, I'm
              </h3>
              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight tracking-tight dark:text-white">
                BARATH.S
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                I build digital experiences.
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                I am a passionate Website Developer and Cybersecurity student. Combining beautiful UI/UX with rigorous security principles to build robust digital solutions.
              </p>
              <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                <a href="#contact" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-blue-500/40 flex items-center gap-2">
                  Get In Touch <ChevronRight size={18} />
                </a>
                <a href={resumePDF} download="Barath_Resume.pdf" className="px-10 py-4 glass text-slate-800 dark:text-white rounded-xl font-bold border border-white/40 hover:bg-white/30 dark:hover:bg-navy-800/60 transition-all flex items-center gap-2">
                  <Download size={18} /> Download Resume
                </a>
              </div>
            </div>

            {/* Right Column: Circular Photo */}
            <div className="flex-shrink-0 order-1 md:order-2">
              <div className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-[8px] border-white dark:border-navy-700 shadow-[0_25px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-105 group relative bg-white dark:bg-navy-800 flex items-center justify-center">
                {/* Real Image */}
                <img 
                  src={profileImg} 
                  alt="Barath" 
                  className="w-full h-full object-cover object-top relative z-10 transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                  }}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24">
          <SectionHeading subtitle>About Me</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {PORTFOLIO_DATA.about}
              </p>
              <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl">{PORTFOLIO_DATA.education.degree}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex gap-2 items-center">
                      <span>{PORTFOLIO_DATA.education.institution}</span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                      <span>{PORTFOLIO_DATA.education.year}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full max-w-md mx-auto md:max-w-none"
            >
              <div className="aspect-[3/4] relative rounded-3xl overflow-hidden glass-card shadow-2xl flex items-center justify-center group bg-navy-900 border border-white/30 dark:border-navy-500/30">
                 {/* Decorative background */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 z-0"></div>
                 <img 
                   src={profileImg} 
                   alt="Barath Profile" 
                   className="w-full h-full object-cover object-top relative z-10 group-hover:scale-110 transition-transform duration-700"
                 />
                 {/* Gradient overlay for premium feel */}
                 <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent z-10 pointer-events-none mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="absolute inset-0 border-[4px] border-white/30 dark:border-navy-500/30 rounded-3xl z-20 m-3 md:m-4 pointer-events-none transition-all duration-500 group-hover:m-2 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24">
          <SectionHeading subtitle>Technical Expertise</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PORTFOLIO_DATA.skills).map(([category, skills], idx) => {
              const icons = {
                Frontend: <Code2 className="text-blue-500" />,
                Backend: <Server className="text-teal-500" />,
                Databases: <Database className="text-indigo-500" />,
                Languages: <Code2 className="text-purple-500" />,
                AITools: <BrainCircuit className="text-pink-500" />,
                Specialized: <Code2 className="text-cyan-500" />,
                SoftSkills: <MessageSquare className="text-orange-500" />
              };
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/50 dark:bg-navy-800/50 rounded-xl">
                      {icons[category]}
                    </div>
                    <h3 className="text-xl font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-slate-100 dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24">
          <SectionHeading subtitle>Featured Works</SectionHeading>
          <div className="grid md:grid-cols-2 gap-8">
            {PORTFOLIO_DATA.projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <TiltCard className="h-full">
                  <div className="glass-card h-full rounded-3xl p-8 flex flex-col group overflow-hidden relative">
                    {/* Background glow decoration */}
                    <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${project.color} opacity-10 dark:opacity-20 blur-[50px] group-hover:opacity-30 transition-opacity duration-500`}></div>
                    
                    <h3 className="text-2xl font-bold mb-4 relative z-10">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1 relative z-10 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map(t => (
                          <span key={t} className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-navy-800 rounded-md text-slate-700 dark:text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-navy-700/50">
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-cyan-500 transition-colors">
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="py-24">
          <SectionHeading subtitle>Experience & Journey</SectionHeading>
          <div className="max-w-3xl mx-auto pl-4 border-l-2 border-blue-200 dark:border-navy-700 space-y-12">
            {PORTFOLIO_DATA.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8"
              >
                {/* Timeline Dot */}
                <div className="absolute top-0 -left-[45px] w-[26px] h-[26px] bg-blue-100 dark:bg-navy-900 border-4 border-blue-500 rounded-full z-10"></div>
                
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold tracking-wide mb-4">
                    {exp.duration}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{exp.company}</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SOCIAL MEDIA SECTION */}
        <section id="social-media" className="py-24">
          <SectionHeading subtitle>Social Media</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'LinkedIn', 
                icon: Linkedin, 
                link: `https://${PORTFOLIO_DATA.social.linkedin}`, 
                color: 'from-blue-600 to-blue-400', 
                description: 'Professional networking & career updates' 
              },
              { 
                name: 'GUVI', 
                icon: Guvi, 
                link: PORTFOLIO_DATA.social.guvi, 
                color: 'from-emerald-500 to-teal-400', 
                description: 'Coding profile & certifications' 
              },
              { 
                name: 'Email', 
                icon: Mail, 
                link: `mailto:${PORTFOLIO_DATA.email}`, 
                color: 'from-rose-500 to-red-400', 
                description: 'Direct inquiries & collaborations' 
              },
              { 
                name: 'Resume', 
                icon: Download, 
                link: resumePDF, 
                color: 'from-cyan-500 to-blue-400', 
                description: 'Download full professional CV', 
                download: true 
              }
            ].map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.link}
                target={platform.download ? undefined : "_blank"}
                rel={platform.download ? undefined : "noreferrer"}
                download={platform.download}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden glass-card rounded-3xl p-8 flex flex-col items-center text-center transition-all border border-slate-200/50 dark:border-navy-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50"
              >
                {/* Background Glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${platform.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <platform.icon size={32} />
                </div>
                
                <h4 className="text-xl font-bold mb-2 dark:text-white">{platform.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {platform.description}
                </p>
                
                <div className={`mt-auto px-6 py-2 rounded-full border border-slate-200 dark:border-navy-700 text-sm font-semibold group-hover:bg-gradient-to-r ${platform.color} group-hover:text-white group-hover:border-transparent transition-all duration-300`}>
                  {platform.download ? 'Download' : 'Visit Profile'}
                </div>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ExternalLink size={14} className="text-slate-400" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24">
          <SectionHeading subtitle>Let's Connect</SectionHeading>
          <div className="grid md:grid-cols-5 gap-12 glass-card rounded-3xl p-8 md:p-12 overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>
            
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-8 relative z-10">
              <div>
                <h3 className="text-3xl font-bold mb-4">Get in touch</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Whether you have a project in mind, an internship opportunity, or just want to say hi, my inbox is always open.
                </p>
              </div>
              
              <div className="space-y-6">
                <a href={`mailto:${PORTFOLIO_DATA.email}`} className="flex items-center gap-4 group">
                  <div className="p-4 bg-white/50 dark:bg-navy-800/50 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email</p>
                    <p className="font-medium group-hover:text-blue-500 transition-colors">{PORTFOLIO_DATA.email}</p>
                  </div>
                </a>
                
                <a href={`tel:${PORTFOLIO_DATA.phone}`} className="flex items-center gap-4 group">
                  <div className="p-4 bg-white/50 dark:bg-navy-800/50 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Phone</p>
                    <p className="font-medium group-hover:text-blue-500 transition-colors">+91 {PORTFOLIO_DATA.phone}</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/50 dark:bg-navy-800/50 rounded-xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Location</p>
                    <p className="font-medium">{PORTFOLIO_DATA.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form ref={form} onSubmit={handleSubmit(onSubmitContact)} className="md:col-span-3 space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <input
                    name="name"
                    {...register("name", { required: true })}
                    className="w-full bg-white/50 dark:bg-navy-950/50 border border-slate-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input
                    name="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full bg-white/50 dark:bg-navy-950/50 border border-slate-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1">Valid email is required</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                <input
                  name="subject"
                  {...register("subject")}
                  className="w-full bg-white/50 dark:bg-navy-950/50 border border-slate-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                  placeholder="Internship Opportunity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea
                  name="message"
                  {...register("message", { required: true })}
                  rows="4"
                  className="w-full bg-white/50 dark:bg-navy-950/50 border border-slate-200 dark:border-navy-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white resize-none"
                  placeholder="Hello Barath..."
                />
                {errors.message && <span className="text-red-500 text-xs mt-1">Message is required</span>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-cyan-500/25 flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>

              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500 text-center font-medium">
                  Message sent successfully! I will get back to you soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center font-medium">
                  Failed to send message. Please try again or email me directly.
                </motion.p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="glass border-t border-slate-200 dark:border-navy-800 py-12 text-center mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-medium">
            Personal Portfolio 2026
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} {PORTFOLIO_DATA.name}. Designed & Built with ❤️ and React.
          </p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
