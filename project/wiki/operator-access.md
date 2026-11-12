# Operator access to the account

Working notes for HUM-1fa16b: how we reach the Humorus AWS account to operate it, which role, who may assume it and what it may do. This is the first version of operator access for the managed service. It is a proposal for Ryan. Nothing here changes the account.

## What was verified, and what was not

- **Verified from the repositories (2026-11-11):** the pipeline roles and what they may do (`infra/README.md` in Humorus; `docs/account-pipeline.md` in Papyrus), the rules in `AGENTS.md`, the organisation design and the access proposal recorded on HUM-be87f4, and the second administrator note recorded on HUM-1fa16b.
- **Not verified live:** the AWS single sign-on token for the local profile `dataparade-papyrus-production` had expired when this page was written, and signing in needs a person. So the list of permission sets assigned in the account, their session durations, and whether CloudTrail is on were **not read** from AWS. Where this page gives those facts it says where the fact came from. A person or an agent with a fresh sign-in should read them (see "To verify" at the end) and correct this page.

## The access layers

| Layer | Who or what | How it gets in | Standing power |
| --- | --- | --- | --- |
| People | Ryan, and one second user | IAM Identity Center in the DataParade management account. A person signs in with `aws sso login --sso-session dataparade` and gets a role in the account for a limited session. | Today: administrator (see below). |
| Agents | Claude sessions and other tools working for Ryan | The same single sign-on profile, `dataparade-papyrus-production`, in region `us-east-1`, used with the AWS CLI. | Read-only by rule, not by technology: today the profile is an administrator role, so the rule is the only barrier. |
| Pipeline | The Infrastructure workflow and its roles | GitHub OIDC (sign-in with no stored keys), trusted only for this repository and the `main` branch. | Narrow, per role. See the table below. |

There are no IAM users and no long-lived access keys in the account. **[verify]** with a read of the IAM user list when the sign-in is fresh.

## Who can do what

| Actor | What it may do | What it may not do | Source |
| --- | --- | --- | --- |
| `humorus-github-plan` (any pull request in this repository, not forks) | Read: describe the `humorus-*` stacks, read their templates, look up the DNS zone and the budget. | Create or change anything. | `infra/README.md` |
| `humorus-github-deploy` (a push to `main` in this repository) | Start and read Amplify jobs on `main`. Create, read and execute CloudFormation change sets on `humorus-*` stacks through the `humorus-cloudformation` service role. Look up the zone and budget. | Change IAM. Write to the `humorus-github-deploy` stack (explicitly denied). | `infra/README.md` |
| `humorus-github-roles-apply` (a job in the `pipeline-roles` environment, `main` only, no reviewers) | Run a change set on the `humorus-github-deploy` stack only, through `humorus-cloudformation-roles`. | Anything on other stacks. | `infra/README.md` |
| `humorus-cloudformation` (used by CloudFormation itself) | DNS zones and records, one budget, certificates, email identities, and the placeholder site. | IAM. | `infra/README.md`, `docs/account-pipeline.md` |
| `humorus-cloudformation-roles` (used by CloudFormation itself) | IAM on the five pipeline roles and the GitHub provider. | Everything else. | `infra/README.md` |
| An agent with the single sign-on profile | Read the account with list and describe calls. Run the `papyrus` command-line tool for Papyrus operations. | Create or change AWS resources. The rule is that every change is a merge to `main`. | `AGENTS.md` rule 10; `infra/README.md` |
| A person with the administrator role | Everything in the account. | Nothing technical stops them. By the rule, they too change the account by merging to `main`, except the person-only steps below. | HUM-1fa16b comment |
| Anyone who can merge to `main` | Change what the pipeline may do, through the roles job. | Merge without a pull request and the `ci` check, because branch protection applies to admins too. | `infra/README.md`; Current state |

The person-only steps (not available to the pipeline): the first apply of the roles stack, the registrar's name servers, the Google sign-in client, secret values (SecureString parameters), the budget alert address parameter, and the mail production-access request. See [Current state](state.md).

## Today's state

- **Permission sets assigned:** the repository notes say AdministratorAccess is the only permission set assigned in this account, and that it was copied from the management account's assignments, so **two users hold it** (HUM-1fa16b comment, 2026-11-11). The live list of permission sets (roles named `AWSReservedSSO_...` in the account) was **not read** this time because the sign-in had expired.
- **Session length:** not read. AWS's default for a permission set is one hour; the actual value on the assigned set is **unknown** until someone reads it in the management account.
- **CloudTrail:** not read. The management event history is on by default in every account for 90 days; whether a trail with longer retention exists is **unknown**. The pipeline's stacks do not create one (the stacks are DNS, budget, certificate, email, placeholder, and the baseline roles).
- **Pipeline roles:** exist and are managed by the baseline stack `humorus-github-deploy`, first deployed by the pipeline on 2026-11-11.

### Open question for Ryan

Should the second user who received AdministratorAccess keep it? It was a side effect of copying the management account's assignments, not a decision. This question is already in [Decisions](decisions.md).

## Proposal

