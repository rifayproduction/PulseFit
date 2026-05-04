let tg = window.Telegram?.WebApp || null;
let telegramInitialized = false;

function initTelegramWebApp() {
  const webApp = window.Telegram?.WebApp;

  if (!webApp || telegramInitialized) {
    return;
  }

  tg = webApp;
  tg.ready();
  tg.expand();
  tg.setHeaderColor("#101312");
  tg.setBackgroundColor("#101312");
  telegramInitialized = true;
}

window.initTelegramWebApp = initTelegramWebApp;

const HISTORY_KEY = "pulseFitHistory";
const PLAN_KEY = "pulseFitPlan";
const CUSTOM_TIMER_KEY = "pulseFitCustomTimer";

const AREA_LABELS = {
  legs: "Ноги",
  push: "Верх",
  core: "Кор",
  mobility: "Мобилити",
  cardio: "Пульс",
};

const EXERCISES = [
  {
    id: "squat",
    name: "Приседание",
    area: "legs",
    focus: "Бедра, ягодицы, корпус",
    cue: "Колени смотрят туда же, куда носки. Пятки остаются на полу.",
    technique: {
      setup: ["Поставь стопы чуть шире таза.", "Перенеси вес на середину стопы и пятку.", "Подтяни ребра вниз, взгляд направь вперед."],
      movement: ["Отводи таз назад и вниз.", "Опускайся до комфортной глубины без завала корпуса.", "Вставай через пятки, не своди колени внутрь."],
      breathing: ["Вдох на опускании.", "Выдох на подъеме."],
      mistakes: ["Не отрывай пятки.", "Не округляй поясницу внизу.", "Не ускоряйся ценой техники."],
    },
  },
  {
    id: "pushup",
    name: "Отжимание",
    area: "push",
    focus: "Грудь, плечи, трицепс",
    cue: "Тело остается одной линией от макушки до пяток.",
    technique: {
      setup: ["Поставь ладони под плечи или немного шире.", "Собери корпус и ягодицы.", "Упрись пальцами ног в пол."],
      movement: ["Опускай грудь между ладонями.", "Локти веди под углом около 45 градусов.", "Отталкивай пол и возвращайся в ровную планку."],
      breathing: ["Вдох вниз.", "Выдох на усилии вверх."],
      mistakes: ["Не проваливай таз.", "Не задирай голову.", "Ставь колени на пол, если качество повторений падает."],
    },
  },
  {
    id: "plank",
    name: "Планка",
    area: "core",
    focus: "Кор, плечевой пояс",
    cue: "Дыши спокойно и держи корпус как цельную линию.",
    technique: {
      setup: ["Поставь локти под плечи.", "Упрись предплечьями в пол.", "Слегка подкрути таз и напряги ягодицы."],
      movement: ["Сохраняй нейтральную шею.", "Толкай пол локтями.", "Не задерживай дыхание."],
      breathing: ["Короткий вдох носом.", "Длинный спокойный выдох."],
      mistakes: ["Не поднимай таз слишком высоко.", "Не проваливай поясницу.", "Остановись, если начинает болеть спина."],
    },
  },
  {
    id: "lunge",
    name: "Обратный выпад",
    area: "legs",
    focus: "Ягодицы, бедра, баланс",
    cue: "Шагай назад, а переднее колено держи над стопой.",
    technique: {
      setup: ["Встань ровно, стопы на ширине таза.", "Собери корпус.", "Руки держи перед собой или на поясе."],
      movement: ["Сделай шаг назад и мягко опустись.", "Передняя стопа полностью стоит на полу.", "Вернись вверх усилием передней ноги."],
      breathing: ["Вдох на шаге назад.", "Выдох на возвращении."],
      mistakes: ["Не бей коленом об пол.", "Не заваливайся вперед.", "Не разворачивай таз в сторону."],
    },
  },
  {
    id: "deadbug",
    name: "Dead bug",
    area: "core",
    focus: "Глубокий кор, контроль поясницы",
    cue: "Поясница мягко прижата, движение медленное.",
    technique: {
      setup: ["Ляг на спину.", "Подними бедра и руки вверх.", "Прижми поясницу к полу без напряжения шеи."],
      movement: ["Опускай противоположные руку и ногу.", "Возвращайся в центр без рывка.", "Чередуй стороны."],
      breathing: ["Выдох при опускании.", "Вдох при возврате."],
      mistakes: ["Не выгибай поясницу.", "Не спеши.", "Уменьши амплитуду, если теряешь контроль."],
    },
  },
  {
    id: "mountain",
    name: "Альпинист",
    area: "cardio",
    focus: "Пульс, кор, плечи",
    cue: "Плечи над ладонями, колени двигаются под корпус.",
    technique: {
      setup: ["Встань в высокую планку.", "Поставь ладони под плечи.", "Собери живот и ягодицы."],
      movement: ["Подтяни одно колено к груди.", "Верни ногу назад и смени сторону.", "Держи корпус устойчивым."],
      breathing: ["Дыши ритмично.", "Не задерживай дыхание на ускорении."],
      mistakes: ["Не раскачивай таз.", "Не переносись назад на пятки.", "Снизь темп, если плечи устают раньше корпуса."],
    },
  },
  {
    id: "hiphinge",
    name: "Наклон тазом",
    area: "mobility",
    focus: "Задняя поверхность бедра, спина",
    cue: "Движение начинается тазом, а спина остается длинной.",
    technique: {
      setup: ["Поставь стопы на ширине таза.", "Слегка согни колени.", "Положи ладони на ребра или бедра."],
      movement: ["Отведи таз назад.", "Наклоняй корпус без округления спины.", "Вернись вверх, сжимая ягодицы."],
      breathing: ["Вдох на наклоне.", "Выдох на подъеме."],
      mistakes: ["Не тянись головой вниз.", "Не сгибайся в пояснице.", "Не блокируй колени полностью."],
    },
  },
  {
    id: "shoulders",
    name: "Круги плечами",
    area: "mobility",
    focus: "Плечи, грудной отдел",
    cue: "Движение плавное, без боли и хруста через силу.",
    technique: {
      setup: ["Встань ровно.", "Опусти ребра и расслабь шею.", "Разведи руки в стороны или держи кисти на плечах."],
      movement: ["Крути плечи назад большой амплитудой.", "Сохраняй ровное дыхание.", "Затем поменяй направление."],
      breathing: ["Дыши свободно.", "На напряжении делай длинный выдох."],
      mistakes: ["Не поднимай плечи к ушам.", "Не делай резких кругов.", "Не работай через боль."],
    },
  },
  {
    id: "glutebridge",
    name: "Ягодичный мост",
    area: "legs",
    focus: "Ягодицы, задняя линия",
    cue: "Поднимай таз ягодицами, а не прогибом в пояснице.",
    technique: {
      setup: ["Ляг на спину.", "Поставь стопы ближе к тазу.", "Руки положи вдоль корпуса."],
      movement: ["Подними таз до прямой линии бедра и корпуса.", "Задержись на короткий счет.", "Опускайся плавно."],
      breathing: ["Выдох наверху.", "Вдох при опускании."],
      mistakes: ["Не разводи колени слишком широко.", "Не переразгибай поясницу.", "Держи стопы полностью на полу."],
    },
  },
  {
    id: "birdDog",
    name: "Bird dog",
    area: "core",
    focus: "Баланс, кор, спина",
    cue: "Таз смотрит в пол, движение контролируемое.",
    technique: {
      setup: ["Встань на четвереньки.", "Ладони под плечами, колени под тазом.", "Шея продолжает линию спины."],
      movement: ["Вытяни противоположные руку и ногу.", "Сохрани корпус неподвижным.", "Вернись и смени сторону."],
      breathing: ["Выдох на вытяжении.", "Вдох на возврате."],
      mistakes: ["Не разворачивай таз.", "Не прогибайся в пояснице.", "Не поднимай ногу выше линии корпуса."],
    },
  },
];

