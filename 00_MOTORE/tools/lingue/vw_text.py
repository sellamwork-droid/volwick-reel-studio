"""VOLWICK text layer (29 Oct 2026): one source of truth for what is spoken and what is shown.
scripts.json  -> the spoken script per language (phrase-spaced for Japanese), parts and guard sentence
lang.json     -> screen copy + display rules (numMap, stripMarks, keys, caption rules)
words_src.json-> TTS timestamps ({lang}_all), realigned here onto the script's own tokens."""
import json, re, os, unicodedata as ud
HERE = os.path.dirname(os.path.abspath(__file__))
G = json.load(open(os.path.join(HERE, 'vw_glossary.json')))
PUNCT = '.,،、。:：;!?।؟॥"\'»)'
MARKS = re.compile('[ً-ْٰ]')
WEAK_END = {  # never the last word of a caption line (Netflix line-break rules: keep function words with what follows)
 'it': 'il lo la i gli le un uno una di a da in con su per tra fra e o ma che del dello della dei degli delle al allo alla ai agli alle dal dalla nel nello nella nei sul sulla sui ogni dietro sopra sotto verso',
 'pt': 'o a os as um uma de da do das dos em no na nos nas por pelo pela com para e ou que ao à cada',
 'es': 'el la los las un una de del en con por para y o que al a lo cada',
 'de': 'der die das den dem des ein eine einen einem einer und oder in im an am zu zum zur mit von vom für auf über um bei jeder jede jedes hinter vor unter neben zwischen durch gegen ohne nach',
 'en': 'the a an of in on at to for and or with by every',
 'ar': 'في من على إلى عن مع كل عند خلف',
 'hi': 'और', 'ja': ''}
WEAK_START = {'hi': 'के का की में से को पर ने है हैं पीछे लिए ऊपर नीचे साथ'}  # never the first word of a line (postpositions stay with their noun)

def load(lang):
    L = json.load(open(os.path.join(HERE, f'out_{lang}/lang.json')))
    S = json.load(open(os.path.join(HERE, 'scripts.json')))[lang]
    return G['langs'][lang], L, S

def nfc(s): return ud.normalize('NFC', s)
def ends(tok, GL): return tok.rstrip('"\'»)').endswith(tuple(GL['end']))

def tts_text(lang, S):
    """exact text sent to the TTS: Japanese phrase spaces removed"""
    return S['all'].replace(' ', '') if lang == 'ja' else S['all']

def script_tokens(lang, S, part):
    return S[part].split()

def realign(lang, S, ts):
    """map TTS timestamps (any granularity) onto the script's tokens by character position.
    Returns {part: [[token, start, end], ...]} plus 'guard'. Raises if the TTS changed the text."""
    order = [p for p, _ in S['parts']] + ['guard']
    toks = [(p, t) for p in order for t in (S[p].split() if p != 'guard' else S['guard'].split())]
    chars = []  # (char, start, end) of the TTS timeline, spaces dropped
    for w, a, b in ts:
        w = nfc(w).replace(' ', '')
        n = max(1, len(w))
        for i, ch in enumerate(w): chars.append((ch, a + (b - a) * i / n, a + (b - a) * (i + 1) / n))
    flat = ''.join(c for c, _, _ in chars); want = ''.join(nfc(t) for _, t in toks)
    if flat != want:
        i = next((k for k in range(min(len(flat), len(want))) if flat[k] != want[k]), min(len(flat), len(want)))
        raise ValueError(f'TTS text differs from script at char {i}: tts "{flat[i:i+20]}" vs script "{want[i:i+20]}"')
    out, k = {p: [] for p in order}, 0
    for p, t in toks:
        n = len(nfc(t)); seg = chars[k:k + n]; k += n
        out[p].append([t, round(seg[0][1], 3), round(seg[-1][2], 3)])
    return out

def display_tokens(lang, L, toks):
    """spoken tokens -> what the captions show: tashkeel stripped (if set), spoken numbers/respellings -> display form"""
    w = [[MARKS.sub('', t[0]) if L.get('stripMarks') else t[0]] + list(t[1:]) for t in toks]
    for spoken, shown in L.get('numMap', {}).items():
        n = len(spoken.split()); i = 0
        while i + n <= len(w):
            seg = w[i:i + n]; txt = ' '.join(x[0] for x in seg); core = txt.rstrip(PUNCT)
            if core == spoken:
                w[i:i + n] = [[shown + txt[len(core):]] + ([seg[0][1], seg[-1][2]] if len(seg[0]) > 1 else [])]
            i += 1
    return w

def display_text(lang, L, text):
    J = '' if lang == 'ja' else ' '
    return J.join(t[0] for t in display_tokens(lang, L, [[x] for x in text.split()]))

def weak_lists(lang):
    return WEAK_END.get(lang, '').split(), WEAK_START.get(lang, '').split()
