/** EDIT HERE: public copy, links, images, and contact configuration. Service copy is in services.ts. */
export const config = {
  name: "Verendo",
  email: "8174245usama@gmail.com",
  phone: "+1 971 399 4753",
  // Shared destination for every "Book 15-mins call" contact card.
  bookingUrl: "https://wa.me/19713994753",
  // Same-origin server routes. Configure delivery secrets in .env.local / Vercel.
  contactEndpoint: "/api/contact",
  newsletterEndpoint: "/api/newsletter",
  socials: {
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    x: "https://x.com/",
  },
};
export const media = (file: string) => `/media/${file}`;
export const assets = {
  hero: media("verendo-v-landscape.webp"),
  heroPoster: media("verendo-v-poster.webp"),
  avatar: media("6ikL2n7hPhepE6346JbqnpLhis.mp4"),
  footer: "/favicon.svg",
  landscape: media("KmimP8fJf3KTg25QrfWgNhSOI.avif"),
  innerHero: media("2ypHShhhuvlhIHGoRNi0sTmlo.avif"),
  aboutHero: media("about-hero.webp"),
  approach: media("about-approach.webp"),
  results: media("about-results.webp"),
  achievements: media("about-achievements.webp"),
  founder: media("about-founder.webp"),
  logo: media("verendo-logo.svg"),
};
export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
// Original Verendo design concepts; these are not launched products or client work.
export const demoProducts = [
  {
    name: "Verendo Desk",
    category: "Customer management",
    image: "demo-products/verendo-desk.svg",
  },
  {
    name: "Verendo Flow",
    category: "Workflow automation",
    image: "demo-products/verendo-flow.svg",
  },
  {
    name: "Verendo Book",
    category: "Appointment booking",
    image: "demo-products/verendo-book.svg",
  },
  {
    name: "Verendo Cart",
    category: "Online commerce",
    image: "demo-products/verendo-cart.svg",
  },
  {
    name: "Verendo Pulse",
    category: "Business analytics",
    image: "demo-products/verendo-pulse.svg",
  },
  {
    name: "Verendo Assist",
    category: "AI assistance",
    image: "demo-products/verendo-assist.svg",
  },
];
export const projects = [
  {
    slug: "streamscale-streaming-platform",
    legacySlug: "measurable-growth-with-proven-impact.-copy-copy-copy",
    name: "StreamScale",
    category: "Streaming · System Design",
    year: "2026",
    title: "StreamScale: A Netflix-Inspired Streaming Platform",
    description:
      "A portfolio project exploring a cinematic streaming experience, content administration, and the architecture behind a video platform.",
    image: "project-streamscale.png",
    logo: "project-streamscale-logo.svg",
    stats: [
      ["MERN", "Application stack"],
      ["VOD", "System design focus"],
    ],
    focus: [
      "Full-stack web application",
      "Video platform architecture",
      "Content and account management",
    ],
    challenge:
      "A streaming product has two connected jobs: help viewers find something to watch, and help administrators manage a growing catalogue. StreamScale explores that balance through a Netflix-inspired portfolio implementation and system design.",
    approachTitle: "Designing the Viewer and Admin Experience Together",
    approachDescription:
      "The project scope brings catalogue discovery, account journeys, content administration, and subscription-related screens into one product direction.",
    approachBody:
      "The system design considers media storage, content delivery, caching, and background processing separately from the interface. Clear boundaries between these responsibilities make the architecture easier to understand, extend, and evaluate.",
    resultsTitle: "A Portfolio Study in Streaming Product Engineering",
    resultsDescription:
      "This portfolio study brings together a cinematic product direction and the engineering questions behind video on demand: catalogue structure, account access, content administration, and media delivery.",
    imageAlt: "Representative StreamScale streaming platform product mockup",
  },
  {
    slug: "eventsphere-event-management-app",
    legacySlug: "measurable-growth-with-proven-impact.-copy-copy",
    name: "EventSphere",
    category: "Web App · Event Technology",
    year: "2026",
    title: "EventSphere: One Connected Event Management App",
    description:
      "A MERN portfolio application bringing organizer, exhibitor, and attendee journeys into a shared event and exhibition platform.",
    image: "project-eventsphere.png",
    logo: "project-eventsphere-logo.svg",
    stats: [
      ["3", "Core user roles"],
      ["MERN", "Application stack"],
    ],
    focus: [
      "Responsive web application",
      "Role-based user journeys",
      "Event and exhibition workflows",
    ],
    challenge:
      "Organizers, exhibitors, and attendees need different information from the same event. EventSphere explores how a shared application can connect those journeys while keeping each role’s work clear.",
    approachTitle: "Connecting the Full Event Journey",
    approachDescription:
      "The project is structured around organizer administration, exhibitor participation, and attendee discovery, supported by a React frontend and an Express API.",
    approachBody:
      "The portfolio scope covers event listings, account access, exhibition spaces, and participation workflows. The design considers authentication, permissions, and consistent API boundaries so each user role has a clear place within the product.",
    resultsTitle: "A Practical Full-Stack Application Case Study",
    resultsDescription:
      "EventSphere is a portfolio application built around three core user journeys. The case study focuses on connecting event discovery, participation, and administration through a coordinated web experience.",
    imageAlt:
      "Representative EventSphere event platform desktop and mobile mockup",
  },
  {
    slug: "tummly-restaurant-saas-design",
    legacySlug: "measurable-growth-with-proven-impact.-copy",
    name: "Tummly",
    category: "SaaS · Software Design",
    year: "2026",
    title: "Tummly: Software Design for Restaurant Operations",
    description:
      "A restaurant SaaS project connecting trial requests, account onboarding, restaurant locations, and guest-feedback journeys.",
    image: "project-tummly.png",
    logo: "project-tummly-logo.svg",
    stats: [
      ["React", "Frontend application"],
      [".NET", "API architecture"],
    ],
    focus: [
      "SaaS product and software design",
      "Account onboarding workflows",
      "Restaurant and location management",
    ],
    challenge:
      "Restaurant software has to work for a single venue and for a growing group. Tummly’s software design connects account approval, setup, locations, and guest feedback through an understandable onboarding journey.",
    approachTitle: "Turning Hospitality Workflows into Software",
    approachDescription:
      "The project connects a React interface with an ASP.NET Core API and a SQL Server data model, with separate responsibilities for onboarding, authentication, and administration.",
    approachBody:
      "The design covers trial requests, email verification, administrator review, invitation-based account setup, and single- or multi-location journeys. Clear API contracts and a structured data model connect those steps across the application.",
    resultsTitle: "A Clear Foundation for a Restaurant SaaS Product",
    resultsDescription:
      "Tummly connects product design with a structured backend around a specific business workflow. The portfolio focus is on understandable onboarding, restaurant account structure, and maintainable software responsibilities.",
    imageAlt:
      "Representative Tummly restaurant SaaS dashboard and tablet mockup",
  },
  {
    slug: "verendo-digital-agency-website",
    legacySlug: "scaling-shinta’s-influencers-marketing-for-growth",
    name: "Verendo",
    category: "Web Design · Digital Services",
    year: "2026",
    title: "Verendo: A Website Built Around Digital Services",
    description:
      "A digital-agency website project presenting web development, marketing, and AI automation through a clear service and enquiry journey.",
    image: "project-verendo.png",
    logo: "project-verendo-logo.svg",
    stats: [
      ["3", "Service pillars"],
      ["Web", "Digital experience"],
    ],
    focus: [
      "Website and interface design",
      "Service content and positioning",
      "Full-stack development direction",
    ],
    challenge:
      "A service business needs visitors to understand its offer quickly. Verendo brings development, digital marketing, and automation into one website experience with a clear route to a conversation.",
    approachTitle: "Designing a Clear Path from Services to Enquiries",
    approachDescription:
      "The portfolio project organizes service pages, project storytelling, and contact journeys around a consistent digital-agency identity.",
    approachBody:
      "The focus is on responsive interfaces, clear copy, reusable React components, and the supporting MERN architecture. Development, marketing, and automation are presented as distinct services within a consistent brand experience.",
    resultsTitle: "A Digital-Service Brand Presented with Clarity",
    resultsDescription:
      "Verendo is a portfolio website and product-presentation project. Its three service pillars connect development, marketing, and automation, with a service structure that helps visitors understand the offer and start an enquiry.",
    imageAlt:
      "Representative Verendo digital-services website desktop and mobile mockup",
  },
];
export type Project = (typeof projects)[number];
export const metrics = [
  {
    value: 4,
    suffix: "",
    label: "Portfolio projects",
  },
  {
    value: 3,
    suffix: "",
    label: "Connected services",
  },
  {
    value: 4,
    suffix: "",
    label: "Delivery stages",
  },
  {
    value: 1,
    suffix: "",
    label: "Connected approach",
  },
];
export const faqs = [
  [
    "What can Verendo help my business with?",
    "We offer three connected services: AI for Business, Website Development and Digital Marketing. We can focus on one priority or plan how the three should work together.",
  ],
  [
    "Who do you work with?",
    "Our focus is local, small and medium businesses in the UK, USA and UAE. We start by learning about your customers, market and goals rather than applying a one-size-fits-all industry template.",
  ],
  [
    "Do I need all three services?",
    "No. We start with the problem that matters most to your business. If one service is the right fit, that is where we focus.",
  ],
  [
    "How much will my project cost?",
    "We agree the scope before proposing a fee. Your proposal explains the deliverables, milestones and any ongoing or third-party costs. There are no preset monthly packages on this website.",
  ],
  [
    "Can you work with what we already have?",
    "Yes. We review your existing website, tools and marketing before recommending changes. We preserve what works and agree the improvements that are worth making.",
  ],
  [
    "What happens after launch?",
    "We provide an agreed handover and discuss support, maintenance or ongoing marketing separately. You know what is included and how to get help.",
  ],
  [
    "How do we get started?",
    "Book a discovery call or share your project details. We will talk through your business, your priorities and a practical next step.",
  ],
];
export const posts = [
  {
    slug: "building-smarter-ai-tools",
    title: "Building Smarter AI Tools for the Future of Scalable Businesses",
    category: "Announcement",
    image: "Vc7NO5U278jLe6P4yA7xGGgvE4.avif",
    intro:
      "A useful AI system starts with a clear understanding of the work. The best tools fit into an existing process and help people make progress with less friction.",
    sections: [
      [
        "Start with the business problem",
        "Map the recurring decisions, handoffs, and delays in your workflow. Choose one problem with a measurable outcome before introducing new technology. A small, well-defined system is easier to improve than a large collection of disconnected experiments.",
      ],
      [
        "Design for people",
        "Make it clear what the tool can do, which inputs it needs, and when a person should review its output. Predictable interactions help teams build confidence and spot problems early.",
      ],
      [
        "Build a feedback loop",
        "Measure completion time, error rates, and the amount of human review needed. Use those signals to improve the workflow as the team and business change.",
      ],
    ],
  },
  {
    slug: "how-to-get-better-results-from-ai",
    title: "How to Get 1000% Better Results From AI With Smarter Workflows",
    category: "Tips",
    image: "pIt4GsbYWu5BqT0GQoGjB72ym0.avif",
    intro:
      "Better results depend on the structure around your AI tools. Clear inputs, useful context, and a reliable review process matter as much as the model you choose.",
    sections: [
      [
        "Give every step a purpose",
        "Separate research, drafting, checking, and delivery. Define what a good output looks like for each step so the system can be evaluated consistently.",
      ],
      [
        "Use context carefully",
        "Provide the relevant source material and explain which constraints matter. Keep sensitive information within the tools and permissions your organization has approved.",
      ],
      [
        "Check before you scale",
        "Test the workflow with realistic examples. Include missing information and unusual cases, then decide where people need to review or override the result.",
      ],
    ],
  },
  {
    slug: "announcing-our-new-funding-round-to-series-a",
    title: "Announcing Our New Funding Round to Series A",
    category: "Announcement",
    image: "Qps65ImKDxccv7oQk1ZS9XDZY.avif",
    intro:
      "The next chapter is about building thoughtful systems and making reliable automation easier to adopt. This editable announcement is a place to share your own company news.",
    sections: [
      [
        "Investing in the next chapter",
        "Describe the milestones your team has reached and the customer problems you plan to address next. Replace this example with the verified details of your announcement.",
      ],
      [
        "Growing with our customers",
        "Share how the investment will support the product, the team, and the people who rely on your service. Focus on concrete plans and clear priorities.",
      ],
      [
        "What comes next",
        "Add the next steps, relevant dates, and a way for readers to follow future updates. Keep the announcement useful for existing customers as well as new visitors.",
      ],
    ],
  },
  {
    slug: "how-startups-can-do-more-with-less",
    title: "How AI Startups Can Do More With Less Work Using Automation",
    category: "Announcement",
    image: "5Y5HD06gLmz1ZXWPKheJFboktnQ.avif",
    intro:
      "Small teams can protect their time by automating repetitive handoffs. The goal is to remove avoidable work while keeping ownership and quality visible.",
    sections: [
      [
        "Find repeated tasks",
        "Look for work that follows the same sequence every week: collecting leads, organizing requests, preparing reports, or passing updates between tools.",
      ],
      [
        "Connect the tools you have",
        "Use a single source of truth for important records. Define what happens when a record changes, and make failures easy to see and recover from.",
      ],
      [
        "Keep the process simple",
        "Start with one workflow, document it, and measure the time it saves. Add complexity only when it solves a real problem.",
      ],
    ],
  },
  {
    slug: "rise-of-ai-agents-autonomous-systems",
    title: "How Autonomous Systems Are Changing Work",
    category: "Tips",
    image: "pbksAhLQSkvLSkN4bmLyzlzrPA.avif",
    intro:
      "AI agents can coordinate multiple steps of a task. Useful autonomy comes from a carefully defined scope, reliable tools, and clear points of human oversight.",
    sections: [
      [
        "Define the boundaries",
        "Specify what the agent can read, which actions it can take, and when it must ask a person to decide. Permissions should match the task.",
      ],
      [
        "Make actions observable",
        "Keep a record of important decisions and tool actions. Clear status messages and useful logs help people understand what the system is doing.",
      ],
      [
        "Improve through evaluation",
        "Test complete tasks, including failures and recovery. Judge the system by the quality of its outcomes rather than the number of steps it can perform.",
      ],
    ],
  },
  {
    slug: "from-chaos-to-clarity-designing-ai-workflows-that-scale",
    title: "Designing AI Workflows That Scale & Help You Daily",
    category: "Tips",
    image: "pa0FwuOjt0hQMDPRF3HG8SOSqU.avif",
    intro:
      "A scalable workflow is understandable, measurable, and easy to maintain. Start with a clear process and let the technology serve it.",
    sections: [
      [
        "Map the handoffs",
        "Document who owns each step, what information is needed, and where work gets delayed. This becomes the foundation for a useful automation plan.",
      ],
      [
        "Plan for exceptions",
        "Decide what happens when data is missing, a tool is unavailable, or a result needs review. A good recovery path is part of the design.",
      ],
      [
        "Review the system regularly",
        "As the business changes, revisit the workflow. Remove unnecessary steps and update the documentation so the team can keep using it confidently.",
      ],
    ],
  },
];
export type Post = (typeof posts)[number];

export { services, processSteps } from "./services";
