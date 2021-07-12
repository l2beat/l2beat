import { plot } from './plot'

fetch('/api/tvl.json')
  .then((res) => res.json())
  .then(plot)
