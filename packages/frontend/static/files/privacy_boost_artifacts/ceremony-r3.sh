#!/usr/bin/env bash
# Checks the Privacy Boost round-three Groth16 setup (prod-ceremony-2026-03) end to end:
# archive, manifest and bundle digests against the round record, `ceremony verify-public`
# (every phase 2 contribution, the phase 1 link, key re-derivation), then each finalized
# verifying key against the SSTORE2 key data the Base verifiers read.
#
# usage: ceremony-r3.sh <workdir> [fetch|build|verify|summary|onchain|all]
# needs docker, git, curl, tar, jq, sha256sum, realpath, cast (foundry), python3, ~10 GB disk.
# Untrusted code runs only in containers.
# onchain reads BASE_RPC_URL from the environment and never prints it.
set -euo pipefail

W=$(mkdir -p "$1" && realpath "$1")
STEP=${2:-all}
GO_IMAGE=golang:1.25.13-bookworm
CEREMONY_REPO=https://github.com/sunnyside-io/privacy-boost-ceremony.git
CEREMONY_COMMIT=e1e5a01d9bc4ce5b0917d6302aa4d294b6539894 # round record 2026-03 with download links
HOST=https://file.ceremony.privacyboost.io
# rounds/2026-03.md at CEREMONY_COMMIT
PUBLIC_SHA=d584146c8549d0e6544a1b442ed4df19ceb79538422ed178210a7405d4347356
KEYS_SHA=3dfe30e5e3a5b252db0a2381bad0c28ce3e6059b0c82d98fa87f543300a3bd19
MANIFEST_SHA=626faf002bf5448fce6bbb3d808ccf71d06eeaa5bddc04775fa675f8932810cf
ROOT_SHA=d7fc87f8f34ad0cd7514384c39813360bf42236da5c860175a9a7ba574f34af1
SNAPSHOT_SHA=8696316b7509ec6f0d39aee00e9f1f2ef6208986570f399fb3a825b63862bf15
UIDGID="$(id -u):$(id -g)"
export PATH="$HOME/.foundry/bin:$PATH"

fetch() {
  if [ ! -d "$W/repo/.git" ]; then
    git init -q "$W/repo"
    git -C "$W/repo" remote add origin "$CEREMONY_REPO"
  fi
  git -C "$W/repo" fetch -q --depth 1 origin "$CEREMONY_COMMIT"
  git -C "$W/repo" checkout -q "$CEREMONY_COMMIT"
  get public "$PUBLIC_SHA"
  get keys "$KEYS_SHA"
  if [ ! -f "$W/bundle/public/manifest.json" ]; then
    mkdir -p "$W/bundle" && tar xzf "$W/dl-public/prod-20260923-public.tar.gz" -C "$W/bundle" --no-same-owner
  fi
  if [ ! -d "$W/keys/keys" ]; then
    mkdir -p "$W/keys" && tar xzf "$W/dl-keys/prod-20260923-keys.tar.gz" -C "$W/keys" --no-same-owner
  fi
  check "manifest.json" "$(sha256sum "$W/bundle/public/manifest.json" | cut -d' ' -f1)" "$MANIFEST_SHA"
  check "config.snapshot.json" "$(sha256sum "$W/bundle/public/config.snapshot.json" | cut -d' ' -f1)" "$SNAPSHOT_SHA"
  check "manifest bundleRootSha256" "$(jq -r .bundleRootSha256 "$W/bundle/public/manifest.json")" "$ROOT_SHA"
  jq -r '"manifest: \(.circuits|length) circuits, \(.participants|length) participants, \(.totalContributions) contributions"' \
    "$W/bundle/public/manifest.json"
}

get() { # get <public|keys> <sha256>
  local f="$W/dl-$1/prod-20260923-$1.tar.gz"
  mkdir -p "$W/dl-$1"
  [ -f "$f" ] || curl -sSfL -o "$f" "$HOST/prod-20260923-$1.tar.gz"
  check "$(basename "$f")" "$(sha256sum "$f" | cut -d' ' -f1)" "$2"
}

check() { # check <label> <got> <want>
  if [ "$2" = "$3" ]; then echo "ok   $1 $2"; else echo "FAIL $1 got $2 want $3"; exit 1; fi
}

