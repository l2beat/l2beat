# AI templatizer

The AI templatizer lets a language model do the one part of discovery that
has always needed a researcher's hand: writing the template that tells
discovery how to read a contract. It runs as part of a local `l2b discover`
run when the researcher asks for it with `--ai`, writes the same `template.jsonc`
files researchers write, and the researcher reviews them as a git diff before
committing. This document introduces discovery as far as needed, then
describes what the templatizer does, the rules it follows, where it plugs
into discovery, how one contract moves through it, what it checks and
deliberately leaves alone, how the model is driven, how it is benchmarked,
and which model is the default and why.

## Discovery, in short

Discovery is how L2BEAT reads the on-chain state of a project. A project is a
folder under `packages/config/src/projects/<project>/<chain>/` whose
`config.jsonc` names a few initial addresses. `l2b discover <chain> <project>`
starts from those and loops: for each address it fetches the ABI and the
verified source, detects a proxy and reads its implementation, calls every
view function that takes no arguments, and for every view that takes one
`uint256` reads indices 0 to 4. Every address found among the values is
queued and analysed in turn, until no new address appears. It goes level by
level: the initial addresses are level 0, the new addresses their values hold
are level 1, and so on. The addresses of one level are analysed together, and
the next level starts when all of them are done. The result is
`discovered.json`, committed next to the config. The differences between runs
go to `diffHistory.md`, and a monitor watches the same values in production.

What discovery cannot do by itself is read anything it has to be told about:
a getter with arguments, a mapping, the history of an event, a constructor
argument, a `private` variable in a storage slot. For those a researcher
writes a **handler**, a small JSON object naming a handler type and its
parameters, under a field name of their choosing:

```jsonc
"minDelay": { "type": "call", "method": "getMinDelay", "args": [] },
"guardian": { "type": "storage", "slot": 3 }
```

