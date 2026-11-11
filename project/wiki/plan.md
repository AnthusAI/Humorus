# The plan

Approved by Ryan on 2026-11-11. The board is the live version; this page explains the shape and the reasoning. Decisions are in [Decisions](decisions.md). What is done and what is next is in [Current state](state.md).

## What Humorus is for

Humorus publishes political satire: a real news event, rewritten as deadpan satire in the manner of The Onion. It runs on Papyrus beside publications with a very different focus, and that is the point. It forces three things to become true of Papyrus:

1. **A neutral front end.** A plain default theme and example themes, so a site changes its look with tokens and not code.
2. **One deployment, several sites.** The second Humorus site is added to the first site's deployment as data.
3. **Policy is data.** A scaffold writes editable defaults; the engine reads everything from the site's own records.

It is also the first Papyrus deployment in another AWS organisation, which rehearses the managed service.

## The shape of the work

| Initiative | Milestones (epics) |
| --- | --- |
| Foundations | The project is ready for work. The dedicated AWS account is ready. No AWS identifiers in Git anywhere. |
| Papyrus as a neutral base | A neutral theme, factored out of Machines on Machines. A scaffold that starts a new site and newsroom. Newsroom policy is data. Papyrus runs in another AWS organisation. |
| The first satire site | A walking skeleton is live. The satire newsroom is defined in data. Satire is safe to publish. The newsroom publishes on its own schedule. |
| The second site: the multi-tenant MVP | A second site runs on the same deployment. We know what a new site costs. |
| The managed service rehearsal | We operate and update a deployment in a client-owned account. Usage is metered for the service fee. |

Work that belongs in Papyrus is on the Papyrus board under epic `PPY-059573`. Work in Machines on Machines is under `MOM-065620`. Each Humorus epic has a comment naming its Papyrus issues.

## What the scaffold does and does not solve

A scaffold solves every conflict that is **text**: role instructions, drafting and idea instructions, the Story procedure, image rules, starter policies, example mission and sections, byline policy. The condition is that the engine reads the site's records instead of built-in text.

It does not solve what is **logic**: the two-citation minimum for ideas, the point check's verdicts, the list of feed sources in code, the satire label, and an idea mode that starts from one real story and invents the angle. Those need engine work and are separate Papyrus stories.

A scaffolded site stops inheriting improved defaults, so the scaffold needs a diff command.

## Why two friendly sites is a cheap first step

Both Humorus sites have the same editors. So the two-site deployment needs scoping in every list, routing from a host to a site, per-site output and per-site policy data. It does not need permission isolation or billing. That makes it an early milestone for the Papyrus multi-tenant plan, ahead of isolation.

## Risks specific to satire

- **Agents read satire as fact.** Papyrus makes every page easy for agents to read, so every page, Markdown version, feed entry, structured-data block and share preview must say it is satire.
- **Legal footing.** Clear labelling, public figures only, no private people, no victims of tragedies, no invented crimes. One conversation with a lawyer before launch.
- **The check inverts.** The real setup must be right; the invented part must be plainly absurd.
- **Providers refuse political content.** Plan a fallback order for text and images.
- **Copyright.** Satirise the event; never reuse a source's wording or pictures.
- **Pen names** conflict with Papyrus's current authorship rule; it becomes a site policy.

## Risks in operations

- A new AWS account has low limits and mail sending starts in a sandbox. Start those requests early.
- Papyrus's shared services assume the Anthus accounts. Its pipeline bootstrap must not be run for this account yet (see [Current state](state.md)).
- Factoring the theme out of Machines on Machines touches a live site; it goes through that site's preview and release flow with a visual comparison.
- Shared code between Humorus sites is a sign the code belongs in Papyrus.

## Repository layout (target)

```
AGENTS.md, CONTRIBUTING_AGENT.md, .kanbus.yml, project/     coordination and the board
package.json, requirements-publication.txt                  one Papyrus pin
papyrus.config.ts, amplify/, amplify.yml, infra/            the one deployment
sites.json                                                  the site list
sites/<site-id>/                                            per-site settings; shrinks as site settings become data
.github/workflows/                                          checks and deploy, identifiers from variables
```

## How to verify each stage

- Project: `kbs doctor` lists `bdd, git-flow`; a commit with an AWS identifier is refused.
- First site: the domain answers; newsroom sign-in works; an unapproved piece cannot publish; the satire label is in the page, the Markdown version, the feed and the structured data.
- Second site: live on the same deployment with no engine or backend change; nothing from site one appears on site two.
- Policy is data: no satire or political wording in Papyrus code; Machines on Machines still passes its tests on the same Papyrus version.
