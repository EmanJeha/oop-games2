/* Connects to your Firebase Realtime Database (if config.js is filled in).
   Data layout:
     sessions/<game>/state                         { status: waiting | live | ended, round, startedAt }
     sessions/<game>/rounds/<round>/players/<id>    one record per pair: name, score, q, correct, answers, done ... */
window.LIVE = (function () {
  // Accept window.FIREBASE_CONFIG, or Firebase's own snippet pasted as "const firebaseConfig = {...}"
  let cfg = window.FIREBASE_CONFIG;
  try { if (!cfg && typeof firebaseConfig !== 'undefined') cfg = firebaseConfig; } catch (e) {}
  try { if (!cfg && typeof FIREBASE_CONFIG !== 'undefined') cfg = FIREBASE_CONFIG; } catch (e) {}
  const found = !!cfg;
  cfg = Object.assign({}, cfg || {});
  // If databaseURL was left out (Firebase often omits it), build the default one from projectId
  if (!cfg.databaseURL && cfg.projectId && !/PASTE/.test(cfg.projectId)) {
    cfg.databaseURL = 'https://' + cfg.projectId + '-default-rtdb.firebaseio.com';
  }
  let problem = '';
  if (!found) problem = 'config.js did not load, or it has a typing mistake. Check that the file is named exactly config.js (not config.js.txt), and that it does not contain lines starting with "import".';
  else if (!cfg.apiKey || /PASTE/.test(cfg.apiKey)) problem = 'config.js still has "PASTE" in apiKey. This page is reading a config.js that was not edited: save your changes, and edit the config.js in the same folder as this page.';
  else if (!cfg.projectId || /PASTE/.test(cfg.projectId)) problem = 'config.js still has "PASTE" in projectId.';
  else if (/PASTE/.test(cfg.databaseURL)) problem = 'config.js still has "PASTE" in databaseURL. Copy the link shown at the top of the Realtime Database page in Firebase.';
  const filled = !problem;
  const base = 'sessions/' + (window.APP_ID ? String(window.APP_ID).replace(/[^\w-]/g, '') + '/' : '');
  let db = null, error = '';
  if (filled && window.firebase) {
    try { if (!firebase.apps.length) firebase.initializeApp(cfg); db = firebase.database(); }
    catch (e) { error = 'Firebase said: ' + e.message; }
  } else if (filled) error = 'The Firebase library did not load. Check the internet connection.';
  else error = problem;
  return {
    on: !!db, error, filled: !!filled,
    stateRef: (g) => db.ref(base + g + '/state'),
    playersRef: (g, round) => db.ref(base + g + '/rounds/' + round + '/players'),
    playerRef: (g, round, id) => db.ref(base + g + '/rounds/' + round + '/players/' + id),
    now: () => firebase.database.ServerValue.TIMESTAMP,
  };
})();