const PLANS = [
  {
    id: "base",
    title: "База без инвентаря",
    meta: "12 мин - все тело",
    level: "Новичок",
    description: "Ровная тренировка для запуска привычки: ноги, верх, кор и спокойная мобилити в конце.",
    tags: ["без инвентаря", "дом", "умеренно"],
    work: 35,
    rest: 15,
    exercises: ["squat", "pushup", "plank", "lunge", "deadbug", "shoulders"],
  },
  {
    id: "core",
    title: "Кор и осанка",
    meta: "9 мин - контроль",
    level: "Спокойно",
    description: "Медленная сессия на корпус, поясницу и устойчивость. Хороша после сидячего дня.",
    tags: ["кор", "техника", "без прыжков"],
    work: 40,
    rest: 12,
    exercises: ["plank", "deadbug", "birdDog", "glutebridge", "hiphinge"],
  },
  {
    id: "pulse",
    title: "Пульс 10",
    meta: "10 мин - энергично",
    level: "Средне",
    description: "Короткая бодрая тренировка, где техника важнее скорости. Подходит, когда мало времени.",
    tags: ["пульс", "кор", "ноги"],
    work: 30,
    rest: 15,
    exercises: ["mountain", "squat", "pushup", "lunge", "plank", "glutebridge"],
  },
];

