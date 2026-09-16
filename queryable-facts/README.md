# Queryable facts

Ask AI about Solidity contracts. The pipeline gives it compiler facts, Soufflé
results and source snippets to investigate. Answers include the evidence it read;
they are not formal proofs.

## 1. Install tools (once)

On macOS, with [Homebrew](https://brew.sh) installed:

```sh
brew install node souffle
npm install -g @openai/codex
codex login
```

Skip tools you already have. You need **Node 22+**, **Soufflé** (tested with 2.5),
and a current **Codex CLI signed in with an account that has model access**.
[Codex setup](https://developers.openai.com/codex/cli/).

On Linux, install Node 22+ and a [Soufflé package for your distribution](https://github.com/souffle-lang/souffle/releases),
then use the same Codex commands above.

## 2. Start the portal

After cloning and checking out this branch, run from the repository root:

```sh
cd queryable-facts
npm install
npm run dev
```

No installation at the repository root is needed. Open **http://localhost:5181**.
Stop with **Ctrl+C**. After updating the branch, run `npm install` and restart.

Startup checks the compiler, Soufflé, Codex compatibility and sign-in. It stops
with instructions if something is missing. Run `npm run doctor` to check without
starting the portal. These local checks do not send an AI request or verify model
access, available quota or network connectivity.

## 3. Ask a question

1. Choose **An external gate with a discovery snapshot**.
2. Enable **Read with AI**, **Follow internal calls**, **Connect external contracts**, and attach the snapshot.
3. Click **Run this stage**, then ask **“What is the score, and who can change it?”**
4. Open **Investigation** to see what AI read and why.

You can edit source files and the snapshot in the page, then rerun. This does not
overwrite the example files. Runs and AI investigations are saved locally in `out/`.
Asking AI sends the question and retrieved code/facts through your Codex account.

## If something fails

- **Codex missing or too old:** `npm install -g @openai/codex`
- **Not signed in:** `codex login`
- **Model unavailable:** use a model your account can access:
  `QUERYABLE_FACTS_MODEL=your-model npm run dev` (default: `gpt-5.6-sol`).
- **Port in use:** `PORT=5182 npm run dev`
- **Tool installed elsewhere:** set `SOUFFLE_BIN=/path/to/souffle` or `CODEX=/path/to/codex` before the command.

For help, share the error and `npm run doctor` output. Setup is tested on Linux;
macOS testing is still pending.

[Lessons and implementation](GUIDE.md) · Tests: `npm test`
