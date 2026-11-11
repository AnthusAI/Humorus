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
| 17 | The first site is **TheHallucinator.ai** (site id `the-hallucinator`). The domain is registered elsewhere; Route 53 in the account serves its DNS. |
| 18 | Reuse the Papyrus development OpenAI and TypeSafe keys in this account rather than new ones. |
| 19 | Working model: Claude (Opus) is product owner and project manager; one Sonnet engineering lead runs Sonnet and Haiku workers, reviews their work, and reports only working code. |
| 20 | Papyrus order: the guidelines epic PPY-2a2a8a lands first, then PPY-1a6aa6, then the Anthus-defaults items, then the neutral theme and scaffold. |

## Open questions for Ryan

- Whether the second user who received administrator access on the new account should keep it.
- Spend limits at the model providers (the keys are shared with the Anthus sites).
- How Prospectus fits, if at all.
