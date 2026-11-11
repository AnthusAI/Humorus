# TheHallucinator.ai newsroom: draft for review

**Status: DRAFT for Ryan's review. Nothing here is saved anywhere.**

This page is a drafting aid. The newsroom's editorial identity is **backend data, never a file the build reads** (rule 3 in `AGENTS.md`). Once Ryan approves the text, each part is saved into the site's own backend with the `papyrus` CLI (or Administration), and this page is then deleted or reduced to a pointer. Do not treat it as the source of truth after that, and do not import it from the repository at build time.

Binding rules this draft follows: 3 (identity is data), 5 (a person approves every piece), 6 (no real likenesses), 7 (satire is labelled), 8 (satire has limits). The settled decisions are in [Decisions](decisions.md), the reasoning in [The plan](plan.md), and what exists today in [Current state](state.md).

Items that need the lawyer conversation (Kanbus issue HUM-948077) carry the marker **[LEGAL REVIEW]**. They are collected in the last section.

Notation: "Record" names what the text becomes in Papyrus. "Command" is the CLI call that will save it. Commands are written as they exist in Papyrus today; where one is not yet released the table at the end says so.

## How the parts map to Papyrus

| Part | Record in Papyrus | Command |
| --- | --- | --- |
| Publication | The canonical `KnowledgeCorpus` (key `the-hallucinator`) | `papyrus publication init --key the-hallucinator --name "TheHallucinator.ai"` |
| 1. Mission | Private `doctrine` Item, slug `editorial-doctrine-mission` | `papyrus sections doctrine set --kind mission --file mission.md` |
| 2. Editorial policies (prose) | Private `doctrine` Item, slug `editorial-doctrine-policy` | `papyrus sections doctrine set --kind policy --file policy.md` |
| 2b. Editorial policies (checks) | `EditorialPolicy` rows (Humanus rule and judgment checks) | `papyrus editorial policies add --file pack.json` |
| 3. Writing guidelines | Guideline document, kind `writing`, publication scope (doctrine Item, slug `editorial-doctrine-writing`, JSON in S3) | `papyrus guidelines save --kind writing --file writing.yml --reason "..." --expected-current-version-id none` |
| 4. Image guidelines | Visual style profile, slug `editorial-doctrine-visual-style` (schema 2) | `papyrus images profile save` (or `papyrus guidelines save --kind image`), after `papyrus images profile diff --file F` |
| 5. Sections | `NewsroomSection` rows: mission, policy, assignment guidance, kill criteria | `papyrus sections import` (create), then `papyrus sections update --id S --editorial-mission-file F ...` |

Each part below is written so the quoted text can be copied into its file unchanged. Every command that writes takes `--dry-run` where Papyrus supports it; use it first.

## 1. Mission

Record: `editorial-doctrine-mission`. Save as `mission.md`. One short paragraph is kept per line so agents read each as its own instruction.

> TheHallucinator.ai is a satire publication. Every piece is invented. We take a real news event and rewrite it, in the deadpan voice of a wire-service report, so that the absurdity already present in the event becomes visible.
>
> We aim at institutions, public conduct, and the language people in public life use to avoid saying things. We do not aim at private people, at the powerless, or at people who have suffered.
>
> Readers should laugh first and then recognise something true. A piece that is only cruel, only confusing, or only a lie with a joke on top has failed.
>
> We say plainly, on every page and in every file a machine can read, that this is satire.

## 2. Editorial policies

### 2a. The policy document

Record: `editorial-doctrine-policy`. Save as `policy.md`. This is the prose agents and editors read through `papyrus editorial context`. It is one document; the list is numbered so a check or a review comment can cite a number.

