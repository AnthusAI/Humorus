# Humorus infrastructure

Rule (Ryan, 2026-11-11): nobody creates a cloud resource by hand. Everything in the Humorus AWS account is defined in Git and applied by the Infrastructure workflow on merge to `main`. Agents use the AWS CLI to read, never to change.

The mechanism lives in Papyrus (epic PPY-9bd776; see `docs/account-pipeline.md` in Papyrus). This directory holds only Humorus's settings:

| File | What it is |
| --- | --- |
| `stacks.json` | The stacks, their parameters, what to import, and which are waiting (certificate and SES wait for DNS delegation) |
| `expected-nameservers.json` | The four name servers the registrar holds for thehallucinator.ai; a deploy fails if the zone ever differs |
| `allowed-changes.json` | Removes and Replaces a deploy may make on purpose (empty) |
| `../.github/workflows/infrastructure.yml` | Calls Papyrus's reusable workflow |

## What exists today and how it is adopted

| Resource | Made | Adoption |
| --- | --- | --- |
| Stack `humorus-github-deploy` (GitHub provider, `humorus-github-deploy` role) | by hand, stack | Updated in place from Papyrus's account baseline template; logical ids and role name are unchanged, so nothing is replaced. Adds the plan, roles-apply and two service roles |
| Route 53 zone for thehallucinator.ai | by hand | Imported into `humorus-dns` (Retain), name servers verified unchanged |
| Monthly budget `papyrus-production-monthly` | by hand | Imported into `humorus-budget` (Retain). The alert address is read at deploy time from the SSM String parameter `/humorus/budget-alert-email` (never a GitHub variable: workflow logs on a public repo are public). The budget's `BudgetName` and `NotificationsWithSubscribers` are create-only in CloudFormation, so the template must declare the live subscriber exactly, or the update would replace the budget; the deployer refuses any Replace. Whether CloudFormation can import a budget by name is unverified; the change set will say. Fallback, only with Ryan's approval: recreate it |
| `CDKToolkit` (CDK bootstrap) | by hand (`cdk bootstrap`) | Left alone: it is CDK's own template. Nothing here uses it yet |
| SSM SecureStrings `/papyrus/the-hallucinator/openai-api-key`, `/papyrus/shared/typesafe-api-key` | by a person | The person-only exception: CloudFormation cannot create a SecureString and values never go in Git |

## The one apply by a person

The roles that deploy cannot be widened by a pipeline that does not have them yet. This single update is the only manual change to the account; after it, every change goes through the workflow. Do it only with Ryan's go-ahead, from a checkout of Papyrus at the same revision `infrastructure.yml` calls.

```bash
export AWS_PROFILE=dataparade-papyrus-production AWS_REGION=us-east-1 AWS_PAGER=
aws sso login --sso-session dataparade
# Review first: this creates only a change set and shows what would change.
aws cloudformation deploy --stack-name humorus-github-deploy \
  --template-file <papyrus checkout>/infra/account/baseline.yaml \
  --capabilities CAPABILITY_NAMED_IAM --no-execute-changeset \
  --parameter-overrides Prefix=humorus GithubRepository=AnthusAI/Humorus GithubSubjectPrefix=repo:AnthusAI@152415604/Humorus@1454269356 ProductionBranch=main \
    AmplifyAppId='*' CreateOidcProvider=true ApprovalEnvironment=pipeline-roles BudgetName=papyrus-production-monthly
# Read it (the deploy role and provider must show as Modify, not Replace), then apply:
aws cloudformation deploy --stack-name humorus-github-deploy \
  --template-file <papyrus checkout>/infra/account/baseline.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides Prefix=humorus GithubRepository=AnthusAI/Humorus GithubSubjectPrefix=repo:AnthusAI@152415604/Humorus@1454269356 ProductionBranch=main \
    AmplifyAppId='*' CreateOidcProvider=true ApprovalEnvironment=pipeline-roles BudgetName=papyrus-production-monthly
```

One-time GitHub and account setup, each waiting for Ryan's go-ahead (before the first merge to `main` that touches `infra/`):

1. Repository variable `AWS_ACCOUNT_ID` (the Humorus account id; a variable, not Git).
2. GitHub environment `pipeline-roles` with a required reviewer and deployment branch `main`. It must exist before the first baseline change merges, or GitHub would auto-create it unprotected.
3. SSM String parameter `/humorus/budget-alert-email` holding the current budget alert address (`aws ssm put-parameter --name /humorus/budget-alert-email --type String --value <the live subscriber>`). A person does this: the address stays out of Git and logs.

Humorus's repository uses GitHub's immutable OIDC subject claims (`gh api repos/AnthusAI/Humorus/actions/oidc/customization/sub` reports the prefix above; the numbers are public GitHub ids, not AWS identifiers). Roles that trust the classic `repo:AnthusAI/Humorus` subject refuse every run, which is why `GithubSubjectPrefix` is set.

## What each role can do, in plain English

- **`humorus-github-deploy`**: only a run of this repository started by a push to `main`. Starts and reads Amplify jobs on the `main` branch. Creates, reads and executes CloudFormation change sets on `humorus-*` stacks, always through `humorus-cloudformation`. Looks up a Route 53 zone and the budget by name, read-only. Explicitly denied every write to the `humorus-github-deploy` stack. Cannot create or change IAM.
- **`humorus-github-plan`**: any pull request in this repository (not forks). Read-only: describes the stacks, reads their templates, looks up the zone and budget. Creates nothing.
- **`humorus-github-roles-apply`**: only a job in the `pipeline-roles` environment, after a person approves. Can run a change set on the `humorus-github-deploy` stack only, through `humorus-cloudformation-roles`.
- **`humorus-cloudformation`**: what CloudFormation uses for DNS, budget, certificate and SES stacks. Route 53 zones and records, one budget, ACM certificates, SES identities. No IAM.
- **`humorus-cloudformation-roles`**: what CloudFormation uses for the baseline stack. IAM on the five pipeline roles and the GitHub provider only.

Whoever can approve `pipeline-roles` can change what the pipeline may do; read the change set before approving.
