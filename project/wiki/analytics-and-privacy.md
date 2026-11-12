# Analytics and the privacy page

Working notes for HUM-b56573. This is a draft for Ryan's review. Nothing here is live. Facts about Papyrus were read from the Papyrus repository at `origin/develop` on 2026-11-11 (the `consent.py` and `analytics_events.py` modules in `src/papyrus_content/markus_renderer/`, `docs/site-hosting.md` section "Analytics (Google Analytics 4)", `docs/region-aware-consent.md`, `docs/standard-site.md`, `docs/newsletter.md`, and the Papyrus board). Facts about Humorus come from [Current state](state.md), [Decisions](decisions.md) and [the plan](plan.md). Items marked **[CONFIRM]** could not be verified from a repository. Items marked **[LEGAL REVIEW]** belong in the lawyer conversation, HUM-948077.

## What we want

- A new Google Analytics 4 property for Humorus, with standard Consent Mode.
- Each site links to its own privacy page, never to another company's page.
- This is a DataParade property. It is not an Anthus property, and no Anthus analytics may run on a Humorus site.

The Anthus standard uses one measurement id everywhere. Humorus does not reuse it, because the controller is a different company and the data must not mix.

## The standard in plain words

This is how Papyrus implements the consent standard today. The wording below describes behaviour that exists in Papyrus code; the shipped banner wording is a draft that each site owner must approve.

1. **Nothing runs without a measurement id.** With no id set, a page contains no analytics script at all. A staging or preview build never emits analytics, even when an id is configured.
2. **Consent Mode v2 defaults come first.** Before Google's script is configured, the page sets four consent signals: `analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization`. Visitors in the regions that need a notice (the EU 27, Iceland, Liechtenstein, Norway, the United Kingdom and Switzerland) start with all four denied. Everywhere else starts with `analytics_storage` granted and the three advertising signals denied. Region detection is Google's own, never a guess made in the browser.
3. **A first-party banner asks.** The banner belongs to the site, loads nothing from outside, and gives Accept all and Reject all the same visual weight. Accept grants the signals; Reject denies all four.
4. **The choice is remembered in the browser.** It is stored in the browser's local storage under a key named for the site, with a policy version and a retention of 183 days. Raising the policy version asks everyone again. The choice is not sent to us and is not stored on a server.
5. **Visitors can change their mind.** A "Cookie settings" link in the footer reopens the choices.
6. **Addresses are cleaned before they are sent.** The page address and referrer are sent with identity-bearing query parameters, e-mail-like values, long opaque tokens and the fragment removed. Campaign parameters such as `utm_source` are kept.
7. **Only a short list of events is sent.** `cta_click`, `sign_up` (after the newsletter confirmation page), `generate_lead` (only for forms that opt in, and only after a successful answer), and two sponsor events the engine never fires. The events can never carry a user id, and any value that looks like an identity is dropped.
8. **What loads only after Accept.** Google's analytics cookies and the full measurement. Before a choice in a notice region, nothing is stored and Google receives only the cookieless pings that Consent Mode allows. **[CONFIRM]** the exact behaviour of those pings against Google's current documentation; this page does not rely on them.
9. **`analytics_only` stays off.** The Papyrus option `analytics_only` (off by default) would deny the advertising signals even after Accept and change the banner text to say the cookies are not used for advertising. Ryan's decision for the existing sites is standard Consent Mode with the default setting. Humorus runs no advertising at launch, so the draft privacy text below says analytics only; if the option stays off, the banner's default wording mentions advertising and the privacy page must not contradict it. **[CONFIRM]** with Ryan whether Humorus turns `analytics_only` on, since that is the more honest setting for a site with no ads. The default here is to leave it off, as with the other sites, until he says otherwise.
10. **Optional region-aware notice.** A site can skip the banner for visitors outside the notice regions (`region_lookup`). It is off by default and needs a CloudFront behaviour that is not built. Do not turn it on for Humorus yet.

## What the Humorus site needs

Papyrus reads these as site settings. They are data or configuration on the Papyrus side. None of them is a literal in Humorus code, and Humorus code does not exist yet for the site folder anyway (rule 2 of `AGENTS.md`: a site folder holds settings, not code).

