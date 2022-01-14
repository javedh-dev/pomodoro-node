export enum Mode {
  FOCUS = "FOCUS",
  BREAK = "BREAK",
}

export enum State {
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

export class PomodoroTimer {
  private mode: Mode;
  private state: State;
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
    this.state = State.READY;
    this.timeElapsedInMode = 0;
  }

  public start = () => {
    if (this.state === State.READY) {
      this.mode = Mode.FOCUS;
      this.onModeChange(this.mode);
    }
    if (this.timer) clearInterval(this.timer);
    this.state = State.RUNNING;
    this.timer = setInterval(this.updateStatus, 1000);
  };

  public stop = () => {
    this.pause();
    this.state = State.READY;
    this.timeElapsedInMode = 0;
  };

  public pause = () => {
    clearInterval(this.timer);
    this.state = State.PAUSE;
  };

  public reset = (focusSlotDuration: number, breakSlotDuration: number) => {
    this.stop();
    this.focusSlotDuration = focusSlotDuration;
    this.breakSlotDuration = breakSlotDuration;
  };

  public getStatus = (): PomodoroStatus => {
    const remainingTime =
      (this.mode === Mode.FOCUS
        ? this.focusSlotDuration
        : this.breakSlotDuration) - this.timeElapsedInMode;
    return {
      state: this.state,
      mode: this.mode,
      remainingMinutes: Math.floor(remainingTime / 60),
      remainingSeconds: remainingTime % 60,
    };
  };

  private updateStatus = () => {
    this.timeElapsedInMode += 1;
    this.updateReferenceTimestampIfRequired();
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
