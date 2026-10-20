// Techorama NL 2026 schedule data (ported from the original planner page).
export type DayKey = "mon" | "tue" | "wed";
export interface Session { id: string; url?: string; room: string; title: string; who: string; track: string; lvl: string; skip?: boolean }
export interface Slot { t: [string, string]; kind?: string; s: Session[] }
export interface Day { label: string; note: string; slots: Slot[] }

export const TR: Record<string, string> = { AI: "AI & Agents", ARC: "Architecture & Security", OPS: "Cloud & DevOps", DATA: "Data", DEV: "Dev", LEAD: "Leadership & Productivity", "": "" };
export const LV: Record<string, string> = { I: "Introductory", M: "Intermediate", A: "Advanced" };
const S = (id: number, room: string, title: string, who: string, track: string, lvl: string): Session => ({ id: "s" + id, url: "https://techorama.nl/schedule/sessions/" + id, room, title, who, track, lvl });
const W = (n: number, slug: string, title: string, who: string): Session => ({ id: "w" + n, url: "https://techorama.nl/schedule/workshops/" + slug, room: "Van der Valk Utrecht", title, who, track: "", lvl: "" });
const M1 = "Mission 1 (JB)", M2 = "Mission 2 (JB)", PR = "Progress (JB)";

export const DAYS: Record<DayKey, Day> = {
  mon: { label: "Monday 26 October", note: "Full-day workshops at the Van der Valk hotel Utrecht. Workshop ticket needed.", slots: [
    { t: ["Full day", ""], kind: "Workshops", s: [
      W(1, "from-todo-to-ta-da-agentic-engineering-on-github", "From TODO to Ta-Da: Agentic Engineering on GitHub", "Colin Dembovsky, Josh Johanning"),
      W(2, "mastering-modern-architecture-building-flexible-distributed-systems-with-hands-on-code", "Mastering Modern Architecture: Building Flexible, Distributed Systems with Hands-On Code", "Oliver Sturm"),
      W(3, "software-architecture-fundamentals", "Software Architecture Fundamentals", "Ardalis"),
      W(4, "vibe-coding-for-production", "Vibe Coding for Production", "Nick Chapsas"),
    ]},
  ]},
  tue: { label: "Tuesday 27 October", note: "Kinepolis Jaarbeurs Utrecht. Registration and breakfast from 07:30.", slots: [
    { t: ["08:30", "09:30"], kind: "Keynote", s: [ S(1327742, "Room 12", "Scale vs Soul", "Dado Van Peteghem", "AI", "I") ]},
    { t: ["09:45", "10:45"], s: [
      S(1235596, M1, "Who's in Charge? Taking Control of Coding Agents with OpenCode and OpenSpec", "Geert van der Cruijsen", "AI", "I"),
      S(1195296, M2, "One Size Fits None: Make Azure best practices work for your organization", "Barbara Forbes", "ARC", "I"),
      S(1196856, PR, "Scrum to Swarm: Rethinking Software Delivery for the Age of Agents", "Colin Dembovsky", "AI", "I"),
      S(1246271, "Room 10", "MITRE ATT&CK for Developers", "Chris Ayers", "ARC", "M"),
      S(1321242, "Room 11", "Inside the Agent Loop: build a .NET Flight Recorder for Github Copilot, Cursor and Claude", "Christophe Nasarre", "AI", "M"),
      S(1216344, "Room 12", "Weird C# features you (don't) need to know about", "Jiří Činčura", "DEV", "M"),
      S(1233066, "Room 13", "Aspireify your app in an hour", "Maddy Montaquila, Tommaso Stocchi", "DEV", "I"),
      S(1187364, "Room 7", "Application Performance Optimisation in Practice", "Steve Gordon", "DEV", "M"),
      S(1151769, "Room 8", "Mastering Multi-Agent Madness With Microsoft Agent Framework", "Matthijs van der Veer", "AI", "M"),
      S(1192213, "Room 9", "Thread by Thread: Lessons from Migrating to Fabric", "Sam Debruyn", "DATA", "I"),
    ]},
    { t: ["11:15", "12:15"], s: [
      S(1176719, M1, "Slaying the Password Dragon with Passkeys and .NET 10", "Andrew Clymer", "ARC", "M"),
      S(1207641, M2, "Agents Don't Sleep: How AI Turns a 3 AM Incident into a Reviewable Fix", "Jurre Brandsen", "AI", "M"),
      S(1244217, PR, "Modular Code with Examples in C#", "Ian Cooper", "DEV", "M"),
      S(1320606, "Room 10", "Fabric FinOps - Cost Optimization for Fabric", "Alexander Arvidsson", "DATA", "M"),
      S(1318364, "Room 11", "Let's build our own coding agent", "Max Gfeller", "AI", "M"),
      S(1250681, "Room 12", "Kindness in tech", "Kathleen Dollard", "LEAD", "I"),
      S(1246903, "Room 13", "Beat the Clock: Building a Production-Ready Agentic App in 60 Minutes", "Jeff Prosise", "AI", "A"),
      S(1320836, "Room 7", "Do It With Style: Rethinking CSS", "Dylan Beattie", "DEV", "M"),
      S(1245628, "Room 8", "What's New for Developers in SQL Server 2025", "Leonard Lobel", "DEV", "M"),
      S(1316134, "Room 9", "Building an Application with Copilot and Lovable: The Easy, the Hard, and the Unexpected", "Juliana Smith", "AI", "I"),
    ]},
    { t: ["12:30", "13:00"], kind: "Lunch talk", s: [ S(1309018, "Room 12", "Ask and You Shall Generate: Building and Answering Questions at Cito with AI", "Christian van Dijk", "AI", "I") ]},
    { t: ["13:15", "14:15"], s: [
      S(1185098, M1, "The Myth of Message Ordering: What Message Brokers Actually Guarantee", "Poornima Nayar", "ARC", "M"),
      S(1207790, M2, "When AI meets your database: Securing sensitive data in Azure SQL in an AI-driven world", "Pieter Vanhove", "DATA", "M"),
      S(1317875, PR, "Developer Workflows in AI Age - Local or Cloud", "Sam Basu", "AI", "M"),
      S(1245292, "Room 10", "Gatekeeping the API: Azure-native vs Open-source on Kubernetes", "Filip Verlee", "OPS", "M"),
      S(1226286, "Room 11", "How I Migrated a Production Blazor App in Under 40 Hours Using AI", "Hans Muns", "DEV", "I"),
      S(1207969, "Room 12", "Antipatterns, Smells, and Worst Practices", "Ardalis", "DEV", "I"),
      S(1190251, "Room 13", "Build an Enterprise-Grade MCP Server", "Rockford Lhotka", "AI", "I"),
      S(1324527, "Room 7", "What's New In .NET 11", "Jon Galloway", "DEV", "I"),
      S(1228359, "Room 8", "Mission Copilot Autofix: Securing the World's Code with AI and GitHub Advanced Security", "Randy Pagels", "ARC", "I"),
      S(1205255, "Room 9", "Doctor, my agent keeps acting up", "Ruben Scheedler", "AI", "I"),
    ]},
    { t: ["14:30", "15:30"], s: [
      S(1151925, M1, "Change is inevitable: versioning event-driven systems", "Laila Bougria", "ARC", "A"),
      S(1187368, M2, "Unveiling .NET Secrets with the World's Smallest C# Program", "Steve Gordon", "DEV", "A"),
      S(1252440, PR, "Your Pipeline Is the Target: A DevOps Field Guide to Modern Supply Chain Security", "Brian Randell", "OPS", "M"),
      S(1175301, "Room 10", "Building AI-Ready Data Infrastructure at Terabyte Scale with Terraform and Azure", "Florian Lenz", "DATA", "M"),
      S(1246988, "Room 11", "One arrow, multiple breaches: what I've learned jailbreaking AI chatbots", "Yianna Paris", "ARC", "I"),
      S(1216224, "Room 12", "POC Prison: Why agentic systems never escape the lab and how to fix that in 90 days", "Luise Freese", "AI", "I"),
      S(1275951, "Room 13", "From Code Health to Quality Gates with GitHub Code Quality", "Josh Johanning, Tiago Pascoal", "DEV", "I"),
      S(1241958, "Room 7", "Above the Cloud: Building Data Centers in Space", "Richard Campbell", "AI", "M"),
      S(1247289, "Room 8", "Blazor, MAUI, WPF, or WinForms? Picking the Right .NET UI Framework in the AI Coding Era", "Mark Allibone", "DEV", "M"),
      S(1210579, "Room 9", "Doing Agentic Micro UI Right: User Experience Rules", "Dean Schuster", "AI", "I"),
    ]},
    { t: ["16:00", "17:00"], s: [
      S(1247138, M1, "The Developers Guide to Azure SQL Hyperscale", "Bob Ward", "DATA", "M"),
      S(1246663, M2, "Securing ASP.NET Core Today: Lessons from the New OWASP Top 10", "Christian Wenz", "ARC", "M"),
      S(1152280, PR, "Telemetry in .NET", "Stephen Cleary", "DEV", "M"),
      S(1330095, "Room 10", "When Abstractions Leak: Optimizing Message Queuing on SQL Server", "Tomasz Masternak", "DEV", "M"),
      S(1232821, "Room 11", "It's a trap! Stuff a developer needs to know about Azure networking", "Rik Hepworth", "OPS", "I"),
      S(1208113, "Room 12", "You're Not Just Tired: The Psychology of Burnout", "Arthur Doler", "LEAD", "I"),
      S(1177277, "Room 13", "Using Microsoft Kiota to go from OpenAPI to first-class .NET client SDKs", "Alex Thissen", "DEV", "M"),
      S(1241884, "Room 7", "Trust Fall: Building UX for Apps that work on their own", "David Ortinau", "AI", "M"),
      S(1246312, "Room 8", "Copilot Studio for Developers: What You Need to Unlearn", "Christina Wheeler", "AI", "M"),
      S(1155333, "Room 9", "Building AI solutions using Azure AI Foundry", "Tomaž Kaštrun", "AI", "M"),
    ]},
    { t: ["17:15", "18:15"], s: [
      S(1153820, M1, "Reliable Agentic Systems need Durable Execution", "Marc Duiker", "AI", "A"),
      S(1329755, M2, "Problems scale faster with AI", "Liuba Gonta", "LEAD", "I"),
      S(1246091, PR, "Azure Service Bus - Behind the scenes", "Clemens Vasters", "ARC", "M"),
      S(1193663, "Room 10", "Modern cross-platform applications with .NET and Avalonia UI", "Roland König", "DEV", "I"),
      S(1241602, "Room 11", "Optimizing data for agentic use", "Jelle Fremery", "DATA", "I"),
      S(1246376, "Room 12", "C# 14 and Beyond", "Bart De Smet", "DEV", "M"),
      S(1228368, "Room 13", "Test Smarter with AI: Playwright Automation at Scale on Azure", "Randy Pagels", "DEV", "I"),
      S(1230041, "Room 8", "SRE practices in an agentic world", "Tom van den Berg", "AI", "M"),
      S(1175298, "Room 9", "Azure Landing Zones Without the Overwhelm: A Simple Platform Foundation for .NET Teams", "Florian Lenz", "ARC", "M"),
    ]},
  ]},
  wed: { label: "Wednesday 28 October", note: "Kinepolis Jaarbeurs Utrecht. Closing session at 17:15, then the closing reception.", slots: [
    { t: ["08:30", "09:30"], s: [
      S(1183827, M1, "Applying the OWASP Top 10 for Agentic Applications to Your AI Agents", "Will Velida", "AI", "M"),
      S(1177275, M2, "Run locally, call from anywhere: Debugging cloud apps with Dev Tunnels", "Alex Thissen", "OPS", "M"),
      S(1202445, PR, "Death by Tool Calls: Using CodeGen Agents to Solve the Biggest Problem with Agentic AI", "Jeff Prosise", "AI", "A"),
      S(1181517, "Room 10", "Don't talk to me like I'm a computer scientist.", "Dean Schuster", "DEV", "I"),
      S(1233691, "Room 11", "What I learned from modernizing a microservices architecture", "Dennis Doomen", "ARC", "M"),
      S(1320835, "Room 12", "OK, Code Is Worthless... Now What?", "Dylan Beattie", "AI", "I"),
      S(1236348, "Room 13", "Data Platform Bingo: Deployment Edition", "Danny Kruge, Tonie Huizer", "DATA", "I"),
      S(1317872, "Room 7", "Interoperability of .NET", "Sam Basu", "DEV", "M"),
      S(1245634, "Room 8", "Developer's Guide to AI in SQL Server 2025 and Azure SQL", "Leonard Lobel", "DEV", "M"),
      S(1200815, "Room 9", "Cognitive Shift: How Agentic AI Changes the Way We Think", "Thijs Baan", "AI", "M"),
    ]},
    { t: ["09:45", "10:45"], s: [
      S(1248478, M1, "Reimagining PostgreSQL for AI Apps: Inside Azure HorizonDB", "Bob Ward", "DATA", "M"),
      S(1324526, M2, "Tokenomics: Writing Better Code with Fewer Tokens in GitHub Copilot", "Jon Galloway", "DEV", "M"),
      S(1216334, PR, "Azure Spot instances as your secret weapon", "Jiří Činčura", "OPS", "I"),
      S(1153288, "Room 10", "CRAcking Compliance - The EU Cyber Resilience Act", "Christian Schabetsberger", "ARC", "M"),
      S(1213522, "Room 11", "Shipping genAI with confidence using ASSERT and evaluations in Microsoft Foundry", "Arne De Proft, Laura Verghote", "AI", "M"),
      S(1275945, "Room 12", "Quality in the Agentic Era: Keeping Engineering Standards at AI Speed", "Josh Johanning, Tiago Pascoal", "AI", "M"),
      S(1241959, "Room 13", "The Future of Energy", "Richard Campbell", "AI", "M"),
      S(1317798, "Room 7", "Model Context Protocol (MCP) version 2", "Rockford Lhotka", "AI", "M"),
      S(1152273, "Room 8", "Async Masterclass", "Stephen Cleary", "DEV", "A"),
      S(1312362, "Room 9", "From APIs to Agents: Building Governed AI Workflows", "Zinat Farhang", "DEV", "I"),
    ]},
    { t: ["11:15", "12:15"], s: [
      S(1322115, M1, "Dark Factories - From Science Fiction to Production", "Andreas Wänqvist", "AI", "M"),
      S(1313715, M2, "Combining Azure DevOps with GitHub: what to expect", "Jacco Rademaker", "OPS", "I"),
      S(1246095, PR, "What time is it? The mysterious clocks of sports and other things we do.", "Clemens Vasters", "DATA", "I"),
      S(1256156, "Room 10", "Beyond DDD vs EA: Architecting Autonomous Landscapes That Actually Scale", "Dwight Matthys", "ARC", "A"),
      S(1202282, "Room 11", "Continuous Evaluation & Monitoring for AI Applications", "Soham Dasgupta", "ARC", "A"),
      S(1219377, "Room 12", "Pattern-based C#: if it quacks like a duck…", "Eva Ditzelmüller, Stefan Pölz", "DEV", "M"),
      S(1242813, "Room 13", "From 10 to 10,000 Agents: Engineering a Governed AI Platform on Azure with Citadel", "Jesse Wellenberg, Patrick de Kruijf", "AI", "M"),
      S(1240554, "Room 7", "Build Next-Gen AI Apps with .NET", "David Ortinau", "DEV", "M"),
      S(1319474, "Room 8", "Reviving a Legacy Codebase with AI", "Mark Heath", "AI", "I"),
      S(1246845, "Room 9", "The Web Platform Caught Up, but .NET Devs Didn't Notice", "Glenn F. Henriksen", "DEV", "M"),
    ]},
    { t: ["12:30", "13:00"], kind: "Lunch talk (in Dutch)", s: [ S(1319115, "Room 12", "Ik automatiseerde mijn eigen werk weg: twee AI-agents in incident response", "Ömer Zülaloğlu", "AI", "M") ]},
    { t: ["13:15", "14:15"], s: [
      S(1341135, M1, "From Fabric to Fantastic: How dbt Makes Your Lakehouses and Warehouses Shine", "Sam Debruyn", "DATA", "I"),
      S(1194187, M2, "Building a Hybrid AI Platform for Agent-Heavy Engineering", "Willem Meints", "AI", "M"),
      S(1252426, PR, "Local-First AI Development: Sovereignty, Silicon, and the Private Dev Loop", "Brian Randell", "AI", "M"),
      S(1176932, "Room 10", "Bearer of Good News", "Sam Bellen", "ARC", "M"),
      S(1174189, "Room 11", "Digital Sovereignty on the Azure Cloud", "Erwin Staal", "OPS", "M"),
      S(1237073, "Room 12", "Beyond HybridCache: FusionCache", "Jody Donetti", "DEV", "M"),
      S(1250676, "Room 13", "Creating great CLIs", "Kathleen Dollard", "DEV", "M"),
      S(1207930, "Room 7", "Designing Software for Agentic Development", "Ardalis", "AI", "I"),
      S(1175918, "Room 8", "LLMs in the Event-Sourced World: Commands, Projections and Sagas", "Oliver Sturm", "AI", "M"),
      S(1306442, "Room 9", "Agentic Refactoring at Scale: From Loosely Typed VB.NET to Modern C#", "Gerrit van den Geest", "DEV", "M"),
    ]},
    { t: ["14:30", "15:30"], s: [
      S(1329465, M1, "Making AI Useful: Structuring Data Through a Semantic Layer", "Arnoud Boere", "AI", "I"),
      S(1207611, M2, "From Assistant to Actor: The New Security Risks of Coding Agents", "Maxim Salnikov", "ARC", "M"),
      S(1247314, PR, "Lessons Learnt: What Really Happens When You Give AI to Low-Code/No-Code Developers", "Mark Allibone", "AI", "M"),
      S(1173528, "Room 10", "Are you sure your access tokens are really secure?", "Wesley Cabus", "ARC", "M"),
      S(1207578, "Room 11", "Beyond the Hyperscalers: How to build a sovereign tech stack with what you already know", "Bas van de Sande", "OPS", "M"),
      S(1233053, "Room 12", "Use Agents to Build Agents with Aspire + Microsoft Agent Framework", "Maddy Montaquila, Tommaso Stocchi", "AI", "M"),
      S(1219379, "Room 13", "C#shenanigans", "Eva Ditzelmüller, Stefan Pölz", "DEV", "M"),
      S(1211675, "Room 7", "10 things you didn't know EF Core can do", "Hannes Lowette", "DEV", "M"),
      S(1246316, "Room 8", "Copilot Studio Tools Deep Dive: From Connectors to MCP", "Christina Wheeler", "AI", "M"),
      S(1176888, "Room 9", "Build your own CLI tools or how to allow AI agents to troubleshoot production issues", "Christophe Nasarre", "DEV", "M"),
    ]},
    { t: ["16:00", "17:00"], s: [
      S(1328428, M1, "GitHub Agents of Camelot: Building and Defending the Cloud Kingdom", "Wesley Haakman", "OPS", "M"),
      S(1208747, M2, "How I built my own intelligent Robot Arm from Scratch", "Iulia Feroli", "AI", "I"),
      S(1208116, PR, "How To Not Strangle Your Coworkers: Resolving Conflict with Collaboration", "Arthur Doler", "LEAD", "M"),
      S(1235784, "Room 10", "The Fun Side of Advanced TypeScript: A Live Coding Session", "Dante De Ruwe", "DEV", "A"),
      S(1320771, "Room 11", "Out with Entity Framework, In with Copilot", "Robert Hartskeerl", "DEV", "M"),
      S(1152476, "Room 13", "From \"Trust Me\" to \"Verify Me\"", "Tom van den Berg", "ARC", "M"),
      S(1246448, "Room 7", "Building an LLM from scratch in 60 minutes", "Bart De Smet", "AI", "A"),
      S(1246287, "Room 8", "The Well-Architected Architect - Building Secure, Reliable, Cost-efficient Solutions on Azure", "Chris Ayers", "ARC", "M"),
      S(1320725, "Room 9", "Your AI Agent Needs a Kill Switch: Engineering Agents for Production", "Luca Berton", "AI", "I"),
    ]},
    { t: ["17:15", "18:15"], kind: "Closing", s: [ S(1327743, "Room 12", "A Fresh Perspective on Behaviour, Change and the Brain", "Paul Smit", "", "I") ]},
  ]},
};

