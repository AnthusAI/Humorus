# Decisions

Decisions Ryan has made for Humorus. Add new ones at the bottom with the date. Do not reopen a settled one without asking him.

## 2026-11-11

| # | Decision |
| --- | --- |
| 1 | Humorus is a public monorepo under AnthusAI, coordinated by `AGENTS.md`. Public so GitHub Actions minutes are free; deploys go through Amplify. |
| 2 | It deploys to a dedicated account named `papyrus-production` in the DataParade AWS organisation, not to the Anthus accounts. |
| 3 | Humorus is **one Papyrus deployment**. The first site launches on it. Adding the second site to the same deployment as data is the test of the multi-tenant MVP. |
| 4 | One site first, then a second. |
| 5 | Improving Papyrus is almost always the goal. Humorus does not work around Papyrus. |
| 6 | A scaffold command writes the defaults for a new site and newsroom. Those defaults are the only editorial opinion in Papyrus code; the site owner controls everything after that. This reverses the earlier rule that agent prompts can only be added to. |
| 7 | The neutral public theme is factored out of the Machines on Machines design. Both publications build on it. That needs work in Machines on Machines. |
| 8 | AWS identifiers leave Git. No history rewrite is planned: the values are not credentials and the repositories are already public. |
| 9 | Shared services for Humorus (monitoring, any Cyclotron support) run inside its own account. |
| 10 | Prospectus is not needed at launch. How it fits later is open. |
| 11 | Humorus rehearses the managed service: Papyrus in a client's own account, operated and updated by us for a fee. |
| 12 | Generated images show no real likenesses. |
| 13 | A person approves every piece before it publishes. |
| 14 | Satire is labelled for agents as well as people. |
| 15 | Kanbus with the `bdd` and `git-flow` methodologies. Prefer behaviour stories; use tasks and sub-tasks for plain work; epics are milestones; initiatives group them. Also LeftBlock and Semantic Release. |
| 16 | Budget alarm on the account: 200 USD a month. |

## Open questions for Ryan

- The first site's name and domain.
- Whether the second user who received administrator access on the new account should keep it.
- Model provider keys and spend limits for the account.
- How Prospectus fits, if at all.
