# set@1: replay add/remove rules over logs into a sorted, unique set.
#
# A member is inserted when a log matches any `add` rule and deleted when a
# log matches any `remove` rule. A log matching both is an authoring error,
# as in V1's EventHandler: silently picking one would hide an ambiguous plan.

def arg($log; $name):
  if ($log.args | has($name)) then $log.args[$name]
  else error("event \($log.event) has no argument \"\($name)\"") end;

# `negate` flips the comparison so one event can drive both add and remove.
def whenHolds($when; $log):
  if $when == null then true
  else (($when.equals == arg($log; $when.arg)) != ($when.negate // false)) end;

def matches($rules; $log):
  any($rules[]; .event == $log.event and whenHolds(.when; $log));

# jq's own sort orders by type first, which is canonical only when every
# member has the same type; a mixed set is ordered by its JSON text instead.
def canonical:
  if (map(type) | unique | length) > 1 then unique_by(tojson) else unique end;

. as { input: $logs, args: $args }
| reduce $logs[] as $log ([];
    matches($args.add; $log) as $add
    | matches($args.remove // []; $log) as $remove
    | if $add and $remove then
        error("log \($log.event) at block \($log.blockNumber) index \($log.logIndex) matches both an add and a remove rule; make the rules mutually exclusive")
      elif $add then . + [arg($log; $args.key)]
      elif $remove then arg($log; $args.key) as $gone | map(select(. != $gone))
      else . end)
| canonical
