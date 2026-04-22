# RidgeOS — Claude Code Project Memory

## Project Identity
- App: RidgeOS (formerly ClosedLoop CRM)
- Repo: github.com/Mironenko13/closedloop-crm
- Deployed: ridgeos.app (Vercel)
- Stack: React, IndexedDB, Vercel serverless functions, Claude API (AI Coach)

## Current Status
- All 5 MVP phases complete: Pipeline, Photos, Crew/Time Tracking, Job Chat, Calendar/Dispatch
- Phase 6 next: Supabase backend, auth, Stripe
- Demo mode: needs to be fully interactive for customer pitches before Phase 6

## Build Rules — ALWAYS FOLLOW
- Run `CI=true npm run build 2>&1 | grep -E "warning|error|Error|Line" | head -20` before every commit
- Fix ALL ESLint errors before proceeding to next task
- Never batch unrelated changes into one commit
- Commit after every logical unit with descriptive message
- After any CSS/theme change, verify both light and dark mode before committing

## Localization
- Region: Pennsylvania — Mifflinburg, Union County
- Area code: 570 (NOT 717)
- Business context: roofing contractor, Mennonite community market

## Design Tokens — DO NOT change without explicit approval
- Primary: #2D5016 (ridge green)
- Accent: #E8722A (copper orange)
- Inactive nav: #8B95A1
- Active nav: #E8722A with 2px bottom border
- Dark header bar with nav tabs between company name and Sign Out

## Workflow Rules
- When doing bulk find-replace on colors or styles: audit ALL affected files first, flag dark mode collisions, wait for approval before applying
- When replacing localized data (phone numbers, area codes, addresses): confirm exact values before applying
- For any reskin work: follow /reskin skill
- For Phase 6 work: follow /phase6 skill
- When task involves 3+ independent workstreams: use parallel sub-agents via Agent tool

## Task Management
- Use TodoWrite at the start of every multi-step task
- Check items off as you go
- Do not start next task until current task has a clean build

## MCP Connectors Available
- Gmail, Google Calendar, Google Drive — use these when relevant
