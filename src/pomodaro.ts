interface PomodoroOptions {
  focusSlotDuration: number;
  breakSlotDuration: number;
}

export enum Mode {
  FOCUS = "FOCUS",
  BREAK = "BREAK",
}

interface PomodoroStatus {
  mode: Mode;
  remainingMinutes: number;
  remainingSeconds: number;
}

export class PomodoroTimer {
  status: PomodoroStatus | undefined;
  mode: Mode;
  private options: PomodoroOptions;
  private timeElapsedInMode: number;
  private timer: any;

  constructor(
    options: PomodoroOptions = {
      focusSlotDuration: 10,
      breakSlotDuration: 2,
    }
  ) {
    this.options = options;
    this.mode = Mode.FOCUS;
    this.timeElapsedInMode = 0;
  }

  public start = () => {
    this.updateStatus();
    this.timer = setInterval(this.updateStatus, 1000);
  };

  public stop = () => {
    clearInterval(this.timer);
  };

  private updateStatus = () => {
    this.updateReferenceTimestampIfRequired();
    const remainingTime =
      (this.mode === Mode.FOCUS
        ? this.options.focusSlotDuration
        : this.options.breakSlotDuration) - this.timeElapsedInMode;
    this.status = {
      mode: this.mode,
      remainingMinutes: Math.floor(remainingTime / 60),
      remainingSeconds: remainingTime % 60,
    };
    this.timeElapsedInMode += 1;
  };

  private updateReferenceTimestampIfRequired = () => {
    const timeRemainingInMode =
      this.timeElapsedInMode -
      (this.mode === Mode.FOCUS
        ? this.options.focusSlotDuration
        : this.options.breakSlotDuration);
    if (timeRemainingInMode > 0) {
      this.timeElapsedInMode = timeRemainingInMode;
      this.mode = this.mode === Mode.FOCUS ? Mode.BREAK : Mode.FOCUS;
    }
  };
}
