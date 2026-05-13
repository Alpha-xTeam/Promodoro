import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const DEFAULT_SETTINGS = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
  dailyGoalMinutes: 120,
}

const MODES = [
  { id: 'work', label: { en: 'Work', ar: 'عمل' } },
  { id: 'shortBreak', label: { en: 'Short Break', ar: 'استراحة قصيرة' } },
  { id: 'longBreak', label: { en: 'Long Break', ar: 'استراحة طويلة' } },
]

const translations = {
  en: {
    title: 'Pomodoro',
    focusTime: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    skip: 'Skip',
    focusMinutes: 'Focus Minutes',
    sessions: 'Sessions',
    dayStreak: 'Day Streak',
    dailyGoal: 'Daily Goal',
    goalComplete: 'Goal completed! Great work today!',
    goalHalfway: 'More than halfway there! Keep going!',
    settings: 'Settings',
    close: 'Close',
    workDuration: 'Work Duration',
    shortBreakLabel: 'Short Break',
    longBreakLabel: 'Long Break',
    sessionsBeforeLong: 'Sessions before long break',
    sound: 'Sound',
    min: 'min',
    ambientSounds: 'Ambient sounds',
    totalFocus: 'Total focus time',
    focusScore: 'Focus Score',
    achievements: 'Achievements',
    unlocked: 'Unlocked!',
    bestDay: 'Best day',
    avgDaily: 'Avg daily',
    shortcuts: 'Space: Start/Pause | R: Reset | S: Skip | 1-2-3: Modes',
    accentColor: 'Accent Color',
    off: 'Off',
    rain: 'Rain',
    forest: 'Forest',
    ocean: 'Ocean',
    whitenoise: 'White Noise',
    motivation: [
      "You're in the zone. Keep going.",
      'Every session builds momentum.',
      'Consistency beats intensity.',
      'Your focus is a muscle. Train it daily.',
      'Small wins compound into big results.',
      'Deep work is a superpower.',
      'Progress starts with a single minute.',
      'One session at a time.',
      'Be present. Be focused.',
      "You're building something important.",
    ],
  },
  ar: {
    title: 'بومودورو',
    focusTime: 'وقت التركيز',
    shortBreak: 'استراحة قصيرة',
    longBreak: 'استراحة طويلة',
    start: 'بدء',
    pause: 'إيقاف',
    reset: 'إعادة',
    skip: 'تخطي',
    focusMinutes: 'دقائق التركيز',
    sessions: 'الجلسات',
    dayStreak: 'أيام متتالية',
    dailyGoal: 'الهدف اليومي',
    goalComplete: 'اكتمل الهدف! عمل رائع اليوم!',
    goalHalfway: 'تجاوزت نصف الهدف! استمر!',
    settings: 'الإعدادات',
    close: 'إغلاق',
    workDuration: 'مدة العمل',
    shortBreakLabel: 'الاستراحة القصيرة',
    longBreakLabel: 'الاستراحة الطويلة',
    sessionsBeforeLong: 'الجلسات قبل الاستراحة الطويلة',
    sound: 'الصوت',
    min: 'دقيقة',
    ambientSounds: 'أصوات محيطة',
    totalFocus: 'إجمالي وقت التركيز',
    focusScore: 'درجة التركيز',
    achievements: 'الإنجازات',
    unlocked: 'تم الفتح!',
    bestDay: 'أفضل يوم',
    avgDaily: 'المعدل اليومي',
    shortcuts: 'مسافة: بدء/إيقاف | R: إعادة | S: تخطي | 1-2-3: أوضاع',
    accentColor: 'لون التطبيق',
    off: 'إيقاف',
    rain: 'مطر',
    forest: 'غابة',
    ocean: 'محيط',
    whitenoise: 'ضجيج أبيض',
    motivation: [
      'أنت في المنطقة. استمر.',
      'كل جلسة تبني زخماً.',
      'الاستمرارية تتفوق على الشدة.',
      'تركيزك عضلة. دربها يومياً.',
      'الانتصارات الصغيرة تتراكم لنتائج كبيرة.',
      'العمل العميق قوة خارقة.',
      'التقدم يبدأ بدقيقة واحدة.',
      'جلسة واحدة في كل مرة.',
      'كن حاضراً. كن مركزاً.',
      'أنت تبني شيئاً مهماً.',
    ],
  },
}

