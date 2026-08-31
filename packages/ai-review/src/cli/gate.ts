import { evaluateTrigger } from '../gate/evaluateTrigger.js'
import { CommentEvent, PullRequest } from '../gate/types.js'
import { readJson, requireEnv, setOutput } from './io.js'

const event = CommentEvent.parse(readJson(requireEnv('EVENT_JSON_PATH')))
const pr = PullRequest.parse(readJson(requireEnv('PR_JSON_PATH')))

const decision = evaluateTrigger(event, pr)
console.log(JSON.stringify(decision))
setOutput('run', String(decision.run))
if (decision.run) {
  setOutput('pr_number', String(decision.prNumber))
  setOutput('head_sha', decision.headSha)
  setOutput('base_sha', decision.baseSha)
}
