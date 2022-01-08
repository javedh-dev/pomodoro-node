"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroTimer = exports.Mode = void 0;
var Mode;
(function (Mode) {
  Mode["FOCUS"] = "FOCUS";
  Mode["BREAK"] = "BREAK";
})((Mode = exports.Mode || (exports.Mode = {})));

class PomodoroTimer {
  constructor(onModeChange, focusSlotDuration = 1500, breakSlotDuration = 300) {
    this.start = () => {
      this.onModeChange(this.mode);
      this.updateStatus();
      this.timer = setInterval(this.updateStatus, 1000);
    };
    this.stop = () => {
      clearInterval(this.timer);
    };
    this.updateStatus = () => {
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
    this.updateReferenceTimestampIfRequired = () => {
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
    this.onModeChange = onModeChange;
    this.focusSlotDuration = focusSlotDuration;
    this.breakSlotDuration = breakSlotDuration;
    this.mode = Mode.FOCUS;
    this.timeElapsedInMode = 0;
  }
}

exports.PomodoroTimer = PomodoroTimer;
