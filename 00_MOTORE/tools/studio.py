#!/usr/bin/env python3
"""VOLWICK REEL STUDIO · memoria condivisa e controlli.
Solo libreria standard: gira su ogni computer anche senza .venv.

Dalla cartella principale del repository:
  python3 00_MOTORE/tools/studio.py brief                       cosa sapere prima di lavorare (regole recenti, storico, lezioni, hook freschi, motore, coda)
  python3 00_MOTORE/tools/studio.py nuovo V0012 --nome "The Drop 3" --formato T4 --scena 00_MOTORE/scenes/vx_drop3 [--issue 12] [--hook "Ocean Drop.mp4"] [--evento "..."]
  python3 00_MOTORE/tools/studio.py aggiorna V0012 stato=da-rivedere render="04_RENDER/V0012_THE_DROP_3" durata_s=21.4
  python3 00_MOTORE/tools/studio.py aggiorna V0012 feedback="Power: hook troppo lento" lezione="match cut sotto 1,4 s"
  python3 00_MOTORE/tools/studio.py controlla                   controlli prima di ogni push (li ripete anche GitHub a ogni push)
Lavoro in contemporanea (più account, più chat, più computer):
  python3 00_MOTORE/tools/studio.py presenza "cosa sto facendo" [--video V0012] [--chi "account B · chat 2 · cloud"]
                                                                 dice a tutti chi sei e cosa stai facendo; pull, commit e push da solo. --chi si dà la prima volta
  python3 00_MOTORE/tools/studio.py chi                         chi sta lavorando adesso e su cosa (attivo = segnale negli ultimi 45 minuti)
  python3 00_MOTORE/tools/studio.py sync ["messaggio"]          git pull --rebase, commit di MEMORIA, REGOLE, 01_HOOK, 02_AUDIO, 06_DOCS, 07_RIFERIMENTI e push
  python3 00_MOTORE/tools/studio.py fine                        chiude la tua sessione (la vedono tutti come chiusa)
Google Drive (cartella condivisa "VOLWICK REEL STUDIO", sincronizzata da Google Drive per desktop):
  python3 00_MOTORE/tools/studio.py drive ["/percorso/VOLWICK REEL STUDIO"]   trova o imposta la cartella e crea la struttura (una volta per computer)
  python3 00_MOTORE/tools/studio.py arrivi                      prende quello che è stato caricato in 00_CARICA_QUI (video hook, musica, video consigliati per categoria) e lo cataloga
  python3 00_MOTORE/tools/studio.py consegna V0012 <cartella con mp4 e CAPTION.txt>   porta il video su Drive con nomi standard, scheda, indice, stato e commento sulla Issue
  python3 00_MOTORE/tools/studio.py indice                      rifà INDICE_VIDEO.csv su Drive
"""
import csv, datetime as dt, glob, json, os, re, shutil, socket, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VID = os.path.join(ROOT, 'MEMORIA', 'video')
REG = os.path.join(ROOT, 'REGOLE', 'PREFERENZE_E_FORMATI.md')
CAT = os.path.join(ROOT, '01_HOOK', 'CATALOGO_HOOK.csv')
STATI = ['in-lavorazione', 'da-rivedere', 'da-rifare', 'approvato', 'pubblicato', 'superato']
CHIAVI = ['id', 'nome', 'formato', 'scena', 'stato', 'creato', 'sessione']
AUD = os.path.join(ROOT, '02_AUDIO', 'CATALOGO_AUDIO.csv')
RIF = os.path.join(ROOT, '07_RIFERIMENTI', 'RIFERIMENTI.csv')
CONF = os.path.expanduser('~/.volwick_studio.json')
TIPI = [('T1', '01_EDIT', 'Edit: montaggio veloce a tempo di musica, senza voce'),
        ('T2', '02_SPIEGAZIONE_VOCE', 'Spiegazione con voce parlata HeyGen e sottotitoli'),
        ('T3', '03_REGISTRAZIONE_SCHERMO', 'Registrazione dello schermo: il terminale vero sul mercato vero'),
        ('T4', '04_HOOK_GRAFICO_VS_VOLWICK', 'Hook iniziale, poi grafico normale, poi Volwick: la differenza')]
