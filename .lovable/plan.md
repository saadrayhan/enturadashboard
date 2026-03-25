
# Zentura CRM — Implementation Plan

## Overview
Build a clean, modern CRM application called **Zentura** with a Lightfield-inspired design: minimal, warm neutral palette, clean typography, and a sidebar navigation. Frontend-only with mock data to start.

## Layout & Navigation
- **Collapsible left sidebar** with user avatar, search, notification badge, and nav sections:
  - **Records**: Accounts, Opportunities, Contacts
  - **Resources**: Tasks, Meetings, Notes
  - **Chats**: New chat + AI chat interface
- **Main content area** takes up remaining space, responsive

## Pages & Features

### 1. Accounts
- Table view with columns: Account name (with logo/icon), Industry (colored tags), Last interaction, Revenue, Headcount, Last funding, LinkedIn
- Filter bar and Display settings toggle
- "Create account" and "Import CSV" buttons
- Mock data: 3-5 sample companies

### 2. Contacts
- Table view: Name, Account, Last interaction, Job title, Email, LinkedIn
- Contact detail page (click a row): avatar, name, upcoming meetings, activity timeline, contact details panel on right (name, email, phone, account, job title, department, location, socials, date created)
- "Create contact" and "Import CSV" buttons
- Mock data: 6-9 sample contacts

### 3. Opportunities
- **Kanban board view** with stages: Lead, Qualification, Demo, Trial, Proposal, Won, Lost
- Each card shows: Account icon + name, opportunity name, owner, last interaction, deal value, close date
- Toggle between Table and Board view
- "Create opportunity" dialog with Account, Opportunity name, Stage (dropdown), and description
- Display settings popover for toggling visible properties
- Mock data: 3-4 sample opportunities across stages

### 4. Tasks
- List view grouped by date (Today / No due date) with status filters
- Task detail modal: title, rich text description (with toolbar), status chip, assignee, account, opportunity, due date
- "Create task" button and modal
- Mock data: 2-3 sample tasks

### 5. AI Chat
- Bottom-anchored chat input on relevant pages ("Ask Zentura")
- Simple chat interface with message history (mock responses for now, no real AI backend)
- Suggested prompts as chips (e.g., "Generate tasks from this doc", "Summarize my active opportunities")

## Design System
- Warm neutral background (#fafaf8-ish), clean whites for cards
- Thin borders, subtle shadows
- Small, restrained typography (Inter/system font)
- Colored status indicators: colored dots for stages, colored tags for industries
- Consistent icon set (Lucide icons)

## Routing
- `/` — Dashboard/Accounts (default)
- `/accounts` — Accounts list
- `/contacts` — Contacts list
- `/contacts/:id` — Contact detail
- `/opportunities` — Opportunities board
- `/tasks` — Tasks list
- `/meetings` — Meetings (placeholder)
- `/notes` — Notes (placeholder)