const tabs = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-view-panel]");
const todayLabel = document.getElementById("todayLabel");
const streakCount = document.getElementById("streakCount");
const changePlanButton = document.getElementById("changePlanButton");
const selectedPlanTitle = document.getElementById("selectedPlanTitle");
const selectedPlanMeta = document.getElementById("selectedPlanMeta");
const planExerciseList = document.getElementById("planExerciseList");
const openLibraryButton = document.getElementById("openLibraryButton");
const planCards = document.getElementById("planCards");
const libraryList = document.getElementById("libraryList");
const exerciseSearch = document.getElementById("exerciseSearch");
const areaFilterButtons = document.querySelectorAll("[data-area-filter]");
const sessionRing = document.getElementById("sessionRing");
const timerValue = document.getElementById("timerValue");
const currentStepType = document.getElementById("currentStepType");
const currentStepTitle = document.getElementById("currentStepTitle");
const currentStepHint = document.getElementById("currentStepHint");
const nextStepLabel = document.getElementById("nextStepLabel");
const stepCounter = document.getElementById("stepCounter");
const startPauseButton = document.getElementById("startPauseButton");
const resetSessionButton = document.getElementById("resetSessionButton");
const skipStepButton = document.getElementById("skipStepButton");
const ringProgress = document.getElementById("ringProgress");
const weekSessions = document.getElementById("weekSessions");
const weekMinutes = document.getElementById("weekMinutes");
const planStepsCount = document.getElementById("planStepsCount");
const totalSessions = document.getElementById("totalSessions");
const totalMinutes = document.getElementById("totalMinutes");
const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const exerciseSheet = document.getElementById("exerciseSheet");
const sheetBackdrop = document.getElementById("sheetBackdrop");
const sheetClose = document.getElementById("sheetClose");
const sheetArea = document.getElementById("sheetArea");
const sheetTitle = document.getElementById("sheetTitle");
const techniqueGrid = document.getElementById("techniqueGrid");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastText = document.getElementById("toastText");
const workDurationValue = document.getElementById("workDurationValue");
const restDurationValue = document.getElementById("restDurationValue");
const roundsValue = document.getElementById("roundsValue");
const customTimerSummary = document.getElementById("customTimerSummary");
const startCustomTimerButton = document.getElementById("startCustomTimerButton");
const stepControls = document.querySelectorAll("[data-step-control]");

let history = loadHistory();
let selectedPlanId = localStorage.getItem(PLAN_KEY) || "base";
let areaFilter = "all";
let customTimer = loadCustomTimer();
let session = createEmptySession();
let ticker = null;
let toastTimer = null;

initTelegramWebApp();
renderAll();