| Setting | Value for TheHallucinator.ai |
| --- | --- |
| `chrome.ga_measurement_id` | `<GA4-measurement-id>`, a person-only placeholder. See below. |
| `chrome.consent_mode` | Present, with `privacy_policy_url` set to the site's own privacy page (for example `/privacy/`). `{}` takes every other default. |
| `chrome.consent_mode.privacy_policy_label` | "Privacy policy" (the default). |
| `chrome.consent_mode.analytics_only` | Off, unless Ryan decides otherwise. |
| `chrome.consent_mode.policy_version` | 1 at launch. Raise it whenever the privacy text changes in a way that needs a fresh choice. |
| Footer link | A footer column link whose address is `#cookie-settings`, so the standard front end can reopen the choices. |
| Privacy page | A page on the site itself, linked from the footer and from the banner. |

On the standard front end these settings live in the site's `projection.json` (the validated settings document read by the Papyrus projector), not in article content. **[CONFIRM]** where exactly Humorus keeps that file once the scaffold exists; today the Humorus repository has no `sites/` folder, so this is not yet decided. Papyrus plans to move these settings into the tenant's stored site configuration (Papyrus tasks PPY-1252ce and PPY-d0a3d5), which is where a second Humorus site would set its own id.

### The measurement id: person-only

- **Who creates the property:** a person at DataParade with admin rights on the DataParade Google account. Not an agent.
- **What they create:** a GA4 property for Humorus and one web data stream per site, with enhanced measurement and Google signals left at the minimum that the privacy text describes. **[CONFIRM]** data retention in GA4 (the default is two months; the privacy text states 14 months only if someone sets it) and that IP anonymisation and data sharing settings match the text below.
- **Where the id goes:** into the site's Papyrus setting `chrome.ga_measurement_id`, written as `<GA4-measurement-id>` here. Never in Humorus code, never in a wiki page, never in a commit message. A measurement id is not a secret in the page source, but the repository rule here is that site data lives in the site's configuration, and the checks on every commit stay simple if no id appears in Git.
- **What nobody does:** reuse the Anthus id, or point the privacy link at the Anthus page.

## What Papyrus cannot do yet for a neutral, other-company site

Verified against the Papyrus code and board on 2026-11-11.

| Gap | What is true today | Papyrus key |
| --- | --- | --- |
| Consent and analytics per tenant | The banner words, region policy and measurement id come from build-time settings of one publication, not from a tenant's stored site configuration. A shared deployment with two sites cannot yet give each its own id from data. | PPY-d0a3d5 (open, blocked by PPY-1252ce) |
| Site configuration as a stored document | The settings that a tenant may change (including analytics id and consent region policy) are not yet a versioned stored schema. | PPY-1252ce (open) |
| Neutral privacy defaults | The docs builder defaults its privacy link to the Anthus privacy page. The standard front end takes the link from `privacy_policy_url`. A site that forgets to set it gets a banner with no link, not a wrong one. **[CONFIRM]** by building a test page. | no key; file one if the confirmation shows a default that names Anthus |
| Banner wording is a draft | The shipped wording is described in Papyrus as a draft that the site owner approves. It mentions advertising unless `analytics_only` is on. | none |
| Region-aware notice | Built in code but needs a CloudFront behaviour and function per site. Whether the country header reaches a viewer-request function is documented as unknown. | none |
| Privacy page itself | Papyrus has no generated privacy page for a standard front end site; the site owner writes one as a normal page. **[CONFIRM]** against the standard front end's page types. | none |

Humorus rule 1 applies: if the confirmation shows a real gap, file it on the Papyrus board and link it from HUM-b56573. Do not copy Papyrus code here.

## Draft privacy page: TheHallucinator.ai

This text is a draft for Ryan and for the lawyer. It is plain language on purpose. Do not publish it until every **[CONFIRM]** is settled and HUM-948077 has reviewed the **[LEGAL REVIEW]** items. It stays in the wiki, not on the site, until a person approves it (rule 5 of `AGENTS.md` covers pieces; the same discipline applies here).

---

**Privacy at TheHallucinator.ai**

Last updated: [date, set at approval]

**This site is satire.** Everything we publish on TheHallucinator.ai is satire, and we say so on every page. This page is not satire. **[LEGAL REVIEW]** (wording and placement of the satire statement on a legal page)

**Who is responsible for your data.** The controller is DataParade [legal entity name: person-only placeholder], which publishes this site. **[LEGAL REVIEW]** (the correct legal entity, its address, and whether a representative is needed for visitors in the EU or the United Kingdom)

**What we collect, and why.**

