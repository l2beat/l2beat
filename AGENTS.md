# ETHBEAT

ETHBEAT (formerly L2BEAT) is an independent research and analytics organization for Ethereum. We check what Layer 2s, interop protocols, privacy protocols, ZK systems and other things built on Ethereum really inherit from it: whom their users must trust, what those parties can do, and whether users can still get out if everyone else walks away.

Our mission is to help people understand and reduce their dependence on intermediaries. Before work that touches what we assess or how we present it, read the mandate in `packages/frontend/src/pages/mandate/mandateText.ts`.

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

## Terms we use differently

- **TVS** (Total Value Secured) counts every canonically bridged, externally bridged and natively minted asset on a project, used in DeFi or not. It used to be called TVL, and it is not DeFi TVL.
- **CROPS** is censorship resistance, open source, privacy and security: the properties we recognize applications for.
- **Walkaway test**: can users still fully use the system if every centralized participant disappears?
- **Discovery** is how we read a project's deployed contracts and permissions from chain, and notice when they change. Researchers review and classify each change.

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
