import {
  Sparkles,
  Briefcase,
  TrendingUp,
  Users,
  ChartColumnIcon,
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  MessageCircle,
  Upload,
  History,
} from "lucide-react";

export const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Resume",
    href: "/resume-analysis",
  },
  {
    name: "Interview",
    href: "/interview",
  },
  {
    name: "Jobs",
    href: "/jobs",
  },
];

export const companyNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/company/dashboard" },
  {
    icon: Megaphone,
    label: "Jobs Applications",
    href: "/company/jobs-applications",
  },
  { icon: ClipboardList, label: "All Jobs", href: "/company/all-jobs" },
  {
    icon: MessageCircle,
    label: "Applicant Messages",
    href: "/company/applicant-messages",
  },
];

export const ApplicantNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/applicant/dashboard" },
  {
    icon: History,
    label: "Interview History",
    href: "/applicant/interview-history",
  },
  {
    icon: Upload,
    label: "Upload Resume",
    href: "/applicant/upload-resume",
  },
];

export const features = [
  {
    icon: <Sparkles className="w-12 h-12 text-white" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advance AI technology",
  },
  {
    icon: <Briefcase className="w-12 h-12 text-white" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
  },
  {
    icon: <TrendingUp className="w-12 h-12 text-white" />,
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
  },
  {
    icon: <Users className="w-12 h-12 text-white" />,
    title: "Networking",
    description:
      "Connect with professional and built meaningful relationships in your industry.",
  },
  {
    icon: <Briefcase className="w-12 h-12 text-white" />,
    title: "Job Opportunities",
    description:
      "Discover exclusive job opportunities matched to your skill and interests.",
  },
  {
    icon: <ChartColumnIcon className="w-12 h-12 text-white" />,
    title: "Resume Analytics",
    description:
      "Resume Analytics delivers insights on your applications and career growth empowering you to optimize your resume and make strategic, data driven career moves.",
  },
];

export const stats = [
  { value: "50+", label: "Industries Covered" },
  { value: "1000+", label: "Interview Questions" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "AI Support" },
];

export const featuredJobs = [
  {
    title: "Email Marketing",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/App_store_jbqou3.png",
  },
  {
    title: "Visual Designer",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Spotify_poweez.png",
  },
  {
    title: "Data Analyst",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/wordpress_ohrhsy.png",
  },
  {
    title: "Content Writer",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Slack_zinfzu.png",
  },
  {
    title: "Product Designer",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Search_ixaf16.png",
  },
  {
    title: "PHP/JS DEVELOPER",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Telegram_nhdavo.png",
  },
  {
    title: "Plugin Developer",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Figma_xiqykb.png",
  },
  {
    title: "Digital Marketer",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Pinterest_kjdcmt.png",
  },
];

export const latestJobs = [
  {
    title: "Lead Product Designer",
    company: "App Store",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/App_store_jbqou3.png",
    iconBg: "#0A84FF",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    title: "Social Media Assistant",
    company: "Spotify",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Spotify_poweez.png",
    iconBg: "#1DB954",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    title: "Digital Marketer",
    company: "WordPress",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/wordpress_ohrhsy.png",
    iconBg: "#21759B",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    title: "Digital Marketer",
    company: "WordPress",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/wordpress_ohrhsy.png",
    iconBg: "#0077B5",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    title: "Full-Stack Developer",
    company: "Slack",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Slack_zinfzu.png",
    iconBg: "#E01E5A",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    title: "UX Designer/Researcher",
    company: "Pinterest",
    icon: "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Pinterest_kjdcmt.png",
    iconBg: "#E60023",
    jobType: "FULL TIME",
    salary: "$10K-$15K",
    applyBefore: "8 DEC, 2023",
    location: "London, United Kingdom",
    description:
      "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
];

export const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Apple Corp Inc.",
    companyIcon:
      "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/App_store_jbqou3.png",
    iconBg: "#0A84FF",
    location: "San Francisco, CA",
    salary: "120k - 180k",
    postedTime: "2 days ago",
    jobType: "Full Time",
    description:
      "We're looking for an experienced Frontend Developer to join our growing team. You'll work on cutting-edge web applications using React, TypeScript, and modern web technologies.",
    skills: ["Next JS", "React", "TypeScript"],
    responsibilities: [
      "Build and maintain web applications using React and TypeScript",
      "Collaborate with designers to implement pixel-perfect UI",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and mentor junior developers",
    ],
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Strong understanding of TypeScript and Next.js",
      "Experience with state management (Redux, Zustand, etc.)",
      "Excellent problem-solving and communication skills",
    ],
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Spotify Corp Inc.",
    companyIcon:
      "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/Spotify_poweez.png",
    iconBg: "#1DB954",
    location: "Remote",
    salary: "90k - 130k",
    postedTime: "1 week ago",
    jobType: "Full Time",
    description:
      "Join our creative team to design beautiful and intuitive user experiences. We're looking for someone passionate about user-centered design and modern design systems.",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    responsibilities: [
      "Design user interfaces for web and mobile applications",
      "Conduct user research and usability testing",
      "Create and maintain design systems",
      "Collaborate with product and engineering teams",
    ],
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency in Figma and other design tools",
      "Strong portfolio demonstrating design thinking",
      "Understanding of accessibility and responsive design",
    ],
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "WordPress Corp Inc.",
    companyIcon:
      "https://res.cloudinary.com/dvlpfgchq/image/upload/v1763882394/wordpress_ohrhsy.png",
    iconBg: "#21759B",
    location: "New York, NY",
    salary: "130k - 170k",
    postedTime: "3 days ago",
    jobType: "Full Time",
    description:
      "Help us build the next generation of SaaS products. You'll work across the stack, from database design to frontend implementation, in a fast-paced startup environment.",
    skills: ["Next JS", "React", "Node.js", "PostgreSQL", "AWS"],
    responsibilities: [
      "Develop full-stack features from conception to deployment",
      "Design and optimize database schemas",
      "Build and maintain RESTful APIs",
      "Deploy and manage applications on AWS",
    ],
    requirements: [
      "4+ years of full-stack development experience",
      "Strong knowledge of React, Node.js, and SQL databases",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Ability to work in a fast-paced startup environment",
    ],
  },
];
