import { evaluateTrigger } from '../gate/evaluateTrigger.js'
import type { CommentEvent, PullRequest } from '../gate/types.js'
import { readJson, requireEnv, setOutput } from './io.js'

const event = readJson(requireEnv('GITHUB_EVENT_PATH')) as CommentEvent
const pr = readJson(requireEnv('PR_JSON_PATH')) as PullRequest

const decision = evaluateTrigger(event, pr)
console.log(JSON.stringify(decision))
setOutput('run', String(decision.run))
if (decision.run) {
  setOutput('pr_number', String(decision.prNumber))
  setOutput('head_sha', decision.headSha)
  setOutput('base_sha', decision.baseSha)
}