const ACHIEVEMENTS = [
  { id: 'first', icon: '🌱', en: 'First Session', ar: 'أول جلسة', descEn: 'Complete your first session', descAr: 'أكمل أول جلسة لك' },
  { id: 'ten', icon: '🔥', en: 'Getting Started', ar: 'بداية موفقة', descEn: 'Complete 10 sessions', descAr: 'أكمل 10 جلسات' },
  { id: 'fifty', icon: '💪', en: 'Focus Master', ar: 'سيد التركيز', descEn: 'Complete 50 sessions', descAr: 'أكمل 50 جلسة' },
  { id: 'hundred', icon: '🏆', en: 'Century Club', ar: 'نادي المئة', descEn: 'Complete 100 sessions', descAr: 'أكمل 100 جلسة' },
  { id: 'streak3', icon: '📈', en: 'Momentum', ar: 'زخم', descEn: '3-day streak', descAr: '3 أيام متتالية' },
  { id: 'streak7', icon: '🌟', en: 'Week Warrior', ar: 'محارب الأسبوع', descEn: '7-day streak', descAr: '7 أيام متتالية' },
  { id: 'streak30', icon: '💎', en: 'Unstoppable', ar: 'لا يُوقف', descEn: '30-day streak', descAr: '30 يوماً متتالياً' },
  { id: 'goalFirst', icon: '🎯', en: 'Goal Crusher', ar: 'محطم الأهداف', descEn: 'Reach your daily goal once', descAr: 'حقق هدفك اليومي مرة' },
  { id: 'goalWeek', icon: '📅', en: 'Consistent', ar: 'منتظم', descEn: 'Reach daily goal 7 days straight', descAr: 'حقق هدفك 7 أيام متتالية' },
  { id: 'night', icon: '🦉', en: 'Night Owl', ar: 'بوم الليل', descEn: 'Focus after midnight', descAr: 'تركيز بعد منتصف الليل' },
  { id: 'early', icon: '🌅', en: 'Early Bird', ar: 'طائر الصباح', descEn: 'Focus before 8 AM', descAr: 'تركيز قبل 8 صباحاً' },
]

const SOUND_OPTIONS = [
  { id: null, label: { en: 'Off', ar: 'إيقاف' } },
  { id: 'rain', label: { en: 'Rain', ar: 'مطر' } },
  { id: 'forest', label: { en: 'Forest', ar: 'غابة' } },
  { id: 'ocean', label: { en: 'Ocean', ar: 'محيط' } },
  { id: 'whitenoise', label: { en: 'White Noise', ar: 'ضجيج أبيض' } },
]

function loadData(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

function playAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch {}
}