build() {
  mkdir -p "$W/build/gomod" "$W/build/gocache" "$W/build/bin" "$W/build/vkdump"
  # the ceremony tool, as PUBLIC_VERIFICATION.md builds it
  docker run --rm --memory=4g --cpus=8 --user "$UIDGID" \
    -v "$W/repo:/src:ro" -v "$W/build/gomod:/gomod" -v "$W/build/gocache:/gocache" -v "$W/build/bin:/out" \
    -e GOMODCACHE=/gomod -e GOCACHE=/gocache -e GOFLAGS=-mod=readonly -w /src "$GO_IMAGE" \
    sh -c 'go build -trimpath -o /out/ceremony ./cmd/ceremony && go version -m /out/ceremony | grep -E "gnark|privacy-boost-protocol|vcs.revision"'
  # vkdump: encodes a gnark .vk into the verifier's SSTORE2 layout
  # constants = alpha.x alpha.y, then -beta -gamma -delta each as x1 x0 y1 y0; icx/icy = K[i].x / K[i].y
  cat > "$W/build/vkdump/main.go" <<'GO'
package main

import (
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"

	"github.com/consensys/gnark-crypto/ecc/bn254"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	groth16bn254 "github.com/consensys/gnark/backend/groth16/bn254"
)

func word(b *strings.Builder, e fp.Element) {
	x := e.Bytes()
	b.WriteString(hex.EncodeToString(x[:]))
}

func g2neg(b *strings.Builder, p bn254.G2Affine) {
	var n bn254.G2Affine
	n.Neg(&p)
	word(b, n.X.A1)
	word(b, n.X.A0)
	word(b, n.Y.A1)
	word(b, n.Y.A0)
}

func main() {
	enc := json.NewEncoder(os.Stdout)
	for _, path := range os.Args[1:] {
		f, err := os.Open(path)
		if err != nil {
			panic(err)
		}
		var vk groth16bn254.VerifyingKey
		if _, err := vk.ReadFrom(f); err != nil {
			panic(err)
		}
		f.Close()
		var c, x, y strings.Builder
		word(&c, vk.G1.Alpha.X)
		word(&c, vk.G1.Alpha.Y)
		g2neg(&c, vk.G2.Beta)
		g2neg(&c, vk.G2.Gamma)
		g2neg(&c, vk.G2.Delta)
		for _, k := range vk.G1.K {
			word(&x, k.X)
			word(&y, k.Y)
		}
		enc.Encode(map[string]any{
			"id": strings.TrimSuffix(filepath.Base(path), ".vk"), "icLen": len(vk.G1.K),
			"commitmentKeys": len(vk.CommitmentKeys), "constants": c.String(), "icx": x.String(), "icy": y.String(),
		})
	}
}
GO
  docker run --rm --memory=4g --cpus=8 --user "$UIDGID" \
    -v "$W/build/vkdump:/src" -v "$W/build/gomod:/gomod" -v "$W/build/gocache:/gocache" -v "$W/build/bin:/out" \
    -e GOMODCACHE=/gomod -e GOCACHE=/gocache -e HOME=/gocache -w /src "$GO_IMAGE" \
    sh -c '[ -f go.mod ] || go mod init vkdump >/dev/null 2>&1; go get github.com/consensys/gnark@v0.16.3 github.com/consensys/gnark-crypto@v0.21.0 >/dev/null 2>&1 && go mod tidy >/dev/null 2>&1 && go build -o /out/vkdump . && echo "ok   vkdump built"'
}

verify() {
  mkdir -p "$W/vcache/tmp" "$W/logs"
  : > "$W/logs/verify-public.log"
  : > "$W/logs/verify-mem.log"
  # 9 GB hard limit, swap off, 8 CPUs. Bundle read-only. Network only for the phase 1 ptau fetch.
  # A sampler logs the cgroup's anon and file memory in KiB every 2 s for per-circuit peaks.
  set +e
  docker run --rm --name pb-r3-verify --memory=9g --memory-swap=9g --cpus=8 --user "$UIDGID" \
    -v "$W/bundle:/bundle:ro" -v "$W/build/bin:/opt/ceremony:ro" -v "$W/vcache:/vcache" -v "$W/logs:/logs" \
    -e TMPDIR=/vcache/tmp -e HOME=/vcache "$GO_IMAGE" bash -c '
      (while sleep 2; do echo "$(date -u +%FT%TZ) $(awk "/^anon /{a=\$2} /^file /{f=\$2} END{print int(a/1024), int(f/1024)}" /sys/fs/cgroup/memory.stat)"; done) >> /logs/verify-mem.log &
      /opt/ceremony/ceremony verify-public --bundle-dir /bundle/public 2>&1 \
        | while IFS= read -r l; do printf "%s %s\n" "$(date -u +%FT%TZ)" "$l"; done | tee -a /logs/verify-public.log
      rc=${PIPESTATUS[0]}
      echo "$(date -u +%FT%TZ) exit=$rc memory.peak=$(cat /sys/fs/cgroup/memory.peak) $(tr "\n" " " < /sys/fs/cgroup/memory.events)" | tee -a /logs/verify-public.log
      exit $rc'
  local rc=$?
  set -e
  summary
  return $rc
}

