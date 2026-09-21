# format.seconds@1: seconds into V1's `1d 1h` style.
#
# Reproduces @l2beat/shared-pure formatSeconds without options: units of
# 365-day years and 30-day months, and only the two most significant
# non-zero units are shown ("rounding up" in V1's tests). V1 caps values it
# cannot hold in a double with "more than ..."; the same cap applies here
# because jq arithmetic is double-based too.

def units: [["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60], ["s", 1]];

def maxSafe: 9007199254740991;

def toSeconds:
  if type == "number" then .
  elif type == "string" then
    . as $text
    | (try tonumber catch error("format.seconds@1 expects a number or numeric string, got \($text | tojson)"))
  else error("format.seconds@1 expects a number or numeric string, got \(type)") end;

# Non-zero unit counts with their unit index, most significant first.
def parts:
  . as $total
  | reduce range(0; units | length) as $i ({ remaining: $total, parts: [] };
      units[$i] as [$unit, $size]
      | ((.remaining / $size) | floor) as $count
      | .remaining -= $count * $size
      | if $count > 0 then .parts += [{ index: $i, text: "\($count)\($unit)" }] else . end)
  | .parts;

def formatMagnitude:
  parts as $nonZero
  | if ($nonZero | length) == 0 then "0s"
    else $nonZero[0].index as $top
      | [ $nonZero[] | select(.index <= $top + 1) | .text ] | join(" ")
    end;

def format:
  trunc
  | if fabs > maxSafe then "more than \(maxSafe | formatMagnitude)"
    elif . < 0 then "-\(-. | formatMagnitude)"
    else formatMagnitude end;

.input | toSeconds | format