// Every slot gets a "Not going" option, stored like a pick, with a slot-appropriate excuse
const FUN: Record<string, Record<string, string>> = {
  mon: { "Full day": "Skipping the workshop to tour the canals" },
  tue: {
    "08:30": "Sleeping",
    "09:45": "On my third coffee and second croissant",
    "11:15": "Lost somewhere in the expo hall",
    "12:30": "Busy at the lunch buffet",
    "13:15": "Food coma",
    "14:30": "Hunting for free socks at the booths",
    "16:00": "Recharging (me and my laptop)",
    "17:15": "Already looking for the bar",
  },
  wed: {
    "08:30": "Still sleeping off last night",
    "09:45": "Queueing for coffee",
    "11:15": "Collecting stickers for my laptop",
    "12:30": "Second round at the lunch buffet",
    "13:15": "Post-lunch nap in a comfy cinema seat",
    "14:30": "Pretending to answer urgent emails",
    "16:00": "Guarding our spot at the closing reception",
    "17:15": "Already at the closing reception",
  },
};

for (const [d, day] of Object.entries(DAYS)) day.slots.forEach((sl, i) => sl.s.push({ id: "skip-" + d + "-" + i, skip: true, room: "", title: FUN[d]?.[sl.t[0]] || "Not going", who: "", track: "", lvl: "" }));

// Index: session id -> {day, slotIndex, session}
export const IDX: Record<string, { day: DayKey; slot: number; s: Session }> = {};
for (const [d, day] of Object.entries(DAYS)) day.slots.forEach((sl, i) => sl.s.forEach(s => { IDX[s.id] = { day: d as DayKey, slot: i, s }; }));

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed"];
