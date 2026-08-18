const state = { config: null, round: 0, score: 0, selectedCategory: null, currentQuestion: null, rotation: 0, spinTimer: null, revealTimer: null, autoResetTimer: null, pointerFrame: null, pointerAnimation: null, usedCategoryIds: new Set(), sessionResults: [], statsRecorded: false };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

async function loadConfig() {
  const config = window.ACTIVITY_CONFIG;
  if (!config) throw new Error('Configuration introuvable.');
  validateConfig(config);
  return typeof structuredClone === 'function' ? structuredClone(config) : JSON.parse(JSON.stringify(config));
}

function validateConfig(config) {
  if (!config.title || !Array.isArray(config.categories) || config.categories.length < 2) {
    throw new Error('La configuration doit contenir un titre et au moins deux catégories.');
  }
  if (!Number.isFinite(config.spinDurationMs) || config.spinDurationMs < 1000) {
    throw new Error('spinDurationMs doit être un nombre supérieur ou égal à 1000.');
  }
  if (!Number.isInteger(config.questionsPerGame) || config.questionsPerGame < 0) {
    throw new Error('questionsPerGame doit être un nombre entier supérieur ou égal à 0.');
  }
  ['resultAutoResetSeconds', 'sessionAutoResetSeconds'].forEach(option => {
    if (config[option] === undefined) config[option] = 0;
    if (!Number.isFinite(config[option]) || config[option] < 0) {
      throw new Error(`${option} doit être un nombre supérieur ou égal à 0.`);
    }
  });
  if (config.selectedCategoryDelayMs === undefined) config.selectedCategoryDelayMs = 2500;
  if (!Number.isFinite(config.selectedCategoryDelayMs) || config.selectedCategoryDelayMs < 0) {
    throw new Error('selectedCategoryDelayMs doit être un nombre supérieur ou égal à 0.');
  }
  if (typeof config.statsPassword !== 'string' || config.statsPassword.length === 0) {
    throw new Error('statsPassword doit être défini dans la configuration.');
  }
  config.categories.forEach((category) => {
    if (!category.name || !category.icon || !category.color || !category.questions?.length) {
      throw new Error(`La catégorie « ${category.name || 'sans nom'} » est incomplète.`);
    }
  });
}

function isInfiniteMode() {
  return state.config.questionsPerGame === 0;
}

function hasReachedEnd() {
  return !isInfiniteMode() && state.round >= state.config.questionsPerGame;
}

function clearAutoReset() {
  if (state.autoResetTimer) window.clearTimeout(state.autoResetTimer);
  state.autoResetTimer = null;
}

function scheduleAutoReset(delaySeconds) {
  clearAutoReset();
  if (delaySeconds === 0) return;
  state.autoResetTimer = window.setTimeout(restart, delaySeconds * 1000);
}

function scheduleSessionAutoReset() {
  if (state.round === 0) return;
  scheduleAutoReset(state.config.sessionAutoResetSeconds);
}

function categoryIcon(category) {
  const alt = category.iconAlt || '';
  return `<img class="category-icon" src="${category.icon}" alt="${alt}" draggable="false" />`;
}

function controlIcon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function statsStorageKey() {
  return `ergo-stats-${todayKey()}`;
}

function emptyStats() {
  return { date: todayKey(), players: 0, questions: {} };
}

function loadStats() {
  const raw = localStorage.getItem(statsStorageKey());
  if (!raw) return emptyStats();
  try {
    return JSON.parse(raw);
  } catch {
    return emptyStats();
  }
}

function saveStats(stats) {
  localStorage.setItem(statsStorageKey(), JSON.stringify(stats));
}

