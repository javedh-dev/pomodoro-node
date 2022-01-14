"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroTimer = exports.State = exports.Mode = void 0;
var Mode;
(function (Mode) {
    Mode["FOCUS"] = "FOCUS";
    Mode["BREAK"] = "BREAK";
})(Mode = exports.Mode || (exports.Mode = {}));
var State;
(function (State) {
    State["READY"] = "READY";
    State["RUNNING"] = "RUNNING";
    State["PAUSE"] = "PAUSE";
})(State = exports.State || (exports.State = {}));
class PomodoroTimer {
    constructor(onModeChange, focusSlotDuration = 1500, breakSlotDuration = 300) {
        this.start = () => {
            if (this.state === State.READY) {
                this.mode = Mode.FOCUS;
                this.onModeChange(this.mode);
            }
            if (this.timer)
                clearInterval(this.timer);
            this.state = State.RUNNING;
            this.timer = setInterval(this.updateStatus, 1000);
        };
        this.stop = () => {
            this.pause();
            this.state = State.READY;
            this.timeElapsedInMode = 0;
        };
        this.pause = () => {
            clearInterval(this.timer);
            this.state = State.PAUSE;
        };
        this.reset = (focusSlotDuration, breakSlotDuration) => {
            this.stop();
            this.focusSlotDuration = focusSlotDuration;
            this.breakSlotDuration = breakSlotDuration;
        };
        this.getStatus = () => {
            const remainingTime = (this.mode === Mode.FOCUS
                ? this.focusSlotDuration
                : this.breakSlotDuration) - this.timeElapsedInMode;
            return {
                state: this.state,
                mode: this.mode,
                remainingMinutes: Math.floor(remainingTime / 60),
                remainingSeconds: remainingTime % 60,
            };
        };
        this.updateStatus = () => {
            this.timeElapsedInMode += 1;
            this.updateReferenceTimestampIfRequired();
        };
        this.updateReferenceTimestampIfRequired = () => {
            const timeRemainingInMode = this.timeElapsedInMode -
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
        this.state = State.READY;
        this.timeElapsedInMode = 0;
    }
}
exports.PomodoroTimer = PomodoroTimer;
