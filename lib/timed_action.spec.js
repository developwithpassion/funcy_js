import { __test__ } from './timed_action';

const { _create_toggler: create_toggler, _create_timed_action, timeout_styles } = __test__;

describe('time actions', () => {
  let clear;
  let set;
  let behaviour;
  let delay;
  let sut;

  beforeEach(() => {
    set = jest.fn();
    clear = jest.fn();
    behaviour = jest.fn();
    delay = 1000;
  });

  describe('timeout styles', () => {
    describe('delayed', () => {
      it('uses clearTimeout and setTimeout', () => {
        expect(timeout_styles.delayed).toEqual({
          set: setTimeout,
          clear: clearTimeout
        });
      });
    });
    describe('interval', () => {
      it('uses clearInterval and setInterval', () => {
        expect(timeout_styles.interval).toEqual({
          set: setInterval,
          clear: clearInterval
        });
      });
    });
  });

  describe('a created toggler', () => {
    beforeEach(() => {
      set.mockImplementation(item => item());
    });

    beforeEach(() => {
      sut = create_toggler({ clear, set, behaviour, delay });
    });

    describe('when started', () => {
      beforeEach(async () => {
        await sut.start();
      });

      it('triggers the set', () => {
        expect(set).toHaveBeenCalled();
      });
    });

    describe('when stopped', () => {
      beforeEach(async () => {
        await sut.stop();
      });

      it('triggers the clear', () => {
        expect(clear).toHaveBeenCalled();
      });
    });
  });

  describe('creating a timed action', () => {
    let create_toggler;
    let toggler;

    beforeEach(() => {
      create_toggler = jest.fn();
      toggler = { start: jest.fn(), stop: jest.fn() };

      create_toggler.mockReturnValue(toggler);
    });

    beforeEach(() => {
      sut = _create_timed_action({ set, clear }, { create_toggler })(behaviour);
    });

    it('returns an object that contains the start and stop from the created toggler', () => {
      expect(sut).toMatchObject({
        start: toggler.start,
        stop: toggler.stop
      });
    });

    describe('a created timed action', () => {
      describe('when restarted', () => {
        beforeEach(async () => {
          await sut.restart();
        });

        it('stops and starts the toggler', () => {
          expect(toggler.stop).toHaveBeenCalled();
          expect(toggler.start).toHaveBeenCalled();
        });
      });
    });
  });
});
