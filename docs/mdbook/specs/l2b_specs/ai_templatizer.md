# AI templatizer

The AI templatizer lets a language model write discovery templates. It runs
only when a researcher passes `--ai` to a local `l2b discover` run. It writes
the same `template.jsonc` files researchers write, under
`packages/config/src/projects/_templates`, and the researcher reviews them as a
git diff before committing. The backend never calls a model, so
`discovered.json` stays a function of the repository.

This document is the description of record. Keep it in step with the code: a
change in behaviour under `packages/discovery/src/discovery/templatizer/` is
not complete until this document says the same. The design history and the
log of decisions taken along the way are in
`packages/discovery/docs/ai-templatizer.md`.

## Three rules

Everything else here follows from three rules.

**1. The templatizer only adds.** It never removes, renames, reorders or
rewrites anything a human wrote in a template, and it never changes what
discovery outputs for a value that already existed. For an existing template,
the new file is the old file's text with blocks inserted: new fields at the end
of `fields`, and comment lines for the reviewer. The writer checks this before
writing: removing the inserted blocks must give back the old text byte for
byte, or the run stops. A field that fails at the current block stays in the
file and gets a note; the researcher decides what to do with it. The
`ignoreMethods` of an existing template is never touched.

Why: a template is shared by every contract whose code matches one of its
shapes, across projects. A field that looks wrong from one contract's code may
be right for another, and the researcher who wrote it knew something the model
does not see. The first implementation removed fields that failed a dry run.
A bug in that dry run then removed Zora's `absolutePrestateDecoded`, a field 40
projects share, before the model was even asked.

**2. The templatizer never predicts what discovery would do.** It either calls
discovery's own code or reports what that code did. The dry run runs the draft
through the analyzer's own handler executor, with the analyzer's own
configuration for the address: the global and project `types`, the address
override from `config.jsonc`, its `ignoreMethods`. The baseline is the values
the analyzer actually produced before applying a template. No second copy of
discovery's logic exists in the templatizer.

Why: a copy drifts. The first implementation re-implemented how discovery
resolves method names, orders references and decodes edits, so that it could
warn the model before running anything. Each copy was a place to disagree with
discovery, and one such disagreement, a dry run built without the shared
`types`, marked a correct field as broken. Code that calls discovery cannot be
wrong about discovery.

**3. Checks block only on structure and on failure.** A draft is rejected only
when it does not parse, when discovery's own schema rejects it, when a worklist
item has no verdict or two, when a field claims to cover an event its handler
does not read, when a field name would overwrite a value discovery already
produces, or when a field errors in the dry run. Nothing else blocks: not an
empty result, not a name the templatizer finds odd, not a judgment about what
an event means. Whatever the dry run observes that a reviewer should know
becomes a `// review:` comment in the template.

Why: in all recorded runs the model never invented a function, an event or a
handler type. Its mistakes were a reply that was not JSON, a missed verdict, a
wrong event overload, a misnamed key. Parsing, coverage and the dry run catch
those. The checks beyond them fired once in 59 real rounds, and the dry run
would have caught that case too, while the judgment rules rejected correct
fields several times. Every template also goes through human review before it
is committed. So the templatizer checks what it can know, writes down what it
saw, and leaves judgment to the researcher.

## When it runs

| Situation | Flag | What happens |
| --- | --- | --- |
| A verified contract matches no template | `--ai` | The model authors a new template. Discovery then applies it as if it had matched. |
| A contract matches exactly one template | `--ai-revisit` (implies `--ai`) | The model is asked what the template misses for this contract. Additions are appended. Each template is revisited once per run, on the first contract that matches it. |
| A contract that had a template shows new code | `--ai` | The new shape is added to the old template so that it matches again. Fields that fail on the new code get a note. The model is not asked; run `--ai-revisit` to ask it. |
| Unverified code, an EIP-2535 diamond, an EOA | any | Not templatized, as without `--ai`. |

