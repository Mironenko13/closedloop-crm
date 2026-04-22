# /reskin Skill — RidgeOS Theme Workflow

Never apply sweeping theme changes without following these steps in order.

1. Read current theme config and list ALL color tokens currently in use
2. Propose new palette as a summary table — WAIT for user approval before touching any files
3. Update CSS variables/theme tokens ONLY first (not individual components)
4. Run build to verify no errors
5. Apply to components one section at a time (header → nav → cards → forms → modals)
6. After each section: run build, verify light AND dark mode, commit
7. Never do full-app sweeps in a single edit pass
