# list@1: collect `args[key]` from every matching log, in order, with repeats.
#
# Unlike set@1 nothing is deduplicated or sorted: for append-only history the
# position and the repetition of a value are the information.

def arg($log; $name):
  if ($log.args | has($name)) then $log.args[$name]
  else error("event \($log.event) has no argument \"\($name)\"") end;

def whenHolds($when; $log):
  if $when == null then true
  else (($when.equals == arg($log; $when.arg)) != ($when.negate // false)) end;

def matches($rules; $log):
  any($rules[]; .event == $log.event and whenHolds(.when; $log));

. as { input: $logs, args: $args }
| [ $logs[] | select(matches($args.add; .)) | arg(.; $args.key) ]