function createAmbientEngine() {
  let ctx = null
  let nodes = {}
  let activeId = null

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function makeNoiseBuffer(seconds) {
    const c = getCtx()
    const len = c.sampleRate * seconds
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  return {
    start(id) {
      this.stop()
      activeId = id
      const c = getCtx()

      function makeLayer(opts) {
        const buf = makeNoiseBuffer(4)
        const src = c.createBufferSource()
        src.buffer = buf
        src.loop = true
        let last = src
        if (opts.filter) {
          const f = c.createBiquadFilter()
          f.type = opts.filter.type || 'lowpass'
          f.frequency.value = opts.filter.freq || 1000
          if (opts.filter.Q) f.Q.value = opts.filter.Q
          last.connect(f)
          last = f
        }
        const g = c.createGain()
        g.gain.value = opts.gain || 0.1
        last.connect(g)
        const mod = opts.modulation
        if (mod) {
          const lfo = c.createOscillator()
          const lfoG = c.createGain()
          lfo.type = mod.type || 'sine'
          lfo.frequency.value = mod.freq || 1
          lfoG.gain.value = mod.amount || 0.03
          lfo.connect(lfoG)
          lfoG.connect(g.gain)
          lfo.start()
          src.lfo = lfo
        }
        src.start()
        return { src, gain: g, lfo: src.lfo }
      }

      const allNodes = []
      function addLayer(opts) {
        const layer = makeLayer(opts)
        layer.gain.connect(c.destination)
        allNodes.push(layer.src, layer.gain)
        if (layer.lfo) allNodes.push(layer.lfo)
      }

      switch (id) {
        case 'whitenoise': {
          addLayer({ gain: 0.05, filter: { type: 'bandpass', freq: 2000, Q: 0.7 } })
          addLayer({ gain: 0.03, filter: { type: 'highpass', freq: 6000 } })
          break
        }
        case 'rain': {
          addLayer({ gain: 0.08, filter: { type: 'highpass', freq: 4000 }, modulation: { freq: 3 + Math.random() * 2, amount: 0.04 } })
          addLayer({ gain: 0.06, filter: { type: 'bandpass', freq: 1500, Q: 0.4 }, modulation: { freq: 1.5 + Math.random(), amount: 0.03 } })
          addLayer({ gain: 0.04, filter: { type: 'lowpass', freq: 500 }, modulation: { freq: 0.3 + Math.random() * 0.5, amount: 0.02 } })
          break
        }
        case 'forest': {
          addLayer({ gain: 0.04, filter: { type: 'lowpass', freq: 1200 }, modulation: { type: 'sine', freq: 0.2 + Math.random() * 0.3, amount: 0.02 } })
          addLayer({ gain: 0.03, filter: { type: 'bandpass', freq: 3000, Q: 1 }, modulation: { type: 'sine', freq: 0.5 + Math.random() * 0.5, amount: 0.02 } })
          const chirpInt = setInterval(() => {
            try {
              const osc = c.createOscillator()
              const g = c.createGain()
              osc.type = 'sine'
              osc.frequency.value = 2000 + Math.random() * 2000
              g.gain.setValueAtTime(0, c.currentTime)
              g.gain.linearRampToValueAtTime(0.02, c.currentTime + 0.05)
              g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3)
              osc.connect(g)
              g.connect(c.destination)
              osc.start()
              osc.stop(c.currentTime + 0.3)
              allNodes.push(osc, g)
            } catch {}
          }, 3000 + Math.random() * 4000)
          nodes.chirpInt = chirpInt
          break
        }
        case 'ocean': {
          addLayer({ gain: 0.07, filter: { type: 'lowpass', freq: 300 }, modulation: { type: 'sine', freq: 0.08 + Math.random() * 0.04, amount: 0.05 } })
          addLayer({ gain: 0.05, filter: { type: 'bandpass', freq: 700, Q: 0.5 }, modulation: { type: 'sine', freq: 0.15 + Math.random() * 0.1, amount: 0.03 } })
          addLayer({ gain: 0.03, filter: { type: 'highpass', freq: 3000 }, modulation: { type: 'sine', freq: 0.4 + Math.random() * 0.2, amount: 0.02 } })
          break
        }
      }
      nodes = { allNodes }
    },
    stop() {
      if (nodes.chirpInt) {
        clearInterval(nodes.chirpInt)
        delete nodes.chirpInt
      }
      if (nodes.allNodes) {
        nodes.allNodes.forEach(n => {
          try { n.disconnect() } catch {}
          try { n.stop() } catch {}
        })
      }
      nodes = {}
      activeId = null
    },
    getActive() { return activeId },
  }
}

const savedState = loadData('pomodoro-state', null)
const initialSettings = loadData('pomodoro-settings', DEFAULT_SETTINGS)
function getInitialLang() {
  const saved = loadData('pomodoro-lang', null)
  if (saved) return saved
  return (navigator.language || '').startsWith('ar') ? 'ar' : 'en'
}
const initialLang = getInitialLang()

let initialMode = 'work'
let initialTimeLeft = initialSettings.workDuration
let initialIsRunning = false
let initialCompletedSessions = 0
let initialEndTime = null

if (savedState) {
  if (savedState.isRunning && savedState.endTime) {
    const remaining = Math.max(0, Math.round((savedState.endTime - Date.now()) / 1000))
    initialMode = savedState.mode || 'work'
    initialTimeLeft = remaining > 0 ? remaining : 0
    initialIsRunning = remaining > 0
    initialEndTime = remaining > 0 ? savedState.endTime : null
    initialCompletedSessions = savedState.completedWorkSessions || 0
  } else {
    initialMode = savedState.mode || 'work'
    initialTimeLeft = savedState.timeLeft ?? initialSettings.workDuration
    initialCompletedSessions = savedState.completedWorkSessions || 0
  }
}

