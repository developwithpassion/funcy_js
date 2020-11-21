import { identity, noOp, constant, compose, pipe, prop, reducer_for_unique_map, tap } from './core';

describe('core functional utils', () => {
  describe('identity', () => {
    it('builds a function that will return what it was called with', () => {
      expect(identity(42)).toEqual(42);
    });
  });

  describe('noOp', () => {
    it('is the identity function', () => {
      expect(noOp).toEqual(identity);
    });
  });

  describe('when composing functions', () => {
    let calledFirst;
    let calledSecond;
    let first;
    let second;
    let composed;
    let result;
    let rightMostFunctionCalledFirst;

    describe('when no functions are provided', () => {
      it('return the identity function', () => {
        expect(compose()).toEqual(identity);
      });
    });

    describe('when only 1 function is provided', () => {
      let func;

      beforeEach(() => {
        func = () => {};
      });

      beforeEach(() => {
        result = compose(func);
      });

      it('returns the function', () => {
        expect(result).toEqual(func);
      });
    });

    beforeEach(() => {
      calledFirst = false;
      calledSecond = false;
      rightMostFunctionCalledFirst = false;
    });

    beforeEach(() => {
      first = a => {
        expect(calledSecond).toBeTruthy();
        calledFirst = true;
        return a.toLowerCase();
      };
      second = a => {
        expect(calledSecond).toBeFalsy();
        expect(calledFirst).toBeFalsy();
        rightMostFunctionCalledFirst = !(calledSecond && calledFirst);
        calledSecond = true;
        return a[0];
      };
    });

    beforeEach(() => {
      composed = compose(first, second);
    });

    beforeEach(() => {
      result = composed('THIS');
    });

    it('returns a function that evaluates the provided functions right to left', () => {
      expect(rightMostFunctionCalledFirst).toBeTruthy();
    });

    it('returns the result of reducing the arg using the functions', () => {
      expect(result).toEqual('t');
    });
  });

  describe('tap', () => {
    let target;
    let result;
    let visitor;
    let ranAction;

    describe('invoked with a visitor and a target', () => {
      beforeEach(() => {
        target = { number: 7 };

        visitor = val => {
          expect(val).toEqual(target);
          ranAction = true;
        };
      });

      beforeEach(() => {
        result = tap(visitor, target);
      });

      it('invokes the visitor with the target', () => {
        expect(ranAction).toBeTruthy();
      });

      it('returns the item it was invoked against', () => {
        expect(result).toEqual(target);
      });
    });

    describe('is curried', () => {
      beforeEach(() => {
        target = { number: 7 };

        visitor = val => {
          expect(val).toEqual(target);
          ranAction = true;
        };
      });

      beforeEach(() => {
        result = tap(visitor);
        result = result(target);
      });

      it('invokes the visitor with the target', () => {
        expect(ranAction).toBeTruthy();
      });

      it('returns the item it was invoked against', () => {
        expect(result).toEqual(target);
      });
    });
  });

  describe('when piping functions', () => {
    let calledFirst;
    let calledSecond;
    let first;
    let second;
    let piped;
    let result;
    let leftMostFunctionCalledFirst;

    beforeEach(() => {
      calledFirst = false;
      calledSecond = false;
      leftMostFunctionCalledFirst = false;
    });

    beforeEach(() => {
      first = a => {
        expect(calledSecond).toBeFalsy();
        expect(calledFirst).toBeFalsy();
        leftMostFunctionCalledFirst = !(calledSecond && calledFirst);
        calledFirst = true;
        return a.toLowerCase();
      };

      second = a => {
        calledSecond = true;
        return a[0];
      };
    });

    beforeEach(() => {
      piped = pipe(first, second);
    });

    beforeEach(() => {
      result = piped('THIS');
    });

    it('returns a function that evaluates the provided functions left to right', () => {
      expect(leftMostFunctionCalledFirst).toBeTruthy();
    });

    it('returns the result of reducing the arg using the functions', () => {
      expect(result).toEqual('t');
    });
  });

  describe('tap', () => {
    let target;
    let result;
    let visitor;
    let ranAction;

    describe('invoked with a visitor and a target', () => {
      beforeEach(() => {
        target = { number: 7 };

        visitor = val => {
          expect(val).toEqual(target);
          ranAction = true;
        };
      });

      beforeEach(() => {
        result = tap(visitor, target);
      });

      it('invokes the visitor with the target', () => {
        expect(ranAction).toBeTruthy();
      });

      it('returns the item it was invoked against', () => {
        expect(result).toEqual(target);
      });
    });

    describe('is curried', () => {
      beforeEach(() => {
        target = { number: 7 };

        visitor = val => {
          expect(val).toEqual(target);
          ranAction = true;
        };
      });

      beforeEach(() => {
        result = tap(visitor);
        result = result(target);
      });

      it('invokes the visitor with the target', () => {
        expect(ranAction).toBeTruthy();
      });

      it('returns the item it was invoked against', () => {
        expect(result).toEqual(target);
      });
    });
  });

  describe('building reducers', () => {
    let items;
    let result;

    const createPerson = ({ id, lastName, firstName, city, age }) => ({
      id,
      lastName,
      firstName,
      city,
      age
    });

    beforeEach(() => {
      items = [
        createPerson({
          id: 5,
          lastName: 'Gordon',
          firstName: 'Jim',
          city: 'Gotham',
          age: 50
        }),
        createPerson({
          id: 2,
          lastName: 'Doe',
          firstName: 'Jane',
          city: 'Seattle',
          age: 38
        }),
        createPerson({
          id: 3,
          lastName: 'Bob',
          firstName: 'Jim',
          city: 'Houston',
          age: 40
        }),
        createPerson({
          id: 1,
          lastName: 'Doe',
          firstName: 'John',
          city: 'Austin',
          age: 40
        }),
        createPerson({
          id: 4,
          lastName: 'Gordon',
          firstName: 'Barbara',
          city: 'Gotham',
          age: 38
        })
      ];
    });

    describe('reducer_for_unique_map', () => {
      [
        {
          buildReducer: reducer_for_unique_map(prop('city'), identity),
          expectedResult: {
            Seattle: expect.objectContaining({ id: 2 }),
            Houston: expect.objectContaining({ id: 3 }),
            Austin: expect.objectContaining({ id: 1 }),
            Gotham: expect.objectContaining({ id: 4 })
          }
        },
        {
          buildReducer: reducer_for_unique_map(prop('age')),
          expectedResult: {
            50: 50,
            38: 38,
            40: 40
          }
        }
      ].forEach(({ buildReducer, expectedResult }, index) => {
        describe(`Scenaro ${index + 1}`, () => {
          beforeEach(() => {
            result = items.reduce(buildReducer, {});
          });

          it('matches the expected result', () => {
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
  });

  describe('prop', () => {
    let sut;
    let result;

    beforeEach(() => {
      sut = prop('age');
    });

    describe('when created', () => {
      it('builds a function waiting for a target to key into', () => {
        expect(typeof sut === 'function').toBeTruthy();
      });
    });

    describe('invoked against a target', () => {
      beforeEach(() => {
        result = sut({ age: 20 });
      });

      it('returns the value of the key on the target', () => {
        expect(result).toEqual(20);
      });
    });
  });

  describe('constant', () => {
    let sut;

    beforeEach(() => {
      sut = constant(5);
    });

    it('builds a function that will always return the value it was initialized with', () => {
      expect(sut()).toEqual(5);
    });
  });
});