VECCHI_CODICI = {'F1': 'T2', 'F2': 'T4', 'F3': 'T1', 'F4': 'T3', 'F5': 'T4'}
CATEGORIE = [(c, t) for _, c, t in TIPI] + [('05_HOOK_E_APERTURE', 'aperture fortissime dei primi 2 secondi da studiare'),
             ('06_COMPETITOR', 'video di altri strumenti di trading e dei concorrenti'),
             ('07_ALTRO', 'tutto il resto: Claude lo guarda e lo classifica')]
CAT_VECCHIE = {'01_VOCE_E_SPIEGAZIONE': '02_SPIEGAZIONE_VOCE', '02_REPLAY_SCHERMO': '04_HOOK_GRAFICO_VS_VOLWICK', '03_EDIT_E_MUSICA': '01_EDIT',
               '04_LIVE_MERCATO': '03_REGISTRAZIONE_SCHERMO', '05_CONFRONTO': '04_HOOK_GRAFICO_VS_VOLWICK', '06_HOOK_E_APERTURE': '05_HOOK_E_APERTURE',
               '07_COMPETITOR': '06_COMPETITOR', '08_ALTRO': '07_ALTRO'}


def tipo(v):
    f = (v.get('formato') or '').upper()
    return VECCHI_CODICI.get(f, f)


def cartella_tipo(v):
    return {k: c for k, c, _ in TIPI}.get(tipo(v), '00_SENZA_TIPO')
IN_HOOK, IN_MUS, IN_CONS = '00_CARICA_QUI/01_VIDEO_HOOK', '00_CARICA_QUI/02_MUSICA', '00_CARICA_QUI/03_VIDEO_CONSIGLIATI'
VECCHIE = {IN_HOOK: '00_CARICA_QUI/HOOK', IN_MUS: '00_CARICA_QUI/AUDIO', IN_CONS: '00_CARICA_QUI/RIFERIMENTI'}   # nomi della prima versione, letti ancora se esistono
LIB_MUS, LIB_CONS = '02_LIBRERIA/02_MUSICA', '02_LIBRERIA/03_VIDEO_CONSIGLIATI'
DRIVE_DIRS = [IN_HOOK, IN_MUS] + [f'{IN_CONS}/{c}' for c, _ in CATEGORIE] + ['01_VIDEO'] + [f'01_VIDEO/{c}' for _, c, _ in TIPI] + [LIB_MUS] + [f'{LIB_CONS}/{c}' for c, _ in CATEGORIE] + ['03_ARCHIVIO_CARICAMENTI', '04_ARCHIVIO_VIDEO']
VIDEO_EXT = ('.mp4', '.mov', '.m4v', '.webm', '.mkv')
AUDIO_EXT = ('.mp3', '.wav', '.m4a', '.aac', '.flac', '.aiff')
SESS = os.path.join(ROOT, 'MEMORIA', 'sessioni')
ME = os.path.expanduser('~/.volwick_sessione.json')
ATTIVA_MIN = 45
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
    print('=' * 70); print('VOLWICK REEL STUDIO · brief', ora_it()); print('=' * 70)
    git_pull()
    sh('git', 'fetch', '-q'); st = sh('git', 'status', '-sb').splitlines()
    if st and 'behind' in st[0]: print('\n!! Il tuo repository è indietro: fai `git pull --rebase` prima di lavorare.  ', st[0])
    print('\n0. CHI STA LAVORANDO ADESSO (MEMORIA/sessioni, segnale negli ultimi %d minuti)' % ATTIVA_MIN)
    chi(rientro='  ')
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
    # 7. caricamenti
    print('\n7. MATERIALE CARICATO DAL TEAM')
    d = drive_root(quiet=True)
    if d:
        att = in_attesa(d) + (len(os.listdir(os.path.join(ROOT, '04_RENDER', '_DA_CARICARE'))) if os.path.isdir(os.path.join(ROOT, '04_RENDER', '_DA_CARICARE')) else 0)
        print(f'  Drive: {d}')
        if att: print(f'  {att} file nuovi in 00_CARICA_QUI: li prendo in carico adesso.'); arrivi(); print('  >> Fai commit e push di 01_HOOK, 02_AUDIO e 07_RIFERIMENTI prima di iniziare.')
        else: print('  00_CARICA_QUI vuota')
    else: print('  Drive non configurato su questo computer (`studio.py drive`).')
    da_st = [f"{r.get('categoria','')}/{r['file']}" for r in csv_rows(RIF) if r.get('stato') == 'da studiare']
    da_asc = [r['file'] for r in csv_rows(AUD) if r.get('stato') == 'da ascoltare']
    if da_st: print('  Video consigliati da studiare (scheda in 06_DOCS/RIFERIMENTI, poi lezioni, regole o formati): ' + ', '.join(da_st))
    if da_asc: print('  Audio da ascoltare e classificare (licenza da confermare con Power): ' + ', '.join(da_asc))
    print('\nPrima di consegnare: `python3 00_MOTORE/tools/studio.py controlla`.')