This page proposes. The change itself happens in the DataParade management account, where IAM Identity Center lives, through the organisation design in Papyrus epic PPY-9bd776, story PPY-a41df9 (accounts seeded from the organisation). It needs Ryan's go-ahead each time (`AGENTS.md`).

1. **Everyday access is ReadOnly.** A ReadOnly permission set is the standing assignment for people and for agents. Agents already work read-only by rule; this makes it so by technology.
2. **Administrator is break-glass.** AdministratorAccess becomes a separate permission set, assigned only to named administrators, with a one-hour session. Using it raises an alert to the people who watch the account. **[verify]** that a management-account alert can be built from Identity Center sign-in events and CloudTrail; the design is the part to confirm, not the intent.
3. **Changes still go through Git.** Even with break-glass administrator, the rule from Ryan (2026-11-11) stands: nobody creates a cloud resource by hand. Break-glass is for recovery, such as a stuck stack or a lost pipeline, and every use is written up on the board afterwards.
4. **One extra permission set may be needed for the `papyrus` tool.** The Papyrus operations go through the signed-in `papyrus` command-line tool, which uses the site's own sign-in, not AWS credentials. If that holds, agents need no AWS access beyond ReadOnly. **[verify]** against Papyrus operating notes (Papyrus task ba1f31, "Remove AWS from the operating manuals once the CLI covers it, then shrink operator access").
5. **Alarms and trail.** A management-account CloudTrail that keeps access events for longer than 90 days, and an alert on administrator sign-in. Both belong to the organisation design and are not built.

## What we, as the managed-service operator, may do in a client's account

This is the model for the managed offer, from Papyrus story PPY-1f6e73 (the access stack for a client-owned account) and the design on HUM-be87f4. It is a design, not built.

- The client owns the account and launches **one access stack** from a link, giving it a deployment name.
- The stack creates **one role** that our pipeline can assume. The role requires an external id, and has the **same permission ceiling** as the roles seeded in our own accounts: the five baseline roles' powers, not administrator.
- Our pipeline then seeds the baseline and deploys the stacks through that role, driven by merges in the operating repository.
- The client's data and keys stay in the client's account. We hold no standing keys and no IAM users in it.
- The client **revokes everything by deleting the stack**.
- People at our company use the client's account only through that role, never by a user we ask the client to create. Everyday reading by agents uses the same read-only path.
- Anything outside the ceiling needs the client to change the stack, so the client sees what they widened.

Humorus is the rehearsal: it is our own account, but the roles and the rules should be the ones a client would see.

## Rules

1. No IAM users in the account.
2. No access keys, and no secrets in GitHub for AWS. The pipeline signs in with GitHub OIDC.
3. Agents never create or change AWS. They read with the AWS CLI and use the `papyrus` tool for Papyrus operations.
4. Every account change is a merge to `main`. The exceptions are the person-only steps listed above.
5. Nothing in GitHub needs approval. No environment with required reviewers, no pull request approvals, no rulesets that need a click from Ryan. The safety is the main-only trust on every role, the `ci` check on `main`, and the deployer refusing any Replace or Remove that `allowed-changes.json` does not list. The `pipeline-roles` environment must keep its `main`-only branch policy.
6. Never use the AWS profile named `papyrus-production` for Humorus. It belongs to a different organisation. Humorus uses `dataparade-papyrus-production`.
7. Granting access, creating roles and anything that spends money need Ryan's go-ahead each time.
8. No AWS account ids, ARNs or real email addresses in Git. The access design refers to roles by name only.

## Review cadence

- **Each month:** read who is assigned to the account in Identity Center, and compare it with this page. Do the same after any change of who works on Humorus.
- **After any break-glass use:** a short note on the board saying why, and a check that no hand-made resource was left behind.
- **Each quarter:** read the pipeline roles' policies against the plain-English table above, and read the CloudTrail event history for sign-ins that do not match a known person or the pipeline.
- **When the permission sets change:** update this page in the same pull request.

## Open questions

- Does the second user keep AdministratorAccess? (Ryan.)
- What session length does the assigned administrator set have today?
- Is there a CloudTrail trail beyond the default 90-day event history, and where does it write?
- Who receives the break-glass alert, and by what route?
- Does everyday ReadOnly give agents enough, once the `papyrus` tool covers Papyrus operations? What reads, if any, need more?
- For a client account, who holds the external id on our side, and how is it rotated?

## To verify with a fresh sign-in

These are read-only calls, with `AWS_PROFILE=dataparade-papyrus-production`, `AWS_REGION=us-east-1` and `AWS_PAGER=` set after `aws sso login --sso-session dataparade`.

- Roles whose names begin with `AWSReservedSSO` (`aws iam list-roles --query` with a filter on the name), and for each, `MaxSessionDuration`.
- IAM users and access keys: `aws iam list-users` should return none.
- `aws cloudtrail describe-trails` and `aws cloudtrail lookup-events --max-results 5`.
- The five `humorus-*` pipeline roles' trust policies, to compare with the table above.

Then correct "Today's state" on this page.

## Related pages

[Current state](state.md), [Decisions](decisions.md), [The plan](plan.md), [Analytics and the privacy page](analytics-and-privacy.md).
