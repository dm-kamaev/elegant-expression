type GetResult<ResultFinally, ResultTry, ResultCatch> =
  // We wrapping  data  callback try/catch/finally into tuple for disable distribution when GetResult<void, string, never>:
  /**
   * Details: The behavior you are seeing is caused by distribution. K is a naked generic type on the left side of a conditional. Therefore the compiler is trying to distribute the union in K over the conditional.
   * If K is never, this union is empty and there is "nothing" to distribute over.
   * Therefore, the whole type returns never.
   * You can imagine this being similar to an empty for-loop which never starts iterating leading to no result.
   * */
  [ResultFinally] extends [void] ? ([ResultCatch] extends [void] ? ResultTry : ResultTry | ResultCatch) : ResultFinally;

// type Temp222 = GetResult<void, string, never>;

async function execTryCatchFinally<
  fnTry extends () => any,
  fnCatch extends (error: Error) => any,
  fnFinally extends () => any,
>(try_: fnTry, catch_?: fnCatch, finally_?: fnFinally) {
  if (try_ && catch_ && finally_) {
    try {
      const result = await try_();
      if (result !== undefined) {
        return result;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`${err}`, { cause: err });

      const result = await catch_(error);
      if (result !== undefined) {
        return result;
      }
    } finally {
      const result = await finally_();
      if (result !== undefined) {
        // eslint-disable-next-line no-unsafe-finally
        return result;
      }
    }
  } else if (try_ && catch_) {
    try {
      const result = await try_();
      if (result !== undefined) {
        return result;
      }
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      const result = await catch_(err);
      if (result !== undefined) {
        return result;
      }
    }
  } else if (try_ && finally_) {
    try {
      const result = await try_();
      if (result !== undefined) {
        return result;
      }
    } finally {
      const result = await finally_();
      if (result !== undefined) {
        // eslint-disable-next-line no-unsafe-finally
        return result;
      }
    }
  } else {
    throw new Error('Invalid parametrs');
  }
}

function try_<FnTry extends () => any>(_try: FnTry) {
  return {
    catch: function <FnCatch extends (error: Error) => any>(_catch: FnCatch) {
      return {
        finally: function <FnFinally extends () => Promise<any>>(finally_: FnFinally) {
          return {
            then: async function (
              onFulfilled: (
                value: GetResult<
                  Awaited<ReturnType<FnFinally>>,
                  Awaited<ReturnType<FnTry>>,
                  Awaited<ReturnType<FnCatch>>
                >,
              ) => void,
              onRejected?: (reason: any) => void,
            ): Promise<
              GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>
            > {
              let promise = execTryCatchFinally(_try, _catch, finally_).then((result) => {
                if (result !== undefined) {
                  return onFulfilled(result);
                }
                return onFulfilled(
                  undefined as GetResult<
                    Awaited<ReturnType<FnFinally>>,
                    Awaited<ReturnType<FnTry>>,
                    Awaited<ReturnType<FnCatch>>
                  >,
                );
              });

              if (onRejected) {
                promise = promise.catch(onRejected);
              }

              return promise as Promise<
                GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>
              >;
            },
          } as unknown as PromiseLike<
            GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>
          >;
        },
        then: async function (
          onFulfilled: (value: GetResult<void, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>) => void,
          onRejected?: (reason: any) => void,
        ): Promise<GetResult<void, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>> {
          let promise = execTryCatchFinally(_try, _catch).then((result) => {
            if (result !== undefined) {
              return onFulfilled(result);
            }
            return onFulfilled(undefined as GetResult<void, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>);
          });

          if (onRejected) {
            promise = promise.catch(onRejected);
          }

          return promise as Promise<GetResult<void, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>>;
        },
      } as unknown as PromiseLike<GetResult<void, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>> & {
        finally<FnFinally extends () => any>(
          finally_: FnFinally,
        ): Promise<GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, Awaited<ReturnType<FnCatch>>>>;
      };
    },
    finally: function <FnFinally extends () => any>(_finally: FnFinally) {
      return {
        then: async function (
          onFulfilled: (value: GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, void>) => void,
          onRejected?: (reason: any) => void,
        ): Promise<GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, void>> {
          let promise = execTryCatchFinally(_try, undefined, _finally).then((result) => {
            if (result !== undefined) {
              return onFulfilled(result);
            }
            return onFulfilled(
              undefined as GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, void>,
            );
          });
          if (onRejected) {
            promise = promise.catch(onRejected);
          }
          return promise as Promise<GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, void>>;
        },
      } as unknown as PromiseLike<GetResult<Awaited<ReturnType<FnFinally>>, Awaited<ReturnType<FnTry>>, void>>;
    },
  };
}
// const fn = async () => {
//   return 1;
// };
// const fn2 = async () => {
//   return '1';
// };

// const fn3 = async () => {
//   return 'finally';
// };
// type Value = ReturnType<typeof fn> extends void ? true : false;

// type Debug = GetResult<void, ReturnType<typeof fn>, string>;
// type Debug2222 = Promise<
//   GetResult<Awaited<ReturnType<typeof fn3>>, Awaited<ReturnType<typeof fn>>, Awaited<ReturnType<typeof fn2>>>
// >;

const expression = {
  try: try_,
};

export default expression;