function recordStats() {
  if (state.statsRecorded || !state.sessionResults.length) return;
  const stats = loadStats();
  stats.players += 1;

  state.sessionResults.forEach(result => {
    const questionId = result.question.text;
    if (!stats.questions[questionId]) {
      stats.questions[questionId] = {
        questionText: result.question.text,
        categoryName: result.category.name,
        appearances: 0,
        correct: 0,
        incorrect: 0,
        successRate: 0
      };
    }

    const item = stats.questions[questionId];
    item.appearances += 1;
    if (result.isCorrect) item.correct += 1;
    else item.incorrect += 1;
    item.successRate = item.appearances ? Math.round((item.correct / item.appearances) * 1000) / 10 : 0;
  });

  saveStats(stats);
  state.statsRecorded = true;
}

function renderStats() {
  const stats = loadStats();
  const questions = Object.values(stats.questions);
  $('#stats-player-count').textContent = stats.players;
  $('#stats-question-count').textContent = questions.reduce((total, question) => total + question.appearances, 0);
  $('#stats-table-body').innerHTML = questions.length ? questions.map(question => `
    <tr>
      <td><strong>${question.categoryName}</strong><span>${question.questionText}</span></td>
      <td>${question.appearances}</td>
      <td>${question.correct} / ${question.appearances}</td>
      <td>${question.successRate}%</td>
    </tr>
  `).join('') : '<tr><td colspan="4">Aucune partie enregistrée aujourd’hui.</td></tr>';
}

function openStats() {
  const password = window.prompt('Mot de passe des statistiques');
  if (password !== state.config.statsPassword) {
    if (password !== null) window.alert('Mot de passe incorrect.');
    return;
  }
  $('#runtime-questions').value = state.config.questionsPerGame;
  $('#runtime-result-reset').value = state.config.resultAutoResetSeconds;
  $('#runtime-session-reset').value = state.config.sessionAutoResetSeconds;
  renderStats();
  $('#stats-modal').hidden = false;
}

function closeStats() {
  $('#stats-modal').hidden = true;
}

function applyRuntimeSettings(event) {
  event.preventDefault();
  const questionsPerGame = $('#runtime-questions').valueAsNumber;
  const resultAutoResetSeconds = $('#runtime-result-reset').valueAsNumber;
  const sessionAutoResetSeconds = $('#runtime-session-reset').valueAsNumber;
  if (!Number.isInteger(questionsPerGame) || questionsPerGame < 0 || !Number.isFinite(resultAutoResetSeconds) || resultAutoResetSeconds < 0 || !Number.isFinite(sessionAutoResetSeconds) || sessionAutoResetSeconds < 0) {
    window.alert('Entrez des nombres valides supérieurs ou égaux à 0.');
    return;
  }
  Object.assign(state.config, { questionsPerGame, resultAutoResetSeconds, sessionAutoResetSeconds });
  closeStats();
  renderActivity();
  restart();
}

