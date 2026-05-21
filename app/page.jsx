'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============ THEMES ============
const THEMES = {
  cream: {
    name: 'крем · cream',
    bg: '#F4EFE6', surface: '#FBF8F2', surfaceHover: '#ECE3D2',
    text: '#1E1812', textMuted: 'rgba(30, 24, 18, 0.55)', textFaint: 'rgba(30, 24, 18, 0.4)',
    border: 'rgba(30, 24, 18, 0.1)', borderStrong: 'rgba(30, 24, 18, 0.18)',
    accent: '#8B2A1B', accentHover: '#6B1F12', accentText: '#FBF8F2',
    inactive: '#D6CDBE', swatch: '#8B2A1B',
  },
  ink: {
    name: 'тушь · ink',
    bg: '#141215', surface: '#1E1B22', surfaceHover: '#272430',
    text: '#EDE6DA', textMuted: 'rgba(237, 230, 218, 0.55)', textFaint: 'rgba(237, 230, 218, 0.38)',
    border: 'rgba(237, 230, 218, 0.1)', borderStrong: 'rgba(237, 230, 218, 0.2)',
    accent: '#D4A574', accentHover: '#C49560', accentText: '#141215',
    inactive: '#3A3640', swatch: '#141215',
  },
  blush: {
    name: 'румяна · blush',
    bg: '#F3E8E5', surface: '#FAF1EE', surfaceHover: '#EDDDD8',
    text: '#2A1F22', textMuted: 'rgba(42, 31, 34, 0.55)', textFaint: 'rgba(42, 31, 34, 0.4)',
    border: 'rgba(42, 31, 34, 0.1)', borderStrong: 'rgba(42, 31, 34, 0.18)',
    accent: '#A04860', accentHover: '#803848', accentText: '#FAF1EE',
    inactive: '#D8C5C0', swatch: '#A04860',
  },
  forest: {
    name: 'мох · forest',
    bg: '#E8ECE2', surface: '#F2F4ED', surfaceHover: '#DCE2D2',
    text: '#1C1F18', textMuted: 'rgba(28, 31, 24, 0.55)', textFaint: 'rgba(28, 31, 24, 0.4)',
    border: 'rgba(28, 31, 24, 0.1)', borderStrong: 'rgba(28, 31, 24, 0.18)',
    accent: '#3D5A3D', accentHover: '#2D4A2D', accentText: '#F2F4ED',
    inactive: '#C8CFBC', swatch: '#3D5A3D',
  },
  dusk: {
    name: 'сумерки · dusk',
    bg: '#1B1828', surface: '#252238', surfaceHover: '#2F2B44',
    text: '#E8E0F0', textMuted: 'rgba(232, 224, 240, 0.55)', textFaint: 'rgba(232, 224, 240, 0.38)',
    border: 'rgba(232, 224, 240, 0.1)', borderStrong: 'rgba(232, 224, 240, 0.2)',
    accent: '#C8A8E9', accentHover: '#B898DA', accentText: '#1B1828',
    inactive: '#3C3858', swatch: '#1B1828',
  },
};

const THEME_ORDER = ['cream', 'ink', 'blush', 'forest', 'dusk'];

// ============ STRINGS ============
const STRINGS = {
  ru: {
    subtitle: 'третий, кто слушает обоих',
    title: 'Что у тебя сейчас\nпроисходит?',
    intro: 'Расскажи как есть. Можно вставить переписку, описать ссору, или просто попробовать понять, что ты сам(а) чувствуешь. Я не выбираю сторону — помогаю увидеть, что происходит между вами.',
    placeholder1: 'Расскажи, что случилось…',
    placeholder2: 'Продолжай…',
    new: 'новый',
    disclaimer: 'не замена терапии — но иногда хороший собеседник',
    label: 'между',
    errorEmpty: 'Хм, пусто пришло. Попробуй переформулировать?',
    listening: 'слушаю…',
    starters: [
      { title: 'Помоги понять', sub: 'что он(а) имел(а) в виду' },
      { title: 'Помоги ответить', sub: 'не хочу разрушить' },
      { title: 'Мы ходим по кругу', sub: 'одни и те же ссоры' },
      { title: 'Это манипуляция?', sub: 'или мне кажется' },
      { title: 'Репетиция разговора', sub: 'который страшно начать' },
      { title: 'Я себя не понимаю', sub: 'что я вообще чувствую' },
    ],
  },
  en: {
    subtitle: 'the third who listens to both',
    title: "What's going on\nwith you right now?",
    intro: "Tell me as it is. Paste a chat, describe a fight, or just try to figure out what you yourself are feeling. I don't take sides — I help you see what's happening between you.",
    placeholder1: 'Tell me what happened…',
    placeholder2: 'Go on…',
    new: 'new',
    disclaimer: 'not a replacement for therapy — but sometimes a good companion',
    label: 'between',
    errorEmpty: 'Hmm, came back empty. Try rephrasing?',
    listening: 'listening…',
    starters: [
      { title: 'Help me understand', sub: 'what they meant' },
      { title: 'Help me reply', sub: "without breaking it" },
      { title: 'We go in circles', sub: 'same fight again' },
      { title: 'Is this manipulation?', sub: 'or just me' },
      { title: 'Rehearse a talk', sub: "I'm afraid to start" },
      { title: "I don't get myself", sub: 'what am I feeling' },
    ],
  },
};