def nuovo(a):
    i = a[0]; o = {k: None for k in ('nome', 'formato', 'scena', 'issue', 'hook', 'evento')}
    for k in o:
        if '--' + k in a: o[k] = a[a.index('--' + k) + 1]
    if os.path.exists(path(i)): sys.exit(f'{i} esiste già: usa `aggiorna`.')
    if o['formato'] and o['formato'].upper() not in [t for t, _, _ in TIPI]: sys.exit('--formato deve essere T1 (edit), T2 (spiegazione voce), T3 (registrazione schermo) o T4 (hook + grafico vs Volwick)')
    v = {'id': i, 'issue': int(o['issue']) if o['issue'] else None, 'nome': o['nome'] or i, 'formato': o['formato'] or '',
         'scena': o['scena'] or '', 'hook': {'clip': o['hook']} if o['hook'] else None, 'evento': o['evento'] or '',
         'layer': [], 'titoli': [], 'durata_s': None, 'render': '', 'stato': 'in-lavorazione', 'creato': now(),
         'sessione': os.environ.get('VW_SESSIONE') or socket.gethostname(), 'feedback': [], 'lezioni': [], 'pubblicazioni': []}
    salva(v); print('creato', os.path.relpath(path(i), ROOT))
    if io().get('chi'): presenza([f"preso {i} {v['nome']} ({v['formato']})", '--video', i])


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
        if f.lower().endswith(('.mp4', '.mov', '.wav', '.mp3')) and not f.startswith(('01_HOOK/clip/', '00_SAPERE/')):
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


# ---------------- Google Drive ----------------
LEGGIMI_DRIVE = """VOLWICK REEL STUDIO · cartella condivisa

00_CARICA_QUI   qui chiunque del team mette il materiale nuovo, da qualsiasi computer o dal telefono. Basta trascinare il file:
                01_VIDEO_HOOK         clip da usare come hook (verticali, senza marchi, scritte, @nomi o persone famose)
                02_MUSICA             brani o effetti CON LICENZA da mixare nei video (i brani famosi non si caricano: si scelgono in app)
                03_VIDEO_CONSIGLIATI  video di altri da studiare, nella cartella del tipo che ispirano (o hook, competitor, altro):
""" + "".join(f"                      {c:<28}{t}\n" for c, t in CATEGORIE) + """                Il primo Claude che parte li cataloga e li sposta in 02_LIBRERIA o nel motore. Non serve dire niente.
01_VIDEO        i video finiti, divisi nei 4 tipi:
""" + "".join(f"                      {c:<28}{t}\n" for _, c, t in TIPI) + """                dentro ogni tipo una cartella per video: <ID>_<NOME>/ con i video, CAPTION.txt e SCHEDA.txt. La crea Claude.
02_LIBRERIA     musica e video consigliati già catalogati, con le stesse categorie.
03_ARCHIVIO_CARICAMENTI   gli originali caricati, per data.
04_ARCHIVIO_VIDEO         tutti i video generati prima del Reel Studio, ogni versione, con INDICE_ARCHIVIO.csv.
INDICE_VIDEO.csv          tutti i video con stato, formato, hook e ultimo giudizio. Si apre con Fogli Google.

Le cartelle e i nomi dei file li gestisce Claude: non rinominare e non spostare a mano.
"""


