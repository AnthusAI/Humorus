# Agent Instructions

Read [README.md](README.md) first. This file coordinates every session that works in Humorus.

## What Humorus is

Humorus is a monorepo of political-satire publications built on [Papyrus](https://github.com/AnthusAI/Papyrus). It is one Papyrus deployment in a dedicated AWS account. The first site launches on that deployment. The second site is added to the same deployment as data, which is the test of the Papyrus multi-tenant MVP.

Humorus exists to make Papyrus better. It tests three things:

1. A neutral default front end with example themes, so a new site is mostly data.
2. One deployment serving several sites.
3. Newsroom policy that lives in each site's data, not in Papyrus code.

It is also the rehearsal for the managed offer: Papyrus in a client's own AWS account, operated and updated by us.

## Rules

1. **Improve Papyrus instead of working around it.** When Humorus needs something Papyrus lacks, file an issue on the Papyrus board (key `PPY`), link it from the Humorus issue, and wait for the release. Never copy Papyrus code here. Tell the Papyrus session before depending on unreleased work.
2. **A site folder holds settings, not code.** No Python hooks. No CSS beyond theme tokens. If two sites need the same code, it belongs in Papyrus.
3. **Editorial identity is backend data.** Mission, policy, sections, writing and image guidelines, agent instructions and procedures are edited in the newsroom or through the `papyrus` CLI. They are never files the build reads.
4. **No AWS identifiers in Git.** Account IDs, app IDs, ARNs, bucket names, distribution IDs and user pool IDs go in GitHub and Amplify variables. LeftBlock checks every commit. No real email addresses either.
5. **A person approves every piece before it publishes.** The publish gate stays on.
6. **No real likenesses.** Generated images never show a real person.
7. **Satire is labelled.** Every page, Markdown twin, feed entry and structured-data block says it is satire, for people and for agents.
8. **Satire has limits.** Public figures only. No private people, no victims of tragedies, no invented crimes. Satirise the event; never reuse a source's wording or pictures.
9. **Google sign-in only.** Never create password users.
10. **Use the `papyrus` CLI for Papyrus operations**, not the AWS CLI.

## How work is planned

Everything is on the Kanbus board (key `HUM`). The methodologies are `bdd` and `git-flow`; [CONTRIBUTING_AGENT.md](CONTRIBUTING_AGENT.md) is generated from them.

- **Initiatives** group milestones.
- **Epics** are milestones.
- **Stories** describe behaviour and carry Gherkin scenarios. Prefer a story wherever there is a behaviour to describe.
- **Tasks and sub-tasks** are for plain work with no behaviour to specify, such as creating an AWS account or a DNS zone.

Work for Papyrus or Machines on Machines is filed on those boards and linked from the Humorus issue that needs it.

## Git and releases

- `develop` is the integration branch. `main` is the release branch. A merge to `main` deploys.
- Product code goes through short-lived branches and pull requests to `develop`.
- Board-only changes go straight to `develop` with `kbs commit`.
- Say "merged to develop" or "released" precisely. They are different.
- Every behaviour change ships with a Gherkin scenario and tests.
- Semantic Release tags `main` and writes the changelog. Use `feat:` and `fix:` commit titles.

## Layout

```
AGENTS.md, CONTRIBUTING_AGENT.md, .kanbus.yml, project/     coordination and the board
package.json, requirements-publication.txt                  the one Papyrus pin (to come)
papyrus.config.ts, amplify/, amplify.yml, infra/            the one deployment (to come)
sites/<site-id>/                                            per-site settings (to come)
.github/workflows/                                          CI and deploy (to come)
```

## AWS

The deployment lives in a dedicated account in the DataParade AWS organisation. The local profile name is `dataparade-papyrus-production`. The profile named `papyrus-production` is a different organisation's account; never use it for Humorus.

## Project management with Kanbus

Use Kanbus for task management.
Why: Kanbus task management is MANDATORY here; every task must live in Kanbus.
When: Create/update the Kanbus task before coding; close it only after the change lands.
How: See CONTRIBUTING_AGENT.md for the Kanbus workflow, hierarchy, status rules, priorities, command examples, and the mistakes to avoid. Never inspect project/ or issue JSON directly (including with cat or jq); use Kanbus commands only.
Performance: Prefer kbs (Rust) when available; kanbus (Python) is equivalent but slower.
Warning: Editing project/ directly violates The Way. Do not read or write anything in project/; work only through Kanbus.
Git / PR policy: Rules for product-code commits, branch names, pull requests, and human approval live in this repository's AGENTS.md (outside this Kanbus section). CONTRIBUTING_AGENT.md covers Kanbus board mechanics such as `kbs commit`; follow AGENTS.md for product code and git workflow.
