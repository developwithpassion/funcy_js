import curry from '@developwithpassion/curry_js';

// This file consists of a minimum set of functional utils that
// can be used to "lightly" introduce functional composition styles
// along with introduction of point-free styles where applicable
// Identity - https://en.wikipedia.org/wiki/Identity_function
export const identity = val => val;

export const noOp = identity;

export const constant = val => () => val;

// Creates a composite function which executes provided functions in right->left order
export const compose = (...functions_to_compose) => {
  if (functions_to_compose.length === 0) return noOp;
  if (functions_to_compose.length === 1) return functions_to_compose[0];

  return functions_to_compose.reduce((a, b) => (...args) => a(b(...args)));
};

// Creates a composite function which executes provided functions in left->right order
export const pipe = (...functions_to_compose) => compose(...functions_to_compose.reverse());

// Returns the value of property specified by 'key' on the target instance, curried
// for deferred execution against a target which is useful in pipelines
export const prop = curry((key, target) => target[key]);

// Perform an action against a `target` returning the target once the action has been performed,
// can be used in pipelines target is deferred
export const tap = curry((visitor, target) => {
  visitor(target);
  return target;
});

const create_message_builder = title => val => {
  /* eslint-disable no-console */
  console.log(`***INSPECT: ${title}`);
  console.log(val);
  /* eslint-enable no-console */
};

// Dumps `val` to the console prefixed by the message defined in `create_message_builder`
// along with a provided title. Useful for inspecting
// values as they are going through a pipeline
export const inspect = curry((title, val) => tap(create_message_builder(title), val));

const reducer_map_assignment_styles = {
  object: (target, key, val) => ({
    ...target,
    [key]: val
  }),

  map: (target, key, val) => target.set(key, val)
};

const _reducer_for_unique_map = curry(
  (assignment_style_mapper, attribute_mapper, item_mapper) => (acc, item) =>
    assignment_style_mapper(acc, attribute_mapper(item), item_mapper(item))
);

export const reducer_for_unique_map = (attribute_mapper, item_mapper = attribute_mapper) =>
  _reducer_for_unique_map(reducer_map_assignment_styles.object, attribute_mapper, item_mapper);

export const reducer_for_unique_insertion_order_map = (attribute_mapper, item_mapper = attribute_mapper) =>
  _reducer_for_unique_map(reducer_map_assignment_styles.map, attribute_mapper, item_mapper);
