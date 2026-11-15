# Current state

Updated 2026-11-15. Update this page when the state changes; the board has the detail.

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
- **M2 cutover done (2026-11-15).** The apex and `www` are one CloudFront distribution made by the site backend (Papyrus 5.121.0: `distribution.aliases`, certificate and alias records in the zone, `wwwRedirect`). The apex serves the projected static site; `www` answers 301 to the apex keeping path and query. The newsroom console is the Amplify app at `https://newsroom.thehallucinator.ai/` (`cms.domainPrefix` in `infra/site.json`). Apex downtime during the switch was about 16 minutes (23:35 to about 23:51 UTC): CloudFront will not take an alias while Amplify's distribution holds it, so Amplify had to release the apex first. The placeholder stack stays an inert marker. The Spanish edition strings are merged (PR 48); it is not public yet, see below.
- **Delegation is done.** The registrar points at the four Route 53 name servers: public resolvers (including 8.8.8.8) answer only those four, and `infra/expected-nameservers.json` matches. `humorus-certificate` holds an ACM certificate for `thehallucinator.ai` and `www.thehallucinator.ai`, ISSUED, valid until 2027-05-31, not attached to any distribution (the Amplify app manages its own certificate for the apex). The `Delegation watch` and `first-build-watch` workflows turned themselves off (`disabled_manually`); `first-build` and `App shell` are active.
- A Lambda concurrency increase from 10 to 1,000 is requested; AWS opened a case.
- First site: TheHallucinator.ai. Route 53 hosted zone created in the account; waiting for Ryan to point the domain's name servers at it.
- OpenAI and TypeSafe keys stored as SecureString parameters (`/papyrus/the-hallucinator/openai-api-key`, `/papyrus/shared/typesafe-api-key`).
- Papyrus issues filed under `PPY-059573`; Machines on Machines issues under `MOM-065620`. The Papyrus implementation session was told.

## Not done, and why

- Papyrus's `bootstrap.sh` is not used for this account: the account pipeline replaced it for deployment accounts.
- Newsroom text for TheHallucinator.ai: first draft in [the-hallucinator-newsroom-draft](the-hallucinator-newsroom-draft.md), waiting for Ryan's review and the legal conversation.
- CLI sign-in without Prospectus: recommendation on HUM-539f78 (Google through the site's own Cognito; remote login for agents). On 2026-11-14 `/.well-known/papyrus-cli.json` on the Amplify default host answered 503 `site_origin_not_configured` on Papyrus 5.104.0. Nothing in `infra/site.json` is missing for it: with no custom domain the app shell derives `PAPYRUS_SITE_ORIGIN` from the app's default host and adds that host to the sign-in redirect list itself, so `cms.siteOrigin` (it holds a host name with an app id in it, and is for sites behind their own edge) and `cms.cliRemoteLogin` (agents and headless machines only) stay unset. The change that moves the site to 5.113.0 rewrites the branch variables (site revision 3) and the build spec, and the build after it picks them up. Papyrus 5.104.0 to 5.113.0 needs two deploys, not one: Item gains two indexes in that range and DynamoDB allows one per update, so 5.108.0 goes first; if 5.113.0 reaches `main` first, the deploy fails and rolls back.
- `www.thehallucinator.ai` answers 301 to the apex (path and query kept) since the cutover. The `cms.wwwRedirect` option (PPY-a4540d) is for sites whose apex is on Amplify and is not used here.
- Mail: the sending identity `thehallucinator.ai` is verified (verification, DKIM and the custom MAIL FROM domain all SUCCESS, read 2026-11-15) and sending is enabled, but the account is still in the SES sandbox (production access off). The production-access request is drafted on `HUM-bdd767` and not submitted.
- Not in the pipeline: the CDK bootstrap stack `CDKToolkit` (CDK's own template, made by `cdk bootstrap`), and the connection of the Amplify app to this repository (a one-time authorization in the console, done).
- The Cyclotron session has not been told what Humorus needs.

## Waiting on Ryan

Submitting the SES production-access request (draft on `HUM-bdd767`). The first sign-in is done: the newsroom's user pool has one user, a Google sign-in, and the `admin` group has one member; the `editor` and `curator` groups are empty (counts read 2026-11-15). Other open questions are in [Decisions](decisions.md).

## What can start now

In this repository:
- Analytics and privacy page, operator access notes, the legal conversation.

In Papyrus (through the Papyrus session, not from here):
- The neutral theme, the scaffold, policy as data, and running in another organisation. These gate the first deploy and the first automated piece.

Run `kbs ready` for the full list of work with nothing in its way.

## What happens next

1. Spanish edition: needs a stable Papyrus release with PRs 1585, 1586 and 1592; then pin it, enable es-419, save the overlays, a person reads the translation, then make it public (address `/es/`).
2. Editors are added to the Cognito `editor` group when there are editors.
3. The SES production-access request is submitted, then mail can leave the sandbox.

## What only a person does

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
