import exp from '../src/index';

describe('[try/catch/finally]', () => {
  it('try/catch: block try', async () => {
    const result = await exp
      .try(async () => {
        return 1;
      })
      .catch(async (err) => {
        return err.name;
      });

    expect(result).toBe(1);
  });

  it('try/catch: block catch ', async () => {
    const result = await exp
      .try(async () => {
        if (Date.now() > 1) {
          throw new Error('STOP');
        }
        return 1;
      })
      .catch(async (err) => {
        return err.name;
      });

    expect(result).toBe('Error');
  });

  it('try/finally: block finally', async () => {
    const result = await exp
      .try(async () => {
        return 1;
      })
      // eslint-disable-next-line promise/no-return-in-finally
      .finally(() => {
        return 'finally';
      });

    expect(result.toUpperCase()).toBe('FINALLY');
  });

  it('try/finally: block try', async () => {
    const result = await exp
      .try(async () => {
        return 1;
      })
      .finally(async () => {
        1 + 1;
      });

    expect(result.toFixed()).toBe('1');
  });

  it('try/catch/finally: block try', async () => {
    const result = await exp
      .try(async () => {
        return 1;
      })
      .catch(async (err) => {
        return err.name;
      })
      .finally(async () => {
        1 + 1;
      });

    expect(result).toBe(1);
  });

  it('try/catch/finally: block catch', async () => {
    const result = await exp
      .try(async () => {
        if (Date.now() > 1) {
          throw new Error('STOP');
        }
        return 1;
      })
      .catch((err) => {
        return err.name;
      })
      .finally(() => {
        1 + 1;
      });

    expect(result).toBe('Error');
  });

  it('try/catch/finally: block finally', async () => {
    const result = await exp
      .try(async () => {
        return 1;
      })
      .catch(async (err) => {
        return err.name;
      })
      // eslint-disable-next-line promise/no-return-in-finally
      .finally(async () => {
        return true;
      });

    expect(result).toBe(true);
  });

  it('try/catch/finally: rethrow', async () => {
    expect.assertions(1);
    try {
      const result = await exp
        .try(async () => {
          if (Date.now() > 1) {
            throw new Error('STOP');
          }
          return 1;
        })
        .catch((err) => {
          throw new Error(`Rethrow ${err.name}`);
        })
        .finally(() => {
          1 + 1;
        });
      console.log(result);
    } catch (error) {
      expect((error as unknown as Error).message).toBe('Rethrow Error');
    }
  });

  it('try/catch/finally: wrap incorrect error', async () => {
    expect.assertions(1);
    const result = await exp
      .try(async () => {
        if (Date.now() > 1) {
          // eslint-disable-next-line no-throw-literal
          throw 'Stop';
        }
        return 1;
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        1 + 1;
      });
    expect((result as Error).message).toBe('Stop');
  });
});
