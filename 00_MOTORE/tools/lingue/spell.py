"""Hunspell check (spylls) on the copy. usage: python3 spell.py <lang> "<text>" [allow,list]"""
import sys, re, time
from spylls.hunspell import Dictionary
D={'it':'dictionary-it','de':'dictionary-de','pt':'dictionary-pt','es':'dictionary-es','en':'dictionary-en'}
def check(lang,text,allow=()):
    if lang not in D: return None
    d=Dictionary.from_files(f'/tmp/claude-0/-home-claude/21f21e0f-4446-5704-94a7-4f14ab212a64/scratchpad/spell/node_modules/{D[lang]}/index')
    ok={a.lower() for a in allow}; bad=[]
    for w in re.findall(r"[^\W\d_][^\W\d_'’\-]*(?:[-'’][^\W\d_]+)*", re.sub(r'[#@]\S+',' ',text)):
        parts=[w]+re.split(r"[-'’]",w) if ("'" in w or '’' in w or '-' in w) else [w]
        cand=[p for p in parts if len(p)>1]
        if any(p.lower() in ok for p in cand) or w.lower() in ok: continue
        if d.lookup(w) or d.lookup(w.lower()) or d.lookup(w.capitalize()): continue
        if len(parts)>1 and all(d.lookup(p) or d.lookup(p.lower()) or d.lookup(p.capitalize()) or p.lower() in ok or len(p)<2 for p in parts[1:]): continue
        bad.append((w,list(d.suggest(w.lower()))[:3]))
    return bad
if __name__=='__main__':
    t=time.time(); print(check(sys.argv[1],sys.argv[2],sys.argv[3].split(',') if len(sys.argv)>3 else ()), round(time.time()-t,1),'s')