> 1. **Satire, labelled.** Every piece is satire and says so. The label appears on the page, in the Markdown version, in the feed entry, in the structured data, in `llms.txt` and in the share preview. A piece without the label is not finished. **[LEGAL REVIEW]** (wording and placement of the label)
> 2. **A person approves every piece.** No piece publishes on an agent's say-so. A named person reads the finished piece and its picture and approves it before it goes live. The publish gate stays on.
> 3. **Public figures only, in their public roles.** We write about people who hold or seek public office, lead large public institutions, or have chosen a public career, and only about their public conduct and public statements. **[LEGAL REVIEW]** (who counts as a public figure; second-tier officials; people briefly famous)
> 4. **No private people.** A private person is never named, described closely enough to identify, or used as a type. If the real event involves a private person, the piece is about the institution and not about them.
> 5. **No victims of tragedies.** We do not write jokes about people killed, injured, displaced or bereaved by a disaster, attack, accident or crime, or about their families. The satire may target the response of institutions to the event, never the people it happened to.
> 6. **No invented crimes.** A public figure is never shown committing a crime, or being investigated, charged or convicted of one, unless that is already a matter of public record. The invented part is plainly absurd, not a plausible accusation. **[LEGAL REVIEW]** (false-light and defamation exposure when an absurd claim is attached to a named person)
> 7. **Invented quotations are plainly invented.** A quotation attributed to a real public figure must be impossible to mistake for something they said: absurd in content, or in a register no one would use. We never present an invented quotation as a transcript. **[LEGAL REVIEW]**
> 8. **Satirise the event; do not reuse the source.** We never copy a source's wording, headline, structure beyond the news form, or pictures. We rewrite from the facts of the event. **[LEGAL REVIEW]** (how close a parody headline may stay to its source)
> 9. **The real setup is right.** Where the piece relies on a real fact (who, what, when), that fact is stated correctly and can be checked against a source the reporter recorded. The invented part is where the joke is, and it is plainly absurd.
> 10. **No real likenesses.** Generated images never show a real person. See the image guidelines.
> 11. **Elections and voting.** A piece never states or implies a false fact about when, where or how to vote, or about a result. During an election period it is held for extra review by the approving person. **[LEGAL REVIEW]** (election-period rules on synthetic political content)
> 12. **Byline.** Pieces carry a stated house byline that makes clear the writer is a satire desk, not a reporter. If pen names are used they are listed in the site's byline policy and never resemble a real person. **[LEGAL REVIEW]** (pen names)
> 13. **No hate.** We do not mock people for who they are: race, religion, sex, sexuality, disability, nationality, immigration status.
> 14. **Corrections.** If a reader shows that a piece could be mistaken for fact, or that it names someone it should not, we fix or retract it and say so on the page. The approving person owns that decision.

### 2b. The checks drawn from the policy

Record: `EditorialPolicy` rows, scope `publication`, source `custom`. Save in one pack file as `pack.json`. Do not run `import-starter`: the starter pack is written for news (see HUM-147262).

| Key | Kind | Severity | What it checks |
| --- | --- | --- | --- |
| `satire-label-present` | Rule | error | The body or its metadata carries the satire marker the site defines. |
| `no-source-wording` | Judgment | error | No sentence of three or more words in a row matches the Reference text the piece was written from. |
| `real-setup-correct` | Judgment | warn | The real facts the piece relies on are stated correctly against the recorded Reference. |
| `invented-part-obvious` | Judgment | warn | The invented part is plainly absurd and could not be read as a news claim. |
| `no-private-person` | Judgment | error | Nobody is named or identifiable who is not a public figure acting in a public role. |
| `no-victim-jokes` | Judgment | error | No joke is aimed at a person harmed in a tragedy or at their family. |
| `no-invented-crime` | Judgment | error | No public figure is accused of a crime or investigation that is not already on the public record. |
| `no-identity-mockery` | Judgment | error | No joke targets a person for a protected characteristic. |
| `quotation-plainly-invented` | Judgment | warn | A quotation from a real public figure is absurd or in a register no one would use. |
| `election-claims` | Judgment | error | No claim about voting procedure, dates, results or eligibility. |

Humanus rule findings inside direct quotations are not reported by default, so `satire-label-present` checks the label outside quotations.

## 3. Writing guidelines

Record: guideline document, kind `writing`, publication scope (schema version 1). The fields below are exactly the fields of the document, so the YAML in `writing.yml` can be written straight from this table. Prose fields are lists of plain sentences.

