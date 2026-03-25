# RidgeOS

**The operating system for your roofing business.**

RidgeOS is a CRM and job management platform built specifically for roofing contractors. Track leads through your pipeline, manage callbacks, analyze performance, and get AI-powered coaching on every deal.

## Features

- Pipeline management with roofing-specific stages
- Callback tracking and follow-up reminders
- Analytics dashboard with win rate and revenue reporting
- AI Coach — powered by Claude, gives actionable deal advice
- Team performance tracking (Business plan)
- Works across all contractor trades via AI-generated trade configs

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
