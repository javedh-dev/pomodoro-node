import { Mode, PomodoroStatus, PomodoroTimer, State } from "../src/pomodaro";

jest.useFakeTimers();

describe("Pomodoro Timer", () => {
  beforeEach(() => {});

  test("Create a default pomodoro timer instance", () => {
    const timer = new PomodoroTimer(jest.fn);
    verifyTimerStatus(timer.getStatus(), {
      state: State.READY,
      mode: Mode.FOCUS,
      remainingMinutes: 25,
      remainingSeconds: 0,
    });
    expect(timer.focusSlotDuration).toBe(1500);
    expect(timer.breakSlotDuration).toBe(300);
  });

  test("start pomodoro timer updates the status every second", () => {
    const timer = new PomodoroTimer(jest.fn);
    timer.start();
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 25,
      remainingSeconds: 0,
    });
    timer.stop();
  });

  function verifyTimerStatus(actual: PomodoroStatus, expected: PomodoroStatus) {
    expect(actual.state).toBe(expected.state);
    expect(actual.mode).toBe(expected.mode);
    expect(actual.remainingMinutes).toBe(expected.remainingMinutes);
    expect(actual.remainingSeconds).toBe(expected.remainingSeconds);
  }

  test("Create a pomodoro timer with custom options", async () => {
    jest.spyOn(global, "setInterval");
    const onModeChange = jest.fn();
    const timer = new PomodoroTimer(onModeChange, 100, 25);
    timer.start();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    expect(onModeChange).toHaveBeenLastCalledWith(Mode.FOCUS);

    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    jest.advanceTimersByTime(90000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.BREAK,
      remainingMinutes: 0,
      remainingSeconds: 15,
    });
    expect(onModeChange).toHaveBeenLastCalledWith(Mode.BREAK);

    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 35,
    });
    expect(onModeChange).toHaveBeenLastCalledWith(Mode.FOCUS);

    expect(onModeChange).toBeCalledTimes(3);
    timer.stop();
  });

  test("Pause timer will pause progress and restart from last progress", () => {
    const onModeChange = jest.fn();
    const timer = new PomodoroTimer(onModeChange, 100, 25);
    timer.start();
    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    timer.pause();
    jest.advanceTimersByTime(10000000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.PAUSE,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    timer.start();
    jest.advanceTimersByTime(10000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 10,
    });
    expect(onModeChange).toBeCalledTimes(1);
  });

  test("Stop timer will reset progress and mode and restart from initial state", () => {
    const onModeChange = jest.fn();
    const timer = new PomodoroTimer(onModeChange, 100, 25);
    jest.spyOn(timer, "pause");
    timer.start();
    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    timer.stop();
    jest.advanceTimersByTime(1000000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.READY,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 40,
    });
    timer.start();
    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    expect(onModeChange).toBeCalledTimes(2);
    expect(timer.pause).toBeCalledTimes(1);
  });

  test("Reset timer stops the timer, reset it and start again", () => {
    const onModeChange = jest.fn();
    const timer = new PomodoroTimer(onModeChange, 100, 25);
    jest.spyOn(timer, "pause");
    jest.spyOn(timer, "stop");
    timer.start();
    jest.advanceTimersByTime(20000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 1,
      remainingSeconds: 20,
    });
    jest.spyOn(timer, "start");
    timer.reset(20, 5);
    expect(timer.start).not.toBeCalled();
    timer.start();
    jest.advanceTimersByTime(10000);
    verifyTimerStatus(timer.getStatus(), {
      state: State.RUNNING,
      mode: Mode.FOCUS,
      remainingMinutes: 0,
      remainingSeconds: 10,
    });
    expect(onModeChange).toBeCalledTimes(2);
    expect(timer.stop).toBeCalledTimes(1);
    expect(timer.pause).toBeCalledTimes(1);
  });
});
