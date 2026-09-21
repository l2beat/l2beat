# map@1: callEach pairs into { keyString: value }.
#
# JSON object keys must be strings, so scalars use their JSON text and tuple
# keys are joined with "," (`committeeThresholds(1, 0)` reads as "1,0").

def keyString:
  if type == "string" then .
  elif type == "array" then map(keyString) | join(",")
  else tojson end;

def pair($p):
  if ($p | type) == "object" and ($p | has("key")) and ($p | has("value")) then $p
  else error("map@1 expects [{ key, value }] pairs from a callEach fetch, got \($p | tojson)") end;

. as { input: $pairs }
| reduce $pairs[] as $p ({}; pair($p) as $pair | .[$pair.key | keyString] = $pair.value)