summary() { # per-circuit wall time and peak anonymous memory from the two logs
  python3 -I - "$W/logs/verify-public.log" "$W/logs/verify-mem.log" <<'PY'
import re, sys
from datetime import datetime
ts = lambda s: datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ')
log = [l.rstrip('\n').split(' ', 1) for l in open(sys.argv[1]) if ' ' in l]
mem = [(ts(a), int(b), int(c)) for a, b, c in (l.split() for l in open(sys.argv[2]) if len(l.split()) == 3)]
marks = [(ts(t), m) for t, m in log]
def peak(a, b):
    return max([m[1] for m in mem if a <= m[0] <= b] or [0])
start, spans, cur = marks[0][0] if marks else None, [], None
for t, m in marks:
    s = re.search(r'\[keys\] circuit_start id=(\S+)', m)
    if s:
        if cur: spans.append(cur + (t, 'unfinished'))
        cur = (s.group(1), t)
    if cur and re.search(r'\[keys\] circuit_ok id=' + re.escape(cur[0]) + r'\b', m):
        spans.append(cur + (t, 'ok')); cur = None
if cur: spans.append(cur + (max([marks[-1][0]] + [m[0] for m in mem[-1:]]), 'running or stopped'))
first = spans[0][1] if spans else (marks[-1][0] if marks else None)
if marks:
    print(f'integrity  {(first - start).total_seconds()/60:7.1f} min  peak anon {peak(start, first)/1048576:5.2f} GiB')
for cid, a, b, st in spans:
    print(f'{cid:9s}  {(b - a).total_seconds()/60:7.1f} min  peak anon {peak(a, b)/1048576:5.2f} GiB  {st}')
if marks:
    print(f'total      {(marks[-1][0] - start).total_seconds()/3600:7.2f} h    {marks[-1][1]}')
PY
}

