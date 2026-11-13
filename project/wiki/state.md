# Current state

Updated 2026-11-12. Update this page when the state changes; the board has the detail.

## Done

- Public repository `AnthusAI/Humorus` with `main` and `develop` (`develop` is the default branch), agent rules, licence.
- Checks on every pull request and push (secret and AWS-identifier scan, board validation, wiki links, pull request title), Semantic Release on `main` (GitHub release notes, no committed changelog), branch protection: `main` needs a pull request and the `ci` check, admins included; `develop` blocks only force-push and deletion.
- Kanbus board, key `HUM`, methodologies `bdd` and `git-flow`. The whole plan is filed.
- LeftBlock pre-commit check installed in this checkout and tested by hand: a commit holding an AWS account ID was refused. A new clone must run `leftblock install --local --check-only` itself.
- AWS account `papyrus-production` created in the DataParade organisation. Administrator access through single sign-on. Local profile: `dataparade-papyrus-production`.
- CDK bootstrap in `us-east-1`.
- **The AWS account is managed by a pipeline.** Every change to the account's stacks is a merge to `main`; the Infrastructure workflow (`infra/README.md`) deploys it with GitHub sign-in and no stored keys. The mechanism is Papyrus's account pipeline (epic `PPY-9bd776`); this repository holds only the settings. First real deploy: 2026-11-11, run 43117405856.
- Stacks: `humorus-github-deploy` (provider and the roles), `humorus-dns` (the Route 53 zone, imported, name servers unchanged), `humorus-budget` (200 USD a month, alerts at 50% and 80% of spend and when the forecast passes 100%, imported), `humorus-ses` (sending identity with DKIM, MAIL FROM, SPF and DMARC records). Nothing in GitHub needs anyone's approval.
- **The newsroom app is built.** The app shell (stack `humorus-app-shell`) is deployed, the Amplify app is connected to this repository (done once by Ryan in the console), the Google client is stored, and the first build ran by itself: both passes succeeded (Amplify jobs 3 and 4) and the Cognito domain is active with the Google provider matching the stored client. Deploys after this start from the repository's own workflow (auto-build is off). The console's connect wizard wiped the branch variables and turned auto-build on; they were re-applied through the pipeline (see HUM-4bca14).
- Waiting for the registrar, deployed by the pipeline by itself: `humorus-certificate` and `humorus-placeholder` (a labelled satire page on the apex and www). A `Delegation watch` workflow checks every 15 minutes and, once, opens a GitHub issue and starts the deploy.
- A Lambda concurrency increase from 10 to 1,000 is requested; AWS opened a case.
- First site: TheHallucinator.ai. Route 53 hosted zone created in the account; waiting for Ryan to point the domain's name servers at it.
- OpenAI and TypeSafe keys stored as SecureString parameters (`/papyrus/the-hallucinator/openai-api-key`, `/papyrus/shared/typesafe-api-key`).
- Papyrus issues filed under `PPY-059573`; Machines on Machines issues under `MOM-065620`. The Papyrus implementation session was told.

## Not done, and why

- Papyrus's `bootstrap.sh` is not used for this account: the account pipeline replaced it for deployment accounts.
- Newsroom text for TheHallucinator.ai: first draft in [the-hallucinator-newsroom-draft](the-hallucinator-newsroom-draft.md), waiting for Ryan's review and the legal conversation.
- CLI sign-in without Prospectus: recommendation on HUM-539f78 (Google through the site's own Cognito; remote login for agents).
- Domain delegation: as of 2026-11-12 `dig NS thehallucinator.ai` still answers `ns27.domaincontrol.com` and `ns28.domaincontrol.com`. Ryan changes it at the registrar.
- Mail sending is still in the sandbox; verification of the sending domain is pending delegation. The production-access request is drafted on `HUM-bdd767` and not submitted.
- Not in the pipeline: the CDK bootstrap stack `CDKToolkit` (CDK's own template, made by `cdk bootstrap`), and the Amplify app (not created yet).
- The Cyclotron session has not been told what Humorus needs.

## Waiting on Ryan

Changing TheHallucinator.ai's name servers at the registrar to the four Route 53 servers. The certificate, mail sending and Google sign-in wait on it. Other open questions are in [Decisions](decisions.md).

## What can start now

In this repository:
- Analytics and privacy page, operator access notes, the legal conversation.

In Papyrus (through the Papyrus session, not from here):
- The neutral theme, the scaffold, policy as data, and running in another organisation. These gate the first deploy and the first automated piece.

Run `kbs ready` for the full list of work with nothing in its way.

## What happens next

1. Ryan signs in to the newsroom with Google for the first time.
2. He is added to the Cognito admin group; then the editors.
3. The certificate and placeholder deploy by themselves when the registrar delegates the domain.

## What only a person does

- Give the registrar the zone's four name servers (`infra/expected-nameservers.json`).
- Create the Google sign-in client for the newsroom.
- Put secret values: the two SecureString parameters `/papyrus/the-hallucinator/openai-api-key` and `/papyrus/shared/typesafe-api-key` (CloudFormation cannot create a SecureString, and values never go in Git), and the String parameter `/humorus/budget-alert-email`.
- Submit the SES production-access request.
- Every other account change is a merge to `main`. Agents read the account with the AWS CLI and never change it.

## Things a new session should know

- Never use the AWS profile named `papyrus-production` for Humorus. That is a different organisation's account. Humorus uses `dataparade-papyrus-production`.
- Region is `us-east-1`.
- `kbs update` refuses when the agent provenance variables are set in the environment; set them only for `kbs create` and `kbs comment`.
- A new issue goes `open`, then `in_progress`, then `blocked`; it cannot go straight to `blocked`.
- Board changes go to `develop` with `kbs commit`, then `git push`.
- The disk on the development Mac was 99% full on 2026-11-11. Remove worktrees you create.