| Field | Value |
| --- | --- |
| `voice` | TheHallucinator deadpan wire |
| `audience` | General readers who know the news and enjoy being surprised by how it sounds when said plainly. |
| `tone` | Flat, authoritative wire-service reportage that never winks. The seriousness is the joke. The piece never explains the joke and never comments on itself. |
| `sentenceStyle` | Short declarative paragraphs. A lead that answers who, what, where, when in one sentence. Quotations from invented, generic sources ("a spokesperson", "a resident") carry the absurdity. No exclamation marks. |
| `voicePatterns` | Third person, past tense. One absurd premise per piece, followed through with total logic. Institutional language used to describe something it should not describe. Ends on a flat closing fact, not a punchline. |
| `structure` | Headline, one-line dek, lead paragraph, three to six body paragraphs, a closing paragraph. The satire marker follows the headline block. Length is whatever the premise needs. |
| `lexicon.prefer` | Plain wire words: announced, confirmed, officials said, according to, sources. Specific numbers, dates and places used deadpan. |
| `lexicon.avoid` | "satirical", "hilarious", "in a shocking twist", "reportedly" used as filler, exclamation marks, all-caps, emoji, "literally", and any phrase copied from the source. |
| `glossary` | Site name is written "TheHallucinator.ai" in running text. |
| `headline` | Order: title, then subtitle. Title is a plain news headline of at most 14 words. The subtitle is a dek in the same deadpan voice. |
| `exemplars` | Chosen by an editor from published pieces once they exist; empty at launch. |
| `bodyMarkus` | The prose below. |
| `constraints` | The binding rules in section 2a: items 2 to 8, 10 and 11. **Only an admin who is a person can change these.** |
| `locked` | `audience`, `headline`, `voice`. A section may add to the prose but may not replace these. |

### How to write a piece (the `bodyMarkus` prose)

1. **Start from a real event.** Name the real event and the real setup in a note for yourself first. The setup must be accurate.
2. **Pick one absurd move.** Choose the single thing that, taken literally and followed through, shows what the event is really about. One is enough.
3. **Write it straight.** Report the invented part in the same flat voice you would use for the real part. Do not signal that it is a joke.
4. **Check the three tests.** (a) Could a reader take the invented part as fact? If so, make it more absurd. (b) Does anyone named appear in a role they do not hold, or doing something criminal that is not on the record? If so, change it. (c) Is any sentence close to the source? If so, rewrite from the facts.
5. **Never reuse the source.** Wording, headline shape beyond the news form, and pictures are all the source's.
6. **Add the marker.** The satire marker is not optional and not part of the joke.

### The satire marker

The marker is a short, fixed statement that appears wherever the piece appears:

> Satire. This is a work of fiction published by TheHallucinator.ai. It is not a news report.

It must be present in: the page (beside the headline, visible without scrolling), the Markdown twin (as the first line after the title), the feed entry (title prefix and summary), the structured data (a field stating the content is satire), `llms.txt`, and the share preview text and image. **[LEGAL REVIEW]** (exact wording, size and position; whether the structured-data field is enough for platforms and for machine readers)

### Before and after

The subjects below are placeholders. They are not real people or institutions.

**Example 1: a policy announcement**

Real headline, rewritten as a neutral description of the setup: "A city council announces a study of traffic safety on a named avenue."

Satire:

> **City Council Commissions Study To Determine Whether Cars Are Bad**
>
> *Panel will report back in four years on whether fast-moving metal objects pose a risk to the slow-moving humans nearby*
>
> Satire. This is a work of fiction published by TheHallucinator.ai. It is not a news report.
>
> The Example City Council voted 7 to 2 on Tuesday to commission a study of whether the vehicles on Example Avenue contribute to the collisions occurring there, a question council members said they had been unable to resolve through observation.
>
> "We believe in evidence," said a council spokesperson, standing near the avenue as a vehicle passed. "Until the study is complete, the council has no position on the vehicle."

What this shows: the real setup (a council studies traffic safety) is stated first and correctly; the invented part (the council cannot tell whether cars are dangerous) is plainly absurd; the spokesperson is generic; no source wording is reused.

**Example 2: a corporate statement**

Real setup: "A large company announces a restructuring and says it will focus on its core strengths."

Satire:

> **Company Refocuses On Core Strength Of Announcing Refocus**
>
> *Executives confirm the quarter's main product was the statement itself*
>
> Satire. This is a work of fiction published by TheHallucinator.ai. It is not a news report.
>
> Example Corp announced Wednesday that it would concentrate its resources on what it described as its core strengths, which an executive identified, after a pause, as "the announcement."

What this shows: the target is the language of the statement; no person is named; the closing line is flat, not a punchline.

**Example 3: what not to write**

