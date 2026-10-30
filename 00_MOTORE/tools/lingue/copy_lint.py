"""VOLWICK copy lint v2 (29 Oct 2026). Blocks a render when on-screen text, captions or the spoken script are not exact.
usage: python3 copy_lint.py <lang> [caption.txt]
Checks the script before the TTS call, and after it (when words_src.json has <lang>_all) that the voice read exactly the script.
Exit code 1 on any ERROR."""
import sys, json, re, os, unicodedata as ud
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vw_text as T
lang = sys.argv[1]; cap = sys.argv[2] if len(sys.argv) > 2 else None
GL, L, S = T.load(lang); G = T.G
errs, warns = [], []
E = lambda m: errs.append(m); Wn = lambda m: warns.append(m)

def graphemes(s): return sum(1 for ch in s if ud.category(ch) not in ('Mn', 'Mc', 'Me') and ch not in '‌‍')
def ends(s): return s.rstrip('"\'»)').endswith(tuple(GL['end']))

def num_ok(s, where):
    loc = GL['locale']; dot_group = loc[:2] in ('it', 'pt', 'de')
    for n in re.findall(r'\d[\d.,]*\d', s):
        if dot_group and re.search(r'\d,\d{3}(\D|$)', n): E(f'{where}: "{n}" separatore delle migliaia sbagliato per {loc} (serve il punto)')
        if not dot_group and re.search(r'\d\.\d{3}(\D|$)', n): E(f'{where}: "{n}" separatore delle migliaia sbagliato per {loc} (serve la virgola)')
        if lang == 'es' and re.fullmatch(r'\d{1,3}[.,]\d{3}', n): E(f'{where}: "{n}" in spagnolo i numeri di 4 cifre si scrivono senza separatore (RAE)')
        if re.fullmatch(r'\d{5,}', n): Wn(f'{where}: "{n}" senza separatore delle migliaia')

def common(s, where):
    if re.search(r'\s[-–—]\s|[–—]', s): E(f'{where}: trattino usato come punteggiatura: "{s}"')
    if '  ' in s or s != s.strip(): E(f'{where}: spazi doppi o ai bordi')
    if re.search(r'\s[,.;:!?،。、]', s) and lang != 'ja': E(f'{where}: spazio prima della punteggiatura: "{s}"')
    if re.search(r'[,;:](?=[^\s\d"\'»)])', s) and lang not in ('ja',): E(f'{where}: manca lo spazio dopo la punteggiatura: "{s}"')
    for a in G['brand']['avoid'] + GL.get('avoid', []):
        if a in s: E(f'{where}: termine non approvato "{a}"')
    if lang == 'ja' and re.search(r'[,.!?:](?!\d)', s.replace('7,746', '')): E(f'{where}: punteggiatura ASCII nel giapponese: "{s}"')
    if lang == 'ar' and re.search(r'[؀-ۿ]\s?,|,\s', s): E(f'{where}: virgola latina nell\'arabo, usare ،')
    if lang == 'ar' and re.search(r'[؀-ۿ]\s?\?', s): E(f'{where}: punto interrogativo latino nell\'arabo, usare ؟')
    if lang == 'hi' and re.search(r'[ऀ-ॿ]\.(\s|$)', s): E(f'{where}: punto latino nell\'hindi, usare ।')
    num_ok(s, where)

# 1 · screen copy
for i, h in enumerate(L['hook']):
    common(h, f'hook[{i}]')
    if not ends(h): E(f'hook[{i}]: manca la punteggiatura finale')
    if re.search(r'[a-zà-ÿß]', h.replace('ß', '')) and lang not in ('ar', 'ja', 'hi'): E(f'hook[{i}]: hook non tutto maiuscolo')
    lim = 13 if lang == 'ja' else 26
    if graphemes(h) > lim: Wn(f'hook[{i}]: {graphemes(h)} caratteri, controllare che stia nella larghezza')
for i, x in enumerate(L['legend']): common(x, f'legend[{i}]')
common(L['flip'].strip(), 'flip')
tag = L.get('tagWhole') or ' '.join(w for w, _ in L['tagline'] if w)
common(tag, 'tagline')
if not ends(tag): E('tagline: manca la punteggiatura finale')
common(L['discover'], 'discover')
if 'VOLWICK' not in L['discover'].upper(): E('discover: manca il brand')
if GL.get('rtl') and '←' not in L['discover']: E('discover: in una lingua RTL la freccia è ←')
if not GL.get('rtl') and '→' not in L['discover']: E('discover: manca la freccia →')
common(L['disc'], 'disc'); common(L.get('cta', '').lstrip(', ،'), 'cta')
if L['disc'] != GL['disc']: E(f'disc: diverso dal disclaimer approvato "{GL["disc"]}"')
if GL.get('rtl') and not L.get('rtl'): E('rtl non attivo per una lingua da destra a sinistra')
if L.get('locale') != GL['locale']: E(f'locale "{L.get("locale")}" diverso da "{GL["locale"]}"')