function App() {
  const [settings, setSettings] = useState(initialSettings)
  const [sessions, setSessions] = useState(() => loadData('pomodoro-sessions', []))
  const [mode, setMode] = useState(initialMode)
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)
  const [isRunning, setIsRunning] = useState(initialIsRunning)
  const [completedWorkSessions, setCompletedWorkSessions] = useState(initialCompletedSessions)
  const [showSettings, setShowSettings] = useState(false)
  const [activeSound, setActiveSound] = useState(null)
  const [showSoundPicker, setShowSoundPicker] = useState(false)
  const [language, setLanguage] = useState(initialLang)
  const [accentColor, setAccentColor] = useState(() => loadData('pomodoro-accent', '#FF9500'))
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => loadData('pomodoro-achievements', []))
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState(null)

  const ambientEngine = useRef(createAmbientEngine())
  const intervalRef = useRef(null)
  const endTimeRef = useRef(initialEndTime)
  const completeSessionRef = useRef(null)

  const t = useCallback((key) => translations[language][key] ?? key, [language])

  const [motivationIndex, setMotivationIndex] = useState(
    () => Math.floor(Math.random() * translations.en.motivation.length)
  )
  const motivationMsg = translations[language].motivation[motivationIndex % translations[language].motivation.length]

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    saveData('pomodoro-lang', language)
  }, [language])

  const getDuration = useCallback((m) => {
    switch (m || mode) {
      case 'work': return settings.workDuration
      case 'shortBreak': return settings.shortBreakDuration
      case 'longBreak': return settings.longBreakDuration
      default: return settings.workDuration
    }
  }, [mode, settings])

  const switchMode = useCallback((newMode) => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    endTimeRef.current = null
    setMode(newMode)
    setTimeLeft(getDuration(newMode))
  }, [getDuration])

  const notify = useCallback((title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  }, [])

  const completeSession = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    endTimeRef.current = null

    if (mode === 'work') {
      const entry = {
        date: new Date().toISOString(),
        duration: settings.workDuration,
        type: 'work',
      }
      const updated = [...sessions, entry]
      setSessions(updated)
      saveData('pomodoro-sessions', updated)

      setCompletedWorkSessions(c => c + 1)

      if (settings.soundEnabled) playAlert()
      notify('Work session complete!', 'Time for a break!')

      if ((completedWorkSessions + 1) % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      if (settings.soundEnabled) playAlert()
      notify('Break over!', 'Time to focus!')
      switchMode('work')
    }
  }, [mode, sessions, settings, completedWorkSessions, switchMode, notify])

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
      endTimeRef.current = null
    } else {
      setIsRunning(true)
      endTimeRef.current = Date.now() + timeLeft * 1000
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          clearInterval(intervalRef.current)
          completeSession()
        }
      }, 100)
    }
  }, [isRunning, timeLeft, completeSession])

  const skip = useCallback(() => {
    completeSession()
  }, [completeSession])

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    endTimeRef.current = null
    setTimeLeft(getDuration())
  }, [getDuration])

  const toggleSound = useCallback((id) => {
    if (activeSound === id) {
      ambientEngine.current.stop()
      setActiveSound(null)
    } else {
      ambientEngine.current.start(id)
      setActiveSound(id)
    }
    setShowSoundPicker(false)
  }, [activeSound])

  const toggleLang = useCallback(() => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar')
    setMotivationIndex(Math.floor(Math.random() * translations.en.motivation.length))
  }, [])

  useEffect(() => {
    const engine = ambientEngine.current
    return () => engine.stop()
  }, [])

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (initialIsRunning && initialEndTime) {
      endTimeRef.current = initialEndTime
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
        setTimeLeft(remaining)
        if (remaining <= 0) {
          clearInterval(intervalRef.current)
          if (completeSessionRef.current) completeSessionRef.current()
        }
      }, 100)
    }
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    saveData('pomodoro-state', {
      mode,
      timeLeft,
      isRunning,
      completedWorkSessions,
      endTime: endTimeRef.current,
    })
  })

  useEffect(() => {
    saveData('pomodoro-settings', settings)
  }, [settings])

  useEffect(() => {
    completeSessionRef.current = completeSession
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-work', accentColor)
    document.documentElement.style.setProperty('--accent-work-light', accentColor + '99')
    saveData('pomodoro-accent', accentColor)
  }, [accentColor])

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (showSettings) return
      switch (e.key) {
        case ' ': e.preventDefault(); toggleTimer(); break
        case 'r': case 'R': resetTimer(); break
        case 's': case 'S': skip(); break
        case '1': switchMode('work'); break
        case '2': switchMode('shortBreak'); break
        case '3': switchMode('longBreak'); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleTimer, resetTimer, skip, switchMode, showSettings])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])



  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const radius = 140
  const circumference = 2 * Math.PI * radius
  const duration = getDuration()
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0
  const offset = circumference * (1 - progress)

  const today = new Date().toDateString()
  const todayWorkSessions = sessions.filter(
    s => new Date(s.date).toDateString() === today && s.type === 'work'
  )
  const todayFocusMinutes = Math.round(todayWorkSessions.reduce((sum, s) => sum + s.duration / 60, 0))

  const calculateStreak = () => {
    const dayCounts = {}
    for (const s of sessions) {
      if (s.type !== 'work') continue
      const d = new Date(s.date).toDateString()
      dayCounts[d] = (dayCounts[d] || 0) + 1
    }
    let streak = 0
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    for (let i = 0; i < 365; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      if (dayCounts[key] >= 4) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  }

  const streak = calculateStreak()

  const weeklyData = (() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      const mins = sessions
        .filter(s => new Date(s.date).toDateString() === key && s.type === 'work')
        .reduce((sum, s) => sum + s.duration / 60, 0)
      days.push({
        label: d.toLocaleDateString(language === 'ar' ? 'ar' : 'en', { weekday: 'short' }),
        minutes: mins,
      })
    }
    return days
  })()

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 1)
  const activeTabIndex = MODES.findIndex(m => m.id === mode)

  const totalMinutesAll = Math.round(sessions.filter(s => s.type === 'work').reduce((sum, s) => sum + s.duration / 60, 0))
  const goalProgress = settings.dailyGoalMinutes > 0 ? Math.min(todayFocusMinutes / settings.dailyGoalMinutes, 1) : 0
  const goalPercent = Math.round(goalProgress * 100)

  const focusScore = (() => {
    const todaySess = sessions.filter(s => new Date(s.date).toDateString() === today && s.type === 'work')
    const todayMins = todaySess.reduce((sum, s) => sum + s.duration / 60, 0)
    const goalPts = Math.min(40, Math.round((todayMins / Math.max(1, settings.dailyGoalMinutes)) * 40))
    const sessionPts = Math.min(30, todaySess.length * 8)
    const streakPts = Math.min(30, streak * 4)
    return goalPts + sessionPts + streakPts
  })()

  const bestDay = (() => {
    const dayTotals = {}
    sessions.filter(s => s.type === 'work').forEach(s => {
      const key = new Date(s.date).toDateString()
      dayTotals[key] = (dayTotals[key] || 0) + s.duration / 60
    })
    let best = { day: '', mins: 0 }
    Object.entries(dayTotals).forEach(([day, mins]) => {
      if (mins > best.mins) best = { day, mins }
    })
    return best
  })()

  const avgDaily = (() => {
    const days = new Set()
    sessions.filter(s => s.type === 'work').forEach(s => {
      days.add(new Date(s.date).toDateString())
    })
    const total = sessions.filter(s => s.type === 'work').reduce((sum, s) => sum + s.duration / 60, 0)
    return days.size > 0 ? Math.round(total / days.size) : 0
  })()

  const prevUnlockedLength = useRef(unlockedAchievements.length)
  useEffect(() => {
    const total = sessions.filter(s => s.type === 'work').length
    const unlocked = [...unlockedAchievements]
    let newUnlock = null

    const check = (id, condition) => {
      if (!unlocked.includes(id) && condition) {
        unlocked.push(id)
        newUnlock = newUnlock || id
      }
    }

    check('first', total >= 1)
    check('ten', total >= 10)
    check('fifty', total >= 50)
    check('hundred', total >= 100)
    check('streak3', streak >= 3)
    check('streak7', streak >= 7)
    check('streak30', streak >= 30)

    const todayWork = sessions.filter(s => new Date(s.date).toDateString() === today && s.type === 'work')
    const todayMins = todayWork.reduce((sum, s) => sum + s.duration / 60, 0)
    check('goalFirst', todayMins >= settings.dailyGoalMinutes && todayMins > 0)

    const lastSeven = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      const dayMins = sessions
        .filter(s => new Date(s.date).toDateString() === key && s.type === 'work')
        .reduce((sum, s) => sum + s.duration / 60, 0)
      lastSeven.push(dayMins)
    }
    check('goalWeek', lastSeven.every(m => m >= settings.dailyGoalMinutes))

    const lastSession = sessions[sessions.length - 1]
    if (lastSession) {
      const hour = new Date(lastSession.date).getHours()
      check('night', hour >= 0 && hour < 5)
      check('early', hour >= 5 && hour < 8)
    }

    if (newUnlock) {
      setTimeout(() => { setNewAchievement(newUnlock); setTimeout(() => setNewAchievement(null), 4000) }, 0)
    }

    if (unlocked.length !== prevUnlockedLength.current) {
      prevUnlockedLength.current = unlocked.length
      setTimeout(() => setUnlockedAchievements(unlocked), 0)
      saveData('pomodoro-achievements', unlocked)
    }
  })

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">{t('title')}</h1>
        <div className="header-actions">
          <button className="settings-btn lang-btn" onClick={toggleLang} aria-label="Toggle language">
            <span className="lang-text">{language === 'en' ? 'EN' : 'AR'}</span>
          </button>
          <button className="settings-btn" onClick={() => setShowSettings(true)} aria-label={t('settings')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="main">
        <div className="timer-section">
          <div className="tabs">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`tab ${mode === m.id ? 'active' : ''}`}
                onClick={() => switchMode(m.id)}
              >
                {m.label[language]}
              </button>
            ))}
            <div
              className="tab-indicator"
              style={{
                width: `${100 / MODES.length}%`,
                transform: language === 'ar' ? `translateX(${-activeTabIndex * 100}%)` : `translateX(${activeTabIndex * 100}%)`,
              }}
            />
          </div>

          <div className="timer-container">
            <svg className="timer-ring" viewBox="0 0 300 300">
              <defs>
                <linearGradient id="workStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB040"/>
                  <stop offset="100%" stopColor="#FF9500"/>
                </linearGradient>
                <linearGradient id="breakStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5CE080"/>
                  <stop offset="100%" stopColor="#30D158"/>
                </linearGradient>
              </defs>
              <circle className="ring-bg" cx="150" cy="150" r={radius} fill="none" strokeWidth="8"/>
              <circle
                className="ring-progress"
                cx="150" cy="150" r={radius}
                fill="none" strokeWidth="8"
                strokeLinecap="round"
                stroke={mode === 'work' ? 'url(#workStroke)' : 'url(#breakStroke)'}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 150 150)"
              />
            </svg>
            <div className="timer-content">
              <div className={`time-display ${isRunning ? 'running' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="mode-label">
                {mode === 'work' ? t('focusTime') : mode === 'shortBreak' ? t('shortBreak') : t('longBreak')}
              </div>
            </div>
          </div>

          <div className="controls">
            <button className="btn btn-secondary" onClick={resetTimer} aria-label={t('reset')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
            </button>
            <button className="btn btn-primary" onClick={toggleTimer}>
              {isRunning ? t('pause') : t('start')}
            </button>
            <button className="btn btn-secondary" onClick={skip} aria-label={t('skip')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"/>
                <line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
            <div className="sound-wrapper">
              <button
                className={`btn btn-sound ${activeSound ? 'active' : ''}`}
                onClick={() => setShowSoundPicker(s => !s)}
                aria-label={t('ambientSounds')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </button>
              {showSoundPicker && (
                <div className="sound-picker">
                  {SOUND_OPTIONS.map(s => (
                    <button
                      key={s.id || 'off'}
                      className={`sound-option ${activeSound === s.id ? 'active' : ''}`}
                      onClick={() => toggleSound(s.id)}
                    >
                      {s.label[language]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats">
            <div className="goal-card">
              <div className="goal-header">
                <span className="goal-label">{t('dailyGoal')}</span>
                <span className="goal-value">{todayFocusMinutes} / {settings.dailyGoalMinutes} {t('min')}</span>
              </div>
              <div className="goal-bar-track">
                <div className="goal-bar-fill" style={{ width: `${goalPercent}%` }} />
              </div>
              <div className="goal-footer">
                {goalPercent >= 100
                  ? t('goalComplete')
                  : goalPercent >= 50
                    ? t('goalHalfway')
                    : motivationMsg}
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-value">{todayFocusMinutes}</div>
                <div className="stat-label">{t('focusMinutes')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="stat-value">{todayWorkSessions.length}</div>
                <div className="stat-label">{t('sessions')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                </div>
                <div className="stat-value">{streak}</div>
                <div className="stat-label">{t('dayStreak')}</div>
              </div>
            </div>
            <div className="weekly-chart">
              {weeklyData.map((d, i) => (
                <div key={i} className="bar-container">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{ height: `${Math.max(4, (d.minutes / maxMinutes) * 100)}%` }}
                    />
                  </div>
                  <div className="bar-label">{d.label}</div>
                </div>
              ))}
            </div>
            <div className="total-stats">
              {t('totalFocus')}: <strong>{Math.floor(totalMinutesAll / 60)}h {totalMinutesAll % 60}m</strong>
            </div>

            <div className="insights">
              <span>{t('focusScore')}: <strong className="score">{focusScore}/100</strong></span>
              {bestDay.mins > 0 && (
                <span>{t('bestDay')}: <strong>{bestDay.day.slice(0, 3)}</strong> ({Math.round(bestDay.mins)}{t('min')})</span>
              )}
              <span>{t('avgDaily')}: <strong>{avgDaily}</strong> {t('min')}</span>
            </div>

            <div className="achievements-section">
              <button className="ach-toggle" onClick={() => setShowAchievements(s => !s)}>
                <span>{t('achievements')} ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
                <span className={`ach-arrow ${showAchievements ? 'open' : ''}`}>▾</span>
              </button>
              {showAchievements && (
                <div className="ach-grid">
                  {ACHIEVEMENTS.map(a => {
                    const unlocked = unlockedAchievements.includes(a.id)
                    return (
                      <div key={a.id} className={`ach-item ${unlocked ? 'unlocked' : 'locked'}`}>
                        <span className="ach-icon">{unlocked ? a.icon : '🔒'}</span>
                        <span className="ach-name">{language === 'ar' ? a.ar : a.en}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {newAchievement && (
        <div className="ach-notification">
          {ACHIEVEMENTS.find(a => a.id === newAchievement)?.icon}
          <span>{t('unlocked')} {language === 'ar' ? ACHIEVEMENTS.find(a => a.id === newAchievement)?.ar : ACHIEVEMENTS.find(a => a.id === newAchievement)?.en}</span>
        </div>
      )}

      <div className="shortcuts-hint" title={t('shortcuts')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>
        </svg>
      </div>

      <footer className="footer">
        <span>v1.0.0</span>
        <a href="https://it-hussien.netlify.app" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="it-hussien.netlify.app">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </a>
      </footer>

      {showSettings && (
        <div className="overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={e => e.stopPropagation()}>
            <h2>{t('settings')}</h2>

            <div className="setting-group">
              <label>{t('workDuration')}: {Math.round(settings.workDuration / 60)} {t('min')}</label>
              <input
                type="range" min="15" max="60"
                value={settings.workDuration / 60}
                onChange={e => updateSetting('workDuration', Number(e.target.value) * 60)}
              />
            </div>

            <div className="setting-group">
              <label>{t('shortBreakLabel')}: {Math.round(settings.shortBreakDuration / 60)} {t('min')}</label>
              <input
                type="range" min="3" max="10"
                value={settings.shortBreakDuration / 60}
                onChange={e => updateSetting('shortBreakDuration', Number(e.target.value) * 60)}
              />
            </div>

            <div className="setting-group">
              <label>{t('longBreakLabel')}: {Math.round(settings.longBreakDuration / 60)} {t('min')}</label>
              <input
                type="range" min="10" max="30"
                value={settings.longBreakDuration / 60}
                onChange={e => updateSetting('longBreakDuration', Number(e.target.value) * 60)}
              />
            </div>

            <div className="setting-group">
              <label>{t('sessionsBeforeLong')}: {settings.sessionsBeforeLongBreak}</label>
              <input
                type="range" min="2" max="6"
                value={settings.sessionsBeforeLongBreak}
                onChange={e => updateSetting('sessionsBeforeLongBreak', Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>{t('dailyGoal')}: {settings.dailyGoalMinutes} {t('min')}</label>
              <input
                type="range" min="30" max="360" step="15"
                value={settings.dailyGoalMinutes}
                onChange={e => updateSetting('dailyGoalMinutes', Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>{t('accentColor')}</label>
              <div className="color-options">
                {['#FF9500', '#FF3B30', '#007AFF', '#34C759', '#AF52DE', '#FF2D55', '#5856D6', '#00C7BE'].map(c => (
                  <button
                    key={c}
                    className={`color-dot ${accentColor === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setAccentColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="setting-group toggle-group">
              <label>{t('sound')}</label>
              <button
                className={`toggle ${settings.soundEnabled ? 'active' : ''}`}
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              >
                <div className="toggle-knob" />
              </button>
            </div>

            <button className="btn btn-primary close-btn" onClick={() => setShowSettings(false)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