def drive_root(quiet=False):
    cands = []
    if os.environ.get('VW_DRIVE'): cands.append(os.environ['VW_DRIVE'])
    try: cands.append(json.load(open(CONF))['drive'])
    except Exception: pass
    for pat in ('~/Library/CloudStorage/GoogleDrive-*/*/VOLWICK REEL STUDIO', '~/Library/CloudStorage/GoogleDrive-*/*/*/VOLWICK REEL STUDIO',
                '~/Google Drive/*/VOLWICK REEL STUDIO', '/Volumes/GoogleDrive/*/VOLWICK REEL STUDIO', 'G:/*/VOLWICK REEL STUDIO'):
        cands += sorted(glob.glob(os.path.expanduser(pat)))
    for c in cands:
        if c and os.path.isdir(c): return c
    if not quiet: print('Cartella Drive "VOLWICK REEL STUDIO" non trovata. Installa Google Drive per desktop, aggiungi la cartella condivisa a "Il mio Drive" e lancia `studio.py drive`.')
    return None


def drive(a):
    if a:
        d = os.path.abspath(os.path.expanduser(a[0]))
        if not os.path.isdir(d): sys.exit(f'non esiste: {d}')
        json.dump({'drive': d}, open(CONF, 'w')); print('salvato in', CONF)
    d = drive_root()
    if not d:
        base = sorted(glob.glob(os.path.expanduser('~/Library/CloudStorage/GoogleDrive-*/*Drive*')))
        if base: print('Drive trovato in', base[0], '\nSe la cartella condivisa non c\'è ancora, creala con: python3 00_MOTORE/tools/studio.py drive "' + os.path.join(base[0], 'VOLWICK REEL STUDIO') + '" (dopo averla creata)')
        return
    for x in DRIVE_DIRS: os.makedirs(os.path.join(d, x), exist_ok=True)
    open(os.path.join(d, 'LEGGIMI.txt'), 'w', encoding='utf-8').write(LEGGIMI_DRIVE)
    note = {IN_HOOK: 'Trascina qui le clip da usare come hook. Verticali, senza marchi, scritte, @nomi o persone famose. Il primo Claude che parte le cataloga e le sposta.',
            IN_MUS: 'Trascina qui brani o effetti CON LICENZA da mixare nei video. I brani famosi non si caricano: si scelgono in app.',
            IN_CONS: 'Video di altri da studiare. Mettili nella cartella del tipo che ispirano (01 edit, 02 spiegazione voce, 03 registrazione schermo, 04 hook + grafico vs Volwick), oppure 05 hook, 06 competitor; se non sai quale, in 07_ALTRO.',
            '01_VIDEO': 'I video finiti, divisi nei 4 tipi. Ogni video ha la sua cartella <ID>_<NOME> con le versioni, CAPTION.txt e SCHEDA.txt. Le crea Claude.'}
    for c, t in CATEGORIE:
        note[f'{IN_CONS}/{c}'] = t + '. Trascina qui i video consigliati di questo tipo.'
        note[f'{LIB_CONS}/{c}'] = t + '. Già catalogati (gestito da Claude).'
    for _, c, t in TIPI: note[f'01_VIDEO/{c}'] = t + '. Video finiti di questo tipo, uno per cartella (gestito da Claude).'
    for k, t in note.items(): open(os.path.join(d, k, 'LEGGIMI.txt'), 'w', encoding='utf-8').write(t + '\n')
    indice(); print('Drive pronto:', d)


def durata(p):
    try: return round(float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True, timeout=30).stdout.strip()), 2)
    except Exception: return ''


