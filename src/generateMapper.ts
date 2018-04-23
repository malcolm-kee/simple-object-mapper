import { TransformType } from './constants';

export interface FullSchema {
  transformType: TransformType;
  exclude?: string[];
  include?: string[];
  nestedObjKey?: {
    [key: string]: DataSchema;
  };
  nestedArrayKey?: {
    [key: string]: DataSchema;
  };
}

export type DataSchema = TransformType | FullSchema;

const normalizeSchema = (raw: DataSchema): FullSchema =>
  typeof raw === 'string'
    ? {
        transformType: raw
      }
    : raw;

function camelize(str: string) {
  return str
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    )
    .replace(/\s+/g, '');
}

function pascalize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
    .replace(/\s+/g, '');
}

const getKey = (transformType: TransformType, key: string): string => {
  if (transformType === undefined) {
    return key;
  }
  switch (transformType) {
    case TransformType.camelcase:
      return camelize(key);
    case TransformType.Pascalcase:
      return pascalize(key);
    default:
      return key;
  }
};

const getValueForObject = (object: any, schema: FullSchema): any =>
  generateMapper(schema)(object);

const getValueForArray = (collections: any[], schema: FullSchema): any =>
  collections.map(generateMapper(schema));

export const generateMapper = (dataSchema: DataSchema) => (data: any) => {
  const {
    transformType,
    exclude,
    include,
    nestedArrayKey,
    nestedObjKey
  } = normalizeSchema(dataSchema);
  const keys = Object.keys(data);
  const keysToTransform =
    exclude !== undefined
      ? keys.filter(key => exclude.indexOf(key) === -1)
      : include !== undefined
        ? keys.filter(key => include.indexOf(key) !== -1)
        : keys;
  return keys.reduce((result, key) => {
    const transformedKey =
      keysToTransform.indexOf(key) !== -1 ? getKey(transformType, key) : key;
    const transformedValue =
      keysToTransform.indexOf(key) === -1
        ? data[key]
        : nestedArrayKey !== undefined && nestedArrayKey[key] !== undefined
          ? getValueForArray(data[key], normalizeSchema(nestedArrayKey[key]))
          : nestedObjKey !== undefined && nestedObjKey[key] !== undefined
            ? getValueForObject(data[key], normalizeSchema(nestedObjKey[key]))
            : data[key];

    return {
      ...result,
      [transformedKey]: transformedValue
    };
  }, {});
};
