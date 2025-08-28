import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePomodoroStore = create(
  persist(
    (set, get) => ({
      // Timer state
      isRunning: false,
      currentSession: 'work', // work, shortBreak, longBreak
      timeRemaining: 25 * 60, // 25 minutes in seconds
      sessionCount: 0,
      cycleCount: 0, // Completed cycles (4 work sessions = 1 cycle)
      
      // Timer settings
      settings: {
        workDuration: 25, // minutes
        shortBreakDuration: 5, // minutes
        longBreakDuration: 15, // minutes
        longBreakInterval: 4, // every 4 work sessions
        autoStartBreaks: true,
        autoStartWork: false,
        soundEnabled: true,
        notificationEnabled: true
      },
      
      // Session history
      sessions: [
        {
          id: 1,
          type: 'work',
          duration: 25,
          startTime: '2024-08-24T09:00:00Z',
          endTime: '2024-08-24T09:25:00Z',
          taskId: 1,
          taskName: 'Design Homepage UI/UX',
          completed: true,
          productivity: 4, // 1-5 scale
          notes: 'Completed wireframes',
          date: '2024-08-24'
        },
        {
          id: 2,
          type: 'shortBreak',
          duration: 5,
          startTime: '2024-08-24T09:25:00Z',
          endTime: '2024-08-24T09:30:00Z',
          completed: true,
          date: '2024-08-24'
        },
        {
          id: 3,
          type: 'work',
          duration: 25,
          startTime: '2024-08-24T09:30:00Z',
          endTime: '2024-08-24T09:55:00Z',
          taskId: 6,
          taskName: 'User Registration Form',
          completed: true,
          productivity: 5,
          notes: 'Implemented form validation',
          date: '2024-08-24'
        }
      ],
      
      // Current session data
      currentSessionData: {
        startTime: null,
        taskId: null,
        taskName: null,
        notes: '',
        productivity: null
      },
      
      // Statistics
      todayStats: {
        workSessions: 2,
        breakSessions: 1,
        totalWorkTime: 50, // minutes
        totalBreakTime: 5, // minutes
        productivity: 4.5, // average
        tasksWorked: 2
      },
      
      // Start timer
      startTimer: () => {
        const currentTime = new Date().toISOString();
        set((state) => ({
          isRunning: true,
          currentSessionData: {
            ...state.currentSessionData,
            startTime: currentTime
          }
        }));
      },
      
      // Pause timer
      pauseTimer: () => {
        set({ isRunning: false });
      },
      
      // Stop timer (reset current session)
      stopTimer: () => {
        const { currentSession, settings } = get();
        const defaultTime = currentSession === 'work' 
          ? settings.workDuration * 60
          : currentSession === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
          
        set({
          isRunning: false,
          timeRemaining: defaultTime,
          currentSessionData: {
            startTime: null,
            taskId: null,
            taskName: null,
            notes: '',
            productivity: null
          }
        });
      },
      
      // Tick timer (decrease time by 1 second)
      tick: () => {
        const { timeRemaining, isRunning } = get();
        if (isRunning && timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 });
        } else if (timeRemaining === 0) {
          get().completeSession();
        }
      },
      
      // Complete current session
      completeSession: () => {
        const {
          currentSession,
          currentSessionData,
          sessionCount,
          settings,
          sessions
        } = get();
        
        const endTime = new Date().toISOString();
        const duration = currentSession === 'work' 
          ? settings.workDuration
          : currentSession === 'shortBreak'
          ? settings.shortBreakDuration
          : settings.longBreakDuration;
        
        // Save completed session
        const newSession = {
          id: Date.now(),
          type: currentSession,
          duration,
          startTime: currentSessionData.startTime,
          endTime,
          taskId: currentSessionData.taskId,
          taskName: currentSessionData.taskName,
          completed: true,
          productivity: currentSessionData.productivity,
          notes: currentSessionData.notes,
          date: new Date().toISOString().split('T')[0]
        };
        
        // Determine next session type
        let nextSession = 'work';
        let newSessionCount = sessionCount;
        let newCycleCount = get().cycleCount;
        
        if (currentSession === 'work') {
          newSessionCount++;
          if (newSessionCount % settings.longBreakInterval === 0) {
            nextSession = 'longBreak';
            newCycleCount++;
          } else {
            nextSession = 'shortBreak';
          }
        }
        
        const nextDuration = nextSession === 'work'
          ? settings.workDuration * 60
          : nextSession === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
        
        set({
          sessions: [...sessions, newSession],
          currentSession: nextSession,
          timeRemaining: nextDuration,
          sessionCount: newSessionCount,
          cycleCount: newCycleCount,
          isRunning: settings.autoStartBreaks && nextSession !== 'work' || 
                    settings.autoStartWork && nextSession === 'work',
          currentSessionData: {
            startTime: settings.autoStartBreaks && nextSession !== 'work' || 
                      settings.autoStartWork && nextSession === 'work' ? new Date().toISOString() : null,
            taskId: null,
            taskName: null,
            notes: '',
            productivity: null
          }
        });
        
        // Update today's stats
        get().updateTodayStats();
        
        // Show notification if enabled
        if (settings.notificationEnabled) {
          get().showNotification(currentSession, nextSession);
        }
        
        // Play sound if enabled
        if (settings.soundEnabled) {
          get().playSound();
        }
      },
      
      // Switch session type manually
      switchSession: (sessionType) => {
        const { settings } = get();
        const duration = sessionType === 'work'
          ? settings.workDuration * 60
          : sessionType === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
        
        set({
          currentSession: sessionType,
          timeRemaining: duration,
          isRunning: false,
          currentSessionData: {
            startTime: null,
            taskId: null,
            taskName: null,
            notes: '',
            productivity: null
          }
        });
      },
      
      // Set task for current work session
      setCurrentTask: (taskId, taskName) => {
        set((state) => ({
          currentSessionData: {
            ...state.currentSessionData,
            taskId,
            taskName
          }
        }));
      },
      
      // Set productivity rating for current session
      setProductivity: (rating) => {
        set((state) => ({
          currentSessionData: {
            ...state.currentSessionData,
            productivity: rating
          }
        }));
      },
      
      // Set notes for current session
      setNotes: (notes) => {
        set((state) => ({
          currentSessionData: {
            ...state.currentSessionData,
            notes
          }
        }));
      },
      
      // Update settings
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      // Get sessions by date
      getSessionsByDate: (date) => {
        return get().sessions.filter(session => session.date === date);
      },
      
      // Get sessions by date range
      getSessionsByDateRange: (startDate, endDate) => {
        return get().sessions.filter(session => 
          session.date >= startDate && session.date <= endDate
        );
      },
      
      // Get today's sessions
      getTodaySessions: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().getSessionsByDate(today);
      },
      
      // Update today's statistics
      updateTodayStats: () => {
        const todaySessions = get().getTodaySessions();
        const workSessions = todaySessions.filter(s => s.type === 'work');
        const breakSessions = todaySessions.filter(s => s.type !== 'work');
        
        const totalWorkTime = workSessions.reduce((sum, session) => sum + session.duration, 0);
        const totalBreakTime = breakSessions.reduce((sum, session) => sum + session.duration, 0);
        
        const productivityRatings = workSessions
          .filter(s => s.productivity)
          .map(s => s.productivity);
        const avgProductivity = productivityRatings.length > 0
          ? productivityRatings.reduce((sum, rating) => sum + rating, 0) / productivityRatings.length
          : 0;
        
        const uniqueTasks = new Set(workSessions.filter(s => s.taskId).map(s => s.taskId));
        
        set({
          todayStats: {
            workSessions: workSessions.length,
            breakSessions: breakSessions.length,
            totalWorkTime,
            totalBreakTime,
            productivity: Math.round(avgProductivity * 10) / 10,
            tasksWorked: uniqueTasks.size
          }
        });
      },
      
      // Show notification
      showNotification: (completedSession, nextSession) => {
        if ('Notification' in window && Notification.permission === 'granted') {
          const title = completedSession === 'work' 
            ? '🎉 Work Session Complete!' 
            : '☕ Break Complete!';
          
          const body = nextSession === 'work'
            ? 'Time to get back to work!'
            : nextSession === 'shortBreak'
            ? 'Take a 5-minute break!'
            : 'Take a longer 15-minute break!';
          
          new Notification(title, { body });
        }
      },
      
      // Play sound
      playSound: () => {
        // Simple beep sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.log('Audio not supported');
        }
      },
      
      // Request notification permission
      requestNotificationPermission: () => {
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      },
      
      // Format time for display
      formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      },
      
      // Get progress percentage
      getProgress: () => {
        const { currentSession, timeRemaining, settings } = get();
        const totalTime = currentSession === 'work'
          ? settings.workDuration * 60
          : currentSession === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60;
        
        return ((totalTime - timeRemaining) / totalTime) * 100;
      }
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        sessionCount: state.sessionCount,
        cycleCount: state.cycleCount,
        settings: state.settings,
        sessions: state.sessions,
        todayStats: state.todayStats
      })
    }
  )
);

export { usePomodoroStore };