def csv_add(path, campi, riga):
    nuovo_file = not os.path.exists(path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'a', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=campi)
        if nuovo_file: w.writeheader()
        w.writerow({k: riga.get(k, '') for k in campi})


def csv_rows(path):
    try: return list(csv.DictReader(open(path, encoding='utf-8')))
    except Exception: return []


def libero(dst):
    b, e = os.path.splitext(dst); k = 2
    while os.path.exists(dst): dst = f'{b}_{k}{e}'; k += 1
    return dst


def cartelle_in(d, rel):
    return [os.path.join(d, x) for x in (rel, VECCHIE.get(rel)) if x and os.path.isdir(os.path.join(d, x))]


def file_in(cartella, ricorsivo=False):
    out = []
    for base, dirs, ns in os.walk(cartella):
        out += [os.path.join(base, n) for n in sorted(ns) if not n.startswith('.') and not n.upper().startswith('LEGGIMI')]
        if not ricorsivo: break
    return out


def in_attesa(d):
    return sum(len(file_in(c, True)) for rel in (IN_HOOK, IN_MUS, IN_CONS) for c in cartelle_in(d, rel))


def postino(d):
    """Video consegnati dalle chat dell'app Claude quando Drive non era collegato: stanno in 04_RENDER/_DA_CARICARE sul Mac, qui vanno su Drive."""
    src = os.path.join(ROOT, '04_RENDER', '_DA_CARICARE'); n = 0
    for nome in sorted(os.listdir(src)) if os.path.isdir(src) else []:
        a = os.path.join(src, nome)
        if not os.path.isdir(a): continue
        i = nome.split('_')[0]; v = json.load(open(path(i), encoding='utf-8')) if os.path.exists(path(i)) else {}
        b = os.path.join(d, '01_VIDEO', cartella_tipo(v), nome); os.makedirs(b, exist_ok=True)
        for f in os.listdir(a): shutil.move(os.path.join(a, f), os.path.join(b, f))
        os.rmdir(a); n += 1; print('portato su Drive:', nome)
    if n: indice()
    return n


def arrivi():
    d = drive_root()
    if not d: return
    postino(d)
    oggi = dt.date.today().isoformat(); arch = os.path.join(d, '03_ARCHIVIO_CARICAMENTI', oggi); fatti = 0
    def archivia(src, sotto):
        os.makedirs(os.path.join(arch, sotto), exist_ok=True); shutil.move(src, libero(os.path.join(arch, sotto, os.path.basename(src))))
    # 01_VIDEO_HOOK -> 01_HOOK/clip nel repository, catalogo automatico
    nuovi_hook = 0
    for c in cartelle_in(d, IN_HOOK):
        for src in file_in(c):
            n = os.path.basename(src)
            if not n.lower().endswith(VIDEO_EXT): print('salto (non è un video):', n); continue
            if os.path.getsize(src) > 45e6: print('hook troppo pesante per il repository (oltre 45 MB), accorcialo:', n); continue
            dst = os.path.join(ROOT, '01_HOOK', 'clip', n)
            if os.path.exists(dst): print('hook già in archivio, lo salto:', n)
            else: shutil.copy2(src, dst); nuovi_hook += 1
            archivia(src, '01_VIDEO_HOOK'); fatti += 1
    if nuovi_hook:
        r = subprocess.run([sys.executable, os.path.join(ROOT, '00_MOTORE', 'tools', 'hook_index.py'), ROOT], capture_output=True, text=True)
        print(r.stdout.strip() or r.stderr.strip()[-300:])
    # 02_MUSICA -> 02_LIBRERIA/02_MUSICA su Drive, riga in 02_AUDIO/CATALOGO_AUDIO.csv
    campi = ['file', 'durata_s', 'caricato', 'licenza', 'stato', 'formato_consigliato', 'note']
    for c in cartelle_in(d, IN_MUS):
        for src in file_in(c):
            n = os.path.basename(src)
            if not n.lower().endswith(AUDIO_EXT): print('salto (non è un audio):', n); continue
            os.makedirs(os.path.join(d, LIB_MUS), exist_ok=True)
            dst = libero(os.path.join(d, LIB_MUS, n)); shutil.move(src, dst)
            csv_add(AUD, campi, {'file': os.path.basename(dst), 'durata_s': durata(dst), 'caricato': oggi, 'licenza': 'da confermare con Power', 'stato': 'da ascoltare'}); fatti += 1
    # 03_VIDEO_CONSIGLIATI/<categoria> -> 02_LIBRERIA/03_VIDEO_CONSIGLIATI/<categoria>, riga in 07_RIFERIMENTI/RIFERIMENTI.csv
    campi = ['file', 'categoria', 'durata_s', 'caricato', 'stato', 'formato', 'scheda', 'note']; nomi = [x for x, _ in CATEGORIE]
    for c in cartelle_in(d, IN_CONS):
        for src in file_in(c, True):
            n = os.path.basename(src); sotto = os.path.relpath(os.path.dirname(src), c).split(os.sep)[0]
            cat = CAT_VECCHIE.get(sotto, sotto); cat = cat if cat in nomi else '07_ALTRO'
            if not n.lower().endswith(VIDEO_EXT): print('salto (non è un video):', n); continue
            os.makedirs(os.path.join(d, LIB_CONS, cat), exist_ok=True)
            dst = libero(os.path.join(d, LIB_CONS, cat, n)); shutil.move(src, dst)
            csv_add(RIF, campi, {'file': os.path.basename(dst), 'categoria': cat, 'durata_s': durata(dst), 'caricato': oggi, 'stato': 'da studiare'}); fatti += 1
    print(f'caricamenti presi in carico: {fatti}' + (' (fai commit e push di 01_HOOK, 02_AUDIO, 07_RIFERIMENTI)' if fatti else ''))