function createEmptySession() {
  return {
    mode: "plan",
    planId: selectedPlanId,
    title: "",
    steps: [],
    index: 0,
    remaining: 0,
    running: false,
    startedAt: null,
    completed: false,
  };
}

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 80)));
}

function loadCustomTimer() {
  try {
    return {
      work: 35,
      rest: 15,
      rounds: 6,
      ...JSON.parse(localStorage.getItem(CUSTOM_TIMER_KEY) || "{}"),
    };
  } catch {
    return { work: 35, rest: 15, rounds: 6 };
  }
}

function saveCustomTimer() {
  localStorage.setItem(CUSTOM_TIMER_KEY, JSON.stringify(customTimer));
}

function getPlan(id = selectedPlanId) {
  return PLANS.find((plan) => plan.id === id) || PLANS[0];
}

function getExercise(id) {
  return EXERCISES.find((exercise) => exercise.id === id);
}

function showView(view) {
  const nextView = ["today", "plans", "library", "timer", "progress"].includes(view) ? view : "today";
  document.body.dataset.view = nextView;

  panels.forEach((panel) => {
    const active = panel.dataset.viewPanel === nextView;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });

  tabs.forEach((tab) => {
    const activeTab = nextView === "plans" ? "today" : nextView;
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });

  if (nextView === "library") {
    window.setTimeout(() => exerciseSearch?.focus(), 120);
  }
}

function buildPlanSteps(plan) {
  const steps = [];

  plan.exercises.forEach((exerciseId, index) => {
    const exercise = getExercise(exerciseId);

    if (!exercise) {
      return;
    }

    steps.push({
      kind: "work",
      title: exercise.name,
      hint: exercise.cue,
      duration: plan.work,
      exerciseId,
    });

    if (index < plan.exercises.length - 1) {
      steps.push({
        kind: "rest",
        title: "Отдых",
        hint: "Встряхни руки, восстанови дыхание и готовься к следующему движению.",
        duration: plan.rest,
      });
    }
  });

  return steps;
}

function buildCustomSteps() {
  const steps = [];

  for (let round = 1; round <= customTimer.rounds; round += 1) {
    steps.push({
      kind: "work",
      title: `Раунд ${round}`,
      hint: "Работай ровно. Последние секунды не должны ломать технику.",
      duration: customTimer.work,
    });

    if (round < customTimer.rounds) {
      steps.push({
        kind: "rest",
        title: "Отдых",
        hint: "Восстанови дыхание и держи внимание на следующем раунде.",
        duration: customTimer.rest,
      });
    }
  }

  return steps;
}

function preparePlanSession(planId = selectedPlanId) {
  const plan = getPlan(planId);
  session = {
    mode: "plan",
    planId: plan.id,
    title: plan.title,
    steps: buildPlanSteps(plan),
    index: 0,
    remaining: plan.work,
    running: false,
    startedAt: null,
    completed: false,
  };
  syncSessionStep();
}

function prepareCustomSession() {
  session = {
    mode: "custom",
    planId: null,
    title: "Своя интервальная сессия",
    steps: buildCustomSteps(),
    index: 0,
    remaining: customTimer.work,
    running: false,
    startedAt: null,
    completed: false,
  };
  syncSessionStep();
}

function syncSessionStep() {
  const step = session.steps[session.index];

  if (step) {
    session.remaining = Math.min(session.remaining || step.duration, step.duration);
  } else {
    session.remaining = 0;
  }

  renderSession();
}

function startOrPause() {
  if (!session.steps.length || session.completed) {
    preparePlanSession();
  }

  session.running = !session.running;

  if (session.running && !session.startedAt) {
    session.startedAt = Date.now();
  }

  tg?.HapticFeedback?.impactOccurred("light");
  updateTicker();
  renderSession();
}

function updateTicker() {
  window.clearInterval(ticker);

  if (!session.running) {
    return;
  }

  ticker = window.setInterval(() => {
    session.remaining -= 1;

    if (session.remaining <= 0) {
      nextStep();
      return;
    }

    renderSession();
  }, 1000);
}