onchain() {
  : "${BASE_RPC_URL:?set BASE_RPC_URL to a Base RPC endpoint}"
  # the finalized keys: archive copy and bundle copy, each against the manifest commitment
  python3 -I - "$W" <<'PY'
import hashlib, json, sys
w = sys.argv[1]
m = json.load(open(f'{w}/bundle/public/manifest.json'))
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
bad = 0
for c in m['circuits']:
    i = c['circuitId']
    for kind in ('vk', 'pk'):
        want = c[kind + 'Sha256']
        for p in (f'{w}/keys/keys/{i}.{kind}', f'{w}/bundle/public/{c[kind + "Path"]}'):
            if sha(p) != want:
                bad += 1; print('FAIL', p)
print(f'{"ok  " if not bad else "FAIL"} keys archive and bundle keys match the manifest for {len(m["circuits"])} circuits')
sys.exit(1 if bad else 0)
PY
  docker run --rm --memory=1g --network=none --user "$UIDGID" -v "$W/keys/keys:/keys:ro" -v "$W/build/bin:/opt/b:ro" \
    "$GO_IMAGE" sh -c '/opt/b/vkdump /keys/*.vk' > "$W/logs/vkdump.jsonl"
  BASE_RPC_URL="$BASE_RPC_URL" python3 -I - "$W" <<'PY'
import json, os, subprocess, sys, urllib.request
w = sys.argv[1]
URL = os.environ['BASE_RPC_URL']
EPOCH = '0xB144eb785E2CCe17681395Cd475093C01AEeb11e'
FORCED = '0x40e93d3357A5A3d249437717Da936f6141ba85cE'
GIFT = '0x8f394a08A7544daf39aF38FEA5B2E348180bDC05'
POOL = '0x71A0fD3C76E3E937d8275A3cb6a467b70123bD40'
# storage: 0 owner, 1 pendingOwner, 2 vkRegistry, 3 supportedParams, 4 isSupported, 5 epochVkRegistry
# VKPointers: +0 icxSources[], +1 icySources[], +2 vkConstants, +3 icLen

def rpc(method, params):
    body = json.dumps({'jsonrpc': '2.0', 'id': 1, 'method': method, 'params': params}).encode()
    req = urllib.request.Request(URL, data=body, headers={'content-type': 'application/json', 'user-agent': 'curl/8'})
    res = json.loads(urllib.request.urlopen(req, timeout=60).read())
    if 'error' in res:
        raise RuntimeError(res['error'])
    return res['result']

def keccak(hexdata):
    return int(subprocess.run(['cast', 'keccak', '0x' + hexdata], capture_output=True, text=True, check=True).stdout.strip(), 16)

w32 = lambda n: format(n, '064x')
block = hex(int(rpc('eth_getBlockByNumber', ['finalized', False])['number'], 16))
sload = lambda a, s: int(rpc('eth_getStorageAt', [a, hex(s), block]), 16)
code = lambda a: rpc('eth_getCode', [a, block])[2:]
mapslot = lambda key, slot: keccak(w32(key) + w32(slot))

def call(a, sig, *args):
    data = subprocess.run(['cast', 'calldata', sig, *map(str, args)], capture_output=True, text=True, check=True).stdout.strip()
    r = rpc('eth_call', [{'to': a, 'data': data}, block])[2:]
    return int(r[:64], 16), '0x' + r[64 + 24:128]

def sstore2(addrs):
    out = ''
    for a in addrs:
        if a == 0:
            continue
        c = code('0x' + format(a, '040x'))
        assert c[:2] == '00', 'not an SSTORE2 contract'
        out += c[2:]
    return out

def read_vk(verifier, base, getter):
    arr = lambda s: [sload(verifier, keccak(w32(s)) + i) for i in range(sload(verifier, s))]
    icx, icy = arr(base), arr(base + 1)
    consts = sload(verifier, base + 2)
    iclen = sload(verifier, base + 3)
    g_iclen, g_consts = getter
    assert (g_iclen, int(g_consts, 16)) == (iclen, consts), 'slot math disagrees with the getter'
    return iclen, code('0x' + format(consts, '040x'))[2:], sstore2(icx), sstore2(icy)

vks = {j['id']: j for j in map(json.loads, open(f'{w}/logs/vkdump.jsonl'))}
circuits = json.load(open(f'{w}/bundle/public/manifest.json'))['circuits']
specs = {c['circuitId']: json.loads(c['circuitSpecJson']) for c in circuits}
vksha = {c['circuitId']: c['vkSha256'] for c in circuits}
print(f'Base finalized block {int(block, 16)}')
for getter, want in (('epochVerifier()', EPOCH), ('forcedVerifier()', FORCED), ('giftClaimVerifier()', GIFT)):
    got = call(POOL, getter)[0]
    assert got == int(want, 16), f'pool {getter} is not {want}'
    print(f'ok   pool {getter} = {want}')
bad = 0
for cid, s in specs.items():
    if s['type'] == 'epoch':
        t, i, o = s['batchSize'], s['maxInputsPerTransfer'], s['maxOutputsPerTransfer']
        v, base = EPOCH, mapslot(o, mapslot(i, mapslot(t, 5)))
        g = call(v, 'getEpochVKInfo(uint32,uint32,uint32)', t, i, o)
        where = f'epoch({t},{i},{o})'
    else:
        p = s['maxInputs'] if s['type'] == 'forced' else s['batchSize']
        v = FORCED if s['type'] == 'forced' else GIFT
        base, g = mapslot(p, 2), call(v, 'getVKInfo(uint32)', p)
        where = f'{s["type"]}({p})'
    iclen, consts, icx, icy = read_vk(v, base, g)
    k = vks[cid]
    ok = (k['commitmentKeys'] == 0 and k['icLen'] == iclen and k['constants'] == consts
          and k['icx'] == icx[:64 * iclen] and k['icy'] == icy[:64 * iclen] and len(icx) == len(icy) == 64 * iclen)
    bad += not ok
    print(f'{"ok  " if ok else "FAIL"} {cid:5s} {where:16s} {v[:6]}… icLen {iclen:3d} vk {vksha[cid][:8]}… '
          f'constants and IC {"match" if ok else "differ"}')
sys.exit(1 if bad else 0)
PY
}

case "$STEP" in
  fetch) fetch ;;
  build) build ;;
  verify) verify ;;
  summary) summary ;;
  onchain) onchain ;;
  # one command per step: set -e does not reach into functions run inside an && list
  all)
    fetch
    build
    verify
    onchain
    ;;
  *) echo "unknown step $STEP" >&2; exit 2 ;;
esac
