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
const CUSTOM_WORKOUT_KEY = "pulseFitCustomWorkout";
const SAVED_WORKOUTS_KEY = "pulseFitSavedWorkouts";
const HIDDEN_PRESET_PLANS_KEY = "pulseFitHiddenPresetPlans";
const ACTIVE_SESSION_KEY = "pulseFitActiveSession";
const TIMER_SIGNAL_SECONDS = 3;

const AREA_LABELS = {
  legs: "Ноги",
  chest: "Грудь",
  back: "Спина",
  shoulders: "Плечи",
  arms: "Руки",
  core: "Кор",
};

const EXERCISES = [
  {
    id: "pushup_classic",
    name: "Классические отжимания",
    area: "chest",
    equipment: "без инвентаря",
    level: "средне",
    format: "повторы",
    muscles: ["грудь", "трицепс", "плечи"],
    focus: "Грудь, трицепс, передняя дельта",
    cue: "Тело держи одной линией, а локти веди примерно под 45 градусов.",
    technique: {
      setup: ["Поставь ладони чуть шире плеч.", "Собери пресс и ягодицы, вытолкни пол от себя."],
      movement: ["Опускай грудь между ладонями.", "Выжимайся вверх без провала таза."],
      breathing: ["Вдох на опускании.", "Выдох на подъеме."],
      mistakes: ["Не задирай голову.", "Не разводи локти строго в стороны."],
    },
  },
  {
    id: "pushup_knee",
    name: "Отжимания с колен",
    area: "chest",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["грудь", "трицепс"],
    focus: "Грудь, трицепс, контроль корпуса",
    cue: "Это не упрощение ради галочки: держи корпус таким же жестким, как в обычных отжиманиях.",
    technique: {
      setup: ["Поставь колени на пол, ладони чуть шире плеч.", "Сохрани прямую линию от головы до колен."],
      movement: ["Опускай грудь к полу контролируемо.", "Выжимайся вверх, не теряя напряжение корпуса."],
      breathing: ["Вдох вниз.", "Выдох на усилии."],
      mistakes: ["Не оставляй таз сзади.", "Не падай в нижнюю точку."],
    },
  },
  {
    id: "pushup_wide",
    name: "Широкие отжимания",
    area: "chest",
    equipment: "без инвентаря",
    level: "средне",
    format: "повторы",
    muscles: ["грудь", "плечи"],
    focus: "Грудь, передняя дельта",
    cue: "Ширина добавляет нагрузку на грудь, но плечи должны чувствовать себя спокойно.",
    technique: {
      setup: ["Поставь ладони шире плеч.", "Собери корпус и слегка разверни локти назад."],
      movement: ["Опускайся до комфортной глубины.", "Поднимайся без рывка и без провала между лопатками."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не ставь ладони слишком далеко.", "Не работай через боль в плечах."],
    },
  },
  {
    id: "pushup_diamond",
    name: "Алмазные отжимания",
    area: "arms",
    equipment: "без инвентаря",
    level: "сложно",
    format: "повторы",
    muscles: ["трицепс", "грудь"],
    focus: "Трицепс, внутренняя часть груди",
    cue: "Ладони ближе друг к другу, но запястья не должны ломаться.",
    technique: {
      setup: ["Поставь ладони под грудью близко друг к другу.", "Напряги корпус и ягодицы."],
      movement: ["Опускайся, ведя локти назад.", "Выжимайся вверх за счет трицепса."],
      breathing: ["Вдох вниз.", "Выдох на подъеме."],
      mistakes: ["Не разводи локти в стороны.", "Не делай вариант, если болят запястья."],
    },
  },
  {
    id: "pushup_incline",
    name: "Отжимания от опоры",
    area: "chest",
    equipment: "опора",
    level: "новичок",
    format: "повторы",
    muscles: ["грудь", "трицепс"],
    focus: "Грудь, техника отжиманий",
    cue: "Чем выше опора, тем легче движение.",
    technique: {
      setup: ["Упрись ладонями в устойчивую опору.", "Поставь стопы назад и выровняй корпус."],
      movement: ["Опускай грудь к опоре.", "Отталкивайся вверх, сохраняя жесткий корпус."],
      breathing: ["Вдох на опускании.", "Выдох на подъеме."],
      mistakes: ["Не прогибай поясницу.", "Не ставь опору, которая может уехать."],
    },
  },
  {
    id: "pushup_decline",
    name: "Отжимания с ногами на опоре",
    area: "chest",
    equipment: "опора",
    level: "сложно",
    format: "повторы",
    muscles: ["верх груди", "плечи", "трицепс"],
    focus: "Верх груди, плечи, трицепс",
    cue: "Чем выше ноги, тем сильнее нагрузка на плечи.",
    technique: {
      setup: ["Поставь ноги на устойчивую опору.", "Ладони держи под плечами или чуть шире."],
      movement: ["Опускайся ровно, не клюй головой.", "Выжимайся вверх, сохраняя линию корпуса."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не выбирай слишком высокую опору сразу.", "Не проваливайся в плечах."],
    },
  },
  {
    id: "dumbbell_floor_press",
    name: "Жим гантелей лежа на полу",
    area: "chest",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["грудь", "трицепс"],
    focus: "Грудь, трицепс, стабильность плеч",
    cue: "Пол ограничивает глубину и помогает держать плечи безопаснее.",
    technique: {
      setup: ["Ляг на пол, согни ноги и поставь стопы устойчиво.", "Гантели держи над локтями, лопатки слегка собери."],
      movement: ["Выжми гантели вверх над грудью.", "Опускай локти до мягкого касания пола."],
      breathing: ["Вдох вниз.", "Выдох на жиме."],
      mistakes: ["Не отбивай локти от пола.", "Не выгибай поясницу мостом."],
    },
  },
  {
    id: "dumbbell_fly_floor",
    name: "Разводка гантелей на полу",
    area: "chest",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["грудь"],
    focus: "Грудь, контроль плеч",
    cue: "Движение похоже на объятие: локоть мягкий, плечо под контролем.",
    technique: {
      setup: ["Ляг на пол и выведи гантели над грудью.", "Слегка согни локти и зафиксируй этот угол."],
      movement: ["Разводи руки в стороны до касания плечом или локтем пола.", "Своди гантели обратно над грудью."],
      breathing: ["Вдох на разведении.", "Выдох на сведении."],
      mistakes: ["Не выпрямляй локти полностью.", "Не бери тяжелые гантели в этом движении."],
    },
  },
  {
    id: "squat_bodyweight",
    name: "Приседания с весом тела",
    area: "legs",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["квадрицепс", "ягодицы"],
    focus: "Бедра, ягодицы, корпус",
    cue: "Колени смотрят туда же, куда носки, а пятки остаются на полу.",
    technique: {
      setup: ["Поставь стопы чуть шире таза.", "Подтяни ребра вниз и держи взгляд вперед."],
      movement: ["Отводи таз назад и вниз.", "Вставай через середину стопы и пятку."],
      breathing: ["Вдох вниз.", "Выдох на подъеме."],
      mistakes: ["Не своди колени внутрь.", "Не округляй поясницу внизу."],
    },
  },
  {
    id: "goblet_squat",
    name: "Гоблет-присед с гантелью",
    area: "legs",
    equipment: "гантель",
    level: "средне",
    format: "повторы",
    muscles: ["квадрицепс", "ягодицы", "кор"],
    focus: "Ноги, ягодицы, корпус",
    cue: "Держи гантель у груди и не позволяй ей тянуть корпус вперед.",
    technique: {
      setup: ["Возьми гантель вертикально у груди.", "Поставь стопы чуть шире таза."],
      movement: ["Опускайся вниз, сохраняя грудь открытой.", "Поднимайся через пятки без завала коленей."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не отрывай пятки.", "Не расслабляй корпус под весом."],
    },
  },
  {
    id: "dumbbell_squat",
    name: "Приседания с гантелями",
    area: "legs",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["квадрицепс", "ягодицы"],
    focus: "Ноги, ягодицы",
    cue: "Гантели висят спокойно, а движение задают ноги и таз.",
    technique: {
      setup: ["Возьми гантели в руки по бокам.", "Поставь стопы чуть шире таза."],
      movement: ["Сядь вниз до комфортной глубины.", "Встань, сохраняя корпус собранным."],
      breathing: ["Вдох на опускании.", "Выдох на подъеме."],
      mistakes: ["Не раскачивай гантели.", "Не заваливайся на носки."],
    },
  },
  {
    id: "sumo_squat_dumbbell",
    name: "Сумо-присед с гантелью",
    area: "legs",
    equipment: "гантель",
    level: "средне",
    format: "повторы",
    muscles: ["ягодицы", "внутренняя поверхность бедра"],
    focus: "Ягодицы, бедра",
    cue: "Стопы шире, носки развернуты, колени идут по линии носков.",
    technique: {
      setup: ["Поставь стопы широко и разверни носки наружу.", "Держи гантель двумя руками перед собой."],
      movement: ["Опускай таз вниз между стопами.", "Вставай, сжимая ягодицы в верхней точке."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не своди колени внутрь.", "Не наклоняй корпус слишком сильно вперед."],
    },
  },
  {
    id: "reverse_lunge",
    name: "Обратные выпады",
    area: "legs",
    equipment: "без инвентаря / гантели",
    level: "средне",
    format: "повторы",
    muscles: ["ягодицы", "квадрицепс"],
    focus: "Ягодицы, бедра, баланс",
    cue: "Шагай назад, а переднее колено держи над стопой.",
    technique: {
      setup: ["Встань ровно, стопы на ширине таза.", "При варианте с весом держи гантели по бокам."],
      movement: ["Сделай шаг назад и мягко опустись.", "Вернись вверх усилием передней ноги."],
      breathing: ["Вдох на шаге назад.", "Выдох на возвращении."],
      mistakes: ["Не бей коленом об пол.", "Не заваливайся вперед."],
    },
  },
  {
    id: "bulgarian_split_squat",
    name: "Болгарские выпады с гантелями",
    area: "legs",
    equipment: "гантели, опора",
    level: "сложно",
    format: "повторы",
    muscles: ["ягодицы", "квадрицепс"],
    focus: "Ноги, ягодицы, баланс",
    cue: "Передняя нога работает, задняя только помогает держать баланс.",
    technique: {
      setup: ["Поставь заднюю стопу на устойчивую опору.", "Переднюю стопу вынеси так, чтобы колено не уезжало далеко вперед."],
      movement: ["Опускайся вертикально вниз.", "Поднимайся за счет передней ноги."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не отталкивайся задней ногой.", "Не спеши, если теряешь баланс."],
    },
  },
  {
    id: "dumbbell_romanian_deadlift",
    name: "Румынская тяга с гантелями",
    area: "legs",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["задняя поверхность бедра", "ягодицы", "спина"],
    focus: "Задняя поверхность бедра, ягодицы",
    cue: "Таз уходит назад, спина длинная, гантели скользят близко к ногам.",
    technique: {
      setup: ["Возьми гантели перед бедрами.", "Слегка согни колени и собери лопатки."],
      movement: ["Отводи таз назад и опускай гантели вдоль ног.", "Поднимайся, сжимая ягодицы."],
      breathing: ["Вдох на наклоне.", "Выдох на подъеме."],
      mistakes: ["Не округляй спину.", "Не превращай движение в присед."],
    },
  },
  {
    id: "dumbbell_calf_raise",
    name: "Подъемы на носки с гантелями",
    area: "legs",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["икры"],
    focus: "Икры, стопы",
    cue: "Поднимайся высоко и опускайся медленно, не пружинь на связках.",
    technique: {
      setup: ["Встань ровно с гантелями по бокам.", "Держи корпус вертикально."],
      movement: ["Поднимись на носки и задержись на короткий счет.", "Опускай пятки под контролем."],
      breathing: ["Выдох на подъеме.", "Вдох при опускании."],
      mistakes: ["Не заваливай стопы наружу.", "Не делай быстрые подпрыгивания."],
    },
  },
  {
    id: "dumbbell_glute_bridge",
    name: "Ягодичный мост с гантелью",
    area: "legs",
    equipment: "гантель",
    level: "новичок",
    format: "повторы",
    muscles: ["ягодицы", "задняя поверхность бедра"],
    focus: "Ягодицы, задняя линия",
    cue: "Поднимай таз ягодицами, а не прогибом в пояснице.",
    technique: {
      setup: ["Ляг на спину и поставь стопы ближе к тазу.", "Положи гантель на таз и придерживай руками."],
      movement: ["Подними таз до прямой линии бедра и корпуса.", "Опускайся плавно без удара о пол."],
      breathing: ["Выдох наверху.", "Вдох при опускании."],
      mistakes: ["Не переразгибай поясницу.", "Не отрывай носки или пятки."],
    },
  },
  {
    id: "one_arm_dumbbell_row",
    name: "Тяга гантели одной рукой",
    area: "back",
    equipment: "гантель, опора",
    level: "средне",
    format: "повторы",
    muscles: ["широчайшие", "середина спины", "бицепс"],
    focus: "Широчайшие, середина спины",
    cue: "Тяни локоть назад к тазу, а не гантель к плечу.",
    technique: {
      setup: ["Обопрись одной рукой о устойчивую поверхность.", "Спину держи ровной, гантель под плечом."],
      movement: ["Тяни локоть назад и слегка вверх.", "Опускай гантель до растяжения спины."],
      breathing: ["Выдох на тяге.", "Вдох на опускании."],
      mistakes: ["Не разворачивай корпус рывком.", "Не подтягивай плечо к уху."],
    },
  },
  {
    id: "bent_over_dumbbell_row",
    name: "Тяга двух гантелей в наклоне",
    area: "back",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["широчайшие", "ромбовидные", "задняя дельта"],
    focus: "Спина, задняя дельта",
    cue: "Корпус наклонен, спина ровная, локти идут назад.",
    technique: {
      setup: ["Слегка согни колени и наклонись с ровной спиной.", "Гантели держи под плечами."],
      movement: ["Потяни локти назад к корпусу.", "Опусти гантели без раскачки."],
      breathing: ["Выдох на тяге.", "Вдох вниз."],
      mistakes: ["Не округляй поясницу.", "Не дергай вес корпусом."],
    },
  },
  {
    id: "dumbbell_pullover",
    name: "Пуловер с гантелью",
    area: "back",
    equipment: "гантель, пол или скамья",
    level: "средне",
    format: "повторы",
    muscles: ["широчайшие", "грудь"],
    focus: "Широчайшие, грудная клетка",
    cue: "Двигай руками по дуге и держи ребра под контролем.",
    technique: {
      setup: ["Ляг на пол или скамью, держи гантель двумя руками над грудью.", "Локти оставь слегка согнутыми."],
      movement: ["Опускай гантель за голову до комфортной глубины.", "Верни ее над грудью без рывка."],
      breathing: ["Вдох при опускании.", "Выдох при возврате."],
      mistakes: ["Не прогибай поясницу.", "Не заводи вес глубже, чем позволяют плечи."],
    },
  },
  {
    id: "dumbbell_reverse_fly",
    name: "Разведение гантелей в наклоне",
    area: "back",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["задняя дельта", "верх спины"],
    focus: "Задняя дельта, верх спины",
    cue: "Работают плечи и верх спины, а не трапеции у ушей.",
    technique: {
      setup: ["Наклонись с ровной спиной и мягкими коленями.", "Гантели держи под плечами, локти слегка согнуты."],
      movement: ["Разводи руки в стороны до линии корпуса.", "Опускай гантели медленно."],
      breathing: ["Выдох на разведении.", "Вдох на опускании."],
      mistakes: ["Не махай гантелями.", "Не поднимай плечи к ушам."],
    },
  },
  {
    id: "dumbbell_deadlift",
    name: "Становая тяга с гантелями",
    area: "back",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["спина", "ягодицы", "бедра"],
    focus: "Спина, ягодицы, задняя линия",
    cue: "Гантели идут близко к ногам, корпус поднимается вместе с тазом.",
    technique: {
      setup: ["Поставь гантели перед бедрами или по бокам.", "Собери лопатки и напряги корпус."],
      movement: ["Опускай вес, сгибая таз и колени.", "Вставай ровно, не отклоняясь назад."],
      breathing: ["Вдох перед опусканием.", "Выдох на подъеме."],
      mistakes: ["Не округляй спину.", "Не бросай гантели вниз."],
    },
  },
  {
    id: "dumbbell_shoulder_press",
    name: "Жим гантелей стоя",
    area: "shoulders",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["плечи", "трицепс"],
    focus: "Плечи, трицепс, корпус",
    cue: "Жми гантели вверх, но ребра не выпускай вперед.",
    technique: {
      setup: ["Поставь стопы устойчиво и подними гантели к плечам.", "Напряги пресс и ягодицы."],
      movement: ["Выжми гантели вверх над плечами.", "Опусти до уровня плеч под контролем."],
      breathing: ["Выдох на жиме.", "Вдох при опускании."],
      mistakes: ["Не прогибай поясницу.", "Не стучи гантелями наверху."],
    },
  },
  {
    id: "arnold_press",
    name: "Жим Арнольда",
    area: "shoulders",
    equipment: "гантели",
    level: "средне",
    format: "повторы",
    muscles: ["плечи", "трицепс"],
    focus: "Плечи, контроль вращения",
    cue: "Поворот идет плавно, без щелчков и рывков в плечах.",
    technique: {
      setup: ["Держи гантели перед плечами, ладони смотрят к себе.", "Корпус собран, стопы устойчивы."],
      movement: ["Разворачивай кисти и жми гантели вверх.", "Вернись обратно по той же траектории."],
      breathing: ["Выдох на жиме.", "Вдох на возврате."],
      mistakes: ["Не ускоряй разворот.", "Не бери вес, который ломает траекторию."],
    },
  },
  {
    id: "lateral_raise",
    name: "Махи гантелями в стороны",
    area: "shoulders",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["средняя дельта"],
    focus: "Средняя дельта, ширина плеч",
    cue: "Поднимай локти в стороны, как будто разливаешь воду из кувшинов.",
    technique: {
      setup: ["Встань ровно, гантели по бокам.", "Локти слегка согнуты, плечи опущены."],
      movement: ["Подними руки до уровня плеч.", "Опусти медленно, не теряя напряжение."],
      breathing: ["Выдох на подъеме.", "Вдох вниз."],
      mistakes: ["Не раскачивай корпус.", "Не поднимай плечи к ушам."],
    },
  },
  {
    id: "front_raise",
    name: "Подъем гантелей перед собой",
    area: "shoulders",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["передняя дельта"],
    focus: "Передняя дельта",
    cue: "Поднимай вес до уровня плеч, а не выше любой ценой.",
    technique: {
      setup: ["Держи гантели перед бедрами.", "Корпус вертикальный, пресс собран."],
      movement: ["Подними одну или две гантели перед собой.", "Опусти плавно без броска."],
      breathing: ["Выдох на подъеме.", "Вдох при опускании."],
      mistakes: ["Не запрокидывай корпус назад.", "Не работай через дискомфорт в плечах."],
    },
  },
  {
    id: "pike_pushup",
    name: "Пайк-отжимания",
    area: "shoulders",
    equipment: "без инвентаря",
    level: "сложно",
    format: "повторы",
    muscles: ["плечи", "трицепс"],
    focus: "Плечи, трицепс",
    cue: "Таз высоко, движение похоже на жим вверх собственным весом.",
    technique: {
      setup: ["Поставь ладони на пол и подними таз вверх.", "Перенеси вес ближе к рукам."],
      movement: ["Опускай голову к полу между ладонями.", "Выжимайся вверх, сохраняя угол корпуса."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не превращай движение в обычное отжимание.", "Не ставь голову слишком далеко вперед."],
    },
  },
  {
    id: "dumbbell_biceps_curl",
    name: "Сгибание рук с гантелями",
    area: "arms",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["бицепс"],
    focus: "Бицепс",
    cue: "Локти остаются рядом с корпусом, движение делает предплечье.",
    technique: {
      setup: ["Встань ровно, гантели по бокам.", "Плечи опусти, локти держи близко к корпусу."],
      movement: ["Согни руки и подними гантели к плечам.", "Опусти под контролем до почти прямых рук."],
      breathing: ["Выдох на подъеме.", "Вдох вниз."],
      mistakes: ["Не раскачивай корпус.", "Не уводи локти вперед."],
    },
  },
  {
    id: "hammer_curl",
    name: "Молотковые сгибания",
    area: "arms",
    equipment: "гантели",
    level: "новичок",
    format: "повторы",
    muscles: ["бицепс", "предплечья"],
    focus: "Бицепс, предплечья",
    cue: "Ладони смотрят друг на друга весь повтор.",
    technique: {
      setup: ["Держи гантели нейтральным хватом.", "Зафиксируй корпус и плечи."],
      movement: ["Сгибай руки, не меняя хват.", "Опускай гантели медленнее, чем поднимаешь."],
      breathing: ["Выдох на подъеме.", "Вдох вниз."],
      mistakes: ["Не кидай вес вниз.", "Не поднимай плечи вместе с гантелями."],
    },
  },
  {
    id: "concentration_curl",
    name: "Концентрированное сгибание",
    area: "arms",
    equipment: "гантель, опора",
    level: "средне",
    format: "повторы",
    muscles: ["бицепс"],
    focus: "Бицепс, изоляция",
    cue: "Локоть упирается в бедро, корпус не помогает.",
    technique: {
      setup: ["Сядь или упрись корпусом вперед.", "Локоть рабочей руки поставь к внутренней стороне бедра."],
      movement: ["Согни руку до сильного сокращения бицепса.", "Опусти гантель медленно."],
      breathing: ["Выдох вверх.", "Вдох вниз."],
      mistakes: ["Не разворачивай плечо.", "Не сокращай амплитуду ради веса."],
    },
  },
  {
    id: "overhead_triceps_extension",
    name: "Французский жим гантели стоя",
    area: "arms",
    equipment: "гантель",
    level: "средне",
    format: "повторы",
    muscles: ["трицепс"],
    focus: "Трицепс, длинная головка",
    cue: "Локти смотрят вперед и не разъезжаются в стороны.",
    technique: {
      setup: ["Возьми гантель двумя руками над головой.", "Собери корпус, ребра не выпускай вперед."],
      movement: ["Опусти гантель за голову, сгибая локти.", "Разогни руки вверх без рывка."],
      breathing: ["Вдох вниз.", "Выдох на разгибании."],
      mistakes: ["Не разводи локти широко.", "Не прогибай поясницу."],
    },
  },
  {
    id: "triceps_kickback",
    name: "Разгибание руки назад с гантелью",
    area: "arms",
    equipment: "гантель",
    level: "средне",
    format: "повторы",
    muscles: ["трицепс"],
    focus: "Трицепс, контроль локтя",
    cue: "Плечо зафиксировано, двигается только предплечье.",
    technique: {
      setup: ["Наклонись с ровной спиной и упрись свободной рукой.", "Подними локоть рабочей руки к корпусу."],
      movement: ["Разогни руку назад до почти прямой.", "Верни предплечье вниз без опускания локтя."],
      breathing: ["Выдох на разгибании.", "Вдох на возврате."],
      mistakes: ["Не махай всей рукой.", "Не округляй спину в наклоне."],
    },
  },
  {
    id: "dumbbell_skull_crusher",
    name: "Французский жим гантелей лежа",
    area: "arms",
    equipment: "гантели, пол",
    level: "средне",
    format: "повторы",
    muscles: ["трицепс"],
    focus: "Трицепс",
    cue: "Локти остаются над плечами, гантели двигаются к вискам или за голову.",
    technique: {
      setup: ["Ляг на пол и выведи гантели над плечами.", "Ладони смотрят друг на друга, локти зафиксированы."],
      movement: ["Согни локти и опусти гантели к голове.", "Разогни руки, не двигая плечами."],
      breathing: ["Вдох вниз.", "Выдох вверх."],
      mistakes: ["Не разводи локти.", "Не бросай гантели к голове."],
    },
  },
  {
    id: "plank",
    name: "Планка",
    area: "core",
    equipment: "без инвентаря",
    level: "новичок",
    format: "время",
    muscles: ["кор", "плечевой пояс"],
    focus: "Кор, плечевой пояс",
    cue: "Дыши спокойно и держи корпус как цельную линию.",
    technique: {
      setup: ["Поставь локти под плечи.", "Слегка подкрути таз и напряги ягодицы."],
      movement: ["Толкай пол локтями и держи шею нейтрально.", "Сохраняй ровное дыхание до конца подхода."],
      breathing: ["Короткий вдох носом.", "Длинный спокойный выдох."],
      mistakes: ["Не поднимай таз слишком высоко.", "Остановись, если начинает болеть спина."],
    },
  },
  {
    id: "side_plank",
    name: "Боковая планка",
    area: "core",
    equipment: "без инвентаря",
    level: "средне",
    format: "время",
    muscles: ["косые мышцы", "кор"],
    focus: "Косые мышцы, стабильность корпуса",
    cue: "Тело вытянуто в одну линию, таз не падает вниз.",
    technique: {
      setup: ["Поставь локоть под плечо и вытяни ноги.", "Подними таз и собери корпус."],
      movement: ["Держи линию от головы до стоп.", "Дыши ровно и не разворачивай грудь вниз."],
      breathing: ["Дыши спокойно без задержки.", "На усталости делай длинный выдох."],
      mistakes: ["Не проваливай таз.", "Не ставь локоть далеко от плеча."],
    },
  },
  {
    id: "crunch",
    name: "Скручивания",
    area: "core",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["прямая мышца живота", "кор"],
    focus: "Пресс, контроль корпуса",
    cue: "Поднимай лопатки, а не тяни шею руками.",
    technique: {
      setup: ["Ляг на спину, согни колени и поставь стопы на пол.", "Ладони держи у висков или скрести руки на груди."],
      movement: ["Скрути верх спины и подними лопатки от пола.", "Медленно вернись вниз, сохраняя напряжение пресса."],
      breathing: ["Выдох на подъеме.", "Вдох на опускании."],
      mistakes: ["Не тяни голову руками.", "Не делай рывок поясницей."],
    },
  },
  {
    id: "reverse_crunch",
    name: "Обратные скручивания",
    area: "core",
    equipment: "без инвентаря",
    level: "средне",
    format: "повторы",
    muscles: ["низ живота", "кор"],
    focus: "Низ пресса, контроль таза",
    cue: "Думай о подкручивании таза, а не о махе ногами.",
    technique: {
      setup: ["Ляг на спину и подними согнутые ноги.", "Прижми поясницу к полу и держи руки вдоль корпуса."],
      movement: ["Подкрути таз и слегка подними его от пола.", "Верни ноги медленно, не теряя контроля поясницы."],
      breathing: ["Выдох на подкручивании.", "Вдох при возврате."],
      mistakes: ["Не раскачивай ноги.", "Не прогибай поясницу внизу."],
    },
  },
  {
    id: "bicycle_crunch",
    name: "Велосипед",
    area: "core",
    equipment: "без инвентаря",
    level: "средне",
    format: "повторы",
    muscles: ["косые мышцы", "пресс"],
    focus: "Пресс, косые мышцы",
    cue: "Поворачивай плечи к колену, а не просто двигай локтями.",
    technique: {
      setup: ["Ляг на спину, руки у висков, ноги на весу.", "Подними лопатки и собери пресс."],
      movement: ["Поверни корпус к противоположному колену.", "Меняй стороны плавно, не бросая ноги вниз."],
      breathing: ["Выдыхай на каждом повороте.", "Дыши коротко и ровно."],
      mistakes: ["Не дави руками на шею.", "Не ускоряйся за счет рывков."],
    },
  },
  {
    id: "dead_bug",
    name: "Dead bug",
    area: "core",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["глубокий кор", "пресс"],
    focus: "Кор, стабильность поясницы",
    cue: "Поясница остается спокойной, двигаются только рука и нога.",
    technique: {
      setup: ["Ляг на спину, подними руки вверх и согни ноги под 90 градусов.", "Мягко прижми поясницу к полу."],
      movement: ["Опусти противоположные руку и ногу почти до пола.", "Вернись в центр и повтори на другую сторону."],
      breathing: ["Выдох на опускании.", "Вдох при возврате."],
      mistakes: ["Не отрывай поясницу.", "Не торопись и не бросай ногу вниз."],
    },
  },
  {
    id: "mountain_climber",
    name: "Альпинист",
    area: "core",
    equipment: "без инвентаря",
    level: "средне",
    format: "время",
    muscles: ["кор", "плечи", "бедра"],
    focus: "Кор, выносливость, плечевой пояс",
    cue: "Корпус держи как в планке, колени веди под себя без прыжков таза.",
    technique: {
      setup: ["Встань в упор лежа, ладони под плечами.", "Собери пресс и ягодицы."],
      movement: ["Поочередно подтягивай колени к груди.", "Держи плечи над ладонями и не раскачивай корпус."],
      breathing: ["Дыши ритмично.", "Не задерживай дыхание на ускорении."],
      mistakes: ["Не поднимай таз высоко.", "Не проваливайся в плечах."],
    },
  },
  {
    id: "jumping_jack",
    name: "Прыжки jumping jack",
    area: "legs",
    equipment: "без инвентаря",
    level: "новичок",
    format: "время",
    muscles: ["ноги", "плечи", "сердечно-сосудистая система"],
    focus: "Разминка, выносливость, все тело",
    cue: "Прыгай мягко и держи ритм, не хлопай стопами по полу.",
    technique: {
      setup: ["Встань прямо, руки вдоль корпуса.", "Слегка согни колени и держи корпус собранным."],
      movement: ["Прыжком разведи ноги и подними руки вверх.", "Прыжком вернись в исходное положение."],
      breathing: ["Дыши ровно в темп движения.", "Сохраняй спокойный выдох."],
      mistakes: ["Не приземляйся на прямые колени.", "Не задирай плечи к ушам."],
    },
  },
  {
    id: "burpee",
    name: "Берпи",
    area: "legs",
    equipment: "без инвентаря",
    level: "сложно",
    format: "повторы",
    muscles: ["ноги", "грудь", "кор"],
    focus: "Все тело, мощность, выносливость",
    cue: "Лучше медленно и чисто, чем быстро и разваленно.",
    technique: {
      setup: ["Встань прямо, стопы на ширине таза.", "Подготовь место перед собой для упора лежа."],
      movement: ["Опустись в упор, отведи ноги назад и верни их под себя.", "Встань и сделай мягкий прыжок вверх."],
      breathing: ["Выдох на подъеме.", "Дыши свободно между повторениями."],
      mistakes: ["Не проваливай поясницу в упоре.", "Не приземляйся жестко на прямые ноги."],
    },
  },
  {
    id: "glute_bridge_bodyweight",
    name: "Ягодичный мост",
    area: "legs",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["ягодицы", "задняя поверхность бедра"],
    focus: "Ягодицы, задняя линия",
    cue: "Поднимай таз ягодицами, а не прогибом в пояснице.",
    technique: {
      setup: ["Ляг на спину, согни ноги и поставь стопы близко к тазу.", "Руки положи вдоль корпуса."],
      movement: ["Подними таз до прямой линии от плеч до коленей.", "Опустись медленно и не расслабляй корпус полностью."],
      breathing: ["Выдох на подъеме.", "Вдох при опускании."],
      mistakes: ["Не переразгибай поясницу наверху.", "Не разводи колени внутрь."],
    },
  },
  {
    id: "superman",
    name: "Супермен",
    area: "back",
    equipment: "без инвентаря",
    level: "новичок",
    format: "повторы",
    muscles: ["разгибатели спины", "ягодицы", "задняя дельта"],
    focus: "Спина, осанка, задняя линия",
    cue: "Поднимайся невысоко и контролируемо, без залома в шее.",
    technique: {
      setup: ["Ляг на живот, вытянутые руки направь вперед.", "Смотри в пол и держи шею длинной."],
      movement: ["Одновременно приподними руки и ноги.", "Задержись на мгновение и мягко опустись."],
      breathing: ["Выдох на подъеме.", "Вдох при опускании."],
      mistakes: ["Не задирай голову.", "Не делай резкий прогиб в пояснице."],
    },
  },
  {
    id: "triceps_dips_chair",
    name: "Обратные отжимания от опоры",
    area: "arms",
    equipment: "опора",
    level: "средне",
    format: "повторы",
    muscles: ["трицепс", "плечи"],
    focus: "Трицепс, контроль плеч",
    cue: "Держи плечи вниз и не уходи слишком глубоко.",
    technique: {
      setup: ["Упрись ладонями в устойчивую опору позади себя.", "Поставь стопы на пол и держи корпус близко к опоре."],
      movement: ["Согни локти и опустись до комфортной глубины.", "Выжми себя вверх за счет трицепса."],
      breathing: ["Вдох вниз.", "Выдох на подъеме."],
      mistakes: ["Не проваливай плечи вперед.", "Не используй неустойчивую опору."],
    },
  },
  {
    id: "dumbbell_russian_twist",
    name: "Русские повороты с гантелью",
    area: "core",
    equipment: "гантель",
    level: "средне",
    format: "повторы",
    muscles: ["косые мышцы", "кор"],
    focus: "Кор, косые мышцы",
    cue: "Поворачивай грудную клетку, а не просто перекладывай гантель руками.",
    technique: {
      setup: ["Сядь, слегка отклони корпус назад и держи гантель у груди.", "Стопы оставь на полу, если вариант тяжелый."],
      movement: ["Поверни корпус в одну сторону.", "Вернись через центр и повернись в другую."],
      breathing: ["Выдох на повороте.", "Вдох через центр."],
      mistakes: ["Не округляй поясницу.", "Не дергай шеей за движением."],
    },
  },
];

const BUILDER_PRESETS = [
  {
    id: "fullbody_dumbbells",
    title: "Фулбади с гантелями",
    meta: "6 упражнений - 19 подходов",
    level: "База",
    tags: ["все тело", "гантели", "дом"],
    exercises: [
      { id: "goblet_squat", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_floor_press", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 60 },
      { id: "one_arm_dumbbell_row", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "dumbbell_romanian_deadlift", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_shoulder_press", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 60 },
      { id: "plank", mode: "time", sets: 4, reps: 10, seconds: 35, rest: 45 },
    ],
  },
  {
    id: "home_bodyweight",
    title: "Домашняя база",
    meta: "8 упражнений - 24 подхода",
    level: "База",
    tags: ["без инвентаря", "все тело", "дом"],
    exercises: [
      { id: "squat_bodyweight", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 45 },
      { id: "pushup_knee", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 60 },
      { id: "glute_bridge_bodyweight", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 45 },
      { id: "superman", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 45 },
      { id: "crunch", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 35 },
      { id: "dead_bug", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 35 },
      { id: "mountain_climber", mode: "time", sets: 3, reps: 10, seconds: 30, rest: 45 },
      { id: "plank", mode: "time", sets: 3, reps: 10, seconds: 30, rest: 45 },
    ],
  },
  {
    id: "chest_triceps",
    title: "Грудь + трицепс",
    meta: "6 упражнений - 19 подходов",
    level: "Средне",
    tags: ["грудь", "трицепс", "жим"],
    exercises: [
      { id: "pushup_classic", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 60 },
      { id: "dumbbell_floor_press", mode: "reps", sets: 4, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_fly_floor", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "pushup_diamond", mode: "reps", sets: 3, reps: 8, seconds: 30, rest: 75 },
      { id: "overhead_triceps_extension", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "dumbbell_skull_crusher", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
    ],
  },
  {
    id: "back_biceps",
    title: "Спина + бицепс",
    meta: "6 упражнений - 19 подходов",
    level: "Средне",
    tags: ["спина", "бицепс", "тяга"],
    exercises: [
      { id: "one_arm_dumbbell_row", mode: "reps", sets: 4, reps: 12, seconds: 30, rest: 75 },
      { id: "bent_over_dumbbell_row", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_pullover", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "dumbbell_reverse_fly", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 60 },
      { id: "dumbbell_biceps_curl", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "hammer_curl", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
    ],
  },
  {
    id: "legs_glutes",
    title: "Ноги + ягодицы",
    meta: "6 упражнений - 21 подход",
    level: "Средне",
    tags: ["ноги", "ягодицы", "гантели"],
    exercises: [
      { id: "goblet_squat", mode: "reps", sets: 4, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_romanian_deadlift", mode: "reps", sets: 4, reps: 10, seconds: 30, rest: 75 },
      { id: "reverse_lunge", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 75 },
      { id: "sumo_squat_dumbbell", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 75 },
      { id: "dumbbell_glute_bridge", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 60 },
      { id: "dumbbell_calf_raise", mode: "reps", sets: 4, reps: 15, seconds: 30, rest: 45 },
    ],
  },
  {
    id: "shoulders_core",
    title: "Плечи + кор",
    meta: "6 упражнений - 19 подходов",
    level: "Средне",
    tags: ["плечи", "кор", "контроль"],
    exercises: [
      { id: "dumbbell_shoulder_press", mode: "reps", sets: 4, reps: 10, seconds: 30, rest: 75 },
      { id: "lateral_raise", mode: "reps", sets: 3, reps: 12, seconds: 30, rest: 60 },
      { id: "arnold_press", mode: "reps", sets: 3, reps: 10, seconds: 30, rest: 75 },
      { id: "dumbbell_reverse_fly", mode: "reps", sets: 3, reps: 15, seconds: 30, rest: 60 },
      { id: "plank", mode: "time", sets: 3, reps: 10, seconds: 45, rest: 45 },
      { id: "side_plank", mode: "time", sets: 3, reps: 10, seconds: 30, rest: 45 },
    ],
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
const restAdjustControls = document.getElementById("restAdjustControls");
const decreaseRestButton = document.getElementById("decreaseRestButton");
const increaseRestButton = document.getElementById("increaseRestButton");
const finishCard = document.getElementById("finishCard");
const finishTitle = document.getElementById("finishTitle");
const finishMeta = document.getElementById("finishMeta");
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
const toastActionButton = document.getElementById("toastActionButton");
const builderNameInput = document.getElementById("builderNameInput");
const builderExerciseCount = document.getElementById("builderExerciseCount");
const builderSetCount = document.getElementById("builderSetCount");
const builderPresetList = document.getElementById("builderPresetList");
const builderList = document.getElementById("builderList");
const builderExerciseSearch = document.getElementById("builderExerciseSearch");
const builderAreaFilterButtons = document.querySelectorAll("[data-builder-area-filter]");
const builderExerciseList = document.getElementById("builderExerciseList");
const saveBuilderWorkoutButton = document.getElementById("saveBuilderWorkoutButton");
const startBuilderWorkoutButton = document.getElementById("startBuilderWorkoutButton");

let history = loadHistory();
let savedWorkouts = loadSavedWorkouts();
let hiddenPresetIds = loadHiddenPresetIds();
let areaFilter = "all";
let builderWorkout = loadBuilderWorkout();
let builderAreaFilter = "all";
let session = loadActiveSession() || createEmptySession();
let ticker = null;
let toastTimer = null;
let toastActionHandler = null;
let audioContext = null;

initTelegramWebApp();
if (session.running) {
  updateTicker();
}
renderAll();

function createEmptySession() {
  return {
    mode: "builder",
    planId: null,
    title: "",
    steps: [],
    exerciseIds: [],
    index: 0,
    remaining: 0,
    running: false,
    startedAt: null,
    completed: false,
    totalSeconds: 0,
    finishedAt: null,
    historyEntryId: null,
    lastSignalKey: "",
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

function loadActiveSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(ACTIVE_SESSION_KEY) || "null");

    if (!saved || !Array.isArray(saved.steps) || !saved.steps.length) {
      return null;
    }

    const restored = {
      ...createEmptySession(),
      ...saved,
      index: clamp(Number(saved.index) || 0, 0, saved.steps.length - 1),
      remaining: Math.max(0, Number(saved.remaining) || 0),
      startedAt: Number(saved.startedAt) || null,
      totalSeconds: Math.max(0, Number(saved.totalSeconds) || 0),
      finishedAt: Number(saved.finishedAt) || null,
      historyEntryId: saved.historyEntryId || null,
      lastSignalKey: "",
    };

    return advanceRestoredSession(restored, Number(saved.savedAt) || Date.now());
  } catch {
    return null;
  }
}

function saveActiveSession() {
  if (!session.steps.length) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
    ...session,
    savedAt: Date.now(),
  }));
}

function clearActiveSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

function advanceRestoredSession(restored, savedAt) {
  if (!restored.running || restored.completed) {
    return restored;
  }

  let elapsed = Math.max(0, Math.floor((Date.now() - savedAt) / 1000));

  while (elapsed > 0 && restored.steps.length && !restored.completed) {
    const step = restored.steps[restored.index];

    if (!step || isManualSetStep(step)) {
      restored.running = false;
      break;
    }

    const remaining = Math.max(0, Number(restored.remaining || step.duration || 0));

    if (elapsed < remaining) {
      restored.remaining = remaining - elapsed;
      elapsed = 0;
      break;
    }

    elapsed -= remaining;

    if (restored.index + 1 >= restored.steps.length) {
      restored.completed = true;
      restored.running = false;
      restored.remaining = 0;
      restored.totalSeconds = restored.startedAt ? Math.round((Date.now() - restored.startedAt) / 1000) : 0;
      restored.finishedAt = Date.now();
      saveCompletedSessionHistory(restored, restored.totalSeconds);
      break;
    }

    restored.index += 1;
    restored.remaining = restored.steps[restored.index].duration || 0;

    if (isManualSetStep(restored.steps[restored.index])) {
      restored.running = false;
      break;
    }
  }

  return restored;
}

function loadSavedWorkouts() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_WORKOUTS_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.map((workout) => normalizeSavedWorkout(workout)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function saveSavedWorkouts() {
  savedWorkouts = savedWorkouts
    .map((workout) => normalizeSavedWorkout(workout))
    .filter(Boolean)
    .slice(0, 30);
  localStorage.setItem(SAVED_WORKOUTS_KEY, JSON.stringify(savedWorkouts));
}

function loadHiddenPresetIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDDEN_PRESET_PLANS_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(String) : [];
  } catch {
    return [];
  }
}

function saveHiddenPresetIds() {
  hiddenPresetIds = [...new Set(hiddenPresetIds.map(String))];
  localStorage.setItem(HIDDEN_PRESET_PLANS_KEY, JSON.stringify(hiddenPresetIds));
}

function loadBuilderWorkout() {
  const fallback = createBuilderWorkoutFromPreset(BUILDER_PRESETS[0]) || {
    title: "Моя тренировка",
    exercises: [],
  };

  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_WORKOUT_KEY) || "{}");
    const legacyWork = clamp(Number(saved.work) || 40, 10, 180);
    const legacyRest = clamp(Number(saved.rest) || 60, 5, 180);
    const exercises = Array.isArray(saved.exercises)
      ? saved.exercises
          .map((item) => normalizeBuilderItem(item, legacyWork, legacyRest))
          .filter(Boolean)
      : [];

    return {
      id: typeof saved.id === "string" ? saved.id : null,
      title: String(saved.title || fallback.title).slice(0, 36),
      exercises: exercises.length ? exercises : fallback.exercises,
    };
  } catch {
    return fallback;
  }
}

function saveBuilderWorkout() {
  localStorage.setItem(CUSTOM_WORKOUT_KEY, JSON.stringify(builderWorkout));
}

function createBuilderWorkoutFromPreset(preset) {
  if (!preset) {
    return null;
  }

  return {
    id: null,
    title: preset.title,
    exercises: preset.exercises
      .map((item) => normalizeBuilderItem(item))
      .filter(Boolean),
  };
}

function normalizeSavedWorkout(workout) {
  const exercises = Array.isArray(workout?.exercises)
    ? workout.exercises.map((item) => normalizeBuilderItem(item)).filter(Boolean)
    : [];

  if (!exercises.length) {
    return null;
  }

  const title = String(workout?.title || "Моя тренировка").trim().slice(0, 36) || "Моя тренировка";
  const createdAt = workout?.createdAt || new Date().toISOString();

  return {
    id: String(workout?.id || `custom-${getStringHash(`${title}:${getWorkoutSignature({ exercises })}`)}`),
    title,
    meta: getBuilderWorkoutMeta({ exercises }),
    level: String(workout?.level || "Своя").slice(0, 16),
    tags: getWorkoutTags(exercises),
    exercises,
    createdAt,
    updatedAt: workout?.updatedAt || createdAt,
  };
}

function normalizeBuilderItem(item, fallbackSeconds = 40, fallbackRest = 60) {
  const exerciseId = typeof item === "string" ? item : item?.id;
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    return null;
  }

  const mode = getRequiredBuilderMode(exercise);

  return {
    id: exercise.id,
    mode,
    sets: clamp(Number(item?.sets) || 3, 1, 8),
    reps: clamp(Number(item?.reps) || getDefaultReps(exercise), 1, 50),
    seconds: clamp(Number(item?.seconds) || fallbackSeconds || getDefaultSeconds(exercise), 10, 180),
    rest: clamp(Number(item?.rest) || fallbackRest || getDefaultRest(exercise), 0, 240),
    weight: supportsExerciseWeight(exercise) ? String(item?.weight || "").slice(0, 18) : "",
    note: String(item?.note || "").slice(0, 80),
  };
}

function createBuilderItem(exerciseId) {
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    return null;
  }

  const mode = getRequiredBuilderMode(exercise);

  return {
    id: exercise.id,
    mode,
    sets: 3,
    reps: getDefaultReps(exercise),
    seconds: getDefaultSeconds(exercise),
    rest: getDefaultRest(exercise),
    weight: "",
    note: "",
  };
}

function getExercise(id) {
  return EXERCISES.find((exercise) => exercise.id === id);
}

function getRequiredBuilderMode(exercise) {
  return exercise?.format === "время" ? "time" : "reps";
}

function supportsExerciseWeight(exercise) {
  return normalize(exercise?.equipment).includes("гантел");
}

function cloneBuilderItems(items) {
  return Array.isArray(items)
    ? items.map((item) => normalizeBuilderItem(item)).filter(Boolean)
    : [];
}

function getWorkoutTags(exercises) {
  const tags = ["своя"];
  const areas = [...new Set(exercises.map((item) => getExercise(item.id)?.area).filter(Boolean))];
  const hasDumbbells = exercises.some((item) => supportsExerciseWeight(getExercise(item.id)));

  areas.slice(0, 2).forEach((area) => {
    tags.push(normalize(AREA_LABELS[area]));
  });

  if (hasDumbbells) {
    tags.push("гантели");
  }

  return [...new Set(tags)].slice(0, 3);
}

function getWorkoutSignature(workout) {
  return (workout.exercises || [])
    .map((item) => [
      item.id,
      item.mode,
      item.sets,
      item.reps,
      item.seconds,
      item.rest,
      item.weight || "",
      item.note || "",
    ].join(":"))
    .join("|");
}

function getStringHash(value) {
  let hash = 0;
  const text = String(value || "");

  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }

  return Math.abs(hash).toString(36);
}

function createSavedWorkoutFromBuilder() {
  const exercises = cloneBuilderItems(builderWorkout.exercises);

  if (!exercises.length) {
    return null;
  }

  const title = getBuilderWorkoutTitle();
  const now = new Date().toISOString();

  return normalizeSavedWorkout({
    id: builderWorkout.id || `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    exercises,
    createdAt: now,
    updatedAt: now,
  });
}

function saveCurrentBuilderWorkout(options = {}) {
  const workout = createSavedWorkoutFromBuilder();

  if (!workout) {
    if (!options.silent) {
      showToast("План пустой", "Добавь упражнения, потом сохрани тренировку в выбор.");
    }

    return null;
  }

  const signature = `${normalize(workout.title)}:${getWorkoutSignature(workout)}`;
  let index = builderWorkout.id
    ? savedWorkouts.findIndex((item) => item.id === builderWorkout.id)
    : -1;

  if (index < 0) {
    index = savedWorkouts.findIndex((item) => `${normalize(item.title)}:${getWorkoutSignature(item)}` === signature);
  }

  if (index >= 0) {
    const previous = savedWorkouts[index];
    savedWorkouts[index] = {
      ...workout,
      id: previous.id,
      createdAt: previous.createdAt,
      updatedAt: new Date().toISOString(),
    };
    builderWorkout.id = previous.id;
  } else {
    savedWorkouts.unshift(workout);
    builderWorkout.id = workout.id;
  }

  builderWorkout.title = workout.title;
  builderWorkout.exercises = cloneBuilderItems(workout.exercises);
  saveSavedWorkouts();
  saveBuilderWorkout();
  renderPlanCards();

  if (!options.silent) {
    showToast("Сохранено в выбор", workout.title);
  }

  return workout;
}

function showView(view) {
  const nextView = ["today", "plans", "library", "builder", "progress"].includes(view) ? view : "today";
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

function buildBuilderSteps(workout = builderWorkout) {
  const steps = [];
  const items = workout.exercises.filter((item) => getExercise(item.id));
  const totalSets = items.reduce((sum, item) => sum + item.sets, 0);
  let completedSets = 0;

  items.forEach((item) => {
    const exercise = getExercise(item.id);

    for (let set = 1; set <= item.sets; set += 1) {
      completedSets += 1;
      const isLastSet = completedSets >= totalSets;
      const targetLabel = getBuilderTargetLabel(item);

      steps.push({
        kind: item.mode === "time" ? "work" : "set",
        title: exercise.name,
        hint: getBuilderStepHint(item, set, targetLabel),
        duration: item.mode === "time" ? item.seconds : 0,
        exerciseId: item.id,
        set,
        sets: item.sets,
        targetLabel,
        targetValue: item.mode === "time" ? `${item.seconds}с` : String(item.reps),
      });

      if (!isLastSet && item.rest > 0) {
        steps.push({
          kind: "rest",
          title: "Отдых",
          hint: getNextBuilderStepHint(items, completedSets),
          duration: item.rest,
        });
      }
    }
  });

  return steps;
}

function prepareBuilderSession() {
  if (!builderWorkout.exercises.length) {
    showToast("Добавь упражнения", "Сначала собери тренировку из базы.");
    return false;
  }

  const title = getBuilderWorkoutTitle();
  const steps = buildBuilderSteps();

  if (!steps.length) {
    showToast("План пустой", "В выбранных упражнениях что-то не найдено.");
    return false;
  }

  window.clearInterval(ticker);
  session = {
    mode: "builder",
    planId: null,
    title,
    steps,
    exerciseIds: builderWorkout.exercises.map((item) => item.id),
    builderItems: builderWorkout.exercises.map((item) => ({ ...item })),
    index: 0,
    remaining: steps[0].duration || 0,
    running: false,
    startedAt: null,
    completed: false,
    totalSeconds: 0,
    finishedAt: null,
    historyEntryId: null,
    lastSignalKey: "",
  };
  syncSessionStep();
  return true;
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
  if (!session.steps.length) {
    if (!prepareBuilderSession()) {
      return;
    }
  } else if (session.completed) {
    if (!prepareBuilderSession()) {
      return;
    }
    renderAll();
    return;
  }

  const step = session.steps[session.index];

  if (isManualSetStep(step)) {
    if (!session.startedAt) {
      session.startedAt = Date.now();
    }

    tg?.HapticFeedback?.impactOccurred("light");
    nextStep({ autoStartTimed: true });
    return;
  }

  session.running = !session.running;

  if (session.running && !session.startedAt) {
    session.startedAt = Date.now();
  }

  if (session.running) {
    unlockTimerAudio();
  }

  tg?.HapticFeedback?.impactOccurred("light");
  updateTicker();
  renderSession();
}

function updateTicker() {
  window.clearInterval(ticker);

  if (!session.running || isManualSetStep(session.steps[session.index])) {
    return;
  }

  ticker = window.setInterval(() => {
    session.remaining -= 1;

    if (session.remaining <= 0) {
      nextStep({ autoStartTimed: true });
      return;
    }

    signalTimerCountdown();
    renderSession();
  }, 1000);
}

function nextStep(options = {}) {
  if (!session.steps.length) {
    return;
  }

  const nextIndex = session.index + 1;

  if (nextIndex >= session.steps.length) {
    completeSession();
    return;
  }

  session.index = nextIndex;
  session.remaining = session.steps[session.index].duration || 0;

  if (isManualSetStep(session.steps[session.index])) {
    window.clearInterval(ticker);
    session.running = false;
  } else if (options.autoStartTimed || session.running) {
    session.running = true;
    updateTicker();
  }

  tg?.HapticFeedback?.selectionChanged();
  renderSession();
}

function resetSession() {
  window.clearInterval(ticker);
  session.running = false;
  session.completed = false;

  prepareBuilderSession();

  tg?.HapticFeedback?.impactOccurred("light");
}

function completeSession() {
  window.clearInterval(ticker);
  session.running = false;
  session.completed = true;
  session.remaining = 0;

  const plannedSeconds = session.steps.reduce((sum, step) => sum + Number(step.duration || 0), 0);
  const elapsedSeconds = session.startedAt ? Math.round((Date.now() - session.startedAt) / 1000) : 0;
  const totalSeconds = session.mode === "builder" ? Math.max(1, elapsedSeconds, plannedSeconds) : plannedSeconds;
  session.totalSeconds = totalSeconds;
  session.finishedAt = Date.now();
  saveCompletedSessionHistory(session, totalSeconds);

  saveActiveSession();
  tg?.HapticFeedback?.notificationOccurred("success");
  showToast("Тренировка завершена", "Сессия сохранена в прогрессе.");
  renderAll();
}

function saveCompletedSessionHistory(activeSession, totalSeconds) {
  if (activeSession.historyEntryId) {
    return;
  }

  const entry = {
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    title: activeSession.title || "Тренировка",
    mode: activeSession.mode,
    seconds: Math.max(1, Number(totalSeconds) || 0),
    exercises: activeSession.builderItems || [],
  };

  history.unshift(entry);
  activeSession.historyEntryId = entry.id;
  saveHistory();
}

function adjustCurrentRest(delta) {
  const step = session.steps[session.index];

  if (!step || step.kind !== "rest" || session.completed) {
    return;
  }

  const nextDuration = clamp(Number(step.duration || 0) + delta, 0, 600);
  const remaining = clamp(Number(session.remaining || 0) + delta, 0, nextDuration);
  step.duration = nextDuration;
  session.remaining = remaining;

  if (session.remaining <= 0) {
    nextStep({ autoStartTimed: true });
    return;
  }

  tg?.HapticFeedback?.selectionChanged();
  updateTicker();
  renderSession();
}

function getSessionElapsedSeconds() {
  if (session.totalSeconds) {
    return session.totalSeconds;
  }

  if (!session.startedAt) {
    return 0;
  }

  return Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
}

function signalTimerCountdown() {
  const step = session.steps[session.index];

  if (!step || isManualSetStep(step) || session.remaining > TIMER_SIGNAL_SECONDS || session.remaining <= 0) {
    return;
  }

  const key = `${session.index}:${session.remaining}`;

  if (session.lastSignalKey === key) {
    return;
  }

  session.lastSignalKey = key;
  tg?.HapticFeedback?.impactOccurred("light");

  if (navigator.vibrate) {
    navigator.vibrate(35);
  }

  playTimerBeep();
}

function unlockTimerAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch {
    audioContext = null;
  }
}

function playTimerBeep() {
  try {
    unlockTimerAudio();

    if (!audioContext || audioContext.state !== "running") {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(session.remaining === 1 ? 880 : 660, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } catch {
    audioContext = null;
  }
}

function renderAll() {
  renderToday();
  renderPlanCards();
  renderLibrary();
  renderBuilder();
  renderProgress();
  renderSession();
}

function renderToday() {
  const date = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const activeSession = session.steps.length ? session : null;
  const sourceItems = activeSession?.builderItems || builderWorkout.exercises;
  const title = activeSession ? activeSession.title : getBuilderWorkoutTitle();
  const meta = activeSession ? getSessionMeta(activeSession) : getBuilderWorkoutMeta(builderWorkout);

  todayLabel.textContent = capitalize(date);
  selectedPlanTitle.textContent = title;
  selectedPlanMeta.textContent = meta;
  planStepsCount.textContent = sourceItems.length;

  planExerciseList.innerHTML = "";
  sourceItems.forEach((item) => {
    const exercise = getExercise(item.id);

    if (exercise) {
      planExerciseList.append(createBuilderSummaryCard(exercise, item));
    }
  });

  const weekStats = getWeekStats();
  weekSessions.textContent = weekStats.sessions;
  weekMinutes.textContent = Math.round(weekStats.seconds / 60);
  streakCount.textContent = getStreakDays();
}

function renderPlanCards() {
  planCards.innerHTML = "";

  savedWorkouts.forEach((workout) => {
    planCards.append(createBuilderPresetCard(workout, {
      source: "custom",
      showToday: true,
      deletable: true,
    }));
  });

  BUILDER_PRESETS
    .filter((preset) => !hiddenPresetIds.includes(preset.id))
    .forEach((preset) => {
      planCards.append(createBuilderPresetCard(preset, {
        source: "preset",
        showToday: true,
        deletable: true,
      }));
    });

  if (!planCards.children.length) {
    const empty = document.createElement("div");
    empty.className = "builder-empty";
    empty.textContent = "Выбор пустой. Открой конструктор, загрузи шаблон или собери свою тренировку и сохрани ее сюда.";
    planCards.append(empty);
  }
}

function loadWorkoutPlan(plan, options = {}) {
  if (options.source === "custom") {
    loadSavedWorkout(plan.id, options);
    return;
  }

  loadBuilderPreset(plan.id, options);
}

function deleteWorkoutPlan(plan, options = {}) {
  if (options.source === "custom") {
    const deletedWorkout = normalizeSavedWorkout(plan);
    const deletedIndex = savedWorkouts.findIndex((workout) => workout.id === plan.id);
    savedWorkouts = savedWorkouts.filter((workout) => workout.id !== plan.id);
    saveSavedWorkouts();

    if (builderWorkout.id === plan.id) {
      builderWorkout.id = null;
      saveBuilderWorkout();
    }

    showToast("Удалено из выбора", plan.title, {
      actionLabel: "Отменить",
      onAction: () => {
        if (!deletedWorkout || savedWorkouts.some((workout) => workout.id === deletedWorkout.id)) {
          return;
        }

        const insertAt = deletedIndex >= 0 ? deletedIndex : 0;
        savedWorkouts.splice(insertAt, 0, deletedWorkout);
        saveSavedWorkouts();
        renderAll();
        showToast("Восстановлено", deletedWorkout.title);
      },
    });
  } else {
    if (!hiddenPresetIds.includes(plan.id)) {
      hiddenPresetIds.push(plan.id);
      saveHiddenPresetIds();
    }

    showToast("Шаблон скрыт", "Его можно снова сохранить через конструктор.", {
      actionLabel: "Отменить",
      onAction: () => {
        hiddenPresetIds = hiddenPresetIds.filter((id) => id !== plan.id);
        saveHiddenPresetIds();
        renderAll();
        showToast("Шаблон вернулся", plan.title);
      },
    });
  }

  renderAll();
}

function loadSavedWorkout(workoutId, options = {}) {
  const workout = savedWorkouts.find((item) => item.id === workoutId);

  if (!workout) {
    showToast("Не найдено", "Эта тренировка уже удалена из выбора.");
    renderPlanCards();
    return;
  }

  builderWorkout = {
    id: workout.id,
    title: workout.title,
    exercises: cloneBuilderItems(workout.exercises),
  };
  saveBuilderWorkout();
  window.clearInterval(ticker);
  session = createEmptySession();
  clearActiveSession();
  renderAll();

  if (options.showToday) {
    showView("today");
  }

  tg?.HapticFeedback?.selectionChanged();
  showToast("Тренировка загружена", workout.title);
}

function renderLibrary() {
  const query = normalize(exerciseSearch.value);
  libraryList.innerHTML = "";

  const filtered = EXERCISES.filter((exercise) => {
    const matchesArea = areaFilter === "all" || exercise.area === areaFilter;
    const searchText = [
      exercise.name,
      exercise.focus,
      exercise.equipment,
      exercise.level,
      exercise.format,
      ...(exercise.muscles || []),
    ].join(" ");
    const matchesQuery = !query || normalize(searchText).includes(query);
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

function renderBuilder() {
  if (!builderNameInput) {
    return;
  }

  if (document.activeElement !== builderNameInput) {
    builderNameInput.value = builderWorkout.title;
  }

  builderExerciseCount.textContent = builderWorkout.exercises.length;
  builderSetCount.textContent = getBuilderSetCount();
  saveBuilderWorkoutButton.disabled = !builderWorkout.exercises.length;
  startBuilderWorkoutButton.disabled = !builderWorkout.exercises.length;
  renderBuilderPresets();
  renderBuilderList();
  renderBuilderExerciseList();
}

function renderBuilderPresets() {
  builderPresetList.innerHTML = "";

  BUILDER_PRESETS.forEach((preset) => {
    builderPresetList.append(createBuilderPresetCard(preset));
  });
}

function renderBuilderList() {
  builderList.innerHTML = "";

  if (!builderWorkout.exercises.length) {
    const empty = document.createElement("div");
    empty.className = "builder-empty";
    empty.textContent = "Пока пусто. Добавь упражнения из базы ниже, потом назови тренировку и запускай.";
    builderList.append(empty);
    return;
  }

  builderWorkout.exercises.forEach((builderItem, index) => {
    const exercise = getExercise(builderItem.id);

    if (!exercise) {
      return;
    }

    const isTimeMode = builderItem.mode === "time";
    const targetControl = isTimeMode ? "seconds" : "reps";
    const targetDelta = isTimeMode ? 5 : 1;
    const targetLabel = isTimeMode ? "Секунды" : "Повторы";
    const targetValue = isTimeMode ? `${builderItem.seconds}с` : builderItem.reps;
    const formatLabel = isTimeMode ? "Сек" : "Повт";
    const canUseWeight = supportsExerciseWeight(exercise);
    const weightField = canUseWeight ? `
        <label>
          <span>Вес</span>
          <input type="text" value="${escapeHtml(builderItem.weight)}" maxlength="18" placeholder="Напр. 10 кг" data-builder-item-field="weight">
        </label>
    ` : "";

    const item = document.createElement("article");
    item.className = "builder-item";
    item.innerHTML = `
      <button class="builder-item-main" type="button" aria-label="Открыть технику: ${escapeHtml(exercise.name)}">
        <span class="exercise-badge" aria-hidden="true">${getAreaIcon(exercise.area)}</span>
        <span class="exercise-copy">
          <strong>${escapeHtml(exercise.name)}</strong>
          <span>${getBuilderItemSummary(builderItem)}</span>
        </span>
      </button>
      <div class="builder-actions">
        <button class="mini-icon-button" type="button" aria-label="Поднять выше" ${index === 0 ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 15 6-6 6 6"></path></svg>
        </button>
        <button class="mini-icon-button" type="button" aria-label="Опустить ниже" ${index === builderWorkout.exercises.length - 1 ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6"></path></svg>
        </button>
        <button class="mini-icon-button danger" type="button" aria-label="Удалить упражнение">
          <svg viewBox="0 0 24 24" focusable="false"><path d="M6 7h12M10 11v6M14 11v6M9 7l1-3h4l1 3M8 7l1 13h6l1-13"></path></svg>
        </button>
      </div>
      <div class="builder-prescription" aria-label="Настройки упражнения">
        <div class="builder-format-lock" aria-label="Формат упражнения">
          <span>Формат</span>
          <strong>${formatLabel}</strong>
        </div>
        <div class="builder-stepper">
          <span>Подходы</span>
          <div>
            <button type="button" data-builder-item-control="sets" data-delta="-1">-</button>
            <strong>${builderItem.sets}</strong>
            <button type="button" data-builder-item-control="sets" data-delta="1">+</button>
          </div>
        </div>
        <div class="builder-stepper">
          <span>${targetLabel}</span>
          <div>
            <button type="button" data-builder-item-control="${targetControl}" data-delta="-${targetDelta}">-</button>
            <strong>${targetValue}</strong>
            <button type="button" data-builder-item-control="${targetControl}" data-delta="${targetDelta}">+</button>
          </div>
        </div>
        <div class="builder-stepper">
          <span>Отдых</span>
          <div>
            <button type="button" data-builder-item-control="rest" data-delta="-5">-</button>
            <strong>${builderItem.rest}с</strong>
            <button type="button" data-builder-item-control="rest" data-delta="5">+</button>
          </div>
        </div>
      </div>
      <div class="builder-detail-fields${canUseWeight ? "" : " single"}">
        ${weightField}
        <label>
          <span>Заметка</span>
          <input type="text" value="${escapeHtml(builderItem.note)}" maxlength="80" placeholder="${canUseWeight ? "Темп, техника, вес по рукам" : "Темп, техника, самочувствие"}" data-builder-item-field="note">
        </label>
      </div>
    `;
    const [upButton, downButton, deleteButton] = item.querySelectorAll(".mini-icon-button");
    item.querySelector(".builder-item-main").addEventListener("click", () => openExerciseSheet(exercise));
    upButton.addEventListener("click", () => moveBuilderExercise(index, -1));
    downButton.addEventListener("click", () => moveBuilderExercise(index, 1));
    deleteButton.addEventListener("click", () => removeBuilderExercise(index));
    item.querySelectorAll("[data-builder-item-control]").forEach((button) => {
      button.addEventListener("click", () => {
        adjustBuilderItem(index, button.dataset.builderItemControl, Number(button.dataset.delta));
      });
    });
    item.querySelectorAll("[data-builder-item-field]").forEach((field) => {
      field.addEventListener("input", () => {
        updateBuilderItemField(index, field.dataset.builderItemField, field.value);
        item.querySelector(".exercise-copy span").textContent = getBuilderItemSummary(builderWorkout.exercises[index]);
      });
    });
    builderList.append(item);
  });
}

function renderBuilderExerciseList() {
  const query = normalize(builderExerciseSearch.value);
  builderExerciseList.innerHTML = "";

  const filtered = EXERCISES.filter((exercise) => {
    const matchesArea = builderAreaFilter === "all" || exercise.area === builderAreaFilter;
    const searchText = [
      exercise.name,
      exercise.focus,
      exercise.equipment,
      exercise.level,
      exercise.format,
      ...(exercise.muscles || []),
    ].join(" ");
    const matchesQuery = !query || normalize(searchText).includes(query);
    return matchesArea && matchesQuery;
  });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "history-card";
    empty.innerHTML = `<div class="history-copy"><strong>Ничего не найдено</strong><span>Попробуй другой запрос или фильтр.</span></div>`;
    builderExerciseList.append(empty);
    return;
  }

  filtered.forEach((exercise) => {
    builderExerciseList.append(createBuilderExerciseCard(exercise));
  });
}

function renderSession() {
  const step = session.steps[session.index];
  const totalSteps = session.steps.length;
  const manualStep = isManualSetStep(step);
  const completed = Boolean(session.completed);
  const progress = completed
    ? 100
    : manualStep && totalSteps
    ? (session.index / totalSteps) * 100
    : step && step.duration
      ? ((step.duration - session.remaining) / step.duration) * 100
      : 0;
  const totalSeconds = session.totalSeconds || getSessionElapsedSeconds();

  document.documentElement.style.setProperty("--ring-progress", String(Math.max(0, Math.min(100, progress))));
  sessionRing.classList.toggle("resting", Boolean(step && step.kind === "rest"));
  sessionRing.classList.toggle("manual", manualStep);
  sessionRing.classList.toggle("complete", completed);
  timerValue.textContent = completed ? formatTime(totalSeconds) : manualStep ? step.targetValue : formatTime(session.remaining);
  currentStepType.textContent = completed ? "Финиш" : step ? getStepTypeLabel(step) : "Готовность";
  currentStepTitle.textContent = completed ? "Тренировка завершена" : step ? step.title : "Нажми старт";
  currentStepHint.textContent = completed ? "Можно повторить план или выбрать следующую тренировку." : step ? step.hint : "Выбери план и начни тренировку.";
  nextStepLabel.textContent = completed ? "Отличная работа" : getNextStepLabel();
  stepCounter.textContent = totalSteps ? `${completed ? totalSteps : session.index + 1} / ${totalSteps}` : "0 / 0";
  startPauseButton.textContent = completed ? "Повторить" : manualStep ? "Готово" : session.running ? "Пауза" : "Старт";
  resetSessionButton.disabled = !totalSteps;
  skipStepButton.disabled = !totalSteps || completed;
  restAdjustControls.hidden = !(step && step.kind === "rest" && !completed);
  finishCard.hidden = !completed;

  if (completed) {
    const setCount = session.steps.filter((item) => item.kind === "set" || item.kind === "work").length;
    finishTitle.textContent = "Сессия сохранена";
    finishMeta.textContent = `${formatWorkoutDuration(totalSeconds)} · ${setCount} ${plural(setCount, "подход", "подхода", "подходов")}`;
  }

  if (ringProgress) {
    ringProgress.style.strokeDashoffset = `calc(327 - (327 * ${Math.max(0, Math.min(100, progress))}) / 100)`;
  }

  saveActiveSession();
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
      <span class="area-chip">${getHistoryModeLabel(entry.mode)}</span>
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

function createBuilderExerciseCard(exercise) {
  const card = document.createElement("article");
  card.className = "exercise-card add-exercise-card";
  card.innerHTML = `
    <button class="add-exercise-main" type="button" aria-label="Добавить: ${escapeHtml(exercise.name)}">
      <span class="exercise-badge" aria-hidden="true">${getAreaIcon(exercise.area)}</span>
      <span class="exercise-copy">
        <strong>${escapeHtml(exercise.name)}</strong>
        <span>${escapeHtml(exercise.focus)}</span>
      </span>
    </button>
    <button class="mini-icon-button add" type="button" aria-label="Добавить упражнение">
      <svg viewBox="0 0 24 24" focusable="false"><path d="M12 5v14M5 12h14"></path></svg>
    </button>
  `;
  card.querySelector(".add-exercise-main").addEventListener("click", () => addBuilderExercise(exercise.id));
  card.querySelector(".mini-icon-button").addEventListener("click", () => addBuilderExercise(exercise.id));
  return card;
}

function createBuilderPresetCard(preset, options = {}) {
  const content = `
    <span class="exercise-badge" aria-hidden="true">${getPresetIcon()}</span>
    <span class="builder-preset-copy">
      <strong>${escapeHtml(preset.title)}</strong>
      <span>${escapeHtml(preset.meta)}</span>
      <small>${preset.tags.map((tag) => `<b>${escapeHtml(tag)}</b>`).join("")}</small>
    </span>
    <span class="area-chip">${escapeHtml(preset.level)}</span>
  `;

  if (!options.deletable) {
    const card = document.createElement("button");
    card.className = "builder-preset-card";
    card.type = "button";
    card.innerHTML = content;
    card.addEventListener("click", () => loadWorkoutPlan(preset, options));
    return card;
  }

  const card = document.createElement("article");
  card.className = "builder-preset-card workout-plan-card";
  card.innerHTML = `
    <button class="workout-plan-main" type="button" aria-label="Выбрать тренировку: ${escapeHtml(preset.title)}">
      ${content}
    </button>
    <button class="mini-icon-button danger plan-delete-button" type="button" aria-label="Удалить тренировку из выбора">
      <svg viewBox="0 0 24 24" focusable="false"><path d="M6 7h12M10 11v6M14 11v6M9 7l1-3h4l1 3M8 7l1 13h6l1-13"></path></svg>
    </button>
  `;
  card.querySelector(".workout-plan-main").addEventListener("click", () => loadWorkoutPlan(preset, options));
  card.querySelector(".plan-delete-button").addEventListener("click", () => deleteWorkoutPlan(preset, options));
  return card;
}

function createBuilderSummaryCard(exercise, item) {
  const card = document.createElement("button");
  card.className = "exercise-card";
  card.type = "button";
  card.innerHTML = `
    <span class="exercise-badge" aria-hidden="true">${getAreaIcon(exercise.area)}</span>
    <span class="exercise-copy">
      <strong>${escapeHtml(exercise.name)}</strong>
      <span>${escapeHtml(getBuilderItemSummary(item))}</span>
    </span>
    <span class="duration-chip">${item.sets}x</span>
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

function isManualSetStep(step) {
  return Boolean(step && step.kind === "set");
}

function getStepTypeLabel(step) {
  if (step.kind === "rest") {
    return "Отдых";
  }

  if (step.kind === "set") {
    return `Подход ${step.set} / ${step.sets}`;
  }

  if (step.set && step.sets) {
    return `Таймер ${step.set} / ${step.sets}`;
  }

  return "Работа";
}

function getBuilderWorkoutTitle() {
  const title = String(builderWorkout.title || "").trim();
  return title || "Моя тренировка";
}

function getBuilderSetCount() {
  return builderWorkout.exercises.reduce((sum, item) => sum + Number(item.sets || 0), 0);
}

function getBuilderWorkoutMeta(workout) {
  const exerciseCount = workout.exercises.length;
  const setCount = workout.exercises.reduce((sum, item) => sum + Number(item.sets || 0), 0);
  return `${exerciseCount} ${plural(exerciseCount, "упражнение", "упражнения", "упражнений")} - ${setCount} ${plural(setCount, "подход", "подхода", "подходов")}`;
}

function getBuilderTargetLabel(item) {
  return item.mode === "time"
    ? `${item.seconds} ${plural(item.seconds, "секунда", "секунды", "секунд")}`
    : `${item.reps} ${plural(item.reps, "повторение", "повторения", "повторений")}`;
}

function getBuilderItemSummary(item) {
  const target = item.mode === "time" ? `${item.seconds}с` : `${item.reps} повт`;
  const weight = item.weight && supportsExerciseWeight(getExercise(item.id)) ? ` · ${item.weight}` : "";
  const note = item.note ? ` · ${item.note}` : "";
  return `${item.sets} x ${target}${weight} · отдых ${item.rest}с${note}`;
}

function getBuilderStepHint(item, set, targetLabel) {
  const base = item.mode === "time"
    ? `Подход ${set} из ${item.sets}. Держи ${targetLabel} и не ломай технику.`
    : `Подход ${set} из ${item.sets}: ${targetLabel}. Сделай в своем темпе и нажми «Готово».`;
  const weight = item.weight && supportsExerciseWeight(getExercise(item.id)) ? ` Вес: ${item.weight}.` : "";
  const note = item.note ? ` Заметка: ${item.note}.` : "";
  return `${base}${weight}${note}`;
}

function getDefaultReps(exercise) {
  if (exercise.area === "arms" || exercise.area === "shoulders") {
    return 12;
  }

  if (exercise.level === "сложно") {
    return 8;
  }

  return 10;
}

function getDefaultSeconds(exercise) {
  return exercise.format === "время" ? 40 : 30;
}

function getDefaultRest(exercise) {
  if (exercise.area === "legs" || exercise.level === "сложно") {
    return 75;
  }

  if (exercise.area === "core") {
    return 45;
  }

  return 60;
}

function getNextBuilderStepHint(items, completedSets) {
  let cursor = 0;

  for (const item of items) {
    const exercise = getExercise(item.id);

    for (let set = 1; set <= item.sets; set += 1) {
      cursor += 1;

      if (cursor > completedSets && exercise) {
        return `Дальше: ${exercise.name}, подход ${set} из ${item.sets}.`;
      }
    }
  }

  return "Восстанови дыхание и готовься к следующему подходу.";
}

function getSessionMeta(activeSession) {
  if (activeSession.mode === "builder") {
    const exerciseCount = activeSession.builderItems?.length || activeSession.exerciseIds.length;
    const setCount = activeSession.steps.filter((step) => step.kind === "set" || step.kind === "work").length;
    return `${exerciseCount} ${plural(exerciseCount, "упражнение", "упражнения", "упражнений")} - ${setCount} ${plural(setCount, "подход", "подхода", "подходов")}`;
  }

  return getBuilderWorkoutMeta(builderWorkout);
}

function getHistoryModeLabel(mode) {
  if (mode === "builder") {
    return "своя";
  }

  return "план";
}

function addBuilderExercise(exerciseId) {
  const item = createBuilderItem(exerciseId);
  const exercise = getExercise(exerciseId);

  if (!item || !exercise) {
    return;
  }

  builderWorkout.exercises.push(item);
  saveBuilderWorkout();
  renderBuilder();
  tg?.HapticFeedback?.selectionChanged();
  showToast("Добавлено", exercise.name);
}

function loadBuilderPreset(presetId, options = {}) {
  const preset = BUILDER_PRESETS.find((item) => item.id === presetId);

  if (!preset) {
    return;
  }

  builderWorkout = createBuilderWorkoutFromPreset(preset);
  saveBuilderWorkout();
  window.clearInterval(ticker);
  session = createEmptySession();
  clearActiveSession();
  renderAll();

  if (options.showToday) {
    showView("today");
  }

  tg?.HapticFeedback?.selectionChanged();
  showToast("Шаблон загружен", preset.title);
}

function removeBuilderExercise(index) {
  const [item] = builderWorkout.exercises.splice(index, 1);
  saveBuilderWorkout();
  renderBuilder();

  const exercise = getExercise(item?.id);
  showToast("Удалено", exercise?.name || "Упражнение");
}

function moveBuilderExercise(index, delta) {
  const nextIndex = index + delta;

  if (nextIndex < 0 || nextIndex >= builderWorkout.exercises.length) {
    return;
  }

  const [exerciseId] = builderWorkout.exercises.splice(index, 1);
  builderWorkout.exercises.splice(nextIndex, 0, exerciseId);
  saveBuilderWorkout();
  renderBuilder();
  tg?.HapticFeedback?.selectionChanged();
}

function adjustBuilderItem(index, kind, delta) {
  const item = builderWorkout.exercises[index];

  if (!item) {
    return;
  }

  if (kind === "sets") {
    item.sets = clamp(item.sets + delta, 1, 8);
  } else if (kind === "reps") {
    item.reps = clamp(item.reps + delta, 1, 50);
  } else if (kind === "seconds") {
    item.seconds = clamp(item.seconds + delta, 10, 180);
  } else if (kind === "rest") {
    item.rest = clamp(item.rest + delta, 0, 240);
  }

  saveBuilderWorkout();
  renderBuilder();
}

function updateBuilderItemField(index, kind, value) {
  const item = builderWorkout.exercises[index];
  const exercise = getExercise(item?.id);

  if (!item || !["weight", "note"].includes(kind)) {
    return;
  }

  if (kind === "weight" && !supportsExerciseWeight(exercise)) {
    item.weight = "";
    saveBuilderWorkout();
    return;
  }

  item[kind] = String(value || "").slice(0, kind === "weight" ? 18 : 80);
  saveBuilderWorkout();
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

function formatWorkoutDuration(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);

  if (safeSeconds < 60) {
    return `${safeSeconds} с`;
  }

  return `${Math.round(safeSeconds / 60)} мин`;
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

function showToast(title, text, options = {}) {
  window.clearTimeout(toastTimer);
  toastActionHandler = typeof options.onAction === "function" ? options.onAction : null;
  toastTitle.textContent = title;
  toastText.textContent = text;
  toastActionButton.textContent = options.actionLabel || "Отменить";
  toastActionButton.hidden = !toastActionHandler;
  toast.classList.add("show");
  toast.setAttribute("aria-hidden", "false");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
    toastActionButton.hidden = true;
    toastActionHandler = null;
  }, 2600);
}

function getAreaIcon(area) {
  const icons = {
    legs: `<svg viewBox="0 0 24 24" focusable="false"><path d="M8 4v7l-2 8M14 4v6l4 9M7 12h7"></path></svg>`,
    chest: `<svg viewBox="0 0 24 24" focusable="false"><path d="M5 14h14M8 14l2-5h4l2 5M9 9V6m6 3V6M6 18h12"></path></svg>`,
    back: `<svg viewBox="0 0 24 24" focusable="false"><path d="M6 5v14M18 5v14M8 8h8M8 16h8M10 12h4"></path></svg>`,
    shoulders: `<svg viewBox="0 0 24 24" focusable="false"><path d="M5 14c2-5 5-7 7-7s5 2 7 7M8 14l-2 5M16 14l2 5M10 11h4"></path></svg>`,
    arms: `<svg viewBox="0 0 24 24" focusable="false"><path d="M7 14c2-5 5-7 8-4l2 2M7 14l-2 5h5l2-4M15 10l3-3M17 12l3-1"></path></svg>`,
    core: `<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8l2 7-6 7-6-7 2-7Z"></path></svg>`,
  };
  return icons[area] || icons.core;
}

function getHistoryIcon() {
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="M20 7 9 18l-5-5"></path></svg>`;
}

function getPresetIcon() {
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="M5 12h4l2-7 4 14 2-7h2M6 19h12"></path></svg>`;
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
decreaseRestButton.addEventListener("click", () => adjustCurrentRest(-15));
increaseRestButton.addEventListener("click", () => adjustCurrentRest(15));
toastActionButton.addEventListener("click", () => {
  const action = toastActionHandler;

  window.clearTimeout(toastTimer);
  toast.classList.remove("show");
  toast.setAttribute("aria-hidden", "true");
  toastActionButton.hidden = true;
  toastActionHandler = null;

  if (action) {
    action();
  }
});

exerciseSearch.addEventListener("input", renderLibrary);

areaFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    areaFilter = button.dataset.areaFilter;
    areaFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderLibrary();
  });
});

builderNameInput.addEventListener("input", () => {
  builderWorkout.title = builderNameInput.value.slice(0, 36);
  saveBuilderWorkout();
});

builderNameInput.addEventListener("blur", () => {
  builderWorkout.title = getBuilderWorkoutTitle();
  builderNameInput.value = builderWorkout.title;
  saveBuilderWorkout();
});

saveBuilderWorkoutButton.addEventListener("click", () => {
  builderWorkout.title = getBuilderWorkoutTitle();
  builderNameInput.value = builderWorkout.title;
  saveCurrentBuilderWorkout();
  renderAll();
});

builderExerciseSearch.addEventListener("input", renderBuilderExerciseList);

builderAreaFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    builderAreaFilter = button.dataset.builderAreaFilter;
    builderAreaFilterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderBuilderExerciseList();
  });
});

startBuilderWorkoutButton.addEventListener("click", () => {
  builderWorkout.title = getBuilderWorkoutTitle();
  saveBuilderWorkout();

  if (prepareBuilderSession()) {
    saveCurrentBuilderWorkout({ silent: true });
    renderAll();
    showView("today");
  }
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

window.addEventListener("pagehide", saveActiveSession);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    saveActiveSession();
  }
});
