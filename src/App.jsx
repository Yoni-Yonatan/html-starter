import React, { useEffect, useMemo, useRef, useState } from 'react';
import logo from './assets/logo.png';

const COPY = {
  am: {
    tag: 'ደመና ማከማቻ',
    brand: 'ለዋገኔ',
    dot: '.net',
    headline1: 'እየመጣ ነው',
    headline2: 'በቅርቡ',
    sub: 'ያለ ገደብ ደመና ማከማቻ ለሁሉም። ፋይሎችዎን በደህንነት ያስቀምጡ፣ በየትኛውም ቦታ ይድረሱ።',
    emailPlaceholder: 'ኢሜይልዎን ያስገቡ',
    notify: 'ስታስጀምር አሳውቀኝ',
    submitted: 'አመሰግናለሁ! ስንጀምር እናሳውቅዎታለን።',
    invalid: 'ትክክለኛ ኢሜይል ያስገቡ',
    stat1label: 'ቀናት ቀርተዋል',
    langSwitch: 'English',
    footer: 'ሁሉም መብቶች የተጠበቁ ናቸው',
    system: 'ስርዓት',
    status: 'እየተገነባ ነው',
    days: 'ቀናት',
    hrs: 'ሰዓት',
    min: 'ደቂቃ',
    sec: 'ሰከንድ',
  },
  en: {
    tag: 'CLOUD STORAGE',
    brand: 'LeWagene',
    dot: '.net',
    headline1: 'COMING',
    headline2: 'SOON',
    sub: 'Unlimited cloud storage for everyone. Keep your files safe, reach them from anywhere.',
    emailPlaceholder: 'Enter your email',
    notify: 'Notify me at launch',
    submitted: "Thank you! We'll let you know when we launch.",
    invalid: 'Please enter a valid email',
    stat1label: 'days remaining',
    langSwitch: 'አማርኛ',
    footer: 'All rights reserved',
    system: 'SYSTEM',
    status: 'BUILDING',
    days: 'days',
    hrs: 'hrs',
    min: 'min',
    sec: 'sec',
  },
};

const LAUNCH_MS = Date.now() + 1000 * 60 * 60 * 24 * 21;

