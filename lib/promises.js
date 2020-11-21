export const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

export const timeout = (promise, { duration = 5000 }) => {
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${duration} ms.`));
    }, duration);
  });

  return Promise.race([promise, timeout]);
};
