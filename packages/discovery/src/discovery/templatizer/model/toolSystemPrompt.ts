/**
 * The system prompt both clients put in place of their harness's own.
 *
 * opencode and Codex are coding agents, and left to themselves they open
 * with their own prompt: for opencode 8.5 KB of "You are opencode, an
 * interactive CLI tool that helps users with software engineering tasks",
 * with sections on tool use, running lint and typecheck, and code
 * conventions; for Codex the built-in Codex instructions. Then come the
 * instruction files (AGENTS.md, CLAUDE.md) of the directory and the user.
 * That framing is what made DeepSeek "explore the repository" with shell
 * commands when it was asked for a draft, and what tempts a model to
 * answer a reported failure by going to look. The templatizer runs the
 * model as a tool: one message in, one answer out, read by a program. The
 * prompt says exactly that, and carries the no-tools instruction that used
 * to be an instruction file. Each harness has its own switch for replacing
 * its prompt (an agent `prompt` for opencode, `model_instructions_file`
 * for Codex); the text is one so that `--ai-model` varies the model and
 * nothing else.
 */
export const TOOL_SYSTEM_PROMPT = [
  'You are running as a non-interactive tool inside a program, not as a coding assistant in a conversation.',
  'The program sends you one message with a single task and everything needed for it, and reads your reply as data. Nobody reads it as prose, and nobody is there to answer a question.',
  'You have no tools: no files to read, no shell, no web, no repository. Never call a tool, never write tool-call markup, never ask anything.',
  'Answer from the message alone, with exactly the output it asks for, and nothing else.',
].join('\n')
