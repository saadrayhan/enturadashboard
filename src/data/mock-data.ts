export interface Account {
  id: string;
  name: string;
  industry: string;
  lastInteraction: string;
  revenue: string;
  headcount: number;
  lastFunding: string;
  linkedin: string;
  logo: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  accountId: string;
  accountName: string;
  location: string;
  linkedin: string;
  lastInteraction: string;
  avatar: string;
  dateCreated: string;
}

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  stage: string;
  value: number;
  owner: string;
  closeDate: string;
  lastInteraction: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  assignee: string;
  accountName: string;
  opportunityName: string;
  dueDate: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const accounts: Account[] = [
  { id: "1", name: "Stripe", industry: "Technology", lastInteraction: "2 days ago", revenue: "$14B", headcount: 8000, lastFunding: "Series I — $600M", linkedin: "stripe", logo: "S" },
  { id: "2", name: "Moderna", industry: "Healthcare", lastInteraction: "1 week ago", revenue: "$6.8B", headcount: 3900, lastFunding: "IPO", linkedin: "moderna", logo: "M" },
  { id: "3", name: "Shopify", industry: "Technology", lastInteraction: "3 days ago", revenue: "$7.1B", headcount: 11600, lastFunding: "IPO", linkedin: "shopify", logo: "S" },
  { id: "4", name: "Goldman Sachs", industry: "Finance", lastInteraction: "5 days ago", revenue: "$47B", headcount: 45000, lastFunding: "Public", linkedin: "goldman-sachs", logo: "G" },
  { id: "5", name: "NextEra Energy", industry: "Energy", lastInteraction: "1 day ago", revenue: "$21B", headcount: 15000, lastFunding: "Public", linkedin: "nextera-energy", logo: "N" },
];

export const contacts: Contact[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@stripe.com", phone: "+1 415-555-0101", jobTitle: "VP of Engineering", department: "Engineering", accountId: "1", accountName: "Stripe", location: "San Francisco, CA", linkedin: "sarachen", lastInteraction: "2 days ago", avatar: "SC", dateCreated: "Jan 15, 2025" },
  { id: "2", name: "James Wilson", email: "james@moderna.com", phone: "+1 617-555-0202", jobTitle: "Chief Medical Officer", department: "Medical", accountId: "2", accountName: "Moderna", location: "Cambridge, MA", linkedin: "jameswilson", lastInteraction: "1 week ago", avatar: "JW", dateCreated: "Feb 3, 2025" },
  { id: "3", name: "Emily Rodriguez", email: "emily@shopify.com", phone: "+1 613-555-0303", jobTitle: "Director of Product", department: "Product", accountId: "3", accountName: "Shopify", location: "Ottawa, Canada", linkedin: "emilyrodriguez", lastInteraction: "3 days ago", avatar: "ER", dateCreated: "Dec 20, 2024" },
  { id: "4", name: "Michael Park", email: "michael@stripe.com", phone: "+1 415-555-0404", jobTitle: "Head of Sales", department: "Sales", accountId: "1", accountName: "Stripe", location: "San Francisco, CA", linkedin: "michaelpark", lastInteraction: "1 day ago", avatar: "MP", dateCreated: "Mar 1, 2025" },
  { id: "5", name: "Lisa Thompson", email: "lisa@goldman.com", phone: "+1 212-555-0505", jobTitle: "Managing Director", department: "Investment Banking", accountId: "4", accountName: "Goldman Sachs", location: "New York, NY", linkedin: "lisathompson", lastInteraction: "5 days ago", avatar: "LT", dateCreated: "Jan 28, 2025" },
  { id: "6", name: "David Kim", email: "david@nextera.com", phone: "+1 561-555-0606", jobTitle: "SVP Operations", department: "Operations", accountId: "5", accountName: "NextEra Energy", location: "Juno Beach, FL", linkedin: "davidkim", lastInteraction: "1 day ago", avatar: "DK", dateCreated: "Feb 14, 2025" },
  { id: "7", name: "Anna Petrov", email: "anna@shopify.com", phone: "+1 416-555-0707", jobTitle: "Engineering Manager", department: "Engineering", accountId: "3", accountName: "Shopify", location: "Toronto, Canada", linkedin: "annapetrov", lastInteraction: "4 days ago", avatar: "AP", dateCreated: "Nov 5, 2024" },
  { id: "8", name: "Robert Chang", email: "robert@moderna.com", phone: "+1 617-555-0808", jobTitle: "VP Business Dev", department: "Business Development", accountId: "2", accountName: "Moderna", location: "Cambridge, MA", linkedin: "robertchang", lastInteraction: "6 days ago", avatar: "RC", dateCreated: "Mar 10, 2025" },
];