def slug(t): return re.sub(r'[^A-Z0-9]+', '_', (t or '').upper()).strip('_')[:40]


def scheda_txt(v):
    h = v.get('hook') or {}
    righe = [f"{v['id']} · {v.get('nome','')}", '', f"Tipo: {cartella_tipo(v)}", f"Stato: {v.get('stato','')}", f"Durata: {v.get('durata_s') or ''} s",
             f"Evento di mercato: {v.get('evento','')}", f"Hook: {hook_di(v)} {h.get('tratto','') if isinstance(h, dict) else ''}".rstrip(),
             f"Layer: {', '.join(v.get('layer') or [])}", 'Titoli:'] + [f'  {t}' for t in v.get('titoli') or []]
    righe += ['', f"Fatto da: {v.get('sessione','')} · {v.get('creato','')}", f"Scheda GitHub: #{v['issue']}" if v.get('issue') else '']
    if v.get('feedback'): righe += ['', 'Giudizi di Power:'] + [f"  {f['data']}  {f['testo']}" for f in v['feedback']]
    return '\n'.join(righe).strip() + '\n'


def consegna(a):
    if len(a) < 2: sys.exit('uso: studio.py consegna V0012 <cartella con i file finiti>')
    i, src = a[0], os.path.abspath(os.path.expanduser(a[1]))
    if not os.path.exists(path(i)): sys.exit(f'{i} non esiste: usa prima `nuovo`.')
    v = json.load(open(path(i), encoding='utf-8'))
    files = [f for f in sorted(os.listdir(src)) if f.lower().endswith(VIDEO_EXT + ('.txt', '.png', '.jpg'))]
    if not any(f.lower().endswith(VIDEO_EXT) for f in files): sys.exit('nella cartella non c\'è nessun video')
    if not any(f.lower().startswith('caption') for f in files): print('ATTENZIONE: manca CAPTION.txt (la caption con l\'offerta va consegnata con il video)')
    d = drive_root(quiet=True); nome = f"{i}_{slug(v.get('nome'))}"
    base = os.path.join(d, '01_VIDEO', cartella_tipo(v)) if d else os.path.join(ROOT, '04_RENDER')
    if not d: print('Drive non trovato: consegno in locale in 04_RENDER (poi rilancia `consegna` quando Drive è configurato).')
    out = os.path.join(base, nome); os.makedirs(out, exist_ok=True)
    for f in files:
        nf = f if f.upper().startswith(i) or f.lower().startswith('caption') else f'{i}_{f}'
        shutil.copy2(os.path.join(src, f), os.path.join(out, nf))
    v['render'] = (f'Drive: 01_VIDEO/{cartella_tipo(v)}/' if d else '04_RENDER/') + nome
    if v.get('stato') in ('in-lavorazione', 'da-rifare'): v['stato'] = 'da-rivedere'
    v['aggiornato'] = now(); salva(v)
    open(os.path.join(out, 'SCHEDA.txt'), 'w', encoding='utf-8').write(scheda_txt(v))
    if d: indice()
    if v.get('issue'):
        n = str(v['issue'])
        sh('gh', 'api', f'repos/{{owner}}/{{repo}}/issues/{n}/comments', '-f', f"body=Consegnato: **{v['render']}** ({len(files)} file). Da rivedere.")
        sh('gh', 'api', '-X', 'DELETE', f'repos/{{owner}}/{{repo}}/issues/{n}/labels/in-lavorazione')
        sh('gh', 'api', f'repos/{{owner}}/{{repo}}/issues/{n}/labels', '-f', 'labels[]=da-rivedere')
    print('consegnato in', out)
    if io().get('chi'): presenza([f"consegnato {i} su Drive, da rivedere", '--video', i])
    sync([f'consegna {i}'])