A piece that names a real private citizen who appeared in a news report, or attaches an invented arrest to a named public figure, fails policy items 4 and 6 and is not saved as a draft. The fix is to move the target to the institution and to make the invented part plainly absurd.

## 4. Image guidelines

Record: visual style profile (schema version 2), slug `editorial-doctrine-visual-style`. Save as `image-profile.yml` and check it first with `papyrus images profile diff --file image-profile.yml`. The structured fields below map to the profile's parts; the prose goes in `bodyMarkus`. A section image document is not stored yet (see the table at the end), so section visual notes go in `NewsroomSection.visualGuidance` until it is.

| Profile part | Value |
| --- | --- |
| `identity.summary` | Flat, graphic editorial illustration with a deadpan look: official-looking compositions that depict something absurd with complete seriousness. |
| `identity.mood` | deadpan, official, tidy, slightly off |
| `identity.palette` | Muted newsprint tones with one accent. Exact hex values to be chosen with the theme work. A palette limit of five. Marks and shapes carry meaning; colour never carries it alone. |
| `techniques` preferred | Flat vector illustration, simple geometric shapes, signage, charts, props, empty rooms. |
| `techniques` avoided | Photorealism. Anything that looks like a news photograph. Hyper-detailed faces. |
| `subjects` | People appear as anonymous silhouettes, distant figures, or objects standing in for them. No one is recognisable. |
| `subjects` never | A real person's likeness, face or distinctive features. A recognisable caricature of a real person. Real logos or trademarks. A victim of a tragedy. Disaster scenes. Violence. A flag or seal that could be mistaken for a real one. **[LEGAL REVIEW]** (caricature of a real public figure; use of real institutional marks) |
| `imageTypes` | `cover` (the lead picture at the top of a piece), `inline` (a supporting picture inside the body), `social` (the share card). Each carries a one-sentence description and best-first sources. |
| `imageTypes.*.sources` | `generated` only for illustration. Stock photographs of real events or people are not used. **[LEGAL REVIEW]** (licensing and rights on generated images) |
| `typePreference` | `cover` and `social` default to `cover`; `inline` has no default, so the writer must choose a type. |
| `constraints` | Binding: no real likeness; no photograph treatment; every share card carries the text "Satire" in the image itself. Only an admin who is a person can change these. |
| `locked` | `sources`, `palette` |
| `imageReview` | `before_publish`: a person looks at every picture before the piece publishes. |

### `bodyMarkus` prose for the profile

> Pictures here are illustrations, never reportage. A reader should be able to tell at a glance that the picture is made up, and should not be able to tell who, if anyone, is meant. Compose around objects, signs, rooms and charts. Where a person is needed, use an anonymous silhouette or a figure from behind at a distance.
>
> Never imitate a news photograph. Never include a real person's face, a real logo, or a flag or seal that could be mistaken for a real one.
>
> Every share card says "Satire" in the picture itself.

## 5. Sections

Record: `NewsroomSection`. Each has a key, a title, a short title, a mission, a policy, assignment guidance and kill criteria, as in other Papyrus newsrooms. Section keys are permanent once saved. Section prose layers over the site's doctrine: it adds, and never loosens a site rule.

**Section vs Story type.** Sections are topic categories. Whether a piece is a Story, a short, or any other kind is a separate Story type (see Papyrus). Do not mix them.

### `government`: Government

- Mission: Satire of the day-to-day work of governments: announcements, statements, hearings, agencies.
- Policy: Target the language and machinery of government, not individuals. Public figures only, in their public roles.
- Assignment guidance: Start from one real announcement. Find the one move that takes its own logic seriously and report that.
- Kill criteria: Reject a piece that depends on a private person, on an invented crime, or on a false claim about voting.

### `campaigns`: Campaigns and Elections

- Mission: Satire of campaigns, candidates' public statements and the media around them.
- Policy: Targets are public statements and public conduct. Never state a false fact about when, where or how to vote, or about a result. Held for extra review in an election period.
- Assignment guidance: Mock the form of a statement, a poll, an ad or a debate answer, not the voter.
- Kill criteria: Reject any piece that could be taken as real voting information or a real result.

### `business`: Business and Economy

- Mission: Satire of corporate announcements, markets and economic news.
- Policy: Large companies and their public leaders only. No private employees or customers. No false claims presented as financial advice.
- Assignment guidance: Take the corporate statement literally and follow it through.
- Kill criteria: Reject a piece that could move a stock, or that names a small business or a private individual.

