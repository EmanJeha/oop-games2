/* Student game page. Open as index.html?game=warmup or index.html?game=wrapup.
   Each pair plays on its own device; progress is sent live to the teacher's board. */
(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const gameId = params.get('game');
  const G = window.GAMES[gameId];
  const app = $('#app');

  /* ---------- no game chosen: pick one ---------- */
  if (!G) {
    floaters(['def', 'self', 'return', '.volume()', '( )', 'p1']);
    app.innerHTML = `<section class="center"><div class="card">
      <span class="pill">Grade 10 · Unit 2 · Session 2</span>
      <h1 class="title"><span class="c1">O</span><span class="c2">O</span><span class="c3">P</span> <span class="c4">G</span><span class="c5">a</span><span class="c1">m</span><span class="c2">e</span><span class="c3">s</span> <span class="c4">2</span></h1>
      <p class="lede">Choose the game your teacher asked for.</p>
      <div class="pick">
        <a class="w" href="?game=warmup"><small>Warm-up</small><b>Power Buttons!</b><span>Guess today's topic</span></a>
        <a class="r" href="?game=wrapup"><small>Wrap-up</small><b>Method Masters</b><span>Prove you got it</span></a>
      </div></div></section>`;
    return;
  }

  document.title = G.name;
  floaters(G.floaters || []);
  const N = G.questions.length;
  const KEY = 'oop10s2:' + gameId;
  let state = null, round = 1, me = null, players = {}, unsubPlayers = null, view = '';
  let tick = null, left = 0, answered = false, picks = [], cur = 0;

  const load = () => { const s = store.get(KEY, null); me = s && s.round === round ? s : null; };
  const persist = () => { if (me) store.set(KEY, me); };
  const pref = () => LIVE.playerRef(gameId, round, me.id);
  function sync(extra) {
    persist();
    if (!LIVE.on || !me) return;
    const body = { name: me.name, score: me.score, q: me.q, total: N, correct: me.correct, answers: me.answers, done: me.done, solved: !!me.solved, online: true };
    pref().update(Object.assign(body, extra || {})).catch(() => toast('Connection problem. Your answers are saved on this device.'));
  }
  function goOnline() {
    if (!LIVE.on || !me) return;
    const r = pref().child('online'); r.set(true); r.onDisconnect().set(false);
  }

  /* ---------- connect ---------- */
  if (LIVE.on) {
    LIVE.stateRef(gameId).on('value', (snap) => {
      const st = snap.val() || { status: 'waiting', round: 1 };
      const changed = !state || st.round !== state.round;
      state = st; round = st.round || 1;
      if (changed) { load(); subscribePlayers(); if (me) goOnline(); view = ''; }
      route();
    }, () => { state = { status: 'live', round: 1 }; load(); route(); });
  } else {
    state = { status: 'live', round: 1 }; load(); route();
  }
  function subscribePlayers() {
    if (unsubPlayers) unsubPlayers();
    const ref = LIVE.playersRef(gameId, round);
    const fn = (snap) => { players = snap.val() || {}; if (view === 'lobby') paintLobbyCount(); if (view === 'results') paintRank(); };
    ref.on('value', fn); unsubPlayers = () => ref.off('value', fn);
  }

  function route() {
    if (!me) { if (view !== 'join') renderJoin(); else paintJoinNote(); return; }
    if (me.done) { if (view !== 'results') renderResults(); return; }
    if (state.status === 'ended') { me.done = true; me.locked = true; sync({ finishedAt: LIVE.on ? LIVE.now() : Date.now() }); renderResults(); return; }
    if (state.status === 'waiting') { if (view !== 'lobby') renderLobby(); return; }
    if (view !== 'play') { if (me.q >= N) afterLast(); else renderQ(); }
  }

  /* ---------- join ---------- */
  function joinNote() {
    if (!LIVE.on) return `<p class="banner">${LIVE.error ? esc(LIVE.error) + ' ' : ''}Practice mode: this game is not connected to the class board.</p>`;
    if (state && state.status === 'ended') return '<p class="banner">This round has ended. Wait for your teacher to start a new one.</p>';
    return '<p class="banner ok">Connected to the class board</p>';
  }
  function paintJoinNote() { const n = $('#note'); if (n) n.innerHTML = joinNote(); const b = $('#joinBtn'); if (b) b.disabled = LIVE.on && state.status === 'ended'; }
  function renderJoin() {
    view = 'join';
    app.innerHTML = `<section class="center"><div class="card">
      <span class="pill">${esc(G.badge)}</span>
      <h1 class="title">${G.titleHTML}</h1>
      <p class="lede">${esc(G.intro)}</p>
      <div class="rules">${G.rules.map((r) => `<span>${esc(r)}</span>`).join('')}</div>
      <form class="namefield" id="join">
        <input id="pair" maxlength="28" placeholder="Your names, e.g. Sara & Noura" autocomplete="off" aria-label="Your pair's names">
        <button class="btn go" id="joinBtn" type="submit">Join →</button>
      </form>
      <p class="err" id="err"></p>
      <div id="note">${joinNote()}</div>
    </div></section>`;
    paintJoinNote();
    $('#join').onsubmit = (e) => {
      e.preventDefault();
      const name = $('#pair').value.trim().replace(/\s+/g, ' ');
      if (name.length < 2) { $('#err').textContent = 'Type both of your names first.'; $('#pair').focus(); return; }
      me = { round, id: 'p' + Math.random().toString(36).slice(2, 10), name, score: 0, q: 0, correct: 0, answers: {}, done: false, solved: false, revealed: [] };
      beep('tap');
      if (LIVE.on) { sync({ joinedAt: LIVE.now() }); goOnline(); }
      persist(); view = ''; route();
    };
  }

  /* ---------- lobby ---------- */
  function renderLobby() {
    view = 'lobby';
    app.innerHTML = `<section class="center"><div class="card">
      <span class="pill">${esc(G.name)}</span>
      <p class="lede">You're in!</p>
      <div class="bigname">${esc(me.name)}</div>
      <div class="wait-dots"><i></i><i></i><i></i><i></i></div>
      <h2 style="font-size:clamp(24px,3vw,32px)">Look at the smart board.<br>The game starts when your teacher presses Start.</h2>
      <p class="lede" id="count"></p>
    </div></section>`;
    paintLobbyCount();
  }
  function paintLobbyCount() { const c = $('#count'); if (c) { const n = Object.keys(players).length; c.textContent = n + (n === 1 ? ' pair has' : ' pairs have') + ' joined so far'; } }

  /* ---------- status bar + mystery ---------- */
  function barHTML() {
    return `<div class="sbar">
      <div class="who"><small>${esc(G.name)}</small><b>${esc(me.name)}</b></div>
      <div class="stat"><small>Question</small><b>${Math.min(cur + 1, N)}/${N}</b></div>
      <div class="stat"><small>Score</small><b class="score" id="score">${me.score}</b></div>
      <div class="ring" id="ring"><b id="tm">${G.seconds}</b></div>
    </div>
    <div class="qbar"><i style="width:${(me.q / N) * 100}%"></i></div>`;
  }
  function mysteryHTML() {
    if (!G.mystery) return '';
    const M = G.mystery; const rev = new Set(me.revealed || []);
    const tiles = M.phrase.split('').map((ch, i) => ch === ' ' ? '<span class="tile gap"></span>' : `<span class="tile ${rev.has(i) ? 'shown' : ''}" style="${rev.has(i) ? 'background:' + COLORS[i % COLORS.length] : ''}">${rev.has(i) ? ch : ''}</span>`).join('');
    return `<section class="mystery" id="mystery">
      <div class="top"><span class="lbl">${me.solved ? 'Topic cracked! +' + M.bonus : esc(M.label)}</span>
      ${me.solved ? '' : `<form class="guess" id="guessForm"><input id="guess" placeholder="Know the topic? Type it" autocomplete="off" aria-label="Guess the topic"><button class="btn small pink" type="submit">Guess</button></form>`}</div>
      <div class="tiles">${tiles}</div></section>`;
  }
  function bindMystery() {
    const f = $('#guessForm'); if (!f) return;
    f.onsubmit = (e) => {
      e.preventDefault();
      const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
      const v = $('#guess').value; if (!norm(v)) return;
      if (G.mystery.accept.some((a) => norm(a) === norm(v))) {
        me.solved = true; me.score += G.mystery.bonus;
        me.revealed = G.mystery.phrase.split('').map((c, i) => c === ' ' ? -1 : i).filter((i) => i >= 0);
        sync(); beep('win'); confetti(200); toast('You cracked it! +' + G.mystery.bonus);
        $('#mystery').outerHTML = mysteryHTML(); bumpScore();
      } else { beep('bad'); toast('Not quite. Keep collecting letters!'); $('#guess').value = ''; }
    };
  }
  function revealLetters(n) {
    if (!G.mystery) return;
    const have = new Set(me.revealed || []); let c = 0;
    for (const i of G.mystery.order) { if (c >= n) break; if (!have.has(i)) { have.add(i); c++; } }
    me.revealed = [...have];
  }
  function bumpScore() { const el = $('#score'); if (el) { el.textContent = me.score; el.animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'cubic-bezier(.2,1.4,.4,1)' }); } }

  /* ---------- questions ---------- */
  function hl(line) {
    const kw = (x) => esc(x)
      .replace(/\b(for|in|while|and|class|def|self|return|if|else)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(print|range|len|int|input)\b/g, '<span class="fn">$1</span>')
      .replace(/(^|[^\w])(\d+)(?![\w])/g, '$1<span class="num">$2</span>');
    if (/^\s*#/.test(line)) return '<span style="color:#8A90B5">' + esc(line) + '</span>';
    return line.split(/("[^"]*")/).map((part, i) => (i % 2 ? '<span class="str">' + esc(part) + '</span>' : kw(part))).join('');
  }
  function renderQ() {
    view = 'play'; answered = false; picks = []; cur = me.q;
    const q = G.questions[cur];
    let area = '';
    if (q.type === 'mc') area = `<div class="opts">${q.options.map((o, i) => `<button class="opt o${i}" data-i="${i}" data-k="${'ABCD'[i]}">${o}</button>`).join('')}</div>`;
    const slotLbl = (i) => q.wide ? 'Step ' + (i + 1) : '[' + i + ']';
    if (q.type === 'order') area = `<div class="order${q.wide ? ' wide' : ''}"><div class="slots">${q.answer.map((_, i) => `<div class="slot"><small>${slotLbl(i)}</small></div>`).join('')}</div>
      <div class="pool">${q.tiles.map((t, i) => `<button class="ptile" data-t="${i}" style="background:${COLORS[i % COLORS.length]}">${esc(t)}</button>`).join('')}</div>
      <div class="acts"><button class="btn small" id="undo">Undo</button><button class="btn go small" id="check" disabled>Check answer</button></div></div>`;
    if (q.type === 'line') area = `<div class="code">${q.code.map((l, i) => `<button class="cl" data-l="${i}"><span>${i + 1}</span><span>${hl(l)}</span></button>`).join('')}</div>`;
    app.innerHTML = `${barHTML()}${mysteryHTML()}
      <section class="qcard">
        <div class="qhead"><span class="tag n">Question ${cur + 1} of ${N}</span>${q.ctx ? `<span class="tag ctx">${esc(q.ctx)}</span>` : ''}<span class="tag hot">${esc(q.skill)}</span></div>
        <div class="qtext">${q.q}</div>
        ${q.sub ? `<p class="qsub">${q.sub}</p>` : ''}
        ${q.scene ? `<div class="scene">${q.scene}</div>` : ''}
        <div id="area">${area}</div>
        <div id="fb"></div>
      </section>`;
    bindMystery();
    if (q.type === 'mc') document.querySelectorAll('.opt').forEach((b) => b.onclick = () => answerMC(+b.dataset.i));
    if (q.type === 'order') {
      const fill = () => {
        document.querySelectorAll('.slot').forEach((s, i) => { const t = picks[i]; s.classList.toggle('filled', t != null); s.innerHTML = (t != null ? esc(q.tiles[t]) : '') + `<small>${slotLbl(i)}</small>`; });
        document.querySelectorAll('.ptile').forEach((b) => b.classList.toggle('used', picks.includes(+b.dataset.t)));
        $('#check').disabled = picks.length !== q.answer.length;
      };
      document.querySelectorAll('.ptile').forEach((b) => b.onclick = () => { if (answered || picks.length >= q.answer.length) return; picks.push(+b.dataset.t); fill(); });
      $('#undo').onclick = () => { if (!answered) { picks.pop(); fill(); } };
      $('#check').onclick = () => {
        if (answered) return; let ok = true;
        document.querySelectorAll('.slot').forEach((s, i) => { const g = String(q.tiles[picks[i]]) === String(q.answer[i]); s.classList.add(g ? 'ok' : 'no'); if (!g) ok = false; });
        done(ok);
      };
    }
    if (q.type === 'line') document.querySelectorAll('.cl').forEach((b) => b.onclick = () => {
      if (answered) return; const i = +b.dataset.l;
      if (i === q.answer) b.classList.add('right'); else { b.classList.add('wrong'); document.querySelector(`.cl[data-l="${q.answer}"]`).classList.add('right'); }
      done(i === q.answer);
    });
    startTimer();
  }
  function answerMC(i) {
    if (answered) return;
    const q = G.questions[cur];
    document.querySelectorAll('.opt').forEach((o) => { const k = +o.dataset.i; if (k === q.answer) o.classList.add('right'); else if (k === i) o.classList.add('wrong'); else o.classList.add('dim'); o.disabled = true; });
    done(i === q.answer);
  }
  function startTimer() {
    clearInterval(tick); left = G.seconds;
    const paint = () => { const r = $('#ring'); if (!r) return; r.style.setProperty('--p', left / G.seconds); $('#tm').textContent = left; r.classList.toggle('low', left <= 5); };
    paint();
    tick = setInterval(() => {
      left--; paint();
      if (left <= 0) {
        clearInterval(tick);
        const q = G.questions[cur];
        if (q.type === 'mc') document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; o.classList.add(+o.dataset.i === q.answer ? 'right' : 'dim'); });
        if (q.type === 'line') document.querySelector(`.cl[data-l="${q.answer}"]`).classList.add('right');
        done(false, "Time's up!");
      }
    }, 1000);
  }
  function done(ok, headline) {
    if (answered) return;
    answered = true; clearInterval(tick);
    const q = G.questions[cur];
    let pts = 0;
    if (ok) { pts = G.points + Math.round(50 * Math.max(0, left) / G.seconds); me.score += pts; me.correct++; revealLetters(G.mystery ? G.mystery.perCorrect : 0); beep('good'); confetti(); }
    else beep('bad');
    me.answers[cur] = ok ? 1 : 0; me.q = cur + 1;
    sync();
    bumpScore();
    const qb = document.querySelector('.qbar i'); if (qb) qb.style.width = (me.q / N) * 100 + '%';
    if (G.mystery) { const t = document.querySelector('#mystery .tiles'); if (t) t.outerHTML = mysteryHTML().match(/<div class="tiles">[\s\S]*?<\/div>/)[0]; }
    const praise = ['Brilliant!', 'Nailed it!', 'Spot on!', 'Sharp thinking!', 'Superb!'][cur % 5];
    const last = me.q >= N;
    $('#fb').innerHTML = `<div class="fb ${ok ? 'good' : 'bad'}">
      <h3>${headline || (ok ? praise + ' +' + pts : 'Not this time')}</h3>
      <p><b>Why?</b> ${q.why}</p>
      <div class="row"><button class="btn go" id="next">${last ? (G.mystery && !me.solved ? 'Final guess →' : 'See my results →') : 'Next question →'}</button></div></div>`;
    $('#next').onclick = () => { if (me.q >= N) afterLast(); else renderQ(); };
    $('#next').focus();
  }
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'Enter' && answered && $('#next')) $('#next').click();
  });

  /* ---------- warm-up final guess ---------- */
  function afterLast() {
    if (G.mystery && !me.solved && !me.finalTried) return renderFinal();
    finish();
  }
  function renderFinal() {
    view = 'play'; clearInterval(tick);
    const M = G.mystery;
    app.innerHTML = `${barHTML().replace(/<div class="ring"[\s\S]*?<\/div>/, '')}${mysteryHTML()}
      <section class="qcard">
        <div class="qhead"><span class="tag n">Final round</span><span class="tag hot">Synthesize</span><span class="tag ctx">+${M.bonus} bonus</span></div>
        <div class="qtext">${M.finalQ}</div>
        <div class="opts">${M.finalOptions.map((o, i) => `<button class="opt o${i}" data-i="${i}" data-k="${'ABCD'[i]}">${esc(o)}</button>`).join('')}</div>
        <div id="fb"></div></section>`;
    bindMystery();
    document.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
      if (me.finalTried) return;
      const i = +b.dataset.i, ok = i === M.finalAnswer;
      me.finalTried = true;
      document.querySelectorAll('.opt').forEach((o) => { o.disabled = true; const k = +o.dataset.i; o.classList.add(k === M.finalAnswer ? 'right' : k === i ? 'wrong' : 'dim'); });
      if (ok) { me.score += M.bonus; me.solved = true; beep('win'); confetti(200); } else beep('bad');
      me.revealed = M.phrase.split('').map((c, k) => c === ' ' ? -1 : k).filter((k) => k >= 0);
      sync(); bumpScore();
      $('#mystery').outerHTML = mysteryHTML();
      $('#fb').innerHTML = `<div class="fb ${ok ? 'good' : 'bad'}"><h3>${ok ? 'Correct! +' + M.bonus : 'The topic is ' + esc(M.finalOptions[M.finalAnswer])}</h3><p>${M.finalWhy}</p><div class="row"><button class="btn go" id="next">See my results →</button></div></div>`;
      $('#next').onclick = finish;
    });
  }

  /* ---------- results ---------- */
  function finish() {
    clearInterval(tick);
    me.done = true;
    sync({ finishedAt: LIVE.on ? LIVE.now() : Date.now() });
    beep('win'); confetti(240);
    renderResults();
  }
  function rankText() {
    const list = Object.entries(players).map(([id, p]) => ({ id, score: p.score || 0 }));
    if (!LIVE.on || !list.length) return '';
    list.sort((a, b) => b.score - a.score);
    const k = list.findIndex((p) => p.id === me.id);
    if (k < 0) return '';
    return `#${k + 1} of ${list.length} pairs right now`;
  }
  function paintRank() { const r = $('#rank'); if (r) r.textContent = rankText() || 'Check the smart board!'; }
  function renderResults() {
    view = 'results'; clearInterval(tick);
    const answeredCount = Object.keys(me.answers || {}).length;
    const extra = gameId === 'wrapup'
      ? `<div class="exit"><span class="pill">Exit ticket</span>
          <h2 style="font-size:clamp(22px,3vw,30px)">${esc(G.exitQ)}</h2>
          <textarea id="exitT" placeholder="${esc(G.exitPlaceholder)}">${esc(me.exit || '')}</textarea>
          <button class="btn small go" id="sendExit" type="button" style="justify-self:start">${me.exit ? 'Update my answer' : 'Send my answer'}</button>
          <div class="model" id="model" ${me.exit ? '' : 'hidden'}><b>Model answer:</b> ${esc(G.exitModel)}</div></div>`
      : `<div class="reveal"><span class="pill">Today's topic</span><div class="big">${esc(G.topic)}</div></div>
         <div class="recap">${(G.recap || []).map(([b, t]) => `<div><b>${esc(b)}</b>${esc(t)}</div>`).join('')}</div>`;
    app.innerHTML = `<section class="center"><div class="card">
      <span class="pill">${esc(G.name)}</span>
      <h1 style="font-size:clamp(30px,5vw,48px)">${me.locked && answeredCount < N ? "Time's up, " : 'Well played, '}${esc(me.name)}!</h1>
      <div class="big-score">${me.score}</div>
      <p class="lede" id="rank"></p>
      <div class="res-tiles"><div><small>Correct</small><b>${me.correct}/${N}</b></div><div><small>Answered</small><b>${answeredCount}/${N}</b></div><div><small>${G.mystery ? 'Topic' : 'Accuracy'}</small><b>${G.mystery ? (me.solved ? 'Cracked' : '—') : Math.round((me.correct / N) * 100) + '%'}</b></div></div>
      ${extra}
    </div></section>`;
    paintRank();
    const sb = $('#sendExit');
    if (sb) sb.onclick = () => {
      const t = $('#exitT').value.trim(); if (!t) { toast('Write your answer first'); return; }
      me.exit = t; sync({ exit: t }); $('#model').hidden = false; sb.textContent = 'Update my answer'; toast('Sent to your teacher');
    };
  }
})();
