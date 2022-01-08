"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroTimer = exports.Mode = void 0;
var Mode;
(function (Mode) {
  Mode["FOCUS"] = "FOCUS";
  Mode["BREAK"] = "BREAK";
})((Mode = exports.Mode || (exports.Mode = {})));

class PomodoroTimer {
  constructor(
    options = {
      focusSlotDuration: 10,
      breakSlotDuration: 2,
    }
  ) {
    this.start = () => {
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
          ? this.options.focusSlotDuration
          : this.options.breakSlotDuration) - this.timeElapsedInMode;
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
          ? this.options.focusSlotDuration
          : this.options.breakSlotDuration);
      if (timeRemainingInMode > 0) {
        this.timeElapsedInMode = timeRemainingInMode;
        this.mode = this.mode === Mode.FOCUS ? Mode.BREAK : Mode.FOCUS;
      }
    };
    this.options = options;
    this.mode = Mode.FOCUS;
    this.timeElapsedInMode = 0;
  }
}

exports.PomodoroTimer = PomodoroTimer;
