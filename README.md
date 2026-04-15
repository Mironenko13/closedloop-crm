# RidgeOS

**The operating system for your roofing business.**

RidgeOS is a CRM and job management platform built for roofing companies. Track leads through a 12-stage roofing pipeline, manage callbacks, dispatch crews, and get AI-powered coaching on every deal — from lead to paid.

## Features

- 12-stage roofing pipeline (Lead → Inspection → Estimate → Contract → Install → Paid)
- 9 roofing job types: Full Replacement, Repair, Storm Damage, Gutter Install, Skylight, Flashing Repair, Ventilation, Inspection, Emergency Tarp
- AI Coach — powered by Claude, gives roofing-specific deal advice
- Dispatch Board with Day Detail view (crew hours, labor cost, margin tracking)
- Photo documentation with roofing categories (Before, During Tear-off, Decking, Underlayment, Final, Damage Documentation, Drone Shots)
- Cost Manager with materials and labor tracking
- Callback tracking and follow-up reminders
- Analytics dashboard with win rate and revenue reporting
- Role-based access (Owner, Sales, Foreman, Crew)

## Getting Started

```bash
npm install
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
ANTHROPIC_API_KEY=your-key-here
```

## Deployment

Deployed on Vercel. Set `ANTHROPIC_API_KEY` in Vercel Environment Variables (Settings → Environment Variables).
