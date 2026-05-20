# From Research Prototype to Production

This guide describes the process a developer follows to turn a research-team prototype into production-ready, code-reviewed code.

The pipeline at L2BEAT is:

**Idea → Research → Prototype (Research Team) → Reimplementation (Development Team) → Production**

The prototype is a working reference produced by the research team to demonstrate a feature end-to-end. It is _not_ production code. The steps below describe how a developer takes that prototype and ships it.

## Step 1 — Analyze the prototype

Check out the prototype branch and run the [`l2beat-analyze-research-prototype`](https://github.com/l2beat/skills) skill (available in the `l2beat/skills` repo).

The skill walks you through reading the prototype as untrusted reference material and produces an analysis covering:

- What the feature is and what it does end-to-end.
- Which parts of the prototype are load-bearing vs. scaffolding.
- Known weaknesses to fix during reimplementation (performance, security, correctness, observability, types).
- Deviations from the codebase's conventions.

The output of this step is your mental model of the feature plus a list of things you will _not_ carry over verbatim.

## Step 2 — Inspect the prototype UI

Run the prototype and click through the feature in the browser.

Goals of this step:

- See what the user-facing surface looks like — pages, components, states, transitions.
- Identify what data each view consumes: shapes, sources, refresh cadence.
- Note which numbers, labels, and charts come from where, and which are hardcoded or stubbed.
- Spot edge cases the prototype doesn't handle (empty states, loading, errors, missing data).

## Step 3 — Meet with the researcher

Schedule a meeting with the researcher who owns the prototype and walk through it together.

Things to cover:

- **Key features** — what must be preserved, what is "nice to have", what is throwaway.
- **Decisions** — why this shape, this metric, this threshold, this fallback. The reasoning often isn't in the code.
- **Data sources** — which sources are authoritative, what their quirks are, what to do when they disagree or are missing.
- **Open questions** — anything ambiguous in the prototype that the researcher has an opinion on but didn't encode.
- **Out of scope** — what the researcher considered and explicitly excluded.

Write the answers down. The researcher is the source of truth for product intent; the prototype is only their sketch of it.

## Step 4 — Plan the reimplementation

Run the [`l2beat-reimplement-prototype`](https://github.com/l2beat/skills) skill (also in the `l2beat/skills` repo).

This skill produces a reimplementation plan grounded in the codebase's conventions:

- Where the code should live (packages, modules, file boundaries).
- Which existing abstractions to reuse instead of reinventing.
- What to split into separate PRs vs. land together.
- The order of work and the dependencies between steps.

The plan is the contract you'll execute against in Step 5 and review against later.

## Step 5 — Implement

With the analysis (Step 1), UI map (Step 2), researcher notes (Step 3), and reimplementation plan (Step 4) in hand, start writing production code.

While implementing:

- Follow the plan, but flag deviations as you find them — don't quietly rewrite the plan in your head.
- When the prototype and the researcher's intent disagree, the researcher wins. When the researcher and the codebase's conventions disagree, raise it explicitly.
- Address the weaknesses identified in Step 1 — don't port them.
- Keep PRs reviewable. Smaller, ordered PRs beat one large drop.

The output of this step is production code, reviewed by another developer, that ships the feature the research team prototyped.
