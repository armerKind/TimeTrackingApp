// src/renderer.js - Complete Final Version with Auto-Save on App Close

const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Predefined color palette (16 distinct colors)
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#8B5A2B', // Brown
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
  '#374151'  // Slate
];

// Icon components (inline SVG)
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const SquareIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const RotateIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
  </svg>
);

// Custom Color Picker Component
const ColorPicker = ({ selectedColor, onColorChange, className = "" }) => {
  return (
    <div className={`grid grid-cols-8 gap-1 ${className}`}>
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            selectedColor === color
              ? 'border-gray-700 scale-110'
              : 'border-gray-300 hover:border-gray-500'
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};

const TimeTrackingApp = () => {
  // State variables
  const [projects, setProjects] = useState([]);
  const [deletedProjects, setDeletedProjects] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('tracking');
  
  // Week navigation state
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  
  // Save indicator state
  const [saving, setSaving] = useState(false);
  
  // Debug state
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  
  // Manual entry state
  const [selectedProject, setSelectedProject] = useState(null);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New project state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(COLOR_PALETTE[0]);
  
  // Project editing state
  const [editingProject, setEditingProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectColor, setEditProjectColor] = useState('');
  
  // Entry editing state
  const [editingEntry, setEditingEntry] = useState(null);
  const [editEntryHours, setEditEntryHours] = useState('');
  const [editEntryMinutes, setEditEntryMinutes] = useState('');
  const [editEntryProject, setEditEntryProject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Ref to keep timer interval stable
  const timerIntervalRef = React.useRef(null);

  // Debug logging function
  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  // Database operation functions
  const loadProjects = async () => {
    if (window.electronAPI) {
      try {
        const data = await window.electronAPI.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  };

  const loadDeletedProjects = async () => {
    if (window.electronAPI) {
      try {
        const data = await window.electronAPI.getDeletedProjects();
        setDeletedProjects(data);
      } catch (error) {
        console.error('Error loading deleted projects:', error);
      }
    }
  };

  const loadTimeEntries = async () => {
    if (window.electronAPI) {
      try {
        const data = await window.electronAPI.getTimeEntries();
        setTimeEntries(data);
      } catch (error) {
        console.error('Error loading time entries:', error);
      }
    }
  };

  // Load data from database on component mount
  useEffect(() => {
    loadProjects();
    loadDeletedProjects();
    loadTimeEntries();
  }, []);

  // Add a ref for debouncing and processing state
  const shortcutDebounceRef = React.useRef({});
  const processingShortcutRef = React.useRef(false);

  // Add refs to avoid stale closure issues with global shortcuts
  const currentTimerRef = React.useRef(currentTimer);
  const timerSecondsRef = React.useRef(timerSeconds);
  const savingRef = React.useRef(saving);

  // Update refs whenever state changes
  useEffect(() => {
    currentTimerRef.current = currentTimer;
  }, [currentTimer]);

  useEffect(() => {
    timerSecondsRef.current = timerSeconds;
  }, [timerSeconds]);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  // Setup global shortcuts listener - FIXED with refs to avoid stale closure
  const handleGlobalShortcut = React.useCallback(async (event, data) => {
    // Immediate exit if already processing a shortcut
    if (processingShortcutRef.current) {
      return;
    }

    const keyNumber = parseInt(data.key);
    if (keyNumber >= 1 && keyNumber <= 9 && projects.length >= keyNumber) {
      const project = projects[keyNumber - 1];
      if (project) {
        // More aggressive debouncing using ref
        const now = Date.now();
        const lastTrigger = shortcutDebounceRef.current[keyNumber] || 0;
        if (now - lastTrigger < 1000) { // 1 second debounce
          return;
        }
        
        // Set processing flag to prevent concurrent execution
        processingShortcutRef.current = true;
        shortcutDebounceRef.current[keyNumber] = now;
        
        try {
          // Use refs to get current state (avoid stale closure)
          const currentTimerState = currentTimerRef.current;
          const currentSeconds = timerSecondsRef.current;
          const currentlySaving = savingRef.current;
          
          // Prevent processing if already saving
          if (currentlySaving) {
            addDebugLog('Already saving, ignoring shortcut');
            return;
          }
          
          addDebugLog(`Shortcut Ctrl+${keyNumber} pressed for project: ${project.name}`);
          addDebugLog(`Current timer (ref): ${currentTimerState ? currentTimerState.name : 'None'}`);
          addDebugLog(`Timer seconds (ref): ${currentSeconds}`);
          addDebugLog(`Current paused state (ref): ${currentTimerState ? currentTimerState.paused : 'N/A'}`);
          
          // Case 1: Same project - toggle pause/resume (PRESERVE timer seconds!)
          if (currentTimerState && currentTimerState.id === project.id) {
            const newPausedState = !currentTimerState.paused;
            addDebugLog(`SAME PROJECT: Toggling pause from ${currentTimerState.paused} to ${newPausedState} (keeping ${currentSeconds}s)`);
            
            // CRITICAL: Don't reset timerSeconds for same project!
            setCurrentTimer(prev => {
              if (!prev || prev.id !== project.id) {
                addDebugLog('ERROR: Timer state changed during pause toggle');
                return prev;
              }
              return {
                ...prev,
                paused: newPausedState
              };
            });
            // Explicitly do NOT reset timerSeconds here!
            return;
          }
          
          // Case 2: Different project with running timer - save current and switch
          if (currentTimerState && currentTimerState.id !== project.id && currentSeconds > 0) {
            addDebugLog('DIFFERENT PROJECT: Saving current timer and switching');
            setSaving(true);
            
            try {
              const entry = {
                projectId: currentTimerState.id,
                projectName: currentTimerState.name,
                projectColor: currentTimerState.color,
                date: new Date().toISOString().split('T')[0],
                duration: currentSeconds,
                type: 'timer'
              };
              
              addDebugLog(`Saving entry: ${currentTimerState.name} - ${currentSeconds}s`);
              
              if (window.electronAPI) {
                await window.electronAPI.addTimeEntry(entry);
                await loadTimeEntries();
              }
            } catch (error) {
              addDebugLog(`Error saving: ${error.message}`);
            } finally {
              setSaving(false);
            }
          }
          
          // Case 3: Start new timer (ONLY for different projects or no timer)
          if (!currentTimerState || currentTimerState.id !== project.id) {
            addDebugLog(`STARTING NEW TIMER for project: ${project.name}`);
            const startTime = Date.now();
            setCurrentTimer({
              id: project.id,
              name: project.name,
              color: project.color,
              startTime: startTime,
              paused: false
            });
            setTimerSeconds(0); // Only reset for NEW projects
          }
        } finally {
          // Always reset processing flag after a delay
          setTimeout(() => {
            processingShortcutRef.current = false;
          }, 100);
        }
      }
    }
  }, [projects, addDebugLog]); // Removed state dependencies to avoid stale closure

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onGlobalShortcut(handleGlobalShortcut);
    }
  }, [handleGlobalShortcut]);

  // Timer interval effect - BULLETPROOF timing that works through screen locks
  useEffect(() => {
    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Only start new interval if timer is running (not paused)
    if (currentTimer && !currentTimer.paused) {
      addDebugLog(`Starting timer interval for ${currentTimer.name} (currently ${timerSeconds}s)`);
      
      // Use a more frequent interval to handle background throttling
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          // Calculate actual elapsed time based on start time instead of just incrementing
          const now = Date.now();
          const elapsedMs = now - currentTimerRef.current?.startTime;
          const actualSeconds = Math.floor(elapsedMs / 1000);
          
          // Use the actual calculated time instead of just prev + 1
          const newSeconds = actualSeconds;
          
          // Debug every 5 seconds to avoid spam
          if (newSeconds % 5 === 0 && newSeconds !== prev) {
            console.log(`Timer sync: Expected ${newSeconds}s, had ${prev}s for ${currentTimerRef.current?.name}`);
          }
          
          return newSeconds;
        });
      }, 250); // Update every 250ms for smoother display and better background handling
    } else if (currentTimer && currentTimer.paused) {
      addDebugLog(`Timer paused for ${currentTimer.name} at ${timerSeconds}s`);
      // When paused, update the startTime to account for the pause duration
      if (currentTimerRef.current) {
        const pauseAdjustment = Date.now() - (currentTimerRef.current.startTime + (timerSeconds * 1000));
        setCurrentTimer(prev => ({
          ...prev,
          startTime: prev.startTime + pauseAdjustment
        }));
      }
    }

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [currentTimer?.id, currentTimer?.paused]); // CRITICAL: Don't include timerSeconds here!

  // BULLETPROOF: Wake-up sync when app regains focus (handles screen locks, sleep, etc.)
  useEffect(() => {
    const handleFocus = () => {
      if (currentTimerRef.current && !currentTimerRef.current.paused) {
        const actualElapsed = Math.floor((Date.now() - currentTimerRef.current.startTime) / 1000);
        addDebugLog(`Focus regained: Syncing timer to ${actualElapsed}s`);
        setTimerSeconds(actualElapsed);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && currentTimerRef.current && !currentTimerRef.current.paused) {
        const actualElapsed = Math.floor((Date.now() - currentTimerRef.current.startTime) / 1000);
        addDebugLog(`Visibility restored: Syncing timer to ${actualElapsed}s`);
        setTimerSeconds(actualElapsed);
      }
    };

    // Listen for focus and visibility events
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // BULLETPROOF: Periodic sync check every 10 seconds (backup for extreme cases)
  useEffect(() => {
    if (!currentTimer || currentTimer.paused) return;

    const syncInterval = setInterval(() => {
      if (currentTimerRef.current && !currentTimerRef.current.paused) {
        const actualElapsed = Math.floor((Date.now() - currentTimerRef.current.startTime) / 1000);
        setTimerSeconds(prev => {
          const drift = Math.abs(actualElapsed - prev);
          if (drift > 2) { // Only sync if off by more than 2 seconds
            addDebugLog(`Periodic sync: Corrected ${drift}s drift (${prev}s → ${actualElapsed}s)`);
            return actualElapsed;
          }
          return prev;
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(syncInterval);
  }, [currentTimer?.id, currentTimer?.paused]);

  // Auto-save running timer when app closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTimer && timerSeconds > 5 && !currentTimer.paused) {
        addDebugLog('App closing, saving timer: ' + timerSeconds + ' seconds');
        const entry = {
          projectId: currentTimer.id,
          projectName: currentTimer.name,
          projectColor: currentTimer.color,
          date: new Date().toISOString().split('T')[0],
          duration: timerSeconds,
          type: 'timer'
        };
        
        if (window.electronAPI) {
          try {
            window.electronAPI.addTimeEntry(entry);
          } catch (error) {
            console.error('Error saving timer on close:', error);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentTimer, timerSeconds, addDebugLog]);

  // Time formatting functions
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}h`;
  };

  // Enhanced stopTimer function
  const stopTimer = async () => {
    if (currentTimer && timerSeconds > 0) {
      setSaving(true);
      
      const entry = {
        projectId: currentTimer.id,
        projectName: currentTimer.name,
        projectColor: currentTimer.color,
        date: new Date().toISOString().split('T')[0],
        duration: timerSeconds,
        type: 'timer'
      };
      
      addDebugLog('Stopping timer, saving entry: ' + currentTimer.name + ' - ' + timerSeconds + 's');
      
      if (window.electronAPI) {
        try {
          await window.electronAPI.addTimeEntry(entry);
          await loadTimeEntries();
        } catch (error) {
          addDebugLog('Error saving: ' + error.message);
        }
      }
      
      setSaving(false);
    } else {
      addDebugLog('Timer stopped but no time to save (seconds: ' + timerSeconds + ')');
    }
    setCurrentTimer(null);
    setTimerSeconds(0);
  };

  // Enhanced startTimer function
  const startTimer = async (project) => {
    if (saving) {
      addDebugLog('Already saving, ignoring startTimer call');
      return;
    }
    
    addDebugLog('startTimer called for project: ' + project.name);
    addDebugLog('Current timer: ' + (currentTimer ? currentTimer.name : 'None'));
    addDebugLog('Timer seconds: ' + timerSeconds);
    addDebugLog('Current paused state: ' + (currentTimer ? currentTimer.paused : 'N/A'));
    
    // Case 1: Same project - toggle pause/resume (PRESERVE timer seconds!)
    if (currentTimer && currentTimer.id === project.id) {
      const newPausedState = !currentTimer.paused;
      addDebugLog('UI BUTTON: Same project, toggling pause from ' + currentTimer.paused + ' to ' + newPausedState + ' (keeping ' + timerSeconds + 's)');
      
      // CRITICAL: Don't reset timerSeconds for same project!
      setCurrentTimer(prev => {
        if (!prev || prev.id !== project.id) {
          addDebugLog('ERROR: Timer state changed during UI pause toggle');
          return prev;
        }
        return {
          ...prev,
          paused: newPausedState
        };
      });
      // Explicitly do NOT reset timerSeconds here!
      return;
    }
    
    // Case 2: Different project - auto-save current and switch
    if (currentTimer && currentTimer.id !== project.id && timerSeconds > 0) {
      addDebugLog('UI BUTTON: Different project, saving and switching');
      await stopTimer();
    }
    
    // Case 3: Start completely new timer (ONLY for different projects)
    addDebugLog('UI BUTTON: Starting new timer');
    const startTime = Date.now();
    setCurrentTimer({
      id: project.id,
      name: project.name,
      color: project.color,
      startTime: startTime,
      paused: false
    });
    setTimerSeconds(0); // Only reset for NEW projects
  };

  // Get current week dates
  const getCurrentWeekDates = (weekOffset = 0) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates(selectedWeekOffset);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Week navigation helper functions
  const getWeekDisplayText = () => {
    if (selectedWeekOffset === 0) {
      return "Current Week";
    } else if (selectedWeekOffset === -1) {
      return "Last Week";
    } else if (selectedWeekOffset > 0) {
      return `${selectedWeekOffset} Week${selectedWeekOffset > 1 ? 's' : ''} Ahead`;
    } else {
      return `${Math.abs(selectedWeekOffset)} Week${Math.abs(selectedWeekOffset) > 1 ? 's' : ''} Ago`;
    }
  };

  const getWeekDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  };

  // Manual entry functions
  const addManualEntry = async () => {
    if (selectedProject && (manualHours || manualMinutes)) {
      const hours = parseInt(manualHours) || 0;
      const minutes = parseInt(manualMinutes) || 0;
      const totalSeconds = hours * 3600 + minutes * 60;
      
      if (totalSeconds > 0) {
        const entry = {
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          projectColor: selectedProject.color,
          date: manualDate,
          duration: totalSeconds,
          type: 'manual'
        };
        
        if (window.electronAPI) {
          try {
            await window.electronAPI.addTimeEntry(entry);
            loadTimeEntries();
            setManualHours('');
            setManualMinutes('');
            setSelectedProject(null);
          } catch (error) {
            console.error('Error adding manual entry:', error);
          }
        }
      }
    }
  };

  // Project management functions
  const addProject = async () => {
    if (newProjectName.trim()) {
      const project = {
        name: newProjectName.trim(),
        color: newProjectColor
      };
      
      if (window.electronAPI) {
        try {
          await window.electronAPI.addProject(project);
          loadProjects();
          setNewProjectName('');
          setNewProjectColor(COLOR_PALETTE[0]);
        } catch (error) {
          console.error('Error adding project:', error);
        }
      }
    }
  };

  const startEditingProject = (project) => {
    setEditingProject(project.id);
    setEditProjectName(project.name);
    setEditProjectColor(project.color);
  };

  const cancelEditingProject = () => {
    setEditingProject(null);
    setEditProjectName('');
    setEditProjectColor('');
  };

  const saveProjectEdits = async () => {
    if (editProjectName.trim()) {
      const updates = {
        name: editProjectName.trim(),
        color: editProjectColor
      };
      
      if (window.electronAPI) {
        try {
          await window.electronAPI.updateProject(editingProject, updates);
          loadProjects();
          cancelEditingProject();
        } catch (error) {
          console.error('Error updating project:', error);
        }
      }
    }
  };

  const deleteProject = async (projectId) => {
    if (window.electronAPI) {
      try {
        // Soft delete: Always mark as deleted, even if it has entries
        await window.electronAPI.deleteProject(projectId);
        loadProjects();
        loadDeletedProjects();
        
        // If this project is currently running, stop the timer
        if (currentTimer && currentTimer.id === projectId) {
          addDebugLog(`Stopping timer for deleted project: ${currentTimer.name}`);
          await stopTimer();
        }
        
        addDebugLog(`Project soft-deleted: ${projectId}`);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const restoreProject = async (projectId) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.restoreProject(projectId);
        loadProjects();
        loadDeletedProjects();
      } catch (error) {
        console.error('Error restoring project:', error);
      }
    }
  };

  // Data retrieval functions
  const getTimeForDate = (date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.date === dateStr);
  };

  const getAccumulatedTimeForDate = (date) => {
    const entries = getTimeForDate(date);
    const accumulated = {};
    
    entries.forEach(entry => {
      if (accumulated[entry.project_id]) {
        accumulated[entry.project_id].duration += entry.duration;
      } else {
        accumulated[entry.project_id] = {
          projectId: entry.project_id,
          projectName: entry.project_name,
          projectColor: entry.project_color,
          duration: entry.duration
        };
      }
    });
    
    return Object.values(accumulated);
  };

  const getTotalTimeForDate = (date) => {
    const entries = getTimeForDate(date);
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getTotalWeekTime = () => {
    return timeEntries.reduce((total, entry) => {
      const isInSelectedWeek = weekDates.some(date => 
        date.toISOString().split('T')[0] === entry.date
      );
      return isInSelectedWeek ? total + entry.duration : total;
    }, 0);
  };

  // Entry editing functions
  const startEditingEntry = (entry) => {
    setEditingEntry(entry.id);
    const hours = Math.floor(entry.duration / 3600);
    const minutes = Math.floor((entry.duration % 3600) / 60);
    setEditEntryHours(hours.toString());
    setEditEntryMinutes(minutes.toString());
    setEditEntryProject(projects.find(p => p.id === entry.project_id));
  };

  const cancelEditingEntry = () => {
    setEditingEntry(null);
    setEditEntryHours('');
    setEditEntryMinutes('');
    setEditEntryProject(null);
  };

  const saveEntryEdits = async () => {
    if (editEntryProject && (editEntryHours || editEntryMinutes)) {
      const hours = parseInt(editEntryHours) || 0;
      const minutes = parseInt(editEntryMinutes) || 0;
      const totalSeconds = hours * 3600 + minutes * 60;
      
      if (totalSeconds > 0) {
        const updates = {
          projectId: editEntryProject.id,
          projectName: editEntryProject.name,
          projectColor: editEntryProject.color,
          duration: totalSeconds
        };
        
        if (window.electronAPI) {
          try {
            await window.electronAPI.updateTimeEntry(editingEntry, updates);
            loadTimeEntries();
            cancelEditingEntry();
          } catch (error) {
            console.error('Error updating time entry:', error);
          }
        }
      }
    }
  };

  const deleteEntry = async (entryId) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteTimeEntry(entryId);
        loadTimeEntries();
      } catch (error) {
        console.error('Error deleting time entry:', error);
      }
    }
  };

  // Export function
  const exportData = () => {
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];
    
    const formatDateForFilename = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    let csvContent = "Project,Date,Hours,Type\n";
    
    const accumulatedData = {};
    
    weekDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      const entries = getTimeForDate(date);
      
      entries.forEach(entry => {
        const key = `${entry.project_name}_${dateStr}`;
        
        if (accumulatedData[key]) {
          accumulatedData[key].hours += entry.duration / 3600;
          accumulatedData[key].types.add(entry.type);
        } else {
          accumulatedData[key] = {
            projectName: entry.project_name,
            date: dateStr,
            hours: entry.duration / 3600,
            types: new Set([entry.type])
          };
        }
      });
    });
    
    Object.values(accumulatedData).forEach(item => {
      const hours = item.hours.toFixed(2);
      const formattedDate = item.date;
      const projectName = item.projectName.includes(',') ? `"${item.projectName}"` : item.projectName;
      const types = Array.from(item.types).join('+');
      csvContent += `${projectName},${formattedDate},${hours},${types}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `timetracking_${formatDateForFilename(weekStart)}_to_${formatDateForFilename(weekEnd)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Filter active projects
  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Time Tracking</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'tracking' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ClockIcon />
              <span className="ml-1">Timer</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon />
              <span className="ml-1">Week</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'projects' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SettingsIcon />
              <span className="ml-1">Projects</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Debug Panel */}
          {showDebug && (
            <div className="mb-4 bg-gray-900 text-green-400 rounded-lg p-3 text-xs font-mono">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Debug Log</span>
                <button
                  onClick={() => setDebugLogs([])}
                  className="text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {debugLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
                {debugLogs.length === 0 && (
                  <div className="text-gray-500">No debug logs yet...</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-4">
              {/* Debug Toggle Button */}
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`w-full text-xs py-1 px-2 rounded transition-colors ${
                  showDebug 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showDebug ? 'Hide Debug' : 'Show Debug'}
              </button>

              {/* Global Shortcuts Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <div className="font-medium mb-1">Global Shortcuts:</div>
                <div>Ctrl+1 through Ctrl+9 to start/toggle first 9 projects</div>
                <div className="text-xs text-blue-600 mt-1">✨ Auto-saves time when switching projects</div>
              </div>

              {/* Current Timer Display with Save Indicator */}
              {currentTimer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: currentTimer.color }}
                      ></div>
                      <span className="text-sm font-medium truncate">{currentTimer.name}</span>
                      {saving && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Saving...
                        </span>
                      )}
                      {/* Debug pause state indicator */}
                      {showDebug && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          currentTimer.paused ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          State: {currentTimer.paused ? 'PAUSED' : 'RUNNING'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={stopTimer}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <SquareIcon />
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-xl font-mono font-bold text-blue-600 timer-display">
                      {formatTime(timerSeconds)}
                    </span>
                    {currentTimer.paused && (
                      <span className="text-xs text-gray-500 ml-2">(paused)</span>
                    )}
                  </div>
                </div>
              )}

              {/* Project Buttons */}
              <div className="space-y-2">
                {activeProjects.map((project, index) => {
                  const isRunning = currentTimer?.id === project.id && !currentTimer.paused;
                  const isPaused = currentTimer?.id === project.id && currentTimer.paused;
                  
                  return (
                    <button
                      key={project.id}
                      onClick={() => startTimer(project)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isRunning
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : isPaused
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full project-color-dot"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="font-medium text-sm truncate">{project.name}</span>
                        {index < 9 && (
                          <span className="text-xs text-gray-500">(Ctrl+{index + 1})</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {isRunning ? (
                          <PauseIcon />
                        ) : (
                          <PlayIcon />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {activeProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No projects available</p>
                  <p className="text-xs">Create projects in the Projects tab</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Week Navigation */}
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    ← Previous
                  </button>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{getWeekDisplayText()}</div>
                    <div className="text-xs text-gray-500">{getWeekDateRange()}</div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Next →
                  </button>
                </div>
                
                {selectedWeekOffset !== 0 && (
                  <div className="text-center">
                    <button
                      onClick={() => setSelectedWeekOffset(0)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                    >
                      Back to Current Week
                    </button>
                  </div>
                )}
              </div>

              {/* Week Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Week total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatHours(getTotalWeekTime())}
                  </span>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                <DownloadIcon />
                <span className="text-sm">Export {getWeekDisplayText()}</span>
              </button>
              
              {/* Week Overview */}
              <div className="space-y-2">
                {weekDates.map((date, index) => {
                  const accumulatedEntries = getAccumulatedTimeForDate(date);
                  const totalTime = getTotalTimeForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={index} className={`border rounded-lg p-3 ${isToday && selectedWeekOffset === 0 ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          {dayNames[index]} {date.getDate()}/{date.getMonth() + 1}
                          {isToday && selectedWeekOffset === 0 && (
                            <span className="text-xs text-blue-600 ml-1">(Today)</span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatHours(totalTime)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {accumulatedEntries.map((entry, entryIndex) => (
                          <div key={entryIndex} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-2 h-2 rounded-full project-color-dot"
                                style={{ backgroundColor: entry.projectColor }}
                              ></div>
                              <span className="truncate">{entry.projectName}</span>
                              {/* Show indicator for deleted projects */}
                              {!activeProjects.find(p => p.id === entry.projectId) && (
                                <span className="text-xs text-gray-400 italic">(deleted)</span>
                              )}
                            </div>
                            <span className="text-gray-500">{formatHours(entry.duration)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* Add New Project */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-3">New Project</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Choose color:</label>
                    <ColorPicker
                      selectedColor={newProjectColor}
                      onColorChange={setNewProjectColor}
                    />
                  </div>
                  <button
                    onClick={addProject}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <PlusIcon />
                    <span>Create</span>
                  </button>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-3">Manual Entry</h3>
                <div className="space-y-2">
                  <select
                    value={selectedProject?.id || ''}
                    onChange={(e) => setSelectedProject(activeProjects.find(p => p.id === parseInt(e.target.value)))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select project</option>
                    {activeProjects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={manualHours}
                      onChange={(e) => setManualHours(e.target.value)}
                      placeholder="Hours"
                      min="0"
                      max="24"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={manualMinutes}
                      onChange={(e) => setManualMinutes(e.target.value)}
                      placeholder="Min"
                      min="0"
                      max="59"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addManualEntry}
                    className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Edit Entries */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-3">Edit Entries</h3>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getTimeForDate(selectedDate).map(entry => (
                      <div key={entry.id} className="p-2 border border-gray-200 rounded bg-gray-50">
                        {editingEntry === entry.id ? (
                          <div className="space-y-2">
                            <select
                              value={editEntryProject?.id || ''}
                              onChange={(e) => setEditEntryProject(activeProjects.find(p => p.id === parseInt(e.target.value)))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select project</option>
                              {activeProjects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                              ))}
                            </select>
                            <div className="flex space-x-2">
                              <input
                                type="number"
                                value={editEntryHours}
                                onChange={(e) => setEditEntryHours(e.target.value)}
                                placeholder="Hours"
                                min="0"
                                max="24"
                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="number"
                                value={editEntryMinutes}
                                onChange={(e) => setEditEntryMinutes(e.target.value)}
                                placeholder="Min"
                                min="0"
                                max="59"
                                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex justify-end space-x-1">
                              <button
                                onClick={saveEntryEdits}
                                className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                              >
                                <CheckIcon />
                              </button>
                              <button
                                onClick={cancelEditingEntry}
                                className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                              >
                                <XIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1">
                              <div 
                                className="w-2 h-2 rounded-full project-color-dot"
                                style={{ backgroundColor: entry.project_color }}
                              ></div>
                              <span className="text-xs truncate">{entry.project_name}</span>
                              <span className="text-xs text-gray-500">{formatHours(entry.duration)}</span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => startEditingEntry(entry)}
                                className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => deleteEntry(entry.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Projects */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-3">Active Projects</h3>
                <div className="space-y-2">
                  {activeProjects.map((project, index) => (
                    <div key={project.id} className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50">
                      {editingProject === project.id ? (
                        <div className="space-y-3 flex-1">
                          <input
                            type="text"
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Project name"
                          />
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">Choose color:</label>
                            <ColorPicker
                              selectedColor={editProjectColor}
                              onColorChange={setEditProjectColor}
                            />
                          </div>
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={saveProjectEdits}
                              className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                            >
                              <CheckIcon />
                            </button>
                            <button
                              onClick={cancelEditingProject}
                              className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                            >
                              <XIcon />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full project-color-dot"
                              style={{ backgroundColor: project.color }}
                            ></div>
                            <span className="text-sm">{project.name}</span>
                            {index < 9 && (
                              <span className="text-xs text-gray-500">(Ctrl+{index + 1})</span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditingProject(project)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => deleteProject(project.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deleted Projects */}
              {deletedProjects.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-3">Deleted Projects</h3>
                  <div className="space-y-2">
                    {deletedProjects.map(project => (
                      <div key={project.id} className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full opacity-50 project-color-dot"
                            style={{ backgroundColor: project.color }}
                          ></div>
                          <span className="text-sm text-gray-600">{project.name}</span>
                        </div>
                        <button
                          onClick={() => restoreProject(project.id)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                        >
                          <RotateIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(TimeTrackingApp));