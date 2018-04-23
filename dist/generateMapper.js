"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var normalizeSchema = function (raw) {
    return typeof raw === 'string'
        ? {
            transformType: raw
        }
        : raw;
};
function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) { return (index === 0 ? letter.toLowerCase() : letter.toUpperCase()); })
        .replace(/\s+/g, '');
}
function pascalize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter) { return letter.toUpperCase(); })
        .replace(/\s+/g, '');
}
var getKey = function (transformType, key) {
    if (transformType === undefined) {
        return key;
    }
    switch (transformType) {
        case "transformType/camelCase" /* camelcase */:
            return camelize(key);
        case "transformType/pascalCase" /* Pascalcase */:
            return pascalize(key);
        default:
            return key;
    }
};
var getValueForObject = function (object, schema) {
    return exports.generateMapper(schema)(object);
};
var getValueForArray = function (collections, schema) {
    return collections.map(exports.generateMapper(schema));
};
exports.generateMapper = function (dataSchema) { return function (data) {
    var _a = normalizeSchema(dataSchema), transformType = _a.transformType, exclude = _a.exclude, include = _a.include, nestedArrayKey = _a.nestedArrayKey, nestedObjKey = _a.nestedObjKey;
    var keys = Object.keys(data);
    var keysToTransform = exclude !== undefined
        ? keys.filter(function (key) { return exclude.indexOf(key) === -1; })
        : include !== undefined
            ? keys.filter(function (key) { return include.indexOf(key) !== -1; })
            : keys;
    return keys.reduce(function (result, key) {
        var transformedKey = keysToTransform.indexOf(key) !== -1 ? getKey(transformType, key) : key;
        var transformedValue = keysToTransform.indexOf(key) === -1
            ? data[key]
            : nestedArrayKey !== undefined && nestedArrayKey[key] !== undefined
                ? getValueForArray(data[key], normalizeSchema(nestedArrayKey[key]))
                : nestedObjKey !== undefined && nestedObjKey[key] !== undefined
                    ? getValueForObject(data[key], normalizeSchema(nestedObjKey[key]))
                    : data[key];
        return __assign({}, result, (_a = {}, _a[transformedKey] = transformedValue, _a));
        var _a;
    }, {});
}; };
//# sourceMappingURL=generateMapper.js.map