A handler's value can be reshaped with an `edit`, a program in **blip**
(Bracket LISP, discovery's small edit language): `["format", "FormatSeconds"]`
turns a number of seconds into a duration. Discovery has over thirty handler
types, most of them specific to one protocol. The seven general ones are
`call`, `array`, `event`, `storage`, `accessControl`, `constructorArgs` and
`hardcoded`; the discovery README documents them all.

Handlers live in one of two places. An override in `config.jsonc` applies to
one address of one project. A **template** applies to every contract whose
code matches it, in every project. A template is a folder under
`packages/config/src/projects/_templates/`, named after the contract or after
`<project>/<Contract>`, with two files. `template.jsonc` holds the fields with
their handlers, the methods to ignore, a description, and the permissions the
contract grants. `shapes.json` lists known deployments of that code with the
hash of their flattened source. When discovery meets a contract it hashes the
contract's flattened source and looks the hash up among all shapes; a hit
means the template applies as if it were the address's override. There are
more than twelve hundred templates, and one template is often shared by
dozens of projects.

Writing a template is research work: read the source, decide which state
matters and who can change it, write the handlers, run discovery, read the
diff, fix what errors. It is also the slow part of onboarding a project.
Everything in discovery up to that point is mechanical and runs without a
model, in the backend as well as locally.

## What the AI templatizer adds

The AI templatizer puts a language model at that one point. It is a step of
a discovery run, not a separate tool, and it is off unless the researcher
switches it on with `--ai`. With the flag, the templatizer runs between the
levels of discovery. When a level is done, it goes through what discovery
found so far, one contract at a time: for each verified contract that matched
no template, it hands the model the contract and the model writes a template.
Discovery then analyses again every contract a written template applies to,
and only then goes a level deeper, following the addresses those analyses
hold. A contract whose code changed since
the committed `discovered.json`, typically a proxy that was upgraded, matches
no template either. If its old template still fits the new code, the model is
asked what that template misses and the new shape joins it; if not, the
contract gets a template of its own. With `--ai-revisit` the model is also
shown each template that does match, once per run, and asked what the
template misses for this contract; its additions are appended. Either way the
output is ordinary template files under `_templates`, and the researcher
reviews them as a git diff before committing.

Only a local `l2b discover` can ask a model. The backend never does, so
`discovered.json` stays a function of the repository.

| Situation | Flag | What happens |
| --- | --- | --- |
| A verified contract matches no template | `--ai` | The model authors a new template. Discovery analyses the contract again with it before going deeper. |
| A contract matches exactly one template by its shape | `--ai-revisit` (implies `--ai`) | The model is asked what the template misses for this contract. Additions are appended. Each template is revisited once per run, on the first contract, in address order, that matches it. |
| A contract that had a template shows new code, and the template still fits | `--ai` | The model is asked what the template leaves undecided for the new code. Additions are appended and the new shape is added, so the template matches again. |
| A contract that had a template shows new code, and the template no longer fits | `--ai` | The model authors a template of its own for the new code; its header says why the old one no longer fits. The old template is left as it is. |
| Unverified code (also code known only through a `manualSourcePaths` link: the analysis counts it as verified, but the explorer holds none to show the model or to hash a shape from), an EIP-2535 diamond, an EOA | any | Not templatized, as without `--ai`. |

Options: `--ai-model` (`opencode-go/<model>`, `opencode/<model>` or a Codex
model; default Codex's default), `--ai-effort` (default `high`), `--ai-rounds`
(model turns per contract, a positive integer, default 3). The templatizer
needs `codex` or `opencode` on `PATH` and a logged-in account.

## Three rules

The design follows from three rules. Each was learned from a version that
broke it.

**1. The templatizer only adds.** It never removes, renames, reorders or
rewrites anything a human wrote in a template, and it never changes what
discovery outputs for a value that already existed. The model replies with
the part of `template.jsonc` it adds, and one writer inserts that into the
template's text at paths the text does not have yet; a path that exists is an
error sent back to the model, never a replacement. On an existing template
only new entries under `fields` are added, and on a field it already has only
`severity`, `description` and `permissions`, which describe a value without
changing it; nothing at the top level, since an `ignoreMethods` added to a
shared template changes what every project using it reports. A new template is
the same merge into the file discovery creates for it, and there anything
discovery's schema accepts may be added. The old text survives byte for byte
outside its whitespace (an object written on one line is spread one member per
line when it gets a member), and before writing, every value the old text held
must hold the same in the new one, or the run stops. A field that fails at the
current block stays as it is; the model is told it fails, and the researcher
decides what to do with it. When a contract's new code no longer fits its old
template, the templatizer does not bend the old template to it: the contract
gets a template of its own.

Why: a template is shared by every contract whose code matches one of its
shapes, across projects. A field that looks wrong from one contract's code may
be right for another, and the researcher who wrote it knew something the model
does not see. The first implementation removed fields that failed a dry run.
A bug in that dry run then removed Zora's `absolutePrestateDecoded`, a field 40
projects share, before the model was even asked.

**2. The templatizer never predicts what discovery would do.** It either calls
discovery's own code or reports what that code did. The dry run runs the draft
through discovery's own handler executor, with the configuration discovery
uses for the address: the global and project `types`, the address
override from `config.jsonc`, its `ignoreMethods`. The baseline comes from
the same executor, run with the address's configuration and, when a template
is being extended, with that template pushed, as discovery will push it.
Whether a template still fits a contract whose code changed is also read off
discovery: the old fields run on the new code, and the committed
`discovered.json` says which of them already failed and what the contract was
called. No second copy of discovery's logic exists in the templatizer.

Why: a copy drifts. The first implementation re-implemented how discovery
resolves method names, orders references and decodes edits, so that it could
warn the model before running anything. Each copy was a place to disagree with
discovery, and one such disagreement, a dry run built without the shared
`types`, marked a correct field as broken. Code that calls discovery cannot be
wrong about discovery.

**3. Checks block only on structure and on failure.** A draft is rejected only
when it does not parse, when discovery's own schema rejects it, when it would
replace what the template or the baseline already has, when a field it adds
has no reason, when discovery cannot construct a handler, or when a field
errors in the dry run. Nothing else blocks: not an empty result, not a name
the templatizer finds odd, not a judgment about what an event means, and not
whether every function and event was considered. Whatever the dry run
observes that a reviewer should know becomes a `// review:` comment in the
template.

Why: in all recorded runs the model never invented a function, an event or a
handler type. Its mistakes were a reply that was not JSON, a wrong event
overload, a misnamed key. Parsing, discovery's own schema and the dry run catch
those. The checks beyond them fired once in 59 real rounds, and the dry run
would have caught that case too, while the judgment rules rejected correct
fields several times. A coverage check, which made the model give a verdict on
every function and event, never fired on the two default models in eight
quick-suite runs; on two other models it fired 39 times, 32 of them about its
own bookkeeping (an item given two verdicts), and turning its skips into
`ignoreMethods` caused the one recorded regression. Every template also goes
through human review before it is committed. So the templatizer checks what it
can know, writes down what it saw, and leaves judgment to the researcher.

## Between the levels of discovery

The templatizer is a hook of discovery's engine (`BetweenLevels` in
`DiscoveryEngine.ts`), called when every analysis of a level has finished and
none of the next level has started. Nothing is in flight then, so the
templatizer works one contract at a time. It is given every analysis made so
far and passes over the contracts it was asked about at an earlier level.

After each call, the analyzer reads again the template files that changed,
and the engine asks it, for every analysis it holds, whether `analyze` would
now extend another template, or the same template changed since
(`AddressAnalyzer.templateChanged`). Those addresses are
analysed again. That is the contract the model wrote a template for, every
contract of the same shape, and, once a template was added to, every contract
it applies to, at whatever level it was found. A template that a referrer's
field suggested stays the referrer's choice, and the address is analysed
again with the same suggestion. The engine then calls the templatizer again,
until a call changes nothing, and only then follows the level's relatives,
from the analyses as they now are. So a contract's relatives are followed as
its template makes them, never as discovery saw them without it.

An analysis made again replaces the old one in place. Only an address's first
analysis counts towards `maxAddresses` and `maxDepth`. An address that a
contract of an earlier level holds only once analysed again joins the next
level rather than the level after that contract, which matters only for
`maxDepth`. A relative that the new analysis no longer holds is dropped by
the reachability pruning discovery already does, which also runs after
the last level. A contract whose template still changed right after it was
analysed again stops the run instead of being analysed forever. Without
`--ai` the engine calls no hook and never asks about templates.

Why here:

- **Not everything discovery reaches belongs to the project.** Without
  templates, discovery follows every address a getter returns: a bridge's
  list of tokens, a registry of instances, a contract that is only mentioned.
  Researchers cut those with `ignoreRelatives`, `ignoreMethods` and
  `ignoreDiscovery`. A templatizer that ran after a whole discovery would be
  asked about all of them, spend model turns on them, and leave templates
  nobody wants. Between the levels, a contract's template is in place before
  its relatives are followed, so what the template says not to follow is
  never reached.
- **The model cannot cut yet.** It can keep discovery from following a
  field it adds (`"ignoreRelative": true` on the handler), but not the
  getters discovery reads by itself; that takes `ignoreRelatives` or
  `ignoreMethods` at the template's top level, which the model may not write.
  So on a new project discovery still goes wherever it goes without `--ai`,
  and the researcher should cut what does not belong in `config.jsonc` before
  running `--ai` on it. Letting the model, or a classifier, mark relatives
  not to follow is the next step, and this hook is where that takes effect:
  at the level where the contract is templatized.
- **It reuses what the engine had.** Analysing an address again when its
  template changes, as when a referrer's field suggests one, and dropping
  what no analysis points to any more, were both there.
- **Nothing after discovery changes what it follows.** Colouring, when
  `discovered.json` is written, and permission modelling, a separate command,
  read the templates and add to the output, so the hook sees everything the
  structure will hold. A model reviewing the modelled permissions would be a
  step of its own after the modelling.

## One contract, step by step

A contract whose code changed starts with a fit check. Every field of the old
template runs on the new code. The template still fits when the contract kept
its name and no field that computes a value fails, apart from fields that
already failed in the committed `discovered.json`. The name compared is the
source name of the implementation behind a proxy, else of the contract, not a
display name from the config. A template that fits goes through the steps
below as an existing template and gets the new shape at the end. One that does
not is left as it is, and the contract goes through the steps as a new
contract. So is a template whose `criteria.json` does not list the contract,
whether or not it already holds the contract's shape: discovery matches such
a template for the listed addresses alone, so nothing is added to it.

Contracts go through these steps one at a time, in address order, so each
one's check and prompt see what the previous ones wrote. A contract that a
template written earlier in the run already matches, because it has the same
code, is not asked about; discovery analyses it again with that template.
Each contract is asked about once per run, however many levels see it.

1. **Baseline.** The templatizer runs discovery's handlers on the contract with
   the address's configuration: every 0-argument getter, the 0–4 probe of
   every view with one `uint256` argument, and the address override from
   `config.jsonc`. When a template is being extended it is pushed onto that
   configuration, because an override field may reference its fields, and
   the values the template computes or edits are left out: the model sees
   those as the existing fields. These values are the baseline. The
   proxy values come from proxy detection and are shown next to it.
2. **Worklist.** From the ABI: every view or pure function with at least one
   argument, the constructor when it has parameters, and every event. These
   are the things discovery cannot read without being told how; the
   constructor's arguments only a `constructorArgs` field can decode, and a
   constructor is listed so that field is considered, not forgotten. The
   worklist is what the model is asked to go through; most of it needs no
   field, and nothing checks that every item was read. When the list is
   empty, the model is not asked: a new contract gets a template with no
   fields, and an existing template only the new shape.
3. **Prompt.** One message, in a fixed order: the guidance (what to read and
   what needs no field, how to enumerate a mapping, event-only state, roles,
   references, literals), the reply schema with a worked example, the handler
   reference for the seven handler types the model is shown, the contract
   facts (identity, proxy values, baseline, the existing template verbatim
   with the fields that fail at this block, the worklist), and the flattened
   source, last and the only part cut when the prompt is too long. When an
   existing field uses a handler or an edit form outside the reference, the
   matching section of the discovery README is added, so the model knows what
   that field does.
4. **Draft.** The model replies with one JSON object in the shape of
   `template.jsonc`: `fields`, each with a `handler`, an optional `edit` and a
   one-sentence `reason`, which is written as a comment above the field rather
   than as a key. The prompt asks for fields only; descriptions, severities,
   permissions and `ignoreMethods` stay the researcher's.
5. **Checks.** The checks of rule 3. Errors go back to the model verbatim,
   numbered, on the same conversation thread, up to the round limit.
6. **Dry run.** The template the file will hold, the draft merged into it,
   runs through discovery's handler executor at the run's block. A field the
   draft adds that errors goes back to the model. What the run observed is
   kept for the notes.
7. **Write.** A new template is written to
   `_templates/<project>/<ContractName>/` with its shape, with a short shape
   hash appended to the name when that id is taken, as it is when a changed
   contract outgrew its old template; an existing template gets the draft
   merged into its text. Discovery then analyses again every contract the
   template applies to, at whatever level it was found.
8. **Failure.** If the model does not answer (quota, network, timeout), no
   draft passes within the rounds, or the templatizer hits a bug, discovery
   stops before writing `discovered.json`, with a message naming the contract,
   the reason, the trail directory and how to proceed. Templates written
   earlier in the run stay and are reused by the next run.

## What is checked, what is not

Checked, and blocks until fixed:

| Check | Why it can be certain |
| --- | --- |
| The reply is one JSON object | Parsing. A stray `}` after the object is tolerated; an object that never closes is reported with the number of braces still open, which a model can act on where a character position was ignored. |
| The reply matches discovery's own schema for `template.jsonc`, with no key the schema does not name; every handler matches the definition its `type` names; every `edit` and `where` is a blip program discovery parses | Discovery's own definitions, walked so that the message names the wrong key: every object as strict, since discovery ignores an unknown key where the model meant something, and a handler against the one definition its `type` names. |
| The reply adds only paths the template does not have: on an existing template, entries under `fields`, and on a field it has, `severity`, `description` or `permissions` | Read off the template's text. This is rule 1. |
| Every field it adds has a `reason` | Its presence. The reason is what the reviewer reads first. |
| A field it adds that computes a value does not take the name of a value the baseline or proxy detection already has; the one exception is an `array` over the single-`uint256` getter discovery probes under that name, which replaces the 0–4 probe with the whole array; which function that field reads is resolved as discovery's `array` handler resolves it, so an overload keyed by a narrower integer does not qualify | A field of an existing name replaces that value, which would remove output (rule 1); one that only describes it is allowed. The exception is what researchers write; resolving the function keeps `foo(uint32)` from taking the place of the probed `foo(uint256)`. |
| Every field constructs with discovery's handler factory and runs without error at the block; a full `method` fragment written for a function of this contract agrees with the ABI's declaration, outputs included | Discovery itself. The one construction failure that is explained rather than only quoted is an `array` over a getter keyed by a type `array` does not take (a `uint8`): discovery's message names no cause, and the model's next try was the same handler spelled differently. Discovery parses a full fragment without looking it up, so a wrong return type calls the right function and decodes the same 32 bytes without an error at the block; this is the one wrong template the dry run cannot catch. |

Deliberately not checked:

| Not checked | Reason |
| --- | --- |
| Whether every function and event was considered | Nothing blocks on it; the worklist is in the prompt, and the benchmark measures what the model finds. |
| Whether a method or event name exists, or resolves to what the model meant | The dry run errors on a missing one. Which function a bare name resolved to is written as a note. |
| Whether `{{ references }}` resolve | The dry run fails on an unresolved one. |
| Which `edit` or `where` forms are used | Any program discovery parses is allowed. A throwing one fails the dry run; a wrong one is reviewed. |
| Whether a result is empty | Event-only state can be empty at a block. The note says so. |
| Whether a name is meaningful, or whether an `accessControl` field is named `accessControl` | Researchers rename freely in review; the guidance states the convention. |
| Whether an event left out as activity is really configuration | A judgment. The guidance tells the model how to decide; the researcher checks. |
| Whether a field would make discovery follow many addresses | The note states the count; the guidance asks for `ignoreRelative` on lists of instances. |

## Notes for the reviewer

The templatizer writes what it saw as comments, each starting with
`// review:`, directly above a field it added:

- `empty at block N: no logs yet for <events>`: an event fold returned nothing.
- `reads <fragment>`: a bare method name resolved to this function; check that
  it is the intended one.
- `holds N addresses discovery will follow`: a field whose values discovery
  analyses next, counted as discovery counts them (values, not object keys).
- `empty at block N: no logs for <event>, but another declaration of the same
  event has logs: <fragment> (<n> log(s))`, or `another declaration of <event>
  has logs too: …` when the fold is not empty: the field reads one overload of
  the event while another has history.

Above the first addition to an existing template, one comment states who added
it and when: `Added by <model>, <effort> effort via l2b discover --ai-revisit on
<date>, <n> round(s). Review before committing.` A new template carries the same
line after its `$schema`, starting `Authored by`, with the flag of the run that
wrote it. Above each new field, the model's reason, then the notes. Existing
fields get no notes, even when they fail: a note on a shared template would be
added on every run, and `discovered.json` already shows the error.

A reviewer reads the template diff as they would a colleague's: the reason,
the handler, the notes, and the `discovered.json` diff next to it.

## The model

Two clients drive command-line coding agents and need no SDK: `opencode run`
for `opencode/…` and `opencode-go/…` models, `codex exec` for everything else.
Turns run one at a time, as contracts do, which also suits the accounts behind
them: they are rate-limited. A turn is allowed fifteen minutes. A turn whose
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

The model has no tools. Both clients disable them in configuration, a test
runs each installed CLI against a local endpoint and checks that the request
offers no tool, and both refuse any turn whose event stream shows a tool
call. For Codex that takes more than the shell and web search switches: with
a ChatGPT login it also offers the ChatGPT apps (GitHub, a search service
with internet access) and their MCP resource readers, plus `view_image`,
goals, plugin installs and `request_user_input`, and each is switched off.
The one exception is `apply_patch` for a model whose catalogue entry asks for
it (gpt-5.5 when this was written), which no setting removes and the
read-only sandbox refuses. opencode merges the turn's config into the user's
global config and into any `opencode.json` in a directory above the turn's,
and a `"permission": {"bash": "allow"}` in either brings `bash` back, so the
global config directory is pointed at an empty one and the search upwards is
switched off; the login lives in the data directory and stays. The reason is not distrust of
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

Each turn executes in an empty scratch directory that holds only the client's
configuration, and the model is told so: the directory is the process cwd,
the `--dir` argument and `$PWD` alike, because opencode reads its directory
from `$PWD` and would otherwise tell the model it works inside the repository
and load the repository's `AGENTS.md`. A model that believes it sits in a
coding repository goes to explore it; one that is told it is a tool answers.
Codex gets a new directory per turn. For opencode the directory is the same
for the whole run, because opencode keeps its sessions per directory and a
repair turn resumes the first turn's session. A first opencode turn whose text
holds tool-call markup is sampled once more within the same round; the refused
sample's events, tokens and time stay part of the round, so the trail and the
benchmark's cost show both.

The trail of every contract (the prompt, each reply, the findings, the dry run,
a summary) is written under
`packages/config/cache/templatizer/<project>/<address>/`, next to the sqlite
cache, and is not committed. A rerun for the same address empties that
directory first, so a shorter run does not leave the earlier run's later rounds
beside its own.

## Benchmark

The benchmark, `templatizer-benchmark` in the discovery package's own CLI
(from `packages/discovery`: `node --env-file=../backend/.env --import tsx
src/cli.ts templatizer-benchmark …`), measures the templatizer against
committed work. For each contract in the suite it hides the committed
template, lets the
templatizer author one from scratch, analyses the contract with it at the
committed block, and compares the values with the committed `discovered.json`,
field by field. Values are compared, not template text: a field is credited
when its values are there, under the same name, a different name, or a
different shape, because researchers and models shape the same state
differently (one field per key against one object). Two limits keep that
honest. Where both sides keep the same keys, in an object or in every row of
a list, each key must hold the same values, so values swapped between `admin`
and `guardian` are a difference, not a reshape. And only fields a template
handler produced are matched under
another name or shape: a proxy value, a getter or an override field must
come back under its own name with its own value, so a copy of it elsewhere
cannot hide its loss. The benchmark is a command, not part of the test suite;
the tests drive it with fakes.

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
model cannot reach marked. It is the default suite. It runs in about a
quarter of an hour on the Codex default model and half an hour on DeepSeek
V4.1 Flash at high effort, and a repeat run differs from the first by a few
fields on the same four contracts. The **full suite** is the research suite
(scroll, 24 base contracts, 6 plumenetwork) and exists for comparability with
the research numbers.

Run the benchmark before and after any change to the prompt, the checks or the
loop, and when comparing models or efforts. Contracts whose template has no
handler field are not in the quick suite: the model cannot do better than the
baseline there, and about 38% of all templates are like that.

What the benchmark does not yet do: exercise the revisit and changed-code
paths (it only measures authoring from scratch), and run against synthetic
contracts with known complete answers. Both are worth adding; neither is
needed to use the numbers above.

## Decisions

The choices that shape the code, with the reason each was taken, so they are
not reopened without new evidence.

- **Between the levels of discovery.** The templatizer first ran in the
  analyzer, where every untemplatized contract of a level reached it at once.
  That needed a queue of model turns, a map of authorings in flight and a
  record of where each template had been applied, and a template extended
  after a contract used it left that contract's values stale. It then ran
  after discovery and discovered again until nothing was written: simple, but
  every contract the untemplatized discovery reached was asked about, wanted
  or not. Between the levels nothing is in flight, the engine's own analysis
  of an address again keeps values current, and a template is in place before
  its contract's relatives are followed, which is what lets a template, and
  later the model, keep discovery from going where it should not.
- **The reply is the template itself.** The model writes the part of
  `template.jsonc` it adds, which discovery's own schema checks and the
  reviewer reads as is. One writer merges it, insertions only, so a shared
  template keeps every byte a researcher wrote (rule 1), and describing an
  existing value (`severity`, `description`, `permissions`) needs no new code.
- **Never predict discovery** (rule 2) and **block only on structure and
  failure** (rule 3). Both were learned from code that guessed and was
  wrong: the dry run without `types`, the deletion on Zora, and a coverage
  check that cost more rounds than it saved.
- **No tools for the model.** The contract source in the prompt is written by
  whoever deployed the contract, and a read tool could reach the RPC keys in
  `packages/backend/.env`. Both clients switch every tool off, a test checks
  the request each installed CLI sends, and a turn that shows a tool call is
  refused.
- **Command-line agents, not an SDK.** `codex` and `opencode` use the
  researcher's existing login, so no API key is handled here, and
  `--ai-model` varies the model and nothing else. Their own system prompts
  are replaced by the templatizer's.
- **Only locally.** The backend never builds a templatizer, so
  `discovered.json` stays a function of the repository.

## Operations

- `l2b discover --help` documents the flags.
- A stopped run prints `TemplatizationFailedError` with the contract, the
  reason, advice and the trail path. Rerun after fixing the cause, or rerun
  without `--ai` to leave the contract untemplatized on purpose.
- Model processes run in their own process group and are killed when discovery
  exits, including cancellation with SIGINT or SIGTERM.
- A Codex turn that reports an error and then completes, as after a dropped
  stream it reconnected, counts as answered; only a failed or unfinished turn
  stops the run.
- This document is the description of record. A change in behaviour under
  `packages/discovery/src/discovery/templatizer/` is not complete until this
  document says the same.

## Model comparison (2026-10-05)

The quick suite, run once per model at `high` effort on the same code, to
pick the default. Every committed template of the fourteen contracts is
hidden, the model writes one, and the values it discovers are compared with
the committed ones. "Found" counts the 82 handler fields a model could have
written; a failed contract is one where no draft passed three rounds, which
in `discover --ai` stops the run.

| Model | Found | Regressions | Contracts failed | Repair rounds | Tokens in / out | Wall |
| --- | --- | --- | --- | --- | --- | --- |
| GPT-6.1 Sol (Codex default) | **58/82** | 0 | 0 | 1 of 14 | 0.95M / 29k | 15 min |
| GPT-5.6 Terra (Codex) | 53/82 | 0 | 0 | 2 of 14 | 1.09M / 52k | 13 min |
| GPT-5.6 Luna (Codex) | 51/82 | 0 | 1 | 5 of 14 | 1.66M / 137k | 30 min |
| DeepSeek V4.1 Flash (opencode) | 50/82 | 0 | 0 | 1 of 14 | 0.80M / 303k | 32 min |
| GPT-6 Luna (Codex) | 49/82 | 0 | 1 | 5 of 14 | 2.04M / 81k | 22 min |

Repeat runs of one model land within a few fields of each other, so the four
lower rows are indistinguishable from one another. Sol's lead is real and
concentrated: it alone read Lighter's five `storage` slots off the source's
layout (8/10 against 4/10 for every other model) and HubPool's four fields.
Both Lunas failed the same contract (FluentRollup) on one stray closing brace
in a single-line reply, and did not fix it when told the character position.
The reply parser has since been changed to take the object that closes when a
stray `}` follows it, and to say by how many braces an unclosed object is
open; two of the three failing replies parse under it, so the Lunas would
probably fail nothing on a rerun. The comparison has also become stricter
since: values swapped between the same keys no longer count as found, and a
getter, proxy value or override field that comes back only under another name
or shape counts as a regression. The first can only lower a "Found" above,
the second can only add a regression. The rows above are from before these
changes.
GPT-6 Terra, GPT-6.1 Luna and GPT-6.1 Terra are not available to a ChatGPT
account in Codex and were not run.

Decision: the default stays the Codex default model, GPT-6.1 Sol. It finds
the most, fails nothing, reasons least and needs only `codex`, which the
researchers already have. GPT-5.6 Terra is the fallback if Sol's limits
bind; the Lunas are not recommended. opencode remains supported for cheap
models but is not required.

## After the reply became part of the template (2026-10-05)

The acceptance run for the change that replaced the draft (fields with
`covers`, and `skips`) with the part of `template.jsonc` the model adds, and
removed the coverage check: the quick suite on DeepSeek V4.1 Flash at `high`
effort, with the stricter comparison described above.

| Model | Found | Regressions | Contracts failed | Repair rounds | Tokens in / out | Wall |
| --- | --- | --- | --- | --- | --- | --- |
| DeepSeek V4.1 Flash (opencode) | 51/82 | 0 | 0 | 0 of 14 | 0.80M / 237k | 34 min |

The same model found between 47 and 54 in five runs before the change, so
the result is within the noise, under a comparison that can only lower it.
No contract needed a repair round, and the replies were half as long (9k
output tokens against 16k), since nothing had to be listed that no field
reads. Per contract it found what the Codex default model found in the table
above on eleven of the fourteen; the seven fields between them are Lighter's
storage slots, which only Sol reads, and three on HubPool and
AgglayerGateway. The Codex default model was not rerun: its workspace had no
credits left.
