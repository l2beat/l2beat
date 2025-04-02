import type { FieldDiff, ProjectDiff } from './diff'

export function diffsToHtml(props: {
  diffs: ProjectDiff[]
  commitBefore: string
  commitAfter: string
}) {
  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Diff</title>
</head>

<body>
  <h1>Diff between ${props.commitBefore.slice(0, 8)} and ${props.commitAfter.slice(0, 8)}</h1>
  <ul>${props.diffs.map(diffToHtml)}</ul>
</body>

</html>`
}

function diffToHtml(diff: ProjectDiff) {
  return `<li>
  <h2>Project: ${diff.id} - ${diff.type}</h2>
  <ul>${diff.fields.map(fieldDiffToHtml)}</ul>
</li>`
}

function fieldDiffToHtml(field: FieldDiff) {
  return `<li>
  <h3>${field.field}</h3>
  <h4>Before:</h4>
  <pre><code>${field.before ?? '-'}</code></pre>
  <h4>After:</h4>
  <pre><code>${field.after ?? '-'}</code></pre>
</li>`
}
