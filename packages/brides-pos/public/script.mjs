const root = document.getElementById('root')
const MAX_MESSAGES = 50
const messages = []

render()
connect(onMessage)

function onMessage(message) {
  messages.unshift(message)
  if (messages.length > MAX_MESSAGES) {
    messages.pop()
  }
  render()
}

function render() {
  root.innerHTML = renderMessages(messages)
}

function renderMessages(messages) {
  return `
<table>
  <thead>
    <tr>
      <th>Timestamp</th>
      <th>Protocol</th>
      <th>Source</th>
      <th>Destination</th>
      <th>Token</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    ${messages.map(renderMessage).join('')}
  </tbody>
</table>
  `
}

function renderMessage(message) {
  return `
<tr>
  <td>${message.timestamp.slice(11, -5)}</td>
  <td>${message.protocol}</td>
  <td>${message.source}</td>
  <td>${message.destination}</td>
  <td>${message.token}</td>
  <td>${message.amount}</td>
</tr>
  `
}

async function connect(onMessage) {
  const response = await fetch('/stream', {
    headers: {
      Accept: 'text/event-stream',
    },
  })

  if (!response.ok) {
    throw Error(response.statusText())
  }

  const reader = response.body.getReader()
  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }

    const chunk = new TextDecoder().decode(value)
    const messages = chunk.split('\n\n')
    for (const message of messages) {
      if (message === '') {
        continue
      }
      onMessage(JSON.parse(message))
    }
  }
}
