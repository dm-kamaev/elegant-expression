# Elegant Expression

[![Actions Status](https://github.com/dm-kamaev/elegant-expression/workflows/Build/badge.svg)](https://github.com/dm-kamaev/elegant-expression/actions) ![Coverage](https://github.com/dm-kamaev/elegant-expression/blob/master/coverage/badge-statements.svg)

Library provides `try/catch/finally` as expression.



## Install
```sh
npm i elegant-expression -S
```

## Try/Catch/Finally
JavaScript and TypeScript (accordingly)  provide the `try/catch/finally` only as statement.

When using a block of `try/catch/finally` creating different scopes and you will need to declare ahead the variables that are used within blocks. Additional, you should manual set types for this variables (you can't  using smart detection types of variables) and make casting of error type in block of catch.

All this leads to the writing of boilerplate code and makes it difficult to read:
```ts

// Before 😮‍💨
let status: 'ok' | 'fail';
try {
  await fn();
  status = 'ok';
// error has type unknown
} catch (err: unknown) {
  const error = err as Error;
  status = 'fail';
}

// After 🙆‍♂️
import exp from 'elegant-expression';

// We get result of executing immediately in one place
const status = await exp
  .try(async () => {
    await fn();
    return 'ok';
  })
  // error already has type Error
  .catch((err: Error) => {
    console.error(err);
    return 'fail';
  });

```

`try/catch/finally`:
```ts
const result = await exp
  .try(async () => {
    await fn();
    return 'ok';
  }).catch((err) =>
    'fail'
  ).finally(() =>
    console.log('finally');
  );
```


`try/finally`:
```ts
const result = await exp
  .try(async () => {
    await fn();
    return 'ok';
  }).finally(() =>
    console.log('finally');
  );
```


