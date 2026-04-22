# /phase6 Skill — Supabase + Auth + Stripe Migration

Context: Migrating RidgeOS from IndexedDB/mock data to Supabase backend with auth and Stripe billing.

Pre-flight checklist before any Phase 6 work:
1. Confirm current IndexedDB schema for the feature being migrated
2. Design Supabase table structure — wait for approval
3. Write migration in isolation, do not touch UI until data layer is confirmed working
4. Add auth guards after data layer is stable
5. Add Stripe integration last, per-tier pricing: Solo / Small Crew / Mid-Size / Enterprise
6. Run full build + lint after every layer
7. Never migrate more than one feature at a time
