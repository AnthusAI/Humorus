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

## 2026-11-15

| # | Decision |
| --- | --- |
| 21 | Satire on TheHallucinator.ai may be wholly invented. It does not need to start from a real news event, and no piece is fact-checked against a recorded Reference. Ryan: "This is a satire site and so obviously that fact-checking rule isn't going to work here." The old rule that the real setup be stated correctly (policy 9 and the `real-setup-correct` check in the newsroom draft) is withdrawn. |
| 22 | Reason and what stays. A real setup cannot be required of a piece that is made up, so a fact-check has nothing to check. The protective work that rule did for real people is kept in satire form (policy 9): a claim about a real, named person stays plainly absurd; a wholly fictional person or agency is allowed when plainly fictional and must not plausibly match a real private person, which the approver checks with a quick web search of the name, role and place. **[LEGAL REVIEW]** (false light and defamation; sufficiency of the search), folded into HUM-948077. Unchanged: satire labelled everywhere, a person approves every piece, no real likenesses, no private people, no victims of tragedies, no invented crimes attributed to real people, invented quotations plainly invented, no hate, no election misinformation, corrections. Where a piece does start from a real source, its wording and pictures are still never reused. |
| 23 | Nothing from the newsroom draft is saved in the backend yet; the draft is revised and still awaits Ryan's review. |
| 24 | **The satire label is the minimum viable warning.** Ryan: "I really don't like this disclaimer in the way of each joke: 'Satire: this article is fiction. The people, agency and quotations in it are invented.' We need that to be the minimum-viable legal warning about this being a hallucination. The warning could sarcastically point to the title: THE HALLUCINATOR." And on placement: "that satire disclaimer could go in a fixed footer or something." The label is one short line in the page furniture, a slim footer fixed to the bottom of every page (his suggestion, not a hard requirement), that points at the name. It is never a paragraph in the body of a piece. The full machine-readable labelling stays (decision 14). The exact wording is open; the starting proposal is "It's called THE HALLUCINATOR. None of this happened." **[LEGAL REVIEW]**: the wording, size and placement go into HUM-948077. |
| 25 | **The public layout is one column, phone-first, simpler.** Ryan: "The two-column thing … is just not working, it doesn't work well on smaller viewports at all. Needs to be simpler." |
| 26 | **Localized editions localize the brand in full.** On 11-15 Ryan decided for Machines on Machines: "Máquinas Sobre Máquinas. We will localize the branding, fully." Asked whether the same applies to TheHallucinator.ai: "That does seem to make sense." The Spanish edition is EL ALUCINADOR in the masthead, the footer notice and titles; the notice reads "Se llama EL ALUCINADOR. Nada de esto pasó." **[LEGAL REVIEW]** alongside the English line (HUM-948077). |

## Open questions for Ryan

- Whether the second user who received administrator access on the new account should keep it.
- Spend limits at the model providers (the keys are shared with the Anthus sites).
- How Prospectus fits, if at all.