# ---------- lavoro in contemporanea ----------
def utc(): return dt.datetime.now(dt.timezone.utc)
def ora_it(t=None):
    t = t or utc()
    try:
        from zoneinfo import ZoneInfo; t = t.astimezone(ZoneInfo('Europe/Rome'))
    except Exception: pass
    return t.strftime('%d/%m %H:%M')
def git(*a, timeout=120):
    try: r = subprocess.run(('git',) + a, cwd=ROOT, capture_output=True, text=True, timeout=timeout); return r.returncode, (r.stdout + r.stderr).strip()
    except Exception as e: return 1, str(e)
def git_pull():
    c, o = git('pull', '--rebase', '--autostash', '-q')
    if c: print('!! git pull non riuscito:', o[:300])
    return c == 0
def git_sync(msg, percorsi):
    """pull, commit dei percorsi indicati, push; un secondo tentativo se un altro Claude ha appena fatto push."""
    git_pull()
    git('add', '--', *[p for p in percorsi if os.path.exists(os.path.join(ROOT, p))])
    if git('diff', '--cached', '--quiet')[0] == 0: print('niente da salvare'); return True
    git('commit', '-q', '-m', msg)
    for _ in range(3):
        c, o = git('push', '-q')
        if c == 0: print('salvato su GitHub:', msg); return True
        git_pull()
    print('!! push non riuscito:', o[:300]); return False
def io():
    try: return json.load(open(ME, encoding='utf-8'))
    except Exception: return {}
def sess_path(m): return os.path.join(SESS, slug(m['chi']).lower() + '.json')
def presenza(a):
    m = io()
    if '--chi' in a: m = {'chi': a[a.index('--chi') + 1], 'inizio': utc().isoformat(timespec='minutes')}
    if not m.get('chi'):
        m = {'chi': os.environ.get('VW_SESSIONE') or socket.gethostname(), 'inizio': utc().isoformat(timespec='minutes')}
    json.dump(m, open(ME, 'w', encoding='utf-8'), ensure_ascii=False)
    video = a[a.index('--video') + 1] if '--video' in a else None
    cosa = next((x for i, x in enumerate(a) if not x.startswith('--') and (i == 0 or a[i - 1] not in ('--chi', '--video'))), None)
    git_pull()
    os.makedirs(SESS, exist_ok=True); p = sess_path(m)
    try: s = json.load(open(p, encoding='utf-8'))
    except Exception: s = {'chi': m['chi'], 'inizio': m['inizio'], 'storia': []}
    s['ultimo'] = utc().isoformat(timespec='minutes'); s['stato'] = 'attiva'
    if cosa: s['cosa'] = cosa; s['storia'] = ([f"{ora_it()} {cosa}"] + s.get('storia', []))[:15]
    if video: s['video'] = video
    s['computer'] = socket.gethostname()
    with open(p, 'w', encoding='utf-8') as f: json.dump(s, f, ensure_ascii=False, indent=2); f.write('\n')
    git_sync(f"presenza · {m['chi']} · {cosa or 'attiva'}", [os.path.relpath(p, ROOT)])