Options: `--ai-model` (`opencode-go/<model>`, `opencode/<model>` or a Codex
model; default Codex's default), `--ai-effort` (default `high`), `--ai-rounds`
(model turns per contract, default 3).

## One contract, step by step

1. **Baseline.** The analyzer runs discovery's handlers on the contract
   without a template: every 0-argument getter, the 0–4 probe of every view
   with one `uint256` argument, the proxy values, and the address override
   from `config.jsonc`. These values are the baseline.
2. **Worklist.** From the ABI: every view or pure function with at least one
   argument, the constructor when it has parameters, and every event. These
   are the things discovery cannot read without being told how; the
   constructor's arguments only a `constructorArgs` field can decode, and a
   constructor is listed so that field is decided on, not forgotten. If the
   contract already has a template, the items its fields read and the methods
   it ignores leave the list.
3. **Prompt.** One message, in a fixed order: the guidance (what a draft is,
   the five skip reasons, how to enumerate a mapping, event-only state, roles,
   references, literals), the draft schema with a worked example, the handler
   reference for the seven handler types the model may use (`call`, `array`,
   `event`, `accessControl`, `storage`, `constructorArgs`, `hardcoded`), the
   contract facts (identity, proxy values, baseline, the existing template's
   fields verbatim, the worklist), and the flattened source, last and the
   only part cut when the prompt is too long. When an existing field uses a
   handler or an edit form outside the reference, the matching section of the
   discovery README is added, so the model knows what that field does.
4. **Draft.** The model replies with one JSON object: `fields`, each with a
   `handler`, an optional `edit`, the worklist tokens it `covers` and a
   one-sentence `reason`; and `skips`, each a worklist token with one of five
   reasons (`computation`, `user-activity`, `unbounded`, `covered`,
   `not-state`).
5. **Checks.** The structural checks of rule 3. Errors go back to the model
   verbatim, numbered, on the same conversation thread, up to the round limit.
6. **Dry run.** The draft's fields, together with the existing template's
   fields, run through discovery's handler executor at the run's block. A
   field that errors goes back to the model. What the run observed is kept for
   the notes.
7. **Write.** A new template is written to
   `_templates/<project>/<ContractName>/` with its shape; an existing template
   gets the new fields appended. For a new template, `ignoreMethods` holds the
   probed getters the model skipped as not worth reading or covered by a field
   of another name, which is what a researcher writes by hand. A getter
   skipped as `covered` keeps its probe: that skip is a claim, and when it is
   wrong the probe is the only copy of the data. The template service reloads
   and the analyzer applies the template.
8. **Failure.** If the model does not answer (quota, network, timeout), no
   draft passes within the rounds, or the templatizer hits a bug, discovery
   stops before writing `discovered.json`, with a message naming the contract,
   the reason, the trail directory and how to proceed. Templates written
   earlier in the run stay and are reused by the next run.

## What is checked, what is not

Checked, and blocks until fixed:

| Check | Why it can be certain |
| --- | --- |
| The reply is one JSON object | Parsing. |
| Every handler matches discovery's own schema for its type; every `edit` and `where` is a blip program discovery parses | Discovery's own definitions, applied one type at a time so that the message names the wrong key. |
| Every worklist item has exactly one verdict, in `covers` or in `skips`, and nothing outside the list is named. The one plurality: several `call` fields that read one function with different literal arguments, one per enum value, each list it | Counting over a closed list. This is the "nothing was forgotten" check. The plurality is how researchers read a getter keyed by a `uint8`, which `array` cannot enumerate; each of those fields does read the function. |
| A field covers only events its handler names; a `call` or `array` field covers only the function it calls | Read off the handler itself. Without this a missed item could hide behind a false claim. |
| A field name is a Solidity identifier, does not start with `$`, and is not the name of a value the baseline or the existing template already has; the one exception is an `array` over the single-`uint256` getter discovery probes under that name, which replaces the 0–4 probe with the whole array | A field of an existing name replaces that value, which would remove output (rule 1). The exception is what researchers write. |
| Every field constructs with discovery's handler factory and runs without error at the block | Discovery itself. The one construction failure that is explained rather than only quoted is an `array` over a getter keyed by a type `array` does not take (a `uint8`): discovery's message names no cause, and the model's next try was the same handler spelled differently. |

Deliberately not checked:

| Not checked | Reason |
| --- | --- |
| Whether a method or event name exists, or resolves to what the model meant | The dry run errors on a missing one. Which function a bare name resolved to is written as a note. For `covers`, a bare method name is matched to the worklist by name and number of arguments, a full fragment by its signature: a comparison of names the model wrote, not a resolution. |
| Whether `{{ references }}` resolve | The dry run fails on an unresolved one. |
| Which `edit` or `where` forms are used | Any program discovery parses is allowed. A throwing one fails the dry run; a wrong one is reviewed. |
| Whether a result is empty | Event-only state can be empty at a block. The note says so. |
| Whether a name is meaningful, or whether an `accessControl` field is named `accessControl` | Researchers rename freely in review; the guidance states the convention. |
| Whether an event skipped as activity is really configuration | A judgment. The guidance tells the model how to decide; the researcher checks. |
| Whether a field would make discovery follow many addresses | The note states the count; the guidance asks for `ignoreRelative` on lists of instances. |

## Notes for the reviewer

The templatizer writes what it saw as comments, each starting with
`// review:`, directly above the field concerned:

- `fails at block N: <error>`: an existing field errored at this block. It was
  kept.
- `empty at block N: no logs yet for <events>`: an event fold returned nothing.
- `reads <fragment>`: a bare method name resolved to this function; check that
  it is the intended one.
- `holds N addresses discovery will follow`: a field whose values discovery
  analyses next.
- `empty at block N: no logs for <event>, but another declaration of the same
  event has logs: <fragment> (<n> log(s))`: the field reads one overload of the
  event while another has the history.

Above a block of appended fields, one comment states who added them and when:
`Added by <model>, <effort> effort via l2b discover --ai-revisit on <date>, <n>
round(s). Review before committing.` A new template carries the same line
after its `$schema`, starting `Authored by`, with the flag of the run that
wrote it. Above each new field, the model's reason and the items it covers.
A note is written once; a rerun that sees the same fact does not repeat it.

A reviewer reads the template diff as they would a colleague's: the reason,
the handler, the notes, and the `discovered.json` diff next to it.

## The model

Two clients drive command-line coding agents and need no SDK: `opencode run`
for `opencode/…` and `opencode-go/…` models, `codex exec` for everything else.
Turns run one at a time across the whole discovery run, because the accounts
behind them are rate-limited. A turn is allowed fifteen minutes. A turn whose
answer is unusable (the model called a tool, wrote tool-call markup into
its text, or returned no text) is asked again with the same message, and
that costs one of the rounds; the first turn of a contract gets one extra
sample from the opencode client before it counts. A repair message repeats
that no tools exist, because a reported failure is what tempts a model to go
and look. A turn that is not answered stops the run. opencode's own budget
of 32,000 output tokens per turn, which a reasoning model's thinking counts
against, is raised to 128,000: at the default, DeepSeek at high effort spent
the whole budget thinking about the larger contracts and answered with
nothing, or with a reply cut off mid-JSON.

The default effort is `high`, and it stays `high` after `low` was measured:
on the quick suite the two were indistinguishable on recall (47 and 48 of 82
reachable fields, the same thirteen contracts at the same counts), and low
saved a quarter of the reasoning tokens and five minutes of twenty-eight. A
saving that small does not buy a lower setting for the hard kind of turn, and
the setting will be carried to stronger models, which should be run at their
best. Every benchmark run since is at `high`.

The model has no tools. Both clients disable them in configuration and refuse
any turn whose event stream shows a tool call. The reason is not distrust of
the model but of what a read tool can reach: `packages/backend/.env` holds RPC
keys, and neither client can restrict reads to a directory. Instead the prompt
carries everything the model needs, including the README sections for
handlers an existing template uses. Read-only tools behind a boundary we own
(an MCP server over a staged directory) remain an option, to be taken only if
the benchmark shows room for it.

The system prompt is the templatizer's, not the harness's. Both CLIs are
coding agents and open every session with their own prompt (for opencode 8.5
KB of "You are opencode, an interactive CLI tool that helps users with
software engineering tasks", with sections on tool use and code conventions;
for Codex its built-in instructions), then the `AGENTS.md` and `CLAUDE.md`
files they find. Each has a switch that replaces its prompt, and the clients
use it: opencode runs the turn as a configured agent whose `prompt` stands in
for the default (`--agent`), with the user's `CLAUDE.md` kept out by
`OPENCODE_DISABLE_CLAUDE_CODE_PROMPT`; Codex takes the same text through
`model_instructions_file`, with `project_doc_max_bytes=0` so that no
`AGENTS.md` is read, `agents.enabled=false` so that no sub-agent tools or
the message introducing them are sent, and `include_environment_context=false`.
The text says what the session is: a non-interactive tool inside a program,
one message with a single task, a reply read as data, no tools, nothing to
ask. What remains of each harness is small and verified by asking the model
to repeat its instructions: opencode adds an environment block naming the
model, the empty scratch directory, the platform and the date; Codex adds a
catalogue of the skills installed on the machine, which no documented setting
removes and which the model has no tool to open. Claude Code, not a client
today, offers the same (`--system-prompt`, `--bare`, `--tools ""`), so the
approach does not tie the templatizer to these two.

Every turn of a run executes in one empty scratch directory that holds only
the client's configuration, and the model is told so: the directory is the
process cwd, the `--dir` argument and `$PWD` alike, because opencode reads
its directory from `$PWD` and would otherwise tell the model it works inside
the repository and load the repository's `AGENTS.md`. A model that believes
it sits in a coding repository goes to explore it; one that is told it is a
tool answers. The directory is the same for the whole run because opencode
keeps its sessions per directory, and a repair turn resumes the first turn's
session.

The trail of every contract (the prompt, each reply, the findings, the dry run,
a summary) is written under
`packages/config/cache/templatizer/<project>/<address>/`, next to the sqlite
cache, and is not committed.

## Benchmark

`l2b templatizer-benchmark` measures the templatizer against committed work.
For each contract in the suite it hides the committed template, lets the
templatizer author one from scratch, analyses the contract with it at the
committed block, and compares the values with the committed `discovered.json`,
field by field. Values are compared, not template text: a field is credited
when its values are there, under the same name, a different name, or a
different shape. The benchmark is a command, not part of the test suite; the
tests drive it with fakes.

Two numbers matter:

- **Recall on reachable fields.** Of the committed handler fields the model
  could have written, how many came back with the same values. Unreachable,
  and so left out of the denominator but listed in the report with the
  reason: fields using `hardcoded` (a researcher's knowledge, not the
  chain's), `eventCount` or a project-specific handler, a `call` on another
  contract (which other contract holds related state is protocol knowledge),
  and fields the suite marks `unreachable` with a reason, such as a storage
  slot nobody could derive. The target is 100%; every miss should have a
  story.
- **Regressions.** Committed values that were not the template's work and
  that the generated template lost or changed: proxy values, getters, fields
  the address override in `config.jsonc` defines. The target is zero.

Alongside: rounds, tokens, wall time and failures.

The **quick suite** is fourteen contracts chosen for dense use of generic
handlers, one per template, all on Ethereum for fast RPC, with fields the
model cannot reach marked. It runs in about half an hour on DeepSeek V4.1
Flash at high effort and in a quarter of an hour on the Codex default model,
a run differs from its repeat by a few fields on the same four contracts,
and it is the default. The **full suite** is the research
suite (scroll, 25 base contracts, 6 plumenetwork) and exists for comparability
with the research numbers.

Run the benchmark before and after any change to the prompt, the checks or the
loop, and when comparing models or efforts. Contracts whose template has no
handler field are not in the quick suite: the model cannot do better than the
baseline there, and about 38% of all templates are like that.

What the benchmark does not yet do: exercise the revisit path (it only measures
authoring from scratch), and run against synthetic contracts with known
complete answers. Both are worth adding; neither is needed to use the numbers
above.

## Operations

- `l2b discover --help` documents the flags. The templatizer needs `opencode`
  or `codex` on `PATH` and a logged-in account.
- A stopped run prints `TemplatizationFailedError` with the contract, the
  reason, advice and the trail path. Rerun after fixing the cause, or rerun
  without `--ai` to leave the contract untemplatized on purpose.
- Model processes run in their own process group and are killed when discovery
  exits.
