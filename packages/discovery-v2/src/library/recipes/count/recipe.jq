# count@1: number of logs of the listed events, optionally filtered.

def arg($log; $name):
  if ($log.args | has($name)) then $log.args[$name]
  else error("event \($log.event) has no argument \"\($name)\"") end;

def whenHolds($when; $log):
  if $when == null then true
  else (($when.equals == arg($log; $when.arg)) != ($when.negate // false)) end;

. as { input: $logs, args: $args }
| [ $logs[] | select((.event | IN($args.events[])) and whenHolds($args.when; .)) ]
| length
