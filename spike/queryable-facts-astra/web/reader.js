import { makeBriefing } from '/briefing.mjs'

export function createReader({ escape, highlight }) {
  const $ = (id) => document.getElementById(id)
  let run, briefing, controller, revision = 0, lastRecord
  let config = { provider: 'Codex CLI', model: 'loading…' }

  const prose = (text) => escape(text).replace(/`([^`\n]+)`/g, '<code>$1</code>')

  function source(material, selected = []) {
    return `<pre class="code evidence-code">${material.source.split('\n').map((line, i) => {
      const n = material.start + i
      return `<span class="code-line ${selected.includes(n) ? 'selected-line' : ''}"><span class="line-number">${n}</span>${highlight(line) || ' '}</span>`
    }).join('')}</pre>`
  }
  function materialView(material, selected = []) {
    if (material.kind === 'fact') return `<div class="fact-evidence"><span class="evidence-kind">SOUFFLÉ OBSERVATION</span><h4>${escape(material.title)}</h4><p>${escape(material.text)}</p><p class="caption">Potential write site. This does not establish whether the write can execute.</p></div>`
    return `<div class="source-evidence"><div class="evidence-heading"><b>${escape(material.title)}</b><span>Playground.sol · lines ${material.start}–${material.end}</span></div>${source(material, selected)}</div>`
  }
  function clearAnswer() {
    revision++
    controller?.abort()
    controller = undefined
    lastRecord = undefined
    $('ai-answer').hidden = true
    $('ai-error').hidden = true
    $('investigation').hidden = true
    $('investigation-steps').innerHTML = ''
    $('ask-ai').disabled = false
    $('cancel-ai').hidden = true
    $('ai-status').textContent = ''
  }
  function prepare() {
    clearAnswer()
    if (!run || !$('enable-reader').checked) return
    try {
      briefing = makeBriefing(run, $('question').value)
      $('briefing').textContent = briefing.prompt
      $('briefing-size').textContent = `${briefing.symbols.length} symbols · ${briefing.prompt.length.toLocaleString()} characters · source fetched on request`
    } catch (error) {
      briefing = undefined
      $('briefing').textContent = error.message
      $('ai-status').textContent = error.message
      $('ask-ai').disabled = true
    }
  }
  function show() {
    $('reader-section').hidden = !run || !$('enable-reader').checked
    $('reader-link').hidden = !$('enable-reader').checked
    $('lesson-badge').textContent = run?.followCalls ? 'LESSON 03 · FOLLOW INTERNAL CALLS' : $('enable-reader').checked ? 'LESSON 02 · READ WITH AI' : 'LESSON 01 · DIRECT WRITES'
    if (!$('enable-reader').checked) clearAnswer()
    else prepare()
  }
  function showStep(step) {
    $('investigation').hidden = false
    for (const previous of $('investigation-steps').querySelectorAll(':scope > li > details')) previous.open = false
    const li = document.createElement('li')
    li.innerHTML = `<details open><summary>${escape(step.title)}</summary>
      <p class="inspection-purpose">${prose(step.why)}</p>
      ${step.error ? `<p class="missing">${escape(step.error)}</p>` : ''}
      ${step.evidence.map((e) => materialView(e)).join('')}
      ${['writers', 'entrypoints'].includes(step.tool) && !step.error && !step.evidence.length ? '<p>No results matched these rules. Other call or write forms may still exist.</p>' : ''}
      ${step.note ? `<p class="caption">${escape(step.note)}</p>` : ''}</details>`
    $('investigation-steps').append(li)
    $('investigation-count').textContent = `${$('investigation-steps').children.length} requests`
    $('ai-status').textContent = `Investigating · ${step.title}`
  }
  function showAnswer(record) {
    lastRecord = record
    $('ai-claims').innerHTML = record.answer.claims.map((claim) => `<article class="ai-claim">
      <h3>${prose(claim.text)}</h3>
      ${claim.evidence.map((item) => `<div class="claim-support">
        <p class="support-why"><b>Why:</b> ${prose(item.explanation || 'No explanation supplied.')}</p>
        ${item.issue ? `<p class="missing">${escape(item.issue)}</p>` : ''}
        ${item.material ? materialView(item.material, item.issue ? [] : item.lines) : ''}
      </div>`).join('') || '<p class="missing">The AI did not supply supporting material for this claim.</p>'}
    </article>`).join('')
    $('ai-unknowns').innerHTML = record.answer.unknowns.map((s) => `<li>${prose(s)}</li>`).join('') || '<li>The AI reported no further unknowns within its stated scope.</li>'
    $('ai-record').textContent = `${record.model} · ${(record.elapsedMs / 1000).toFixed(1)} s · ${record.askDir}`
    $('ai-answer').hidden = false
    $('investigation').open = false
    $('ai-status').textContent = 'Answer ready · the explanations below connect each claim to its evidence'
  }
  $('enable-reader').addEventListener('change', show)
  $('question').addEventListener('input', prepare)
  $('cancel-ai').addEventListener('click', () => {
    revision++
    controller?.abort()
    $('ask-ai').disabled = false
    $('cancel-ai').hidden = true
    $('ai-status').textContent = 'Stopped · the partial investigation remains below; there is no final answer.'
  })
  $('ask-ai').addEventListener('click', async () => {
    clearAnswer()
    const requestRevision = revision
    controller = new AbortController()
    $('ask-ai').disabled = true
    $('cancel-ai').hidden = false
    $('investigation').open = true
    $('ai-status').textContent = `${config.provider} is choosing what to inspect…`
    let completed = false
    try {
      const response = await fetch('/api/ask', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ runId: run.runDir.split('/').pop(), question: briefing.question }),
      })
      if (!response.ok) throw new Error((await response.json()).error)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let pending = ''
      while (true) {
        const { value, done } = await reader.read()
        pending += decoder.decode(value, { stream: !done })
        const messages = pending.split('\n'); pending = messages.pop()
        for (const line of messages) {
          if (!line.trim() || revision !== requestRevision) continue
          const event = JSON.parse(line)
          if (event.type === 'inspection') showStep(event.step)
          if (event.type === 'done') { completed = true; showAnswer(event.record) }
          if (event.type === 'error') throw new Error(event.message)
        }
        if (done) break
      }
      if (!completed && revision === requestRevision) throw new Error('The connection ended before an answer was received. The investigation may be incomplete.')
    } catch (error) {
      if (revision !== requestRevision || error.name === 'AbortError') return
      $('ai-error').hidden = false
      $('ai-error').textContent = error.message
      $('ai-status').textContent = 'No final answer accepted. Any completed inspections remain below.'
    } finally {
      if (revision === requestRevision) { $('ask-ai').disabled = false; $('cancel-ai').hidden = true }
    }
  })
  $('download-answer').addEventListener('click', () => {
    if (!lastRecord) return
    const url = URL.createObjectURL(new Blob([JSON.stringify(lastRecord, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'astra-investigation.json'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
  fetch('/api/ai-config').then((r) => { if (!r.ok) throw new Error(); return r.json() }).then((value) => {
    config = value; $('ai-config').textContent = `${config.provider} · ${config.model}`
  }).catch(() => { $('ai-config').textContent = 'Codex CLI · configuration unavailable' })
  return {
    clear() { clearAnswer(); run = undefined; briefing = undefined; $('reader-section').hidden = true },
    update(result) { if (run === result) return; run = result; show() },
  }
}