### `technology`: Technology

- Mission: Satire of technology companies, their products and their promises.
- Policy: Public companies and public figures only, in their public roles. Explain nothing; report the absurd consequence as if it were routine.
- Assignment guidance: Start from a real launch or claim. Report what it would be like to take it at its word.
- Kill criteria: Reject a piece that reveals a real security flaw or exposes private data.

### `world`: World

- Mission: Satire of international affairs, diplomacy and summits.
- Policy: Governments, institutions and public leaders only. No victims of wars, disasters or attacks, and no jokes about them. The target is the diplomatic language, not the people affected.
- Assignment guidance: Treat the communiqué as a literal text.
- Kill criteria: Reject any piece that touches casualties, refugees or a named victim. **[LEGAL REVIEW]** (reach of local law abroad; foreign leaders' exposure)

## 6. Things Papyrus cannot store yet

The table lists the parts above that do not yet have a Papyrus home, or that depend on work not released. "Needs" names the Papyrus work; the Humorus issues are already on the board under the Papyrus epic.

| Part | Why it cannot be stored today | Needs |
| --- | --- | --- |
| The satire marker on every page, Markdown twin, feed, structured data, `llms.txt` and share preview | The label is a site setting that the build and every output reads. Papyrus has no per-site satire flag. | Papyrus work for the satire marker; Humorus issue HUM-6050a9 |
| A person approves every piece | The publish gate exists. A rule that no agent can publish on its own is not yet a stored, checkable site setting beyond the existing gate. | Confirm the gate settings in the newsroom; no new storage if the existing gate suffices |
| House byline and allowed pen names | Papyrus attributes to AI by default and has no site byline policy. | Byline policy story; Humorus issue HUM-e7acbb |
| Idea mode that starts from one real story and invents the angle | The idea pipeline needs two citations; this is logic, not text. | Papyrus engine story |
| The point check's verdicts and the "real setup is right" check as a built-in | Judgment checks in Humanus cover the text. The verdict logic is code. | Papyrus engine story |
| The list of feed sources | Part is in code, not site data. | Papyrus engine story |
| Section image guidelines | Section image documents are not stored yet. | Guidelines epic phase 3; until then use `NewsroomSection.visualGuidance` |
| `exemplars` | Chosen from published pieces; none exist at launch. | An editor, after the first pieces publish |
| Video guidelines | Not needed at launch. | None |
| Guidelines CLI | `papyrus guidelines` is released in the release after 5.101.0 and arrives with a site's data API deploy. `show` on a site not yet deployed answers `service_unavailable`. | The guidelines epic, then a deploy of the site's data API |
| Starter policies for satire | The starter pack is written for news and must not be imported without reading. | Written by hand in 2b |
| Scaffold diff command | A scaffolded site stops inheriting improved defaults. | Papyrus scaffold work |

## 7. Items needing legal review

This is the complete list of items marked **[LEGAL REVIEW]** above. They belong in the one lawyer conversation (HUM-948077). Nothing here is decided by this draft.

1. Wording, size and placement of the satire marker, and whether a structured-data field is enough (section 3).
2. Who counts as a public figure, including second-tier officials and people briefly famous (policy 3).
3. Exposure when an absurd claim is attached to a named person: false light and defamation (policy 6).
4. Invented quotations attributed to real public figures (policy 7).
5. How close a parody headline may stay to its source (policy 8).
6. Election-period rules for synthetic political content (policy 11).
7. Pen names and the byline (policy 12).
8. Caricature of a real public figure, and use of real institutional marks, flags and seals in images (image subjects).
9. Licensing and rights on generated images (image sources).
10. Reach of local law abroad, and foreign leaders' exposure (world section).

## How this is reviewed and used

1. Ryan reads this page and marks changes.
2. The text is revised here until it is approved.
3. The legal conversation is held (HUM-948077); the **[LEGAL REVIEW]** items are resolved.
4. The text is saved into the backend with the commands in the first table, using `--dry-run` first, on the site that exists then. The worked order is: `publication init`, `sections doctrine set` (mission, then policy), `editorial policies add`, `guidelines save` (writing), `images profile save`, `sections import`.
5. This page is then removed from the repository, and the backend holds the only copy.
