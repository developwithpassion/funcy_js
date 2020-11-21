import curry from '@developwithpassion/curry_js';

const default_equality_check = (a, b) => a === b;

const arguments_are_different = ({ previous_arguments, next_arguments }) =>
  previous_arguments === null ||
  next_arguments === null ||
  previous_arguments.length !== next_arguments.length;

const are_shallowly_equal = (equality_check, previous_arguments, next_arguments) => {
  if (arguments_are_different({ previous_arguments, next_arguments })) return false;

  const length = previous_arguments.length;

  for (let i = 0; i < length; i++)
    if (!equality_check(previous_arguments[i], next_arguments[i])) return false;

  return true;
};

export const simple_memoize = (func, equality_check = default_equality_check) => {
  let last_args = null;
  let last_result = null;

  return (...args) => {
    if (!are_shallowly_equal(equality_check, last_args, args)) {
      last_result = func(...args);
    }

    last_args = args;
    return last_result;
  };
};

const _memoize_on_args = curry((arg_key_mapper, create_cache, fn) => {
  let cache = create_cache();

  return (...args) => {
    const key = arg_key_mapper(args);

    if (cache[key]) return cache[key];

    let result = fn(...args);
    cache[key] = result;
    return result;
  };
});

export const memoize_on_args = _memoize_on_args(JSON.stringify, () => ({}));

export const __test__ = {
  _memoize_on_args
};
