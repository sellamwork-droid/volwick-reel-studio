#!/usr/bin/env python3
"""VOLWICK REEL STUDIO · memoria condivisa e controlli.
Solo libreria standard: gira su ogni computer anche senza .venv.

Dalla cartella principale del repository:
  python3 00_MOTORE/tools/studio.py brief                       cosa sapere prima di lavorare (regole recenti, storico, lezioni, hook freschi, motore, coda)
  python3 00_MOTORE/tools/studio.py nuovo V0012 --nome "The Drop 3" --formato F2 --scena 00_MOTORE/scenes/vx_drop3 [--issue 12] [--hook "Ocean Drop.mp4"] [--evento "..."]
  python3 00_MOTORE/tools/studio.py aggiorna V0012 stato=da-rivedere render="04_RENDER/V0012_THE_DROP_3" durata_s=21.4
  python3 00_MOTORE/tools/studio.py aggiorna V0012 feedback="Power: hook troppo lento" lezione="match cut sotto 1,4 s"
  python3 00_MOTORE/tools/studio.py controlla                   controlli prima di ogni push (li ripete anche GitHub a ogni push)
"""
import csv, datetime as dt, json, os, re, socket, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VID = os.path.join(ROOT, 'MEMORIA', 'video')
REG = os.path.join(ROOT, 'REGOLE', 'PREFERENZE_E_FORMATI.md')
CAT = os.path.join(ROOT, '01_HOOK', 'CATALOGO_HOOK.csv')
STATI = ['in-lavorazione', 'da-rivedere', 'da-rifare', 'approvato', 'pubblicato', 'superato']
CHIAVI = ['id', 'nome', 'formato', 'scena', 'stato', 'creato', 'sessione']
ENGINE = ['00_MOTORE/engine', '00_MOTORE/scenes/vx_common', '00_MOTORE/vx', '00_MOTORE/tools']


def now(): return dt.datetime.now().strftime('%Y-%m-%d %H:%M')
def sh(*a):
    try: return subprocess.run(a, cwd=ROOT, capture_output=True, text=True, timeout=20).stdout.strip()
    except Exception: return ''
def path(i): return os.path.join(VID, i + '.json')
def carica():
    out = []
    if os.path.isdir(VID):
        for n in sorted(os.listdir(VID)):
            if n.endswith('.json'):
                with open(os.path.join(VID, n), encoding='utf-8') as f: out.append(json.load(f))
    return sorted(out, key=lambda v: v.get('creato', ''), reverse=True)
def salva(v):
    os.makedirs(VID, exist_ok=True)
    with open(path(v['id']), 'w', encoding='utf-8') as f: json.dump(v, f, ensure_ascii=False, indent=2); f.write('\n')
def hook_di(v):
    h = v.get('hook') or {}
    return h.get('clip', '') if isinstance(h, dict) else str(h)


def brief():
    print('=' * 70); print('VOLWICK REEL STUDIO · brief', now()); print('=' * 70)
    sh('git', 'fetch', '-q'); st = sh('git', 'status', '-sb').splitlines()
    if st and 'behind' in st[0]: print('\n!! Il tuo repository è indietro: fai `git pull --rebase` prima di lavorare.  ', st[0])
    # 1. regole recenti
    print('\n1. REGOLE PIÙ RECENTI (la più recente vince; il file completo va letto comunque)')
    try:
        txt = open(REG, encoding='utf-8').read().split('## Registro delle nuove indicazioni', 1)[1]
        righe = [r for r in txt.splitlines() if r.startswith('- ')][:12]
        for r in righe: print('  ' + (r if len(r) < 260 else r[:257] + '...'))
    except Exception as e: print('  (registro non leggibile:', e, ')')
    V = carica()
    # 2. storico
    print(f'\n2. STORICO VIDEO ({len(V)})')
    for v in V[:15]:
        fb = (v.get('feedback') or [{}])[-1].get('testo', '')
        print(f"  {v['id']:<12} {v.get('stato',''):<14} {v.get('formato',''):<4} {v.get('nome','')[:34]:<34} hook: {hook_di(v)[:28] or '-'}")
        if fb: print(f"  {'':<12} ultimo feedback: {fb[:150]}")
    # 3. lezioni
    print('\n3. LEZIONI (da applicare ai prossimi video)')
    L = [(v['id'], l) for v in V for l in v.get('lezioni', [])]
    for i, l in L[:20]: print(f'  [{i}] {l}')
    if not L: print('  nessuna')
    # 4. hook
    print('\n4. HOOK')
    usi = {}
    for v in V:
        if v.get('stato') != 'superato' and hook_di(v): usi[hook_di(v)] = usi.get(hook_di(v), []) + [v['id']]
    try:
        rows = list(csv.DictReader(open(CAT, encoding='utf-8')))
        buoni = [r for r in rows if not re.match(r'(escluso|non usare|debole|file mancante)', (r.get('stato') or '').strip())]
        freschi = [r for r in buoni if r['file'] not in usi]
        print('  Freschi (utilizzabili e mai usati):')
        for r in freschi: print(f"    {r['file']:<44} {r.get('movimento',''):<15} {r.get('evento_mercato','')[:60]}")
        print('  Già usati (riusare solo con un taglio diverso):')
        for k, ids in usi.items(): print(f'    {k:<44} {", ".join(ids)}')
    except Exception as e: print('  (catalogo non leggibile:', e, ')')
    # 5. motore
    print('\n5. ULTIME MODIFICHE AL MOTORE COMUNE')
    log = sh('git', 'log', '-8', '--date=format:%d/%m %H:%M', '--format=  %ad  %s', '--', *ENGINE)
    print(log or '  nessuna')
    # 6. coda
    print('\n6. CODA (Issues)')
    for lab in ('da-fare', 'in-lavorazione', 'da-rivedere'):
        out = sh('gh', 'api', f'repos/{{owner}}/{{repo}}/issues?state=open&labels={lab}&per_page=30', '--jq', '.[] | "#\\(.number) \\(.title)"')
        print(f'  {lab}: ' + (', '.join(out.splitlines()) if out else '-'))
    print('\nPrima di consegnare: `python3 00_MOTORE/tools/studio.py controlla`.')


