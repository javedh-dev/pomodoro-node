export declare enum Mode {
  FOCUS = "FOCUS",
  BREAK = "BREAK",
}

interface PomodoroStatus {
  mode: Mode;
  remainingMinutes: number;
  remainingSeconds: number;
}

export declare class PomodoroTimer {
  status: PomodoroStatus | undefined;
  mode: Mode;
  private timeElapsedInMode;
  private timer;
  focusSlotDuration: number;
  breakSlotDuration: number;
  start: () => void;
  stop: () => void;
  private readonly onModeChange;

  constructor(
    onModeChange: (newMode: Mode) => void,
    focusSlotDuration?: number,
    breakSlotDuration?: number
  );

  private updateStatus;
  private updateReferenceTimestampIfRequired;
}

export {};
