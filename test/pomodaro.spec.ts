import { Mode, PomodoroTimer } from "../src/pomodaro";

jest.useFakeTimers();

describe("Pomodoro Timer", () => {
  beforeEach(() => {});

  test("Create a default pomodoro timer instance", () => {
    const timer = new PomodoroTimer(jest.fn);
    expect(timer.mode).toBe(Mode.FOCUS);
    expect(timer.status).toBeUndefined();
    expect(timer.focusSlotDuration).toBe(1500);
    expect(timer.breakSlotDuration).toBe(300);
  });

  test("start pomodoro timer updates the status every second", () => {
    const timer = new PomodoroTimer(jest.fn);
    timer.start();
    expect(timer.mode).toBe(Mode.FOCUS);
    expect(timer.status).toBeDefined();
    expect(timer.status?.remainingSeconds).toBeDefined();
    expect(timer.status?.remainingMinutes).toBeDefined();
    timer.stop();
  });

  test("Create a pomodoro timer with custom options", async () => {
    jest.spyOn(global, "setInterval");
    const onModeChange = jest.fn();
    const timer = new PomodoroTimer(onModeChange, 100, 25);
    timer.start();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    expect(onModeChange).toBeCalledWith(Mode.FOCUS);
    jest.advanceTimersByTime(20000);
    expect(timer.status?.mode).toBe(Mode.FOCUS);
    expect(timer.status?.remainingMinutes).toBe(1);
    expect(timer.status?.remainingSeconds).toBe(20);

    jest.advanceTimersByTime(90000);
    expect(onModeChange).toBeCalledWith(Mode.BREAK);
    expect(timer.status?.mode).toBe(Mode.BREAK);
    expect(timer.status?.remainingMinutes).toBe(0);
    expect(timer.status?.remainingSeconds).toBe(15);

    jest.advanceTimersByTime(20000);
    expect(onModeChange).toBeCalledWith(Mode.FOCUS);
    expect(timer.status?.mode).toBe(Mode.FOCUS);
    expect(timer.status?.remainingMinutes).toBe(1);
    expect(timer.status?.remainingSeconds).toBe(35);

    expect(onModeChange).toBeCalledTimes(3);
    timer.stop();
  });
});
