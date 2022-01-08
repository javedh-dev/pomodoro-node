interface PomodoroOptions {
  focusSlotDuration: number;
  breakSlotDuration: number;
}

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
  start: () => void;
  stop: () => void;
  private options;
  private timeElapsedInMode;
  private timer;
  private updateStatus;
  private updateReferenceTimestampIfRequired;

  constructor(options?: PomodoroOptions);
}

export {};
