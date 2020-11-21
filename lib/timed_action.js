const timeout_styles = {
  delayed: {
    clear: clearTimeout,
    set: setTimeout
  },

  interval: {
    clear: clearInterval,
    set: setInterval
  }
};

const _create_toggler = ({ clear, set, behaviour, delay }) => {
  let timer_id = null;

  const start = async() =>
    new Promise((resolve, reject) => {
      timer_id = set(() => {
        try {
          resolve(behaviour());
        } catch (e) {
          reject(e);
        }
      }, delay);
    });

  const stop = () => {
    clear(timer_id);
    timer_id = null;
  };

  return {
    start,
    stop
  };
};

const _create_timed_action = ({ clear, set }, { create_toggler = _create_toggler } = {}) => (
  behaviour,
  delay = 1000
) => {
  const { start, stop } = create_toggler({ clear, set, behaviour, delay });

  const restart = async() => {
    stop();
    return await start();
  };

  return {
    start,
    stop,
    restart
  };
};

export const create_delayed_action = _create_timed_action(timeout_styles.delayed);

export const create_repeating_action = _create_timed_action(timeout_styles.interval);

export const __test__ = {
  _create_timed_action,
  timeout_styles,
  _create_toggler
};