1. *Visit statistics, only if you agree.* We use Google Analytics to count visits and see which pages are read. Analytics cookies are used only after you press "Accept all" on the banner. If you press "Reject all", we do not set analytics cookies. We do not use analytics for advertising and we show no advertising. **[CONFIRM]** (that Humorus shows no advertising at launch; that Google signals and ad personalization are off in the property) We remove email-like values and tokens from the addresses we send to Google, and we never send your name or email address to Google. Google receives your IP address as part of any web request that loads its script. **[CONFIRM]** what Google states today about IP handling in GA4 before this sentence is finalised. **[LEGAL REVIEW]** (the data processing terms with Google, and transfers outside the EU and UK)
2. *Newsletter.* If you give us your email address to get our newsletter, we use it only to send you that newsletter. We first send a confirmation email, and we add you to the list only after you confirm (double opt-in). Every email has an unsubscribe link, and you can also ask us to delete your address. **[CONFIRM]** (that the newsletter exists at launch; the exact email service, which will be Amazon SES from the repository's account setup, and which providers process the address) **[LEGAL REVIEW]** (lawful basis, consent record, and retention)
3. *Newsroom sign-in.* Our editors and approvers sign in to the newsroom with their Google account. Readers do not sign in and do not need an account. We receive the editor's name, email address and the Google account identifier from Google for this purpose only. **[CONFIRM]** (that reader accounts are not offered at launch)
4. *Hosting records.* Like every website, the servers that deliver this site record technical information about each request: the IP address, the time, the address requested, the browser type and the result. We use these records to keep the site secure and working. **[CONFIRM]** (which hosting records exist at launch, since the Amazon Web Services settings for access logging on the delivery network have not been checked, and for how long they are kept)

**What we do not do.** We do not sell your data. We do not build advertising profiles. We do not ask for the personal data of readers beyond the newsletter email address.

**How long we keep things.** Your cookie choice is remembered in your browser for about six months (183 days) and then we ask again. Newsletter addresses are kept until you unsubscribe or ask us to delete them. Analytics data is kept in Google Analytics for [retention period, set in the property and stated here]. Hosting records are kept for [retention period]. **[CONFIRM]** every number in this paragraph against the real settings. **[LEGAL REVIEW]** (retention limits)

**Who processes data for us.** Google (analytics and, for editors, sign-in), Amazon Web Services (hosting and email sending), and the email service named above. **[CONFIRM]** (the complete list of processors at launch, including the model providers if any reader-facing feature sends reader data to them; as designed, none does)

**Your rights.** Depending on where you live, you can ask us to show you the personal data we hold about you, correct it, delete it, limit or object to how we use it, and give it to you in a usable form. You can withdraw your cookie consent at any time with the "Cookie settings" link in the footer. You can complain to your data protection authority. **[LEGAL REVIEW]** (rights text per region; California and other US state notices; children; whether a data protection officer is required)

**Children.** This site is not directed at children. **[LEGAL REVIEW]**

**Contact.** Write to [role address placeholder: a role address such as a privacy mailbox, created by a person; never a personal address, and never written into the repository].

**Changes.** When this page changes in a way that matters, we raise the cookie policy version so the banner asks you again.

---

## What a person does

| Step | Who | Notes |
| --- | --- | --- |
| Create the GA4 property and web data stream | A DataParade Google account admin | Settings per the checks above. |
| Put the measurement id into the site's `chrome.ga_measurement_id` setting | The same person, through Papyrus configuration | Written as `<GA4-measurement-id>` everywhere else. |
| Decide `analytics_only` | Ryan | Default off. |
| Name the legal entity and approve the controller line | Ryan | `[legal entity name]` placeholder. |
| Create the privacy contact role address | A person | Placeholder `[role address placeholder]`; the address stays out of Git (decision on real addresses in the repository). |
| Review the **[LEGAL REVIEW]** items | The lawyer, in the conversation held for HUM-948077 | |
| Confirm every **[CONFIRM]** item | The person who owns the launch checks | Especially logs, retention, newsletter at launch, advertising. |
| Approve and publish the privacy page | A person | Nothing publishes without one (rule 5 of `AGENTS.md`). |

## Open questions for Ryan

- Does Humorus turn `analytics_only` on? It is the more truthful setting for a site with no advertising.
- Does the site launch with the newsletter, or later? The privacy page changes with the answer.
- Is the legal entity DataParade itself or a new company for the satire publications?

## Related pages

[Current state](state.md), [Decisions](decisions.md), [The plan](plan.md), [Operator access to the account](operator-access.md).
