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
var getKey = function (renameType, key) {
    if (renameType === undefined) {
        return key;
    }
    switch (renameType) {
        case "transformType/camelCase" /* Camelcase */:
            return camelize(key);
        case "transformType/pascalCase" /* Pascalcase */:
            return pascalize(key);
        case "transformType/remain" /* Remain */:
            return key;
        default:
            return key;
    }
};
var getValue = function (schema, value) {
    if (schema === undefined || schema.dataType === undefined) {
        return value;
    }
    switch (schema.dataType) {
        case "transformDataType/object" /* Object */:
            return exports.generateMapper(schema.schema)(value);
        case "transformDataType/array" /* Array */:
            return value.map(exports.generateMapper(schema.schema));
        default:
            return value;
    }
};
exports.generateMapper = function (dataSchema) { return function (data) {
    return Object.keys(data).reduce(function (result, key) {
        var keyTransformType = dataSchema[key] !== undefined
            ? dataSchema[key].rename
            : dataSchema["transformSetting/fallback" /* Fallback */] !== undefined
                ? dataSchema["transformSetting/fallback" /* Fallback */].rename
                : undefined;
        var valueTransformType = dataSchema[key] !== undefined
            ? dataSchema[key]
            : dataSchema["transformSetting/fallback" /* Fallback */];
        var transformedKey = getKey(keyTransformType, key);
        var transformedValue = getValue(valueTransformType, data[key]);
        return __assign({}, result, (_a = {}, _a[transformedKey] = transformedValue, _a));
        var _a;
    }, {});
}; };
//# sourceMappingURL=generateMapper.js.map