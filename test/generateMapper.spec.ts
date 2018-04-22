import { generateMapper, NameType, TransformSetting, DataType } from "../src";

test("generateMapper is defined", () => {
  expect(generateMapper).toBeDefined();
});

test("default from PascalCase to camelCase", () => {
  const schema = {
    [TransformSetting.Fallback]: {
      rename: NameType.Camelcase
    }
  };

  const data = {
    Id: 5,
    Name: "SimpleObjectMapper",
    KeyWords: "Awesome"
  };

  const mapper = generateMapper(schema);

  expect(mapper(data)).toEqual({
    id: 5,
    name: "SimpleObjectMapper",
    keyWords: "Awesome"
  });
});

test("default from camelCase to PascalCase", () => {
  const schema = {
    [TransformSetting.Fallback]: {
      rename: NameType.Pascalcase
    }
  };

  const data = {
    id: 5,
    name: "SimpleObjectMapper",
    keyWords: "Awesome"
  };

  const mapper = generateMapper(schema);

  expect(mapper(data)).toEqual({
    Id: 5,
    Name: "SimpleObjectMapper",
    KeyWords: "Awesome"
  });
});

test("default from PascalCase to camelCase with override", () => {
  const schema = {
    [TransformSetting.Fallback]: {
      rename: NameType.Camelcase
    },
    Id: {
      rename: NameType.Remain
    }
  };

  const data = {
    Id: 5,
    Name: "SimpleObjectMapper",
    KeyWords: "Awesome"
  };

  const mapper = generateMapper(schema);

  expect(mapper(data)).toEqual({
    Id: 5,
    name: "SimpleObjectMapper",
    keyWords: "Awesome"
  });
});

test("transform nested object", () => {
  const schema = {
    [TransformSetting.Fallback]: {
      rename: NameType.Camelcase
    },
    Id: {
      rename: NameType.Remain
    },
    Details: {
      rename: NameType.Camelcase,
      dataType: DataType.Object,
      schema: {
        [TransformSetting.Fallback]: {
          rename: NameType.Camelcase
        }
      }
    }
  };

  const data = {
    Id: 5,
    Name: "SimpleObjectMapper",
    KeyWords: "Awesome",
    Details: {
      Address: "Malaysia",
      Role: "Developer"
    }
  };

  const mapper = generateMapper(schema);

  expect(mapper(data)).toEqual({
    Id: 5,
    name: "SimpleObjectMapper",
    keyWords: "Awesome",
    details: {
      address: "Malaysia",
      role: "Developer"
    }
  });
});

test("transform array", () => {
  const schema = {
    [TransformSetting.Fallback]: {
      rename: NameType.Camelcase
    },
    Id: {
      rename: NameType.Remain
    },
    KeyWords: {
      rename: NameType.Camelcase,
      dataType: DataType.Array,
      schema: {
        [TransformSetting.Fallback]: {
          rename: NameType.Camelcase
        }
      }
    }
  };

  const data = {
    Id: 5,
    Name: "SimpleObjectMapper",
    KeyWords: [
      { Id: 1, Description: "Awesome" },
      { Id: 2, Description: "object" },
      { Id: 4, Description: "data-mapping" }
    ]
  };

  const mapper = generateMapper(schema);

  expect(mapper(data)).toEqual({
    Id: 5,
    name: "SimpleObjectMapper",
    keyWords: [
      { id: 1, description: "Awesome" },
      { id: 2, description: "object" },
      { id: 4, description: "data-mapping" }
    ]
  });
});
