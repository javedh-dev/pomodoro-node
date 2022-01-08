import { Mode, PomodoroTimer } from "../src/pomodaro";

jest.useFakeTimers();

describe("Pomodoro Timer", () => {
  beforeEach(() => {});

  test("Create a default pomodoro timer instance", () => {
    const timer = new PomodoroTimer();
    expect(timer.mode).toBe(Mode.FOCUS);
    expect(timer.status).toBeUndefined();
  });

  test("start pomodoro timer updates the status every second", () => {
    const timer = new PomodoroTimer();
    timer.start();
    expect(timer.mode).toBe(Mode.FOCUS);
    expect(timer.status).toBeDefined();
    timer.stop();
  });

  test("Create a pomodoro timer with custom options", async () => {
    jest.spyOn(global, "setInterval");
    const timer = new PomodoroTimer({
      focusSlotDuration: 100,
      breakSlotDuration: 25,
    });
    timer.start();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.advanceTimersByTime(20000);
    expect(timer.status?.mode).toBe(Mode.FOCUS);
    expect(timer.status?.remainingMinutes).toBe(1);
    expect(timer.status?.remainingSeconds).toBe(20);

    jest.advanceTimersByTime(90000);
    expect(timer.status?.mode).toBe(Mode.BREAK);
    expect(timer.status?.remainingMinutes).toBe(0);
    expect(timer.status?.remainingSeconds).toBe(15);

    jest.advanceTimersByTime(20000);
    expect(timer.status?.mode).toBe(Mode.FOCUS);
    expect(timer.status?.remainingMinutes).toBe(1);
    expect(timer.status?.remainingSeconds).toBe(35);
  });
});
