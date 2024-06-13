# Elegant Expression

[![Actions Status](https://github.com/dm-kamaev/elegant-expression/workflows/Build/badge.svg)](https://github.com/dm-kamaev/elegant-expression/actions) ![Coverage](https://github.com/dm-kamaev/elegant-expression/blob/master/coverage/badge-statements.svg)

The library for create enum which support object as values. You can simulate enum like Swift associated values or Rust enum with her help.
It has supports TypeScript </>



## Install
```sh
npm i elegant-expression -S
```

## About
For handling errors, JavaScript and TypeScript provide the `try/catch/finally` statement.
While it is highly useful, it sometimes makes your code hard to read, e.g. if you want to assign a variable and have a fallback in the catch clause:
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

Library `enum-object-value` offers a solution to the problem. It make work with enums by analogy associated values in Swift or Rust enum.

### Definition
```ts
import EnumObject from 'enum-object-value';

const userRoleEnum = new EnumObject({
  ROOT: { value: 'root', permission: ['create:admin', 'create', 'remove', 'read'] },
  ADMIN: { value: 'admin', permission: ['create', 'remove', 'read'] },
  EMPLOYEE: { value: 'employee', permission: ['read'] },
} as const);
```

### Access to properties and names of enum:
```ts
// Get value
const admin = userRoleEnum.prop.ADMIN;
// {
//    readonly value: "admin";
//    readonly permission: readonly ["create", "remove", "read"];
// }

// Similarly with method .get
const admin = userRoleEnum.get('ADMIN');

// Get name
const ADMIN = userRoleEnum.name.ADMIN;
// ADMIN
```

### Iteration
```ts
for (const [name, { value, permission }] of userRoleEnum) {
  console.log(`${name} => { value: ${value}, permission: ${permission} } }`);
}

// OR
userRoleEnum.forEach((name, { value, permission }) => {
  console.log(`${name} => { value: ${value}, permission: ${permission} } }`);
});
```

If you want change  order of iteration by enum values, you can pass order as optional field of second argument `EnumObject`:
```ts
 const userRoleEnum = new EnumObject(
    {
      ROOT: { value: 'root', permission: ['create:admin', 'create', 'remove', 'read'] },
      ADMIN: { value: 'admin', permission: ['create', 'remove', 'read'] },
      EMPLOYEE: { value: 'employee', permission: ['read'] },
    } as const,
    { order: ['EMPLOYEE', 'ADMIN', 'ROOT'] },
  );
```


### Get names and properties
```ts
userRoleEnum.getNames();
// ("ROOT" | "ADMIN" | "EMPLOYEE")[]

userRoleEnum.getValues();
// {
//     readonly ROOT: {
//         readonly value: "root";
//         readonly permission: readonly ["create:admin", "create", "remove", "read"];
//     };
//     readonly ADMIN: {
//         readonly value: "admin";
//         readonly permission: readonly ["create", "remove", "read"];
//     };
//     readonly EMPLOYEE: {
//         readonly value: "employee";
//         readonly permission: readonly ["read"];
//     };
// }
```
### Typings
You can get type of names and values of enum with utility types: `EnumNames` and `EnumValues`.
```ts
import EnumObject, { EnumNames, EnumValues } from 'enum-object-value';

const data = {
  ROOT: { value: 'root', permission: ['create:admin', 'create', 'remove', 'read'] },
  ADMIN: { value: 'admin', permission: ['create', 'remove', 'read'] },
  EMPLOYEE: { value: 'employee', permission: ['read'] },
} as const;

const userRoleEnum = new EnumObject(data);

type UserRoleEnumNames = EnumNames<typeof userRoleEnum>;
//   "ROOT" | "ADMIN" | "EMPLOYEE"
type UserRoleEnumValues = EnumValues<typeof userRoleEnum>;
// {
//     readonly value: "root";
//     readonly permission: readonly ["create:admin", "create", "remove", "read"];
// } |
// ...
```

### More examples
Examples with functions as values:
```ts
import EnumObject, { EnumNames, EnumValues, GetEnumValueByName } from 'enum-object-value';


const paymentTypeEnum = new EnumObject({
  CARD: (number: string, holderName: string, expirationDate: Date) => ({
    type: paymentTypeEnum.name.CARD,
    number,
    holderName,
    expirationDate,
  }),
  GIFT_CERTIFICATE: (number: string) => ({ type: paymentTypeEnum.name.GIFT_CERTIFICATE, number }),
  PAYPALL: (transactionId: string, transactionAuthCode?: string) => ({
    type: paymentTypeEnum.name.PAYPALL,
    transactionId,
    transactionAuthCode,
  }),
} as const);

type PaymentTypeEnumNames = EnumNames<typeof paymentTypeEnum>;
type PaymentTypeEnumValues = ReturnType<EnumValues<typeof paymentTypeEnum>>;

function showInfo(value: PaymentTypeEnumValues) {
  if (value.type === 'CARD') {
    console.log('Card number', value.number);
  } else if (value.type === 'GIFT_CERTIFICATE') {
    console.log('Gift number', value.number);
  } else if (value.type === 'PAYPALL') {
    console.log('Paypal transaction id', value.transactionId);
  }
}

const card = paymentTypeEnum.prop.CARD('234234', 'Peter D', new Date());
showInfo(card);

function getValue<Name extends PaymentTypeEnumNames>(type: Name): GetEnumValueByName<typeof paymentTypeEnum, Name> {
  return paymentTypeEnum.prop[type];
}

const createCard = getValue('CARD');
const card = createCard('11313', 'Peter D', new Date());
```