function exportStats() {
  const stats = loadStats();
  const questions = Object.values(stats.questions);
  const totalAppearances = questions.reduce((total, question) => total + question.appearances, 0);
  const lines = [
    `Statistiques - La roue des mythes et réalités`,
    `Date : ${stats.date}`,
    ``,
    `Nombre de joueurs : ${stats.players}`,
    `Questions vues : ${totalAppearances}`,
    ``,
    `Détail par question`,
    `===================`,
    ``
  ];

  if (!questions.length) {
    lines.push('Aucune partie enregistrée aujourd’hui.');
  } else {
    questions
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName, 'fr'))
      .forEach((question, index) => {
        lines.push(`${index + 1}. ${question.categoryName}`);
        lines.push(`Question : ${question.questionText}`);
        lines.push(`Apparitions : ${question.appearances}`);
        lines.push(`Bonnes réponses : ${question.correct}`);
        lines.push(`Mauvaises réponses : ${question.incorrect}`);
        lines.push(`Taux de réussite : ${question.successRate}%`);
        lines.push('');
      });
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `stats-${todayKey()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function resetStats() {
  localStorage.removeItem(statsStorageKey());
  renderStats();
}

function renderActivity() {
  const { title, organization, welcome, categories } = state.config;
  document.title = title;
  $('#activity-title').textContent = title;
  $('#organization').textContent = organization || '';
  $('#welcome-title').textContent = welcome.title;
  $('#instructions').textContent = welcome.instructions;
  $('.app-shell').classList.toggle('infinite-mode', isInfiniteMode());
  $('#topic-list').innerHTML = categories.map(c => `<div class="topic">${categoryIcon(c)}<span>${c.name}</span></div>`).join('');

  const slice = 360 / categories.length;
  const stops = categories.map((c, i) => `${c.color} ${i * slice}deg ${(i + 1) * slice}deg`).join(',');
  $('#wheel').style.background = `conic-gradient(from -${slice / 2}deg, ${stops})`;
  $('#wheel').innerHTML = categories.map((c, i) => {
    const angle = i * slice;
    const radians = angle * Math.PI / 180;
    const x = 50 + Math.sin(radians) * 35.5;
    const y = 50 - Math.cos(radians) * 35.5;
    return `<div class="wheel-segment" style="left:${x}%;top:${y}%">${categoryIcon(c)}<span>${c.name}</span></div>`;
  }).join('');
}

function showView(view, step) {
  const layout = $('.game-layout');
  layout.classList.toggle('single-screen', view !== 'welcome');
  layout.classList.toggle('result-screen', view === 'result');
  $$('.view').forEach(el => el.classList.toggle('active', el.id === `${view}-view`));
  $$('.step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
    el.classList.toggle('complete', i + 1 < step);
  });
}

function updateStatus() {
  if (isInfiniteMode()) return;
  const remaining = Math.max(0, state.config.questionsPerGame - state.round);
  $('#correct-total').textContent = state.score;
  $('#remaining-total').textContent = remaining;
}

function wheelAngle() {
  const transform = window.getComputedStyle($('#wheel')).transform;
  if (transform === 'none') return 0;
  const values = transform.slice(transform.indexOf('(') + 1, -1).split(',').map(Number);
  return Math.atan2(values[1], values[0]) * 180 / Math.PI;
}

function stopPointerTracking() {
  if (state.pointerFrame) window.cancelAnimationFrame(state.pointerFrame);
  if (state.pointerAnimation) state.pointerAnimation.cancel();
  state.pointerFrame = null;
  state.pointerAnimation = null;
}

function startPointerTracking(slice) {
  stopPointerTracking();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let previousSector = null;
  const pointer = $('.pointer');
  const track = () => {
    const angle = ((wheelAngle() % 360) + 360) % 360;
    const sector = Math.floor(((angle + slice / 2) % 360) / slice);
    if (previousSector !== null && sector !== previousSector) {
      if (state.pointerAnimation) state.pointerAnimation.cancel();
      state.pointerAnimation = pointer.animate([
        { transform: 'translate(-50%, 0) scaleX(1)' },
        { transform: 'translate(-50%, 7px) scaleX(.88)', offset: .35 },
        { transform: 'translate(-50%, 2px) scaleX(1.03)', offset: .7 },
        { transform: 'translate(-50%, 0) scaleX(1)' }
      ], { duration: 140, easing: 'ease-out' });
    }
    previousSector = sector;
    if (state.spinTimer) state.pointerFrame = window.requestAnimationFrame(track);
  };
  state.pointerFrame = window.requestAnimationFrame(track);
}

function spin() {
  if (state.spinTimer || state.revealTimer || hasReachedEnd()) return;
  clearAutoReset();
  const button = $('#spin-button');
  const trigger = $('#wheel-trigger');
  const duration = state.config.spinDurationMs;
  button.disabled = true;
  trigger.classList.add('spinning');
  trigger.setAttribute('aria-disabled', 'true');
  $('#selection-announcement').classList.remove('visible');
  $('#selection-announcement').textContent = '';
  showView('welcome', 2);
  const categories = state.config.categories;
  const availableCategories = categories.filter(category => !state.usedCategoryIds.has(category.id));
  const selectableCategories = availableCategories.length ? availableCategories : categories;
  const selectedCategory = selectableCategories[Math.floor(Math.random() * selectableCategories.length)];
  const selectedIndex = categories.indexOf(selectedCategory);
  const slice = 360 / categories.length;
  const extraTurns = 4 + Math.floor(Math.random() * 2);
  const normalized = ((state.rotation % 360) + 360) % 360;
  const target = extraTurns * 360 + (360 - selectedIndex * slice) - normalized;
  state.rotation += target;
  state.selectedCategory = selectedCategory;
  state.usedCategoryIds.add(selectedCategory.id);
  $('#wheel').style.transitionDuration = `${duration}ms`;
  $('#wheel').style.setProperty('--spin-duration', `${duration}ms`);
  $('#wheel').style.setProperty('--wheel-counter-rotation', `${-state.rotation}deg`);
  $('#wheel').style.transform = `rotate(${state.rotation}deg)`;
  state.spinTimer = window.setTimeout(() => {
    state.spinTimer = null;
    stopPointerTracking();
    trigger.classList.remove('spinning');
    trigger.setAttribute('aria-disabled', 'false');
    $('#selection-announcement').textContent = state.selectedCategory.name;
    $('#selection-announcement').classList.add('visible');
    state.revealTimer = window.setTimeout(() => {
      $('.game-layout').classList.add('fade-out');
      state.revealTimer = window.setTimeout(() => {
        showQuestion();
        $('.game-layout').classList.remove('fade-out');
        state.revealTimer = null;
      }, 420);
    }, state.config.selectedCategoryDelayMs);
  }, duration);
  startPointerTracking(slice);
}

function showQuestion() {
  const category = state.selectedCategory;
  const candidates = category.questions.filter(q => !q._asked);
  const pool = candidates.length ? candidates : category.questions;
  state.currentQuestion = pool[Math.floor(Math.random() * pool.length)];
  state.currentQuestion._asked = true;
  $('#question-count').textContent = isInfiniteMode() ? `Question ${state.round + 1}` : `Question ${state.round + 1} / ${state.config.questionsPerGame}`;
  $('#score-count').textContent = `${state.score} bonne${state.score > 1 ? 's' : ''} réponse${state.score > 1 ? 's' : ''}`;
  $('#progress-bar').style.width = isInfiniteMode() ? '0%' : `${(state.round / state.config.questionsPerGame) * 100}%`;
  $('#category-heading').innerHTML = `${categoryIcon(category)}<span>${category.name}</span>`;
  $('#question-text').textContent = state.currentQuestion.text;
  $('#spin-button').disabled = false;
  showView('question', 3);
  scheduleAutoReset(state.config.resultAutoResetSeconds);
}

function answer(value) {
  clearAutoReset();
  const isCorrect = value === state.currentQuestion.answer;
  if (isCorrect) state.score += 1;
  state.sessionResults.push({
    category: state.selectedCategory,
    question: state.currentQuestion,
    userAnswer: value,
    isCorrect
  });
  state.round += 1;
  updateStatus();
  $('#feedback-status').className = `feedback-status ${isCorrect ? 'correct' : 'incorrect'}`;
  $('#feedback-status').innerHTML = `${controlIcon(isCorrect ? 'check' : 'x')}<span>${isCorrect ? 'Bonne réponse!' : 'À revoir'}</span>`;
  $('#feedback-title').textContent = isCorrect ? 'Exactement!' : `Il s’agissait d’un ${state.currentQuestion.answer === 'mythe' ? 'mythe' : 'fait réel'}.`;
  $('#feedback-explanation').textContent = state.currentQuestion.explanation;
  $('#takeaway-text').textContent = state.currentQuestion.takeaway || '';
  $('#feedback-takeaway').hidden = !state.currentQuestion.takeaway;
  $('#next-button').textContent = hasReachedEnd() ? 'Voir mon résultat' : 'Question suivante';
  showView('feedback', 4);
  scheduleAutoReset(state.config.resultAutoResetSeconds);
}

function next() {
  if (hasReachedEnd()) return showResult();
  showView('welcome', 1);
  $('#welcome-title').textContent = 'Prêt pour la prochaine question?';
  $('#instructions').textContent = 'Tournez de nouveau la roue pour choisir une catégorie.';
  scheduleSessionAutoReset();
}

function showResult() {
  const total = state.config.questionsPerGame;
  recordStats();
  $('#final-score').textContent = `${state.score} / ${total}`;
  const ratio = state.score / total;
  $('.score-ring').style.setProperty('--score-deg', `${Math.round(ratio * 360)}deg`);
  $('#result-title').textContent = ratio === 1 ? 'Excellent!' : ratio >= .6 ? 'Bravo!' : 'Bien essayé!';
  $('#result-message').textContent = ratio === 1 ? 'Vous connaissez très bien les bonnes pratiques ergonomiques.' : 'Chaque bonne habitude contribue à prévenir les blessures.';
  $('#result-takeaway-list').innerHTML = state.sessionResults.map((result, index) => `
    <article class="result-takeaway-card" style="--category-color:${result.category.color}">
      <div class="result-card-heading">
        ${categoryIcon(result.category)}
        <span>${index + 1}. ${result.category.name}</span>
      </div>
      <p>${result.question.takeaway || result.question.explanation}</p>
    </article>
  `).join('');
  showView('result', 5);
  scheduleAutoReset(state.config.resultAutoResetSeconds);
}

function restart() {
  if (state.spinTimer) window.clearTimeout(state.spinTimer);
  if (state.revealTimer) window.clearTimeout(state.revealTimer);
  stopPointerTracking();
  clearAutoReset();
  state.spinTimer = null;
  state.revealTimer = null;
  state.round = 0; state.score = 0; state.selectedCategory = null; state.currentQuestion = null; state.rotation = 0; state.usedCategoryIds.clear(); state.sessionResults = []; state.statsRecorded = false;
  state.config.categories.forEach(c => c.questions.forEach(q => delete q._asked));
  const wheel = $('#wheel');
  wheel.style.transition = 'none';
  wheel.style.setProperty('--spin-duration', '0ms');
  wheel.style.setProperty('--wheel-counter-rotation', '0deg');
  wheel.style.transform = 'rotate(0deg)';
  void wheel.offsetWidth;
  wheel.style.transition = '';
  $('#wheel-trigger').classList.remove('spinning');
  $('#wheel-trigger').setAttribute('aria-disabled', 'false');
  $('#selection-announcement').classList.remove('visible');
  $('#selection-announcement').textContent = '';
  $('.game-layout').classList.remove('fade-out');
  $('#spin-button').disabled = false;
  $('#welcome-title').textContent = state.config.welcome.title;
  $('#instructions').textContent = state.config.welcome.instructions;
  updateStatus();
  showView('welcome', 1);
}

function bindEvents() {
  $('#spin-button').addEventListener('click', spin);
  $('#wheel-trigger').addEventListener('click', spin);
  $('#wheel-trigger').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      spin();
    }
  });
  $$('.answer-button').forEach(button => button.addEventListener('click', () => answer(button.dataset.answer)));
  $('#next-button').addEventListener('click', next);
  $('#reset-button').addEventListener('click', restart);
  $('#restart-button').addEventListener('click', restart);
  $('#stats-button').addEventListener('click', openStats);
  $('#close-stats-button').addEventListener('click', closeStats);
  $('#export-stats-button').addEventListener('click', exportStats);
  $('#reset-stats-button').addEventListener('click', resetStats);
  $('#runtime-settings-form').addEventListener('submit', applyRuntimeSettings);
  $('#stats-modal').addEventListener('click', event => {
    if (event.target.id === 'stats-modal') closeStats();
  });
}

async function init() {
  try {
    state.config = await loadConfig();
    renderActivity();
    bindEvents();
    updateStatus();
  } catch (error) {
    $('#panel').innerHTML = `<div class="view active"><h2>Impossible de démarrer l’activité</h2><p>${error.message}</p><p>Lancez la page depuis un petit serveur web local.</p></div>`;
    $('#spin-button').disabled = true;
  }
}

init();
