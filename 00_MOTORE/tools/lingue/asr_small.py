import sys, subprocess, numpy as np
def dec(f): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout,dtype=np.float32)
from faster_whisper import WhisperModel
m=WhisperModel('/tmp/claude-0/-home-claude/21f21e0f-4446-5704-94a7-4f14ab212a64/scratchpad/wsmall/model',device='cpu',compute_type='int8',cpu_threads=4)
for f,lang in zip(sys.argv[1::2],sys.argv[2::2]):
    segs,_=m.transcribe(dec(f),language=lang,beam_size=5,condition_on_previous_text=False,vad_filter=False)
    print(f'== {f.split("/")[-1]}\n'+' '.join(s.text.strip() for s in segs),flush=True)
