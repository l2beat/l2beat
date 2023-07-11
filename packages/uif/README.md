# List of supported cases

1. Subscribing to parents and updating to their height
2. Partial updates @todo
  - batch size 50
  - Effect(update, from=100, to=200) -> Update(from=100, to=150)
  - Effect(update, from=150, to=200) -> Update(from=150, to=200)
3. Self Invalidation @todo
4. Invalidate and inform parent @todo
5. Start routine: Invalidate to Min(...all parents, saved in db)
