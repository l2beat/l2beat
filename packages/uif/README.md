# List of supported cases

1. Subscribing to parents and updating to their height
2. Partial updates
   - batch size 50
   - Effect(update, from=100, to=200) -> Update(from=100, to=150)
   - Effect(update, from=150, to=200) -> Update(from=150, to=200)
3. Self Invalidation
4. Invalidate and inform parent @todo
5. Start routine: Invalidate to Min(...all parents, saved in db)

## Start sequence

1. Constructor
   - Subscribe to parents
   - state: init
2. Start
   - wait for height from database
   - wait for all parents to callback with their height
   - set height to min(...all parents, your height)
   - callback all children with your height
   - invalidate to height
   - state: invalidating
   - effect: update height
   - effect: invalidate to height