def fine(a=None):
    m = io(); p = sess_path(m) if m.get('chi') else None
    if not p or not os.path.exists(p): print('nessuna sessione aperta da questo computer'); return
    git_pull(); s = json.load(open(p, encoding='utf-8')); s['stato'] = 'chiusa'; s['ultimo'] = utc().isoformat(timespec='minutes')
    with open(p, 'w', encoding='utf-8') as f: json.dump(s, f, ensure_ascii=False, indent=2); f.write('\n')
    git_sync(f"presenza · {m['chi']} · chiusa", [os.path.relpath(p, ROOT)])
def chi(rientro=''):
    S = []
    for n in sorted(glob.glob(os.path.join(SESS, '*.json'))):
        try: S.append(json.load(open(n, encoding='utf-8')))
        except Exception: pass
    if not S: print(rientro + 'nessuna sessione registrata'); return
    me = io().get('chi')
    for s in sorted(S, key=lambda s: s.get('ultimo', ''), reverse=True):
        try: t = dt.datetime.fromisoformat(s['ultimo']); età = int((utc() - t).total_seconds() // 60)
        except Exception: t, età = None, 99999
        if s.get('stato') == 'chiusa' or età > 24 * 60: continue
        st = 'ATTIVA ' if s.get('stato') == 'attiva' and età <= ATTIVA_MIN else 'ferma  '
        tu = ' (tu)' if s.get('chi') == me else ''
        print(f"{rientro}{st} {s.get('chi','?')}{tu} · {s.get('video') or '-'} · {s.get('cosa','')[:90]} · ultimo segnale {ora_it(t) if t else '?'} ({età} min fa)")
SYNC = ['MEMORIA', 'REGOLE', '01_HOOK/CATALOGO_HOOK.csv', '01_HOOK/_schede', '02_AUDIO', '06_DOCS', '07_RIFERIMENTI', '05_PUBBLICATI']
def sync(a):
    git_sync(a[0] if a else f"memoria · {io().get('chi') or socket.gethostname()}", SYNC)


def indice():
    d = drive_root(quiet=True)
    if not d: return
    campi = ['id', 'nome', 'tipo', 'stato', 'durata_s', 'hook', 'evento', 'cartella', 'creato', 'sessione', 'issue', 'ultimo_giudizio']
    with open(os.path.join(d, 'INDICE_VIDEO.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=campi); w.writeheader()
        for v in carica():
            w.writerow({'id': v['id'], 'nome': v.get('nome'), 'tipo': cartella_tipo(v), 'stato': v.get('stato'), 'durata_s': v.get('durata_s'),
                        'hook': hook_di(v), 'evento': v.get('evento'), 'cartella': v.get('render'), 'creato': v.get('creato'), 'sessione': v.get('sessione'),
                        'issue': v.get('issue') or '', 'ultimo_giudizio': (v.get('feedback') or [{}])[-1].get('testo', '')})


if __name__ == '__main__':
    c = sys.argv[1] if len(sys.argv) > 1 else 'brief'
    {'brief': lambda: brief(), 'nuovo': lambda: nuovo(sys.argv[2:]), 'aggiorna': lambda: aggiorna(sys.argv[2:]),
     'controlla': lambda: controlla(), 'drive': lambda: drive(sys.argv[2:]), 'arrivi': lambda: arrivi(),
     'consegna': lambda: consegna(sys.argv[2:]), 'indice': lambda: indice(),
     'presenza': lambda: presenza(sys.argv[2:]), 'chi': lambda: chi(), 'fine': lambda: fine(), 'sync': lambda: sync(sys.argv[2:])}.get(c, lambda: print(__doc__))()
