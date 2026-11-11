# GitHub sign-in and the deploy role

`github-deploy.yaml` is a CloudFormation template for the Humorus AWS account. It is prepared here and applied by a person, once, with Ryan's go-ahead. No workflow deploys it, and it holds no AWS identifiers.

## What it creates

1. The account's GitHub sign-in provider (an IAM OIDC provider for `token.actions.githubusercontent.com`). Skipped with `CreateOidcProvider=false` if the account already has one.
2. The role `humorus-github-deploy`.

## What the role can do, in plain English

- **Who can use it:** only a GitHub Actions run of `AnthusAI/Humorus` that was started by a push to `main`. Pull requests, other branches, forks and other repositories are refused. The sign-in is short-lived (at most one hour) and there are no stored keys.
- **What it can do:** start an Amplify build and read the status of builds, on the `main` branch of Amplify apps in this account. Once the Amplify app exists, update the stack with its id (`AmplifyAppId`) and the role names exactly one app.
- **What it cannot do:** read or change data, buckets, tables, users, DNS, other roles or policies, or CloudFormation stacks. It cannot create or delete anything, and it cannot grant itself more.

The deployment itself (backend, site build) runs inside Amplify under Amplify's own service role, as in the Papyrus pattern (`deploy-on-merge.workflow.yml`: the workflow only starts and watches the Amplify job). If a later step needs CDK deploys from GitHub, that is a new, separate role and a new decision.

The template does not use GitHub environments, so the trust names the branch, not an environment. If we add a `production` environment later, the subject becomes `repo:AnthusAI/Humorus:environment:production` and the template and workflow change together.

## Check the template (no AWS needed)

```bash
cfn-lint infra/github-deploy/github-deploy.yaml
```

## Apply it (a person, after approval)

Sign in with the Humorus profile (`dataparade-papyrus-production`; never `papyrus-production`, which is another organisation's account).

```bash
export AWS_PROFILE=dataparade-papyrus-production AWS_REGION=us-east-1 AWS_PAGER=
aws sso login --sso-session dataparade

# Is there already a GitHub provider? If one is listed, add CreateOidcProvider=false below.
aws iam list-open-id-connect-providers

# 1. Review the change set. Nothing is created yet.
aws cloudformation deploy --stack-name humorus-github-deploy \
  --template-file infra/github-deploy/github-deploy.yaml \
  --capabilities CAPABILITY_NAMED_IAM --no-execute-changeset
aws cloudformation describe-change-set --stack-name humorus-github-deploy \
  --change-set-name "$(aws cloudformation list-change-sets --stack-name humorus-github-deploy \
    --query 'Summaries[0].ChangeSetName' --output text)"

# 2. Apply (this makes a fresh change set and executes it).
aws cloudformation deploy --stack-name humorus-github-deploy \
  --template-file infra/github-deploy/github-deploy.yaml \
  --capabilities CAPABILITY_NAMED_IAM

# 3. Put the role ARN in a GitHub variable (a variable, not a secret; it only stays out of Git).
role_arn="$(aws cloudformation describe-stacks --stack-name humorus-github-deploy \
  --query "Stacks[0].Outputs[?OutputKey=='GithubDeployRoleArn'].OutputValue" --output text)"
gh variable set AWS_DEPLOY_ROLE_ARN --repo AnthusAI/Humorus --body "$role_arn"
```

When the Amplify app exists, narrow the role to it:

```bash
aws cloudformation deploy --stack-name humorus-github-deploy \
  --template-file infra/github-deploy/github-deploy.yaml \
  --capabilities CAPABILITY_NAMED_IAM --parameter-overrides AmplifyAppId=<amplify-app-id>
```
