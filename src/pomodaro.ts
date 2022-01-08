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
  private timeElapsedInMode: number;
  private timer: any;
  focusSlotDuration: number;
  breakSlotDuration: number;
  private readonly onModeChange: (newMode: Mode) => void;

  constructor(
    onModeChange: (newMode: Mode) => void,
    focusSlotDuration: number = 1500,
    breakSlotDuration: number = 300
  ) {
    this.onModeChange = onModeChange;
    this.focusSlotDuration = focusSlotDuration;
    this.breakSlotDuration = breakSlotDuration;
    this.mode = Mode.FOCUS;
    this.timeElapsedInMode = 0;
  }

  public start = () => {
    this.onModeChange(this.mode);
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
        ? this.focusSlotDuration
        : this.breakSlotDuration) - this.timeElapsedInMode;
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
        ? this.focusSlotDuration
        : this.breakSlotDuration);
    if (timeRemainingInMode > 0) {
      this.timeElapsedInMode = timeRemainingInMode;
      this.mode = this.mode === Mode.FOCUS ? Mode.BREAK : Mode.FOCUS;
      this.onModeChange(this.mode);
    }
  };
}
