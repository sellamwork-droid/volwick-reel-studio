#!/usr/bin/env python3
"""VOLWICK · allineamento forzato testo → audio, senza servizi esterni.

Si conosce il testo esatto ma non quando viene detta ogni parola. Si sintetizza il testo
con espeak-ng parola per parola (quindi con confini noti), si calcolano le impronte MFCC
della voce sintetica e della voce vera, e la DTW le fa combaciare: i confini delle parole
sintetiche, riportati sul tempo della voce vera, danno i tempi di ogni parola.
Le pause della voce vera si tolgono prima della DTW e si rimettono dopo, così non
confondono l'allineamento. È il metodo di strumenti come aeneas.

    python3 vw_align.py clip.mp4 "testo esatto" it > parole.json
"""
import json, re, subprocess, sys, tempfile, os
import numpy as np
from scipy.fftpack import dct

SR, HOP = 16000, 160          # 10 ms per fotogramma
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def load(path, a=None, d=None):
    cmd = ["ffmpeg", "-nostdin", "-loglevel", "error"] + (["-ss", f"{a:.3f}"] if a is not None else []) \
          + ["-i", path] + (["-t", f"{d:.3f}"] if d else []) + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).copy()


def _fb(n=26, nfft=512):
    hz = lambda m: 700 * (10 ** (m / 2595) - 1); mel = lambda h: 2595 * np.log10(1 + h / 700)
    pts = hz(np.linspace(mel(60), mel(7600), n + 2)); b = np.floor((nfft + 1) * pts / SR).astype(int)
    fb = np.zeros((n, nfft // 2 + 1))
    for i in range(1, n + 1):
        fb[i - 1, b[i - 1]:b[i]] = (np.arange(b[i - 1], b[i]) - b[i - 1]) / max(1, b[i] - b[i - 1])
        fb[i - 1, b[i]:b[i + 1]] = (b[i + 1] - np.arange(b[i], b[i + 1])) / max(1, b[i + 1] - b[i])
    return fb
FB = _fb()


def mfcc(x):
    if len(x) < 400: x = np.pad(x, (0, 400 - len(x)))
    x = np.append(x[0], x[1:] - 0.97 * x[:-1]); n = 1 + (len(x) - 400) // HOP
    fr = np.stack([x[i * HOP:i * HOP + 400] for i in range(n)]) * np.hamming(400)
    p = np.abs(np.fft.rfft(fr, 512)) ** 2 / 512
    m = dct(np.log(p @ FB.T + 1e-10), type=2, axis=1, norm="ortho")[:, 1:14]
    d = np.vstack([m[1:2] - m[0:1], (m[2:] - m[:-2]) / 2, m[-1:] - m[-2:-1]]) if len(m) > 2 else np.zeros_like(m)
    f = np.hstack([m, d])                       # coefficienti + derivate: più robusto fra voci diverse
    return (f - f.mean(0)) / (f.std(0) + 1e-8)


def dtw_path(A, B, band=0.25):
    """DTW con banda (Sakoe-Chiba) sulla diagonale normalizzata: evita salti assurdi."""
    n, m = len(A), len(B)
    An = A / (np.linalg.norm(A, axis=1, keepdims=True) + 1e-9); Bn = B / (np.linalg.norm(B, axis=1, keepdims=True) + 1e-9)
    C = 1 - An @ Bn.T
    D = np.full((n + 1, m + 1), np.inf); D[0, 0] = 0
    w = max(int(band * max(n, m)), abs(n - m) + 5)
    for i in range(1, n + 1):
        jc = int(i * m / n); lo, hi = max(1, jc - w), min(m, jc + w)
        for j in range(lo, hi + 1):
            D[i, j] = C[i - 1, j - 1] + min(D[i - 1, j], D[i, j - 1], D[i - 1, j - 1])
    i, j, path = n, m, []
    while i > 0 and j > 0:
        path.append((i - 1, j - 1))
        k = np.argmin([D[i - 1, j - 1], D[i - 1, j], D[i, j - 1]])
        i, j = (i - 1, j - 1) if k == 0 else (i - 1, j) if k == 1 else (i, j - 1)
    return path[::-1]


def synth_words(words, lang, voice_extra=""):
    """Voce sintetica parola per parola: restituisce il segnale e i confini di ogni parola."""
    tmp = tempfile.mkdtemp(); sig, bounds, t = [], [], 0
    for k, w in enumerate(words):
        f = os.path.join(tmp, f"w{k}.wav")
        subprocess.run(["espeak-ng", "-v", lang + voice_extra, "-s", "165", "-w", f, w], check=True, capture_output=True)
        x = load(f)
        nz = np.where(np.abs(x) > 0.01)[0]        # toglie il silenzio che espeak mette attorno
        x = x[max(0, nz[0] - 80): nz[-1] + 80] if len(nz) else x
        bounds.append((t, t + len(x))); sig.append(x); t += len(x)
    return np.concatenate(sig), bounds


def energy_db(x):
    """Energia in dB su finestre da 10 ms, levigata con una mediana su 70 ms: un respiro o
    uno scatto isolato non deve spezzare una pausa né crearne una finta."""
    n = len(x) // HOP
    e = 20 * np.log10(np.sqrt((x[:n * HOP].reshape(n, HOP) ** 2).mean(1)) + 1e-9)
    from scipy.ndimage import median_filter
    return median_filter(e, size=7, mode="nearest")


def speech_threshold(e):
    """Soglia parlato/silenzio. Due vincoli insieme:
    - sopra il rumore di fondo misurato (voci registrate piano);
    - non più di 25 dB sotto il picco della voce. Nelle pause di una stanza vera il segnale
      resta a -42/-48 dB (respiro, ambiente): una soglia appena sopra il fondo le spezzava in
      frammenti e la pausa spariva. Verificato sul girato del 21 ottobre (wa01, wa05)."""
    floor, peak = np.percentile(e, 10), np.percentile(e, 99)
    return max(floor + max(6.0, 0.30 * (peak - floor)), peak - 25.0)


def speech_mask(x, min_sil=0.25):
    """Tratti parlati della voce vera, in campioni (energia su finestre da 10 ms)."""
    e = energy_db(x); n = len(e)
    on = e > speech_threshold(e)
    segs, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]: j += 1
            segs.append([i, j]); i = j
        else: i += 1
    merged = []
    for s in segs:                               # pause più corte di min_sil non contano
        if merged and (s[0] - merged[-1][1]) * HOP / SR < min_sil: merged[-1][1] = s[1]
        else: merged.append(s)
    return [(a * HOP, b * HOP) for a, b in merged if (b - a) * HOP / SR > 0.08]


def align(audio_path, text, lang="en", t_in=0.0, t_out=None):
    words = [w for w in re.split(r"\s+", text.strip()) if w]
    clean = [re.sub(r"[^\w'’%$€.,-]", "", w) or w for w in words]
    x = load(audio_path, t_in, (t_out - t_in) if t_out else None)
    segs = speech_mask(x)
    if not segs: return []
    real = np.concatenate([x[a:b] for a, b in segs])          # solo parlato, pause tolte
    syn, bounds = synth_words(clean, lang)
    R, S = mfcc(real), mfcc(syn)
    path = dtw_path(S, R)
    s2r = {}
    for i, j in path: s2r.setdefault(i, []).append(j)
    def map_frame(fi, edge):
        # Inizio parola → primo istante reale abbinato; fine → ultimo. Con la mediana, quando
        # la voce vera è più lenta la DTW "aspetta" e l'inizio cadeva in ritardo (fino a 490 ms).
        fi = min(max(fi, 0), len(S) - 1)
        js = s2r.get(fi) or s2r[min(s2r, key=lambda k: abs(k - fi))]
        return float(min(js) if edge == "s" else max(js))
    # tempo nel parlato compattato → tempo reale (rimette le pause)
    cum = np.cumsum([0] + [b - a for a, b in segs])
    def real_t(sample):
        k = int(np.searchsorted(cum, sample, side="right") - 1); k = min(max(k, 0), len(segs) - 1)
        return (segs[k][0] + (sample - cum[k])) / SR
    out = []
    for w, (a, b) in zip(words, bounds):
        ra = map_frame(a // HOP, "s") * HOP; rb = map_frame(max(a // HOP, b // HOP - 1), "e") * HOP + HOP
        out.append({"w": w, "s": round(t_in + real_t(ra), 3), "e": round(t_in + real_t(rb), 3)})
    # Nessuno fa una pausa di un quarto di secondo DENTRO una parola: se l'intervallo stimato
    # di una parola contiene una pausa intera, la parola comincia dopo la pausa. Nel collaudo
    # tutti gli errori grossi erano parole dopo una virgola o un punto, anticipate di 0,3-0,7 s.
    gaps = [(t_in + segs[k][1] / SR, t_in + segs[k + 1][0] / SR) for k in range(len(segs) - 1)]
    # Da che parte sta la pausa lo dice la punteggiatura del testo: una parola che finisce con
    # virgola o punto ha la pausa DOPO (si accorcia la sua fine); se la punteggiatura è sulla
    # parola precedente la pausa sta PRIMA (si sposta il suo inizio). Senza punteggiatura decide
    # da che lato della pausa cade la parte maggiore della parola stimata.
    P = re.compile(r"[.,;:!?…]['\"’”)]*$")
    for k, o in enumerate(out):
        inside = [g for g in gaps if o["s"] < g[0] and o["e"] > g[1]]
        if not inside:
            continue
        g = inside[0] if P.search(o["w"]) else inside[-1]
        own, prev = bool(P.search(o["w"])), k > 0 and bool(P.search(out[k - 1]["w"]))
        if own and not prev:
            after = False
        elif prev and not own:
            after = True
        else:
            after = (o["e"] - g[1]) > (g[0] - o["s"])
        if after:
            o["s"] = round(g[1], 3)
        else:
            o["e"] = round(g[0], 3)
    # Un inizio parola che cade dove la voce vera tace va spostato al primo fotogramma parlato
    # (la DTW, davanti a un silenzio, tende ad agganciare la parola successiva al suo inizio).
    e = energy_db(x); thr = speech_threshold(e)
    for o in out:
        f0 = int(round((o["s"] - t_in) * SR / HOP)); f1 = int(round((o["e"] - t_in) * SR / HOP))
        if 0 <= f0 < len(e) and e[f0] < thr:
            ahead = np.where(e[f0:max(f0 + 1, f1)] >= thr)[0]
            if len(ahead): o["s"] = round(t_in + (f0 + ahead[0]) * HOP / SR, 3)
    for k in range(1, len(out)):                              # monotonia: niente sovrapposizioni
        if out[k]["s"] < out[k - 1]["s"]: out[k]["s"] = out[k - 1]["s"]
        out[k - 1]["e"] = max(out[k - 1]["s"] + 0.05, min(out[k - 1]["e"], out[k]["s"]))
    return out


if __name__ == "__main__":
    print(json.dumps(align(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "en"), ensure_ascii=False, indent=1))
