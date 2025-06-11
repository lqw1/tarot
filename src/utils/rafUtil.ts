//use requestAnimation to replace setTimeout and setInterval
export default class RafUtils {
  intervalTimer: number | null = null;
  timeoutTimer: number | null = null;

  setTimeout = (callback: (...arg: any[]) => any, interval: number = 10) => {
    const startTime = Date.now();
    let endTime = startTime;

    const loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop);
      endTime = Date.now();
      if (endTime - startTime >= interval) {
        callback();
        cancelAnimationFrame(this.timeoutTimer);
      }
    };
    this.timeoutTimer = requestAnimationFrame(loop);
  };

  clearTimeout = () => {
    this.timeoutTimer && cancelAnimationFrame(this.timeoutTimer);
  };

  setInterval = (callback: (...arg: any[]) => any, interval: number = 10) => {
    let startTime = Date.now(),
      endTime = startTime;

    const loop = () => {
      this.intervalTimer = requestAnimationFrame(loop);
      endTime = Date.now();
      if (endTime - startTime >= interval) {
        startTime = Date.now();
        endTime = startTime;
        callback();
      }
    };
    this.intervalTimer = requestAnimationFrame(loop);
  };

  clearInterval = () => {
    this.intervalTimer && cancelAnimationFrame(this.intervalTimer);
  };
}
