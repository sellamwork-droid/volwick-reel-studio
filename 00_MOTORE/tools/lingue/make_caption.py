"""Post caption generated from the exact spoken script (single source of truth), shown as the viewer must read it.
usage: python3 make_caption.py <lang> <caption.txt> [outdir]"""
import sys, json, vw_text as T
lang, dst = sys.argv[1], sys.argv[2]
GL, L, S = T.load(lang)
if len(sys.argv) > 3: L = json.load(open(f'{sys.argv[3]}/lang.json'))
J = '' if lang == 'ja' else ' '
d = lambda p: T.display_text(lang, L, S[p])
brand = d('brand')
brand = brand[:-1] + L['cta'] if L.get('ctaMode', 'replace') == 'replace' else brand + J + L['cta']
open(dst, 'w').write('\n\n'.join([d('hook'), d('l1') + J + d('l2'), brand, L['disc'], L['tags']]) + '\n')
