export declare enum Mode {
  FOCUS = "FOCUS",
  BREAK = "BREAK",
}

export declare enum State {
  READY = "READY",
  RUNNING = "RUNNING",
  PAUSE = "PAUSE",
}

export interface PomodoroStatus {
  state: State;
  mode: Mode;
  remainingMinutes: number;
  remainingSeconds: number;
}

export declare class PomodoroTimer {
  private mode;
  private state;
  private timeElapsedInMode;
  private timer;
  focusSlotDuration: number;
  breakSlotDuration: number;
  private readonly onModeChange;

  constructor(
    onModeChange: (newMode: Mode) => void,
    focusSlotDuration?: number,
    breakSlotDuration?: number
  );

  start: () => void;
  stop: () => void;
  pause: () => void;
  reset: (focusSlotDuration: number, breakSlotDuration: number) => void;
  getStatus: () => PomodoroStatus;
  private updateStatus;
  private updateReferenceTimestampIfRequired;
}
