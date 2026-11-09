# ETHBEAT

ETHBEAT (formerly L2BEAT) is an independent research and analytics organization for Ethereum. We check what Layer 2s, interop protocols, privacy protocols, ZK systems and other things built on Ethereum really inherit from it: whom their users must trust, what those parties can do, and whether users can still get out if everyone else walks away.

The site lives at https://ethbeat.org. Every l2beat.com link redirects there permanently, so both names appear across the code, the data and the outside world. The repository stays at `github.com/l2beat/l2beat`.

## Who we are

We started as L2BEAT over five years ago to answer one question: do L2s that promise to scale Ethereum really inherit its security? Along the way we became a central reference point for L2 development. Our Stages framework and risk assessments are how much of the ecosystem talks about L2 security. Scaling is now being addressed on L1 itself, and the same questions are being asked of privacy, interop, DeFi and more, so we renamed and widened our scope. L2s are still covered as closely as ever; they're just no longer the only focus.

Our mandate (`/mandate` on the site) is to help people understand and reduce their dependence on intermediaries. We believe disintermediation is one of the most effective ways to protect individual freedom. We do four things:

- **Research** how systems actually work, and track how their guarantees change.
- **Recognize** applications that uphold censorship resistance, open source, privacy and security (**CROPS**), so people can find them.
- **Develop standards** with researchers, builders and users, for assessing systems and for building them better.
- **Build** open source tools that put these principles into practice.

## What we can never compromise on

These are why people trust us. Weigh every change against them.

### 1. Credibly neutral

We don't want to become another intermediary people have to trust. Nobody can pay for a better assessment. Our funding is public (`/donate`): grants from the Ethereum Foundation and others, and contributions from projects we cover, none of which buys a score. The projects we assess are often the ones opening PRs against their own pages, and they have every reason to make themselves look better. A change that softens a risk, raises a stage, or rewords a warning needs evidence on its own merits, no matter who sent it.

### 2. Verifiable

We publish our methods, evidence and reasoning so anyone can check our work, challenge it and build on it. An assessment is only as good as what backs it: onchain state, deployed source code, published specs. A claim we can't point to evidence for doesn't belong on the site. The ETHBEAT team **does not do security audits**, and nothing we publish should read like one.

### 3. Open source

All code and every project config is public under MIT, and it will stay that way. Outsiders read the repo to understand and challenge our assessments, so the repo is part of our transparency, not just our implementation.

### 4. Accurate over flattering

People put real money behind what our pages say. A wrong "green" is worse than a missing number. When data is stale, partial or uncertain, the page should say so rather than look complete.

## Who reads ETHBEAT

- **Users** deciding where to put their money and which systems to trust.
- **Researchers and builders** using our frameworks, data and public API.
- **The projects we assess**, who watch their pages closely and push back.
- **AI agents and LLM tools**, through markdown versions of project pages (append `.md` to a project URL) and `/llms.txt`.

Old links, API responses and badges are embedded all over the ecosystem. People cite us, link deep pages and poll the API, so breaking a URL or a response shape breaks someone else's work.

## A small glossary

- **you** means the agent reading this file.
- **we, us** mean the ETHBEAT team.
- **project** means a system we cover: an L2, a bridge, a privacy protocol, a DA layer, a ZK system.
- **Stages** is our framework for how far an L2 has removed its "training wheels" (Stage 0, 1, 2).
- **TVS** (Total Value Secured) is the value of canonically bridged, externally bridged and natively minted assets on a project. It's broader than DeFi TVL, and we used to call it TVL.
- **DA** means data availability: where a project publishes the data users need to rebuild state and exit.
- **Walkaway test**: can users still fully use the system if every centralized participant disappears?
- **Discovery** is how we read a project's deployed contracts and their permissions from chain, and how we notice when they change. Researchers review and classify each change.

## Where to discuss methodology

Methodology and framework changes are debated in public on the forum (https://forum.l2beat.com, Methodology & Framework category). A code change that changes what an assessment means is a methodology change and belongs there too, not only in a PR.

## Rules for working in this repo

- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- Do not split `eth_getLogs` requests by block range in calling code. `RpcClient` halves a range itself when the RPC reports a limit, and a fixed step multiplies requests on RPCs that have no block-range limit.
- Keep error messages static and put dynamic values in `cause`: `new Error('HTTP error', { cause: { status } })`, not `` new Error(`HTTP error: ${status}`) ``. Why: a fixed message makes Elasticsearch queries easier, since one exact match finds every occurrence.
- Gate e2e perf ratchets on counts of the work (layouts, restyled elements, boxes, layers), and log times without a ceiling. Why: GitHub's runners come with different CPUs, so the same commit times up to 2.5× apart, in CPU time as much as wall time. More in `packages/frontend/e2e/README.md`.
- Before showing a date or time on the frontend, or touching chart tooltips, read `packages/frontend/src/utils/dates.md`.
- For discovery research (`l2b discover`, project `config.jsonc` files, templates), read `packages/config/src/projects/AGENTS.md` first.

@AGENTS.local.md