export const opportunities: Opportunity[] = [
  { id: "1", name: "Enterprise Platform License", accountId: "1", accountName: "Stripe", stage: "Demo", value: 450000, owner: "Alex Morgan", closeDate: "Apr 15, 2026", lastInteraction: "2 days ago", description: "Annual enterprise license for the full platform suite." },
  { id: "2", name: "Clinical Data Integration", accountId: "2", accountName: "Moderna", stage: "Qualification", value: 280000, owner: "Jordan Lee", closeDate: "May 30, 2026", lastInteraction: "1 week ago", description: "Integration of clinical trial data pipelines." },
  { id: "3", name: "Commerce Analytics Suite", accountId: "3", accountName: "Shopify", stage: "Proposal", value: 320000, owner: "Alex Morgan", closeDate: "Apr 1, 2026", lastInteraction: "3 days ago", description: "Advanced analytics module for merchant insights." },
  { id: "4", name: "Risk Assessment Platform", accountId: "4", accountName: "Goldman Sachs", stage: "Lead", value: 750000, owner: "Sam Rivera", closeDate: "Jun 30, 2026", lastInteraction: "5 days ago", description: "Real-time risk assessment and monitoring platform." },
  { id: "5", name: "Grid Monitoring System", accountId: "5", accountName: "NextEra Energy", stage: "Trial", value: 520000, owner: "Jordan Lee", closeDate: "May 15, 2026", lastInteraction: "1 day ago", description: "IoT-based grid monitoring and predictive maintenance." },
  { id: "6", name: "Payment Infrastructure Upgrade", accountId: "1", accountName: "Stripe", stage: "Won", value: 180000, owner: "Sam Rivera", closeDate: "Mar 1, 2026", lastInteraction: "2 weeks ago", description: "Upgrade to next-gen payment processing infrastructure." },
];

export const tasks: Task[] = [
  { id: "1", title: "Prepare demo environment for Stripe", description: "Set up sandbox with latest API features and sample data for the enterprise demo next week.", status: "in_progress", assignee: "Alex Morgan", accountName: "Stripe", opportunityName: "Enterprise Platform License", dueDate: "2026-03-26" },
  { id: "2", title: "Send proposal to Shopify", description: "Finalize pricing and send the commerce analytics proposal document.", status: "todo", assignee: "Alex Morgan", accountName: "Shopify", opportunityName: "Commerce Analytics Suite", dueDate: "2026-03-25" },
  { id: "3", title: "Schedule follow-up call with Goldman Sachs", description: "Coordinate with Lisa Thompson to schedule a technical deep-dive on the risk platform.", status: "todo", assignee: "Sam Rivera", accountName: "Goldman Sachs", opportunityName: "Risk Assessment Platform", dueDate: null },
  { id: "4", title: "Review Moderna integration requirements", description: "Go through the clinical data integration requirements document and prepare technical questions.", status: "done", assignee: "Jordan Lee", accountName: "Moderna", opportunityName: "Clinical Data Integration", dueDate: "2026-03-24" },
];

export const stages = ["Lead", "Qualification", "Demo", "Trial", "Proposal", "Won", "Lost"] as const;

export const stageColors: Record<string, string> = {
  Lead: "bg-[hsl(var(--stage-lead))]",
  Qualification: "bg-[hsl(var(--stage-qualification))]",
  Demo: "bg-[hsl(var(--stage-demo))]",
  Trial: "bg-[hsl(var(--stage-trial))]",
  Proposal: "bg-[hsl(var(--stage-proposal))]",
  Won: "bg-[hsl(var(--stage-won))]",
  Lost: "bg-[hsl(var(--stage-lost))]",
};

export const industryStyles: Record<string, { bg: string; text: string }> = {
  Technology: { bg: "bg-[hsl(var(--tag-technology))]", text: "text-[hsl(var(--tag-technology-fg))]" },
  Finance: { bg: "bg-[hsl(var(--tag-finance))]", text: "text-[hsl(var(--tag-finance-fg))]" },
  Healthcare: { bg: "bg-[hsl(var(--tag-healthcare))]", text: "text-[hsl(var(--tag-healthcare-fg))]" },
  Retail: { bg: "bg-[hsl(var(--tag-retail))]", text: "text-[hsl(var(--tag-retail-fg))]" },
  Energy: { bg: "bg-[hsl(var(--tag-energy))]", text: "text-[hsl(var(--tag-energy-fg))]" },
};
