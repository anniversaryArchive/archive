const throttle = function getThrottle(callback: Function, delayTime: number) {
  let timerId: NodeJS.Timeout | null = null;

  return (event: any) => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback(event);
      timerId = null;
    }, delayTime);
  };
}

export default throttle;