# Spanish edition of TheHallucinator.ai (es-419)

Card HUM-55496d. These files are inputs, not code the build reads, except `sites/the-hallucinator/strings/`.

| File | What it is | How it reaches the site |
| --- | --- | --- |
| `sites/the-hallucinator/strings/en.json`, `es-419.json` | Interface strings of the chrome (nav, footer, notice, listing and translation lines, language switcher words). Complete: checked against the standard front end's required keys for this `projection.json`. | Read by the projection from the static directory. |
| `writing-es-419.json` | Language overlay of the writing guidelines: register (usted), deadpan wire-service tone, how jokes are carried over. | `papyrus guidelines save --kind writing --language es-419 --file docs/spanish-edition/writing-es-419.json --reason "es-419 satire overlay" --expected-current-version-id none` |
| `glossary-es-419.json` | Glossary overlay: Papyrus starter entries plus the brand, ChatGPT, OpenAI, the invented Federal AI Safety Office. | `papyrus guidelines save --kind glossary --language es-419 --file docs/spanish-edition/glossary-es-419.json --reason "es-419 glossary" --expected-current-version-id none` |

Both overlays are newsroom data (rule 3). Save them with the CLI; these files are only what the CLI reads. A save is refused until es-419 is one of the languages the site writes in.

## Order

1. The front-end move and apex cutover (distribution, brand pack, fixed-footer notice, one column).
2. Enable es-419 (Administration > Editorial checks > Languages the site writes in: there is no CLI command that enables a language as of Papyrus 5.120.0). Keep it not public.
3. Save the two overlays; register `SITE.story-localize`; translate the one article; a person reads it.
4. `papyrus editorial languages --set-public es-419 --set-prefix es-419=es`, once Papyrus carries PR 1585 (the notice in Spanish on the twin, feed and structured data) and the site is on the release that has the language switcher in the shared preset.
5. Only then `--auto on`.
