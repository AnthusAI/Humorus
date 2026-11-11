# Current state

Updated 2026-11-11. Update this page when the state changes; the board has the detail.

## Done

- Public repository `AnthusAI/Humorus` with `main` and `develop` (`develop` is the default branch), agent rules, licence.
- Kanbus board, key `HUM`, methodologies `bdd` and `git-flow`. The whole plan is filed.
- LeftBlock pre-commit check installed in this checkout and tested by hand: a commit holding an AWS account ID was refused. A new clone must run `leftblock install --local --check-only` itself.
- AWS account `papyrus-production` created in the DataParade organisation. Administrator access through single sign-on. Local profile: `dataparade-papyrus-production`.
- CDK bootstrap in `us-east-1`.
- Budget: 200 USD a month, alerts at 50% and 80% of spend and when the forecast passes 100%.
- A Lambda concurrency increase from 10 to 1,000 is requested; AWS opened a case.
- Papyrus issues filed under `PPY-059573`; Machines on Machines issues under `MOM-065620`. The Papyrus implementation session was told.

## Not done, and why

- **Papyrus pipeline bootstrap: deliberately not run.** `infra/pipeline/bootstrap.sh` trusts the Papyrus repository and sets that repository's `AWS_ACCOUNT_ID` variable. Run for this account it would redirect Papyrus's own releases. Its stacks also name another organisation's domain. Wait for `PPY-1a6aa6`.
- No GitHub sign-in provider or deploy role in the account yet.
- No hosted zone: the first site has no name or domain.
- Mail sending is still in the sandbox.
- No checks on pull requests, no Semantic Release, no branch protection yet.
- No deployment files in the repository yet.
- The Cyclotron session has not been told what Humorus needs.

## Waiting on Ryan

See the open questions in [Decisions](decisions.md): the site's name and domain come first, because the hosted zone, certificate, mail sending and Google sign-in all wait on them.

## What can start now

In this repository:
- Checks on pull requests, Semantic Release and branch protection (epic "The project is ready for work").
- The GitHub sign-in provider and deploy role in the account.
- Analytics and privacy page, operator access notes, the legal conversation.

In Papyrus (through the Papyrus session, not from here):
- The neutral theme, the scaffold, policy as data, and running in another organisation. These gate the first deploy and the first automated piece.

Run `kbs ready` for the full list of work with nothing in its way.

## Things a new session should know

- Never use the AWS profile named `papyrus-production` for Humorus. That is a different organisation's account. Humorus uses `dataparade-papyrus-production`.
- Region is `us-east-1`.
- `kbs update` refuses when the agent provenance variables are set in the environment; set them only for `kbs create` and `kbs comment`.
- A new issue goes `open`, then `in_progress`, then `blocked`; it cannot go straight to `blocked`.
- Board changes go to `develop` with `kbs commit`, then `git push`.
- The disk on the development Mac was 99% full on 2026-11-11. Remove worktrees you create.