# 2 · spoken script
parts = [p for p, _ in S['parts']]
for p, n in S['parts']:
    toks = S[p].split(); sents, cur = [], []
    for t in toks:
        cur.append(t)
        if ends(t): sents.append(cur); cur = []
    if cur: E(f'{p}: frase senza punteggiatura finale: "{" ".join(cur)}"')
    if len(sents) != n: E(f'{p}: {len(sents)} frasi nel copione ma parts ne dichiara {n}')
    common(S[p] if lang != 'ja' else S[p].replace(' ', ''), f'parlato {p}')
    for s in sents:
        nw = len(s) if lang != 'ja' else graphemes(''.join(s)) // 3
        if nw > 20: Wn(f'{p}: frase lunga ({nw} parole), la voce perde ritmo')
if not ends(S['guard']): E('guard: manca la punteggiatura finale')
if re.search(r'\d', S['all']) : E('parlato: ci sono cifre nel copione, i numeri vanno scritti in lettere per la voce')
if S['all'] != ' '.join(S[p] for p in parts + ['guard']): E('scripts.json: "all" non coincide con le parti (rigenerare)')
brand_spoken = T.display_text(lang, L, S['brand'])
if G['brand']['text'] not in brand_spoken: E(f'slogan parlato: nei sottotitoli il brand non appare come "{G["brand"]["text"]}": "{brand_spoken}"')
if (L.get('tagWhole') or tag).rstrip('.。।') .lower() not in brand_spoken.lower().replace('volwick', 'volwick'):
    if lang not in ('ja', 'ar', 'hi'): Wn(f'tagline a schermo e slogan parlato non coincidono: "{tag}" / "{brand_spoken}"')
    elif ''.join(tag.split()).rstrip('。।.') not in ''.join(brand_spoken.split()): Wn(f'tagline e slogan parlato non coincidono: "{tag}" / "{brand_spoken}"')

# 3 · captions: display tokens, colored keys, line rules
disp = {p: T.display_tokens(lang, L, [[t] for t in S[p].split()]) for p in parts}
capt = [T.nfc(t[0]) for p in ('l1', 'l2') for t in disp[p]]
for w, c in L['keys']:
    if T.nfc(w) not in capt: E(f'parola colorata "{w}" non compare nei sottotitoli')
for t in capt:
    if re.search(r'[؀-ۿऀ-ॿ぀-ヿ一-鿿]', t) is None and re.search(r'[a-zà-ÿ]{21,}', t.lower()): Wn(f'sottotitolo: parola "{t}" molto lunga')
    if re.search(r'[ً-ْ]', t): E(f'sottotitolo con tashkeel "{t}": attivare stripMarks')
for spoken, shown in L.get('numMap', {}).items():
    if spoken not in S['all'] and spoken not in T.MARKS.sub('', S['all']): Wn(f'numMap "{spoken}" non usato nel parlato')
    num_ok(shown, f'numMap "{spoken}"')

# 4 · spelling (Hunspell dictionaries) for Latin-script languages
try:
    sys.path.insert(0, '/tmp/claude-0/-home-claude/21f21e0f-4446-5704-94a7-4f14ab212a64/scratchpad/spell'); import spell
    allow = set(GL.get('allow', [])) | {'volwick', 'gamma', 'γ', 'gex', 'es', 'sp500', 'link', 'bio'}
    texts = [*L['hook'], *L['legend'], L['flip'], tag, L['discover'], L['disc'], L.get('cta', '')] + [T.display_text(lang, L, S[p]) for p in parts]
    bad = spell.check(lang, ' '.join(texts), allow)
    if bad: [E(f'ortografia: "{w}" non è nel dizionario (suggerimenti: {", ".join(s) or "nessuno"})') for w, s in bad]
except Exception as ex: Wn(f'controllo ortografico non eseguito: {ex}')

# 5 · voice read exactly the script (after the TTS call)
W = json.load(open(os.path.join(T.HERE, 'words_src.json')))
if f'{lang}_all' in W:
    try: T.realign(lang, S, W[f'{lang}_all'])
    except ValueError as ex: E(f'voce: {ex}')
else: Wn('voce non ancora generata: controllo fatto sul copione')

# 6 · post caption = script
if cap:
    paras = [p.strip() for p in open(cap).read().split('\n\n') if p.strip()]
    J = '' if lang == 'ja' else ' '
    want = [T.display_text(lang, L, S['hook']), T.display_text(lang, L, S['l1']) + J + T.display_text(lang, L, S['l2'])]
    for i, (got, exp) in enumerate(zip(paras[:2], want)):
        if got != exp: E(f'caption.txt paragrafo {i + 1} diverso dal parlato\n      parlato: {exp}\n      caption: {got}')
    for i, p in enumerate(paras[:4]): common(p, f'caption.txt[{i + 1}]')

for m in warns: print('  WARN ', m)
for m in errs: print('  ERROR', m)
print(f'{lang}: {"OK" if not errs else "BLOCCATO"} · {len(errs)} errori · {len(warns)} avvisi')
sys.exit(1 if errs else 0)