function nextStep() {
  if (!session.steps.length) {
    return;
  }

  const nextIndex = session.index + 1;

  if (nextIndex >= session.steps.length) {
    completeSession();
    return;
  }

  session.index = nextIndex;
  session.remaining = session.steps[session.index].duration;
  tg?.HapticFeedback?.selectionChanged();
  renderSession();
}

function resetSession() {
  window.clearInterval(ticker);
  session.running = false;
  session.completed = false;

  if (session.mode === "custom") {
    prepareCustomSession();
  } else {
    preparePlanSession(selectedPlanId);
  }

  tg?.HapticFeedback?.impactOccurred("light");
}

function completeSession() {
  window.clearInterval(ticker);
  session.running = false;
  session.completed = true;
  session.remaining = 0;

  const totalSeconds = session.steps.reduce((sum, step) => sum + step.duration, 0);
  const entry = {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    title: session.title || "Тренировка",
    mode: session.mode,
    seconds: totalSeconds,
  };

  history.unshift(entry);
  saveHistory();
  tg?.HapticFeedback?.notificationOccurred("success");
  showToast("Тренировка завершена", "Сессия сохранена в прогрессе.");
  renderAll();
}

function selectPlan(planId) {
  selectedPlanId = planId;
  localStorage.setItem(PLAN_KEY, selectedPlanId);
  preparePlanSession(selectedPlanId);
  tg?.HapticFeedback?.selectionChanged();
  renderAll();
  showView("today");
}

function renderAll() {
  renderToday();
  renderPlanCards();
  renderLibrary();
  renderCustomTimer();
  renderProgress();
  renderSession();
}

function renderToday() {
  const plan = getPlan();
  const date = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  todayLabel.textContent = capitalize(date);
  selectedPlanTitle.textContent = plan.title;
  selectedPlanMeta.textContent = plan.meta;
  planStepsCount.textContent = plan.exercises.length;

  planExerciseList.innerHTML = "";
  plan.exercises.forEach((exerciseId) => {
    const exercise = getExercise(exerciseId);

    if (exercise) {
      planExerciseList.append(createExerciseCard(exercise, plan.work));
    }
  });

  const weekStats = getWeekStats();
  weekSessions.textContent = weekStats.sessions;
  weekMinutes.textContent = Math.round(weekStats.seconds / 60);
  streakCount.textContent = getStreakDays();
}

