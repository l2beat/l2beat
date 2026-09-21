# latest@1: the last written value, overall or per group key.
#
# Later logs overwrite earlier ones, which is exactly the fold V1's `set`
# event handler performs; `groupBy` turns it into one fold per key.

def arg($log; $name):
  if ($log.args | has($name)) then $log.args[$name]
  else error("event \($log.event) has no argument \"\($name)\"") end;

def whenHolds($when; $log):
  if $when == null then true
  else (($when.equals == arg($log; $when.arg)) != ($when.negate // false)) end;

def matches($rules; $log):
  any($rules[]; .event == $log.event and whenHolds(.when; $log));

# Object keys must be strings; tuples become "a,b" so a struct key reads the
# same way here as in map@1.
def keyString:
  if type == "string" then .
  elif type == "array" then map(keyString) | join(",")
  else tojson end;

. as { input: $logs, args: $args }
| [ $logs[] | select(matches($args.set; .)) ] as $writes
| if $args.groupBy == null then
    ($writes | last) as $log
    | if $log == null then null else arg($log; $args.value) end
  else
    reduce $writes[] as $log ({};
      .[arg($log; $args.groupBy) | keyString] = arg($log; $args.value))
  end