// ============ APP ============
export default function Page() {
  const [language, setLanguage] = useState(null);
  const [themeKey, setThemeKey] = useState('cream');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const theme = THEMES[themeKey];
  const t = language ? STRINGS[language] : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  useEffect(() => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setSpeechSupported(false); return; }
    setSpeechSupported(true);

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = language === 'en' ? 'en-US' : 'ru-RU';

    rec.onresult = (e) => {
      let chunk = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) chunk += e.results[i][0].transcript;
      }
      if (chunk) {
        setInput(prev => {
          const trimmed = chunk.trim();
          const needsSpace = prev && !prev.endsWith(' ') && !prev.endsWith('\n');
          return prev + (needsSpace ? ' ' : '') + trimmed;
        });
      }
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [language]);

  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (recording) {
      try { rec.stop(); } catch {}
      setRecording(false);
    } else {
      try { rec.start(); setRecording(true); } catch { setRecording(false); }
    }
  };

  const send = async (preset) => {
    const text = (preset !== undefined ? preset : input).trim();
    if (!text || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      });

      const data = await r.json();

      if (!r.ok || data.error) {
        setMessages([...next, { role: 'error', content: data.error || `HTTP ${r.status}` }]);
        return;
      }

      const reply = (data.reply || '').trim();
      if (!reply) {
        setMessages([...next, { role: 'error', content: t.errorEmpty }]);
        return;
      }

      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...next, { role: 'error', content: e.message || 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const newChat = () => { setMessages([]); setInput(''); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        html, body { margin: 0; padding: 0; background: ${theme.bg}; transition: background 0.4s ease; }
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        textarea:focus { outline: none; }
        button { font-family: inherit; }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
        .dot { animation: pulse 1.3s ease-in-out infinite; display: inline-block; }
        .dot:nth-child(2) { animation-delay: 0.18s; }
        .dot:nth-child(3) { animation-delay: 0.36s; }
        .starter { transition: all 0.18s ease; cursor: pointer; }
        .starter:hover { background: ${theme.surfaceHover} !important; transform: translateY(-1px); }
        .send-btn { transition: all 0.18s ease; }
        .send-btn:not(:disabled):hover { background: ${theme.accentHover} !important; }
        .pill { transition: all 0.18s ease; cursor: pointer; }
        .pill:hover { opacity: 1 !important; }
        .swatch { transition: transform 0.15s ease; cursor: pointer; }
        .swatch:hover { transform: scale(1.15); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.32s ease-out; }
        @keyframes recordPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.55); }
          50% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
        }
        .recording-ring { animation: recordPulse 1.4s ease-in-out infinite; }
        .mic-btn { transition: all 0.2s ease; }
        .mic-btn:hover { background: ${theme.surfaceHover} !important; }
        .lang-btn { transition: all 0.2s ease; cursor: pointer; }
        .lang-btn:hover { background: ${theme.surfaceHover} !important; transform: translateY(-2px); }
        @media (max-width: 640px) {
          .starters-grid { grid-template-columns: 1fr 1fr !important; }
          .empty-title { font-size: 34px !important; }
          .onboard-title { font-size: 48px !important; }
        }
      `}</style>

      {!language ? (
        <Onboarding theme={theme} onPick={setLanguage} themeKey={themeKey} setThemeKey={setThemeKey} />
      ) : (
        <div style={{
          minHeight: '100vh', background: theme.bg, color: theme.text,
          fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex', flexDirection: 'column',
          transition: 'background 0.4s ease, color 0.4s ease',
        }}>
          <Header theme={theme} themeKey={themeKey} setThemeKey={setThemeKey}
            language={language} setLanguage={setLanguage}
            hasMessages={messages.length > 0} onNew={newChat} t={t} />

          <main ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 180px' }}>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              {messages.length === 0 ? (
                <EmptyState theme={theme} t={t} onPick={send} />
              ) : (
                <>
                  {messages.map((m, i) => (
                    <Message key={i} role={m.role} content={m.content} theme={theme} t={t} />
                  ))}
                  {loading && <ThinkingIndicator theme={theme} t={t} />}
                </>
              )}
            </div>
          </main>

          <InputBar theme={theme} t={t} input={input} setInput={setInput} send={send}
            loading={loading} onKey={onKey} textareaRef={textareaRef}
            hasMessages={messages.length > 0} recording={recording}
            toggleRecording={toggleRecording} speechSupported={speechSupported} />
        </div>
      )}
    </>
  );
}

function Onboarding({ theme, onPick, themeKey, setThemeKey }) {
  return (
    <div className="fade-in" style={{
      minHeight: '100vh', background: theme.bg, color: theme.text,
      fontFamily: '"DM Sans", sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', transition: 'background 0.4s ease, color 0.4s ease', position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 24, right: 24 }}>
        <ThemePicker theme={theme} themeKey={themeKey} setThemeKey={setThemeKey} />
      </div>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <h1 className="onboard-title" style={{
          fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
          fontSize: 64, lineHeight: 1, margin: 0, fontWeight: 400, letterSpacing: '-0.02em',
        }}>
          между<span style={{ opacity: 0.4, margin: '0 14px' }}>·</span>between
        </h1>
        <p style={{
          fontSize: 14.5, lineHeight: 1.55, opacity: 0.6,
          marginTop: 22, marginBottom: 48,
          maxWidth: 380, marginLeft: 'auto', marginRight: 'auto',
        }}>
          для того, что происходит между двумя людьми<br />
          <span style={{ opacity: 0.7 }}>for what happens between two people</span>
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ key: 'ru', title: 'русский', sub: 'продолжить' }, { key: 'en', title: 'english', sub: 'continue' }].map(l => (
            <button key={l.key} onClick={() => onPick(l.key)} className="lang-btn" style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 14, padding: '18px 32px', minWidth: 160, color: theme.text, cursor: 'pointer',
            }}>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 24, lineHeight: 1 }}>{l.title}</div>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: 6, letterSpacing: '0.06em' }}>{l.sub}</div>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11.5, opacity: 0.4, marginTop: 40, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
          AI ответит на том языке, на котором ты ему напишешь<br />
          the AI replies in whatever language you write in
        </p>
      </div>
    </div>
  );
}

function Header({ theme, themeKey, setThemeKey, language, setLanguage, hasMessages, onNew, t }) {
  return (
    <header style={{
      padding: '16px 18px 14px', borderBottom: `1px solid ${theme.border}`,
      display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12,
      background: theme.bg, position: 'sticky', top: 0, zIndex: 10,
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 8, padding: 2,
      }}>
        {['ru', 'en'].map(lng => (
          <button key={lng} onClick={() => setLanguage(lng)} style={{
            background: language === lng ? theme.text : 'transparent',
            color: language === lng ? theme.bg : theme.textMuted,
            border: 'none', borderRadius: 6, padding: '4px 10px',
            fontSize: 11, cursor: 'pointer', fontWeight: 500, letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}>{lng}</button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 24, lineHeight: 1, color: theme.text }}>{t.label}</div>
        <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.45, marginTop: 4 }}>{t.subtitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ThemePicker theme={theme} themeKey={themeKey} setThemeKey={setThemeKey} />
        {hasMessages && (
          <button onClick={onNew} className="pill" style={{
            background: 'transparent', border: `1px solid ${theme.borderStrong}`,
            borderRadius: 8, padding: '5px 11px', fontSize: 11.5, color: theme.text,
            opacity: 0.75, cursor: 'pointer',
          }}>{t.new}</button>
        )}
      </div>
    </header>
  );
}

function ThemePicker({ theme, themeKey, setThemeKey }) {
  return (
    <div style={{
      display: 'flex', gap: 6, alignItems: 'center',
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 999, padding: '4px 8px',
    }}>
      {THEME_ORDER.map(key => (
        <button key={key} onClick={() => setThemeKey(key)} className="swatch" aria-label={key} style={{
          background: THEMES[key].swatch,
          border: themeKey === key ? `2px solid ${theme.text}` : `1px solid ${theme.border}`,
          width: 14, height: 14, borderRadius: '50%', padding: 0, cursor: 'pointer',
        }} />
      ))}
    </div>
  );
}

function EmptyState({ theme, t, onPick }) {
  return (
    <div className="fade-in" style={{ paddingTop: 28, paddingBottom: 20 }}>
      <h1 className="empty-title" style={{
        fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
        fontSize: 44, lineHeight: 1.05, margin: 0, fontWeight: 400, letterSpacing: '-0.01em',
        whiteSpace: 'pre-line', color: theme.text,
      }}>{t.title}</h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: theme.textMuted, marginTop: 18, marginBottom: 32, maxWidth: 520 }}>
        {t.intro}
      </p>
      <div className="starters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {t.starters.map((s, i) => (
          <button key={i} className="starter" onClick={() => onPick(`${s.title.toLowerCase()} — ${s.sub}`)} style={{
            textAlign: 'left', background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 13, padding: '13px 14px 14px', color: theme.text,
          }}>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 16, marginBottom: 3, lineHeight: 1.2 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4 }}>{s.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ role, content, theme, t }) {
  if (role === 'user') {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
        <div style={{
          maxWidth: '86%', background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 16, padding: '11px 15px', fontSize: 15, lineHeight: 1.55,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: theme.text,
        }}>{content}</div>
      </div>
    );
  }
  if (role === 'error') {
    return (
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: theme.textFaint, marginBottom: 6 }}>⚠ ошибка</div>
        <div style={{
          fontSize: 13.5, lineHeight: 1.5, color: theme.textMuted,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 10, padding: '10px 12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>{content}</div>
      </div>
    );
  }
  return (
    <div className="fade-in" style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: theme.textMuted, marginBottom: 6 }}>{t.label}</div>
      <div style={{ fontSize: 15.5, lineHeight: 1.68, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: theme.text }}>{content}</div>
    </div>
  );
}

function ThinkingIndicator({ theme, t }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>{t.label}</div>
      <div style={{ display: 'flex', gap: 5, paddingLeft: 1 }}>
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: theme.text }} />
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: theme.text }} />
        <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: theme.text }} />
      </div>
    </div>
  );
}

function InputBar({ theme, t, input, setInput, send, loading, onKey, textareaRef, hasMessages, recording, toggleRecording, speechSupported }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: `linear-gradient(to top, ${theme.bg} 50%, ${theme.bg}D9 85%, transparent)`,
      padding: '32px 16px 18px', pointerEvents: 'none', transition: 'background 0.4s ease',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', pointerEvents: 'auto' }}>
        <div style={{
          background: theme.surface, border: `1px solid ${recording ? '#DC2626' : theme.border}`,
          borderRadius: 18, padding: '10px 10px 10px 16px',
          display: 'flex', alignItems: 'flex-end', gap: 6,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', transition: 'all 0.4s ease',
        }}>
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder={recording ? '…' : (hasMessages ? t.placeholder2 : t.placeholder1)} rows={1}
            style={{
              flex: 1, border: 'none', background: 'transparent', resize: 'none',
              fontFamily: 'inherit', fontSize: 15.5, color: theme.text, lineHeight: 1.5,
              padding: '7px 0', maxHeight: 200,
            }} />
          {speechSupported && (
            <button onClick={toggleRecording} disabled={loading}
              className={recording ? 'recording-ring' : 'mic-btn'} style={{
                background: recording ? '#DC2626' : 'transparent',
                color: recording ? '#FFF' : theme.text,
                border: recording ? 'none' : `1px solid ${theme.border}`,
                width: 36, height: 36, borderRadius: 11,
                cursor: loading ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, opacity: loading ? 0.4 : 1,
              }} aria-label={recording ? 'stop' : 'voice'}>
              {recording ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              )}
            </button>
          )}
          <button onClick={() => send()} disabled={!input.trim() || loading} className="send-btn" style={{
            background: input.trim() && !loading ? theme.accent : theme.inactive,
            color: theme.accentText, border: 'none', width: 36, height: 36, borderRadius: 11,
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }} aria-label="send">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 10.5, color: theme.textFaint, marginTop: 8, letterSpacing: '0.02em' }}>
          {recording ? t.listening : t.disclaimer}
        </div>
      </div>
    </div>
  );
}
