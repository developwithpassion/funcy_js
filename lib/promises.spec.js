import { sleep, timeout } from './promises';

describe('promises', () => {
  describe('sleep', () => {
    let startTime;
    let endTime;

    beforeEach(async () => {
      startTime = new Date();
      await sleep(1000);
      endTime = new Date();
    });
    it('sleeps for the time requested', () => {
      expect(endTime.getSeconds()).not.toEqual(startTime.getSeconds());
    });
  });

  describe('timeout', () => {
    let result;

    const buildAction = finishIn =>
      new Promise(resolve => {
        setTimeout(resolve(42), finishIn);
      });

    describe('when the action finishes before the timeout duration', () => {
      beforeEach(async () => {
        result = await timeout(buildAction(50), { duration: 70 });
      });
      it('returns the value of the action', () => {
        expect(result).toEqual(42);
      });
    });

    describe('when the action does not finish before the timeout', () => {
      let error;

      beforeEach(async () => {
        try {
          result = await timeout(buildAction(50), { duration: 40 });
        } catch (theError) {
          error = theError;
        }
      });
      it('an error is raised', () => {
        expect(error).not.toBeNull();
      });
    });
  });
});
