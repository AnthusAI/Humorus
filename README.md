# Humorus

Humorus is a monorepo of political-satire publications built on [Papyrus](https://github.com/AnthusAI/Papyrus), the open newsroom platform.

Everything published from here is satire. None of it is news.

## Why it exists

Humorus runs newsrooms with a very different focus from the other Papyrus publications, on the same Papyrus code. That forces three things to be true of Papyrus:

- **A neutral front end.** Papyrus ships a plain default theme and example themes. A site changes its look with theme tokens, not code.
- **One deployment, several sites.** Humorus is one Papyrus deployment. Each publication is a site on it, added as data.
- **Policy is data.** What a newsroom writes about, how it writes and what it refuses are stored with the site. Papyrus holds no editorial opinion of its own.

## Status

Planning. No site is live yet. The plan, the decisions and the current state are in the [project wiki](project/wiki/index.md), and the board holds the work: run `kbs list` to see it.

## How changes ship

Work merges to `develop`. A merge from `develop` to `main` is a release and deploys.

## Working here

Agents and people start with [AGENTS.md](AGENTS.md).

## Licence

MIT. See [LICENSE](LICENSE).
