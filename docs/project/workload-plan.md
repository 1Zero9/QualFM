# Workload Plan

Last updated: February 21, 2026

This is the active execution plan for Owner Portal and Client Admin Portal work.

## Current Execution Model

- Owner Portal is the full-control workspace.
- Client Admin Portal is a restricted workspace (principle of least privilege).
- Work is tracked in `public.work_items` and surfaced in the Owner `Worklist` tab.
- Progress reporting is generated from `GET /api/work-items-report`.

## Active Backlog (Seeded)

| Priority | Status | Category | Task |
|---|---|---|---|
| critical | in_progress | auth | Fix client-admin production login validation |
| high | todo | auth | Set explicit `CLIENT_ADMIN_*` credentials across environments |
| high | todo | ux | Owner portal IA and navigation pass |
| high | todo | rbac | Client-admin capability reduction pass |
| high | todo | security | Complete permission coverage audit for API endpoints |
| medium | todo | reporting | Worklist reporting template for client progress updates |
| high | todo | qa | Add E2E tests for owner/client-admin login and key flows |
| critical | todo | security | Rotate exposed secrets and migrate to hashed passwords |
| medium | in_progress | docs | Documentation sync for role model and portal workflows |
| medium | todo | backlog | Plan customer portal automation backlog package |

## Reporting Cadence

- Daily: update task status/progress in Worklist.
- Per client update: run Owner `Progress Reports` and export markdown.
- Per milestone: update `docs/build/changelog.md` and this workload plan.

## Definition Of Done (Current Phase)

- Owner portal tabs and controls are stable and permission-complete.
- Client Admin portal only exposes approved capabilities.
- Auth and permission checks are enforced server-side for all portal APIs.
- Docs/changelog reflect implemented behavior with concrete dates.