def nuovo(a):
    i = a[0]; o = {k: None for k in ('nome', 'formato', 'scena', 'issue', 'hook', 'evento')}
    for k in o:
        if '--' + k in a: o[k] = a[a.index('--' + k) + 1]
    if os.path.exists(path(i)): sys.exit(f'{i} esiste già: usa `aggiorna`.')
    v = {'id': i, 'issue': int(o['issue']) if o['issue'] else None, 'nome': o['nome'] or i, 'formato': o['formato'] or '',
         'scena': o['scena'] or '', 'hook': {'clip': o['hook']} if o['hook'] else None, 'evento': o['evento'] or '',
         'layer': [], 'titoli': [], 'durata_s': None, 'render': '', 'stato': 'in-lavorazione', 'creato': now(),
         'sessione': os.environ.get('VW_SESSIONE') or socket.gethostname(), 'feedback': [], 'lezioni': [], 'pubblicazioni': []}
    salva(v); print('creato', os.path.relpath(path(i), ROOT))


def aggiorna(a):
    i = a[0]
    if not os.path.exists(path(i)): sys.exit(f'{i} non esiste: usa `nuovo`.')
    v = json.load(open(path(i), encoding='utf-8'))
    for kv in a[1:]:
        k, _, val = kv.partition('=')
        if k == 'feedback': v.setdefault('feedback', []).append({'data': now(), 'testo': val})
        elif k == 'lezione': v.setdefault('lezioni', []).append(val)
        elif k == 'stato':
            if val not in STATI: sys.exit(f'stato non valido: {val} (ammessi: {", ".join(STATI)})')
            v['stato'] = val
        elif k in ('layer', 'titoli'): v[k] = [x.strip() for x in val.split('|') if x.strip()]
        elif k == 'durata_s': v[k] = float(val)
        elif k == 'hook': v[k] = {'clip': val}
        else: v[k] = val
    v['aggiornato'] = now(); salva(v); print('aggiornato', i)


SEGRETI = re.compile(r'(sk-ant-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|xox[bp]-[A-Za-z0-9-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY)')
VIETATE = [(re.compile(r'dark\s*pool', re.I), 'Block Prints mai chiamati dark pool'),
           (re.compile(r"['\"](GUIDE|MARKET INTELLIGENCE|ES LEVELS)['\"]"), 'riga dei layer: niente GUIDE, MARKET INTELLIGENCE, ES LEVELS'),
           (re.compile(r'\b(guaranteed|sure profit|get rich)\b', re.I), 'nessuna promessa di guadagno')]


def controlla():
    err, warn = [], []
    files = sh('git', 'ls-files').splitlines() or [os.path.relpath(os.path.join(d, n), ROOT) for d, _, fs in os.walk(ROOT) for n in fs if '.git' not in d]
    for f in files:
        p = os.path.join(ROOT, f)
        if not os.path.isfile(p): continue
        if os.path.getsize(p) > 50e6: err.append(f'{f}: più di 50 MB, non va nel repository')
        if f.lower().endswith(('.mp4', '.mov', '.wav', '.mp3')) and not f.startswith('01_HOOK/clip/'):
            err.append(f'{f}: i render e gli audio vanno nella cartella condivisa dei render, non nel repository')
        if f.endswith(('.py', '.js', '.md', '.json', '.sh', '.command', '.txt', '.csv', '.html', '.yml')):
            t = open(p, encoding='utf-8', errors='ignore').read()
            if SEGRETI.search(t): err.append(f'{f}: sembra contenere una chiave o un token. Toglilo subito.')
    V = carica(); ids = set()
    for v in V:
        for k in CHIAVI:
            if not v.get(k): err.append(f"MEMORIA/video/{v.get('id')}.json: manca '{k}'")
        if v.get('stato') not in STATI: err.append(f"{v.get('id')}: stato '{v.get('stato')}' non valido")
        if v['id'] in ids: err.append(f"{v['id']}: id doppio")
        ids.add(v['id'])
        sc = os.path.join(ROOT, v.get('scena') or '')
        if v.get('scena') and not os.path.isdir(sc): warn.append(f"{v['id']}: la cartella di scena {v['scena']} non è nel repository")
        js = os.path.join(sc, 'scene.js')
        if v.get('stato') in ('in-lavorazione', 'da-rivedere', 'da-rifare') and os.path.isfile(js):
            t = open(js, encoding='utf-8', errors='ignore').read()
            for rx, regola in VIETATE:
                if rx.search(t): (warn if v['stato'] == 'da-rifare' else err).append(f"{v['id']} ({v['scena']}/scene.js): {regola}")
            if 'logoForm' not in t and 'VX.end' not in t: warn.append(f"{v['id']}: non trovo il finale approvato (VX.end / VW.logoForm) in scene.js")
    for w in warn: print('ATTENZIONE', w)
    for e in err: print('ERRORE    ', e)
    print(f'controlli: {len(err)} errori, {len(warn)} avvisi')
    sys.exit(1 if err else 0)


if __name__ == '__main__':
    c = sys.argv[1] if len(sys.argv) > 1 else 'brief'
    {'brief': lambda: brief(), 'nuovo': lambda: nuovo(sys.argv[2:]), 'aggiorna': lambda: aggiorna(sys.argv[2:]),
     'controlla': lambda: controlla()}.get(c, lambda: print(__doc__))()
