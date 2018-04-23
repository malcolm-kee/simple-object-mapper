# simple-object-mapper

[![version](https://img.shields.io/npm/v/simple-object-mapper.svg)](https://www.npmjs.com/package/simple-object-mapper)
![license](https://img.shields.io/npm/l/simple-object-mapper.svg)

Simple object key trasformation utility ~~for OCD~~

<hr />

## The problem

You want to rename the object keys of the data that you retrieved from your server.

## This solution

This is a lightweight library to help you rename your object key to the convention that you desire.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save simple-object-mapper
```

## Usage

```js
import { generateMapper, TransformType } from 'simple-object-mapper';

const schema = TransformType.camelCase;

const map = generateMapper(schema);

map({
  Id: 5,
  Name: 'SimpleObjectMapper',
  KeyWords: 'Awesome'
});

/* result: 
{
    id: 5,
    name: 'SimpleObjectMapper',
    keyWords: 'Awesome'
}
*/
```

## API

### TransformType

TransformType is the built in naming convention, which consists of camelCase `TransformType.camelCase` and PascalCase `TransformType.PascalCase`.

### generateMapper: (schema: DataSchema) => function

The function you use to generate the mapping function. You need to provide the `schema` for you data as the input for this function.

### (Schema)

In its simplest form, schema can be just the TransformType, e.g. `const schema = TransformType.camelCase`. However, this only works if your object is a simple key-value object. If your object has nested object/array, then you need to provide the full schema.

A full schema is defined as the following typescript interface. No worries if you are not familiar with typescript, each properties will be explained below.

```ts
interface FullSchema {
  transformType: TransformType;
  exclude?: string[];
  include?: string[];
  nestedObjKey?: {
    [key: string]: FullSchema | TransformType;
  };
  nestedArrayKey?: {
    [key: string]: FullSchema | TransformType;
  };
}
```

#### transformType: TransformType | required

The transformation convention that you want to apply, can be `TransformType.camelCase` or `TransformType.PascalCase`.

#### exclude: string[] | optional

The keys that you want to exclude from the transformation.

Example:

```js
const oriData = {
  Id: 5,
  FullName: 'My Name'
};

const desiredData = {
  Id: 5,
  fullName: 'My Name'
};

const schemaToUse = {
  transformType: TransformType.camelCase,
  exclude: ['Id']
};
```

#### include: string[] | optional

The keys that you want to apply the transformation. `include` will be ignored if `exclude` is provided.

#### nestedObjKey: {[key: string]: Schema} | optional

The keys that has nested data that you wish to apply the transformation.

Example:

```js
const oriData = {
  Id: 5,
  FullName: 'My Name',
  Address: {
    Street: 'Big Street',
    City: 'Kuala Lumpur',
    Country: 'Malaysia'
  }
};

const desiredData = {
  Id: 5,
  fullName: 'My Name',
  address: {
    street: 'Big Street',
    city: 'Kuala Lumpur',
    country: 'Malaysia'
  }
};

const schemaToUse = {
  transformType: TransformType.camelCase,
  exclude: ['Id'],
  nestedObjKey: {
    Address: {
      transformType: TransformType.camelCase
    }
  }
};
```

#### nestedArrayKey: {[key: string]: Schema} | optional

The keys that has nested array data that you wish to apply the transformation.

Example:

```js
const oriData = {
  Id: 5,
  FullName: 'My Name',
  Contacts: [
    {
      Type: 'email',
      Value: 'malcolm.keeweesiong@gmail.com'
    },
    {
      Type: 'phone',
      Value: '0103349585'
    }
  ]
};

const desiredData = {
  Id: 5,
  fullName: 'My Name',
  contacts: [
    {
      type: 'email',
      value: 'malcolm.keeweesiong@gmail.com'
    },
    {
      type: 'phone',
      value: '0103349585'
    }
  ]
};

const schemaToUse = {
  transformType: TransformType.camelCase,
  exclude: ['Id'],
  nestedArrayKey: {
    Contacts: {
      transformType: TransformType.camelCase
    }
  }
};
```

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
