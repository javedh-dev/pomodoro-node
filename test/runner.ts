import { PomodoroTimer } from "../src/pomodaro";

const pomodoroTimer = new PomodoroTimer();
pomodoroTimer.start();

setInterval(() => console.log(pomodoroTimer.currentStatus()), 1000);
