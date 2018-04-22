import { DataType, NameType, TransformSetting } from './constants';

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

const getKey = (renameType: NameType, key: string): string => {
  if (renameType === undefined) {
    return key;
  }
  switch (renameType) {
    case NameType.Camelcase:
      return camelize(key);
    case NameType.Pascalcase:
      return pascalize(key);
    case NameType.Remain:
      return key;
    default:
      return key;
  }
};

const getValue = (schema: any, value: any): any => {
  if (schema === undefined || schema.dataType === undefined) {
    return value;
  }

  switch (schema.dataType) {
    case DataType.Object:
      return generateMapper(schema.schema)(value);

    case DataType.Array:
      return value.map(generateMapper(schema.schema));

    default:
      return value;
  }
};

export const generateMapper = (dataSchema: any) => (data: any) =>
  Object.keys(data).reduce((result, key) => {
    const keyTransformType =
      dataSchema[key] !== undefined
        ? dataSchema[key].rename
        : dataSchema[TransformSetting.Fallback] !== undefined
          ? dataSchema[TransformSetting.Fallback].rename
          : undefined;
    const valueTransformType =
      dataSchema[key] !== undefined
        ? dataSchema[key]
        : dataSchema[TransformSetting.Fallback];
    const transformedKey = getKey(keyTransformType, key);
    const transformedValue = getValue(valueTransformType, data[key]);
    return {
      ...result,
      [transformedKey]: transformedValue
    };
  }, {});