function renderPlanCards() {
  planCards.innerHTML = "";

  PLANS.forEach((plan) => {
    const card = document.createElement("button");
    card.className = "plan-card";
    card.type = "button";
    card.classList.toggle("active", plan.id === selectedPlanId);
    card.innerHTML = `
      <div class="plan-card-head">
        <div>
          <h2>${escapeHtml(plan.title)}</h2>
          <p>${escapeHtml(plan.description)}</p>
        </div>
        <small>${escapeHtml(plan.level)}</small>
      </div>
      <div class="plan-tags">
        ${plan.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => selectPlan(plan.id));
    planCards.append(card);
  });
}

function renderLibrary() {
  const query = normalize(exerciseSearch.value);
  libraryList.innerHTML = "";

  const filtered = EXERCISES.filter((exercise) => {
    const matchesArea = areaFilter === "all" || exercise.area === areaFilter;
    const matchesQuery = !query || normalize(`${exercise.name} ${exercise.focus}`).includes(query);
    return matchesArea && matchesQuery;
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "history-card";
    empty.innerHTML = `<div class="history-copy"><strong>Ничего не найдено</strong><span>Попробуй другой запрос или фильтр.</span></div>`;
    libraryList.append(empty);
    return;
  }

  filtered.forEach((exercise) => {
    libraryList.append(createExerciseCard(exercise));
  });
}

function renderSession() {
  const step = session.steps[session.index];
  const totalSteps = session.steps.length;
  const progress = step ? ((step.duration - session.remaining) / step.duration) * 100 : 0;

  document.documentElement.style.setProperty("--ring-progress", String(Math.max(0, Math.min(100, progress))));
  sessionRing.classList.toggle("resting", Boolean(step && step.kind === "rest"));
  timerValue.textContent = formatTime(session.remaining);
  currentStepType.textContent = step ? (step.kind === "rest" ? "Отдых" : "Работа") : "Готовность";
  currentStepTitle.textContent = step ? step.title : "Нажми старт";
  currentStepHint.textContent = step ? step.hint : "Выбери план и начни тренировку.";
  nextStepLabel.textContent = getNextStepLabel();
  stepCounter.textContent = totalSteps ? `${session.index + 1} / ${totalSteps}` : "0 / 0";
  startPauseButton.textContent = session.running ? "Пауза" : session.completed ? "Повторить" : "Старт";
  resetSessionButton.disabled = !totalSteps;
  skipStepButton.disabled = !totalSteps || session.completed;

  if (ringProgress) {
    ringProgress.style.strokeDashoffset = `calc(327 - (327 * ${Math.max(0, Math.min(100, progress))}) / 100)`;
  }
}

function renderCustomTimer() {
  workDurationValue.textContent = `${customTimer.work} с`;
  restDurationValue.textContent = `${customTimer.rest} с`;
  roundsValue.textContent = customTimer.rounds;
  customTimerSummary.textContent = `${customTimer.rounds} ${plural(customTimer.rounds, "раунд", "раунда", "раундов")}: ${customTimer.work} секунд работы и ${customTimer.rest} секунд отдыха.`;
}

function renderProgress() {
  const seconds = history.reduce((sum, entry) => sum + Number(entry.seconds || 0), 0);
  totalSessions.textContent = history.length;
  totalMinutes.textContent = Math.round(seconds / 60);
  historyList.innerHTML = "";

  history.slice(0, 12).forEach((entry) => {
    const card = document.createElement("article");
    card.className = "history-card";
    const date = new Date(entry.date);
    const label = date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    card.innerHTML = `
      <span class="exercise-badge" aria-hidden="true">${getHistoryIcon()}</span>
      <div class="history-copy">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${label} - ${Math.round(Number(entry.seconds || 0) / 60)} мин</span>
      </div>
      <span class="area-chip">${entry.mode === "custom" ? "таймер" : "план"}</span>
    `;
    historyList.append(card);
  });
}

function createExerciseCard(exercise, duration) {
  const card = document.createElement("button");
  card.className = "exercise-card";
  card.type = "button";
  card.innerHTML = `
    <span class="exercise-badge" aria-hidden="true">${getAreaIcon(exercise.area)}</span>
    <span class="exercise-copy">
      <strong>${escapeHtml(exercise.name)}</strong>
      <span>${escapeHtml(exercise.focus)}</span>
    </span>
    <span class="duration-chip">${duration ? `${duration}с` : AREA_LABELS[exercise.area]}</span>
  `;
  card.addEventListener("click", () => openExerciseSheet(exercise));
  return card;
}

function openExerciseSheet(exercise) {
  sheetArea.textContent = `${AREA_LABELS[exercise.area]} - техника`;
  sheetTitle.textContent = exercise.name;
  techniqueGrid.innerHTML = "";

  [
    ["Старт", exercise.technique.setup],
    ["Движение", exercise.technique.movement],
    ["Дыхание", exercise.technique.breathing],
    ["Не делай так", exercise.technique.mistakes],
  ].forEach(([title, items]) => {
    const block = document.createElement("div");
    block.className = "technique-block";
    block.innerHTML = `
      <strong>${title}</strong>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    `;
    techniqueGrid.append(block);
  });

  exerciseSheet.hidden = false;
  exerciseSheet.setAttribute("aria-hidden", "false");
  tg?.HapticFeedback?.selectionChanged();
}

function closeExerciseSheet() {
  exerciseSheet.hidden = true;
  exerciseSheet.setAttribute("aria-hidden", "true");
}

function getNextStepLabel() {
  if (!session.steps.length) {
    return "Следующее упражнение";
  }

  const next = session.steps[session.index + 1];
  return next ? `Дальше: ${next.title}` : "Финишный шаг";
}

function adjustCustomTimer(kind, delta) {
  if (kind === "work") {
    customTimer.work = clamp(customTimer.work + delta, 10, 120);
  } else if (kind === "rest") {
    customTimer.rest = clamp(customTimer.rest + delta, 5, 90);
  } else if (kind === "rounds") {
    customTimer.rounds = clamp(customTimer.rounds + delta, 1, 20);
  }

  saveCustomTimer();
  renderCustomTimer();
}

function getWeekStats() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const entries = history.filter((entry) => new Date(entry.date) >= start);
  return {
    sessions: entries.length,
    seconds: entries.reduce((sum, entry) => sum + Number(entry.seconds || 0), 0),
  };
}

function getStreakDays() {
  const days = new Set(history.map((entry) => dateKey(new Date(entry.date))));
  let count = 0;
  const cursor = new Date();

  for (let offset = 0; offset < 90; offset += 1) {
    const key = dateKey(cursor);

    if (!days.has(key)) {
      break;
    }

    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function normalize(value) {
  return String(value || "").trim().toLocaleLowerCase("ru-RU");
}

function capitalize(value) {
  return value ? value[0].toLocaleUpperCase("ru-RU") + value.slice(1) : value;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function plural(value, one, few, many) {
  const abs = Math.abs(value) % 100;
  const last = abs % 10;

  if (abs > 10 && abs < 20) {
    return many;
  }

  if (last === 1) {
    return one;
  }

  if (last >= 2 && last <= 4) {
    return few;
  }

  return many;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(title, text) {
  window.clearTimeout(toastTimer);
  toastTitle.textContent = title;
  toastText.textContent = text;
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 2600);
}

function getAreaIcon(area) {
  const icons = {
    legs: `<svg viewBox="0 0 24 24" focusable="false"><path d="M8 4v7l-2 8M14 4v6l4 9M7 12h7"></path></svg>`,
    push: `<svg viewBox="0 0 24 24" focusable="false"><path d="M4 15h16M7 15l2-5h6l2 5M9 10V7m6 3V7"></path></svg>`,
    core: `<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8l2 7-6 7-6-7 2-7Z"></path></svg>`,
    mobility: `<svg viewBox="0 0 24 24" focusable="false"><path d="M5 12c4-7 10-7 14 0M5 12c4 7 10 7 14 0"></path></svg>`,
    cardio: `<svg viewBox="0 0 24 24" focusable="false"><path d="M4 12h4l2-5 4 10 2-5h4"></path></svg>`,
  };
  return icons[area] || icons.mobility;
}

function getHistoryIcon() {
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="M20 7 9 18l-5-5"></path></svg>`;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showView(tab.dataset.tab);
  });
});

changePlanButton.addEventListener("click", () => {
  showView("plans");
});

openLibraryButton.addEventListener("click", () => {
  showView("library");
});

startPauseButton.addEventListener("click", startOrPause);
resetSessionButton.addEventListener("click", resetSession);
skipStepButton.addEventListener("click", nextStep);

exerciseSearch.addEventListener("input", renderLibrary);

areaFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    areaFilter = button.dataset.areaFilter;
    areaFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderLibrary();
  });
});

stepControls.forEach((button) => {
  button.addEventListener("click", () => {
    adjustCustomTimer(button.dataset.stepControl, Number(button.dataset.delta));
  });
});

startCustomTimerButton.addEventListener("click", () => {
  prepareCustomSession();
  showView("today");
  startOrPause();
});

clearHistoryButton.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderAll();
  showToast("История очищена", "Можно начать новую серию тренировок.");
});

sheetBackdrop.addEventListener("click", closeExerciseSheet);
sheetClose.addEventListener("click", closeExerciseSheet);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !exerciseSheet.hidden) {
    closeExerciseSheet();
  }
});

preparePlanSession(selectedPlanId);