function useCountdown(target) {
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft(Math.max(0, target - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const seconds = Math.floor(left / 1000);
  return {
    days: String(Math.floor(seconds / 86400)).padStart(2, '0'),
    hours: String(Math.floor((seconds % 86400) / 3600)).padStart(2, '0'),
    mins: String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'),
    secs: String(seconds % 60).padStart(2, '0'),
  };
}

function useBinaryColumns(count) {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = Array.from({ length: count }, (_, i) => ({
      left: (i / count) * 100,
      delay: (i * 0.37) % 6,
      dur: 6 + ((i * 1.618) % 5),
      chars: Array.from({ length: 14 }, () => (Math.random() > 0.5 ? '1' : '0')),
    }));
  }
  return ref.current;
}

function Segment({ value, label }) {
  return (
    <div className="seg">
      <div className="seg-box">
        <span className="seg-digit">{value}</span>
      </div>
      <span className="seg-label">{label}</span>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('am');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const t = COPY[lang];
  const countdown = useCountdown(LAUNCH_MS);
  const columns = useBinaryColumns(18);
  const isAm = lang === 'am';

  const handleSubmit = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setState('error');
      return;
    }
    setState('done');
  };

  return (
    <div className={`ls-root ${isAm ? 'font-am' : 'font-en'}`} dir="ltr">
      <style>{styles}</style>
      <style>{`.ls-logo-mark{width:56px;height:56px;border-radius:12px} .ls-logo-mark img{width:40px;height:40px;border-radius:8px}`}</style>

      <div className="ls-rain" aria-hidden="true">
        {columns.map((col, i) => (
          <div
            key={i}
            className="ls-rain-col"
            style={{
              left: `${col.left}%`,
              animationDelay: `${col.delay}s`,
              animationDuration: `${col.dur}s`,
            }}
          >
            {col.chars.map((char, j) => (
              <span key={`${i}-${j}`}>{char}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="ls-vignette" aria-hidden="true" />
      <div className="ls-scan" aria-hidden="true" />

      <header className="ls-top">
        <div className="ls-logo">
          <span className="ls-logo-mark" aria-hidden="true">
            <img src={logo} alt="LeWagene logo" style={{width:40,height:40,display:'block'}} />
          </span>
          <span className="ls-logo-text">
            {t.brand}
            <span className="ls-logo-dot">{t.dot}</span>
          </span>
        </div>

        <button
          type="button"
          className="ls-lang-btn"
          onClick={() => {
            setLang((prev) => (prev === 'am' ? 'en' : 'am'));
            setState('idle');
          }}
        >
          <span className="ls-lang-icon" aria-hidden="true">⌁</span>
          {t.langSwitch}
        </button>
      </header>

      <main className="ls-main">
        <div className="ls-tagrow">
          <span className="ls-pulse" aria-hidden="true" />
          <span className="ls-tag">{t.tag}</span>
        </div>

        <h1 className="ls-headline">
          <span className="ls-h-line ls-h-out">{t.headline1}</span>
          <span className="ls-h-line ls-h-fill">{t.headline2}</span>
        </h1>

        <p className="ls-sub">{t.sub}</p>

        <div className="ls-countdown" role="timer" aria-label={t.stat1label}>
          <Segment value={countdown.days} label={t.days} />
          <span className="seg-colon">:</span>
          <Segment value={countdown.hours} label={t.hrs} />
          <span className="seg-colon">:</span>
          <Segment value={countdown.mins} label={t.min} />
          <span className="seg-colon">:</span>
          <Segment value={countdown.secs} label={t.sec} />
        </div>
      </main>

      <footer className="ls-footer">
        <span className="ls-foot-item">
          <span className="ls-dotlive" aria-hidden="true" />
          {t.system} · {t.status}
        </span>
        <span className="ls-foot-item ls-foot-right">
          © {new Date().getFullYear()} <img src={logo} alt="LeWagene logo" style={{width:24,height:24,marginRight:8,verticalAlign:'middle'}} /> {t.brand}{t.dot} — {t.footer}
        </span>
      </footer>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
:root{--acid:#39FF8C;--acid-dim:rgba(57,255,140,0.5);--acid-faint:rgba(57,255,140,0.12);--black:#000000;--white:#ffffff;--line:rgba(255,255,255,0.14)}
.ls-root{position:relative;min-height:100vh;width:100%;background:var(--black);color:var(--white);overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box}.ls-root,.ls-root *{box-sizing:border-box}.font-en{font-family:'Space Grotesk',sans-serif}.font-am{font-family:'Noto Sans Ethiopic','Space Grotesk',sans-serif}.ls-rain{position:absolute;inset:0;pointer-events:none;opacity:0.16;mask-image:linear-gradient(to bottom, transparent, black 20%, black 75%, transparent)}.ls-rain-col{position:absolute;top:-20%;display:flex;flex-direction:column;gap:14px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--acid);animation-name:rainfall;animation-timing-function:linear;animation-iteration-count:infinite}.ls-rain-col span:first-child{color:var(--white);opacity:0.9}@keyframes rainfall{0%{transform:translateY(0)}100%{transform:translateY(140vh)}}.ls-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 55% at 50% 38%, transparent 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)}.ls-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px);mix-blend-mode:overlay}.ls-top{position:relative;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:28px clamp(20px,5vw,56px) 0}.ls-logo{display:flex;align-items:center;gap:10px}.ls-logo-mark{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border:1.5px solid var(--acid);border-radius:10px;color:var(--acid);box-shadow:0 0 18px var(--acid-faint), inset 0 0 12px rgba(57,255,140,0.06)}.ls-logo-text{font-weight:700;font-size:18px;letter-spacing:0.01em;color:var(--white)}.ls-logo-dot{color:var(--acid)}.ls-lang-btn{display:flex;align-items:center;gap:7px;background:transparent;border:1px solid var(--line);color:var(--white);font-family:inherit;font-size:13px;font-weight:600;letter-spacing:0.02em;padding:9px 16px;border-radius:999px;cursor:pointer;transition:border-color .25s ease,color .25s ease,box-shadow .25s ease,transform .15s ease}.ls-lang-icon{color:var(--acid);font-size:14px;line-height:0}.ls-lang-btn:hover{border-color:var(--acid);color:var(--acid);box-shadow:0 0 16px var(--acid-faint)}.ls-lang-btn:active{transform:scale(0.97)}.ls-lang-btn:focus-visible{outline:2px solid var(--acid);outline-offset:2px}.ls-main{position:relative;z-index:5;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px clamp(20px,6vw,40px) 20px}.ls-tagrow{display:inline-flex;align-items:center;gap:9px;padding:7px 16px;border:1px solid var(--line);border-radius:999px;margin-bottom:28px;opacity:0;animation:rise .7s ease .05s forwards}.ls-pulse{width:7px;height:7px;border-radius:50%;background:var(--acid);box-shadow:0 0 10px var(--acid);animation:pulse 1.8s ease-in-out infinite}.ls-tag{font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.72)}.ls-headline{margin:0 0 22px;font-weight:800;line-height:0.92;letter-spacing:-0.02em;font-size:clamp(52px,12vw,132px);display:flex;flex-direction:column;align-items:center}.font-am .ls-headline{letter-spacing:0;font-weight:700;line-height:1.05}.ls-h-line{opacity:0;animation:rise .8s cubic-bezier(.16,1,.3,1) forwards}.ls-h-out{color:transparent;-webkit-text-stroke:1.5px var(--white);animation-delay:.15s}.ls-h-fill{color:var(--acid);text-shadow:0 0 40px rgba(57,255,140,0.45),0 0 90px rgba(57,255,140,0.18);animation-delay:.3s;position:relative}.ls-h-fill::after{content:'';position:absolute;left:2%;right:2%;bottom:-0.08em;height:3px;background:var(--acid);transform-origin:left;animation:underline .9s cubic-bezier(.16,1,.3,1) .9s forwards;transform:scaleX(0);box-shadow:0 0 12px var(--acid)}.ls-sub{max-width:560px;color:rgba(255,255,255,0.62);font-size:clamp(14.5px,2vw,17px);line-height:1.65;margin:0 0 44px;opacity:0;animation:rise .8s ease .5s forwards}.ls-countdown{display:flex;align-items:flex-start;gap:clamp(8px,2vw,18px);margin-bottom:46px;opacity:0;animation:rise .8s ease .62s forwards}.seg{display:flex;flex-direction:column;align-items:center;gap:9px}.seg-box{position:relative;width:clamp(52px,9vw,74px);height:clamp(52px,9vw,74px);display:flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.03), transparent);overflow:hidden}.seg-box::before{content:'';position:absolute;inset:0;background:var(--acid);opacity:0.06}.seg-digit{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:clamp(20px,3.6vw,30px);color:var(--white);font-variant-numeric:tabular-nums;z-index:1}.seg-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.4)}.font-am .seg-label{font-family:'Noto Sans Ethiopic',sans-serif;letter-spacing:0}.seg-colon{color:var(--acid);font-size:clamp(20px,3.6vw,28px);font-weight:600;line-height:1;align-self:center;margin-top:-16px;opacity:0.6;animation:blink 1.4s step-start infinite}.ls-form{width:100%;max-width:460px;opacity:0;animation:rise .8s ease .74s forwards}.ls-field{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.02);border:1.5px solid var(--line);border-radius:14px;padding:6px 6px 6px 20px;transition:border-color .3s ease,box-shadow .3s ease}.ls-field:focus-within{border-color:var(--acid);box-shadow:0 0 0 4px var(--acid-faint)}.ls-field.is-error{border-color:#ff5c5c}.ls-input{flex:1;min-width:0;background:transparent;border:none;outline:none;color:var(--white);font-family:inherit;font-size:14.5px;padding:12px 0}.ls-input::placeholder{color:rgba(255,255,255,0.34)}.ls-submit{flex-shrink:0;display:flex;align-items:center;gap:8px;background:var(--acid);color:var(--black);border:none;border-radius:10px;font-family:inherit;font-weight:700;font-size:13.5px;white-space:nowrap;padding:12px 18px;cursor:pointer;transition:transform .18s ease,box-shadow .25s ease,filter .2s ease}.ls-submit svg{transition:transform .25s ease}.ls-submit:hover:not(:disabled){box-shadow:0 0 24px rgba(57,255,140,0.5);filter:brightness(1.08)}.ls-submit:hover:not(:disabled) svg{transform:translateX(3px)}.ls-submit:active:not(:disabled){transform:scale(0.96)}.ls-submit:disabled{opacity:0.5;cursor:default}.ls-submit:focus-visible{outline:2px solid var(--white);outline-offset:2px}.ls-msg-slot{min-height:30px;margin-top:10px}.ls-msg{margin:0;font-size:13px;text-align:left;padding-left:6px;animation:rise .35s ease forwards}.ls-msg-error{color:#ff7a7a}.ls-msg-ok{color:var(--acid)}.ls-footer{position:relative;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:20px clamp(20px,5vw,56px) 26px;border-top:1px solid var(--line)}.ls-foot-item{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.06em;color:rgba(255,255,255,0.4);text-transform:uppercase}.font-am .ls-foot-right{font-family:'Noto Sans Ethiopic',sans-serif;text-transform:none;letter-spacing:0}.ls-dotlive{width:6px;height:6px;border-radius:50%;background:var(--acid);box-shadow:0 0 8px var(--acid);animation:pulse 1.8s ease-in-out infinite}@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}@keyframes blink{50%{opacity:.15}}@keyframes underline{to{transform:scaleX(1)}}@media (max-width:480px){.ls-countdown{gap:6px}.seg-colon{margin-top:-12px}.ls-field{flex-wrap:wrap;padding:14px}.ls-input{width:100%;padding:6px 0 10px}.ls-submit{width:100%;justify-content:center}}@media (prefers-reduced-motion: reduce){.ls-rain-col,.ls-pulse,.ls-dotlive,.seg-colon,.ls-h-line,.ls-tagrow,.ls-sub,.ls-countdown,.ls-form{animation:none !important;opacity:1 !important;transform:none !important}.ls-h-fill::after{transform:scaleX(1)}}`;
