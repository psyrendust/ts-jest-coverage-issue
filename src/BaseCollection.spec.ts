import BaseCollection from './BaseCollection';

describe('BaseCollection', () => {
  let baseCollection;
  const data = [
    {keyA: 'value a'},
    {keyB: 'value b'},
    {keyC: 'value c'},
    {keyD: 'value d'},
  ];
  const keysComplex = [
    'keyA',
    ['keyB', 'keyB2'],
    ['keyC', 'keyC2', 'keyC3'],
    ['keyD', 'keyD2', 'keyD3', 'keyD4'],
  ];
  const keysFlattened = data.map(item => Object.keys(item)[0]);
  const valsFlattened = data.map((item, i) => item[keysFlattened[i]]);
  const keysComplexFlattened = keysComplex.reduce((a: string, b: string) => a.concat(b), []);
  const valsComplexFlattened = [
    'value a',
    'value b',
    'value c',
    'value d',
  ];

  beforeAll(() => {
    baseCollection = new BaseCollection();
  });

  afterAll(() => {
    baseCollection = null;
  });

  describe('default values', () => {
    test('should have default size of 0', () => {
      expect(baseCollection.size).toBe(0);
    });
    test('should return undefined for a key not in the collection when calling get(\'foo\')', () => {
      expect(baseCollection.get('foo')).toBe(undefined);
    });
    test('should return false for a key not in the collection when calling has(\'foo\')', () => {
      expect(baseCollection.has('foo')).toBe(false);
    });
    test('should return empty array when calling values()', () => {
      expect(baseCollection.values()).toHaveLength(0);
    });
    test('should return empty array when calling keys()', () => {
      expect(baseCollection.keys()).toHaveLength(0);
    });
  });

  describe('api', () => {
    test('should have a method clear', () => {
      expect(baseCollection.clear).toBeDefined();
      // expect(baseCollection).to.respondTo('clear');
    });
    test('should have a method clone', () => {
      expect(baseCollection.clone).toBeDefined();
      // expect(baseCollection).to.respondTo('clone');
    });
    test('should have a method copy', () => {
      expect(baseCollection.copy).toBeDefined();
      // expect(baseCollection).to.respondTo('copy');
    });
    test('should have a method every', () => {
      expect(baseCollection.forEach).toBeDefined();
      // expect(baseCollection).to.respondTo('forEach');
    });
    test('should have a method forEach', () => {
      expect(baseCollection.forEach).toBeDefined();
      // expect(baseCollection).to.respondTo('forEach');
    });
    test('should have a method get', () => {
      expect(baseCollection.get).toBeDefined();
      // expect(baseCollection).to.respondTo('get');
    });
    test('should have a method has', () => {
      expect(baseCollection.has).toBeDefined();
      // expect(baseCollection).to.respondTo('has');
    });
    test('should have a method keys', () => {
      expect(baseCollection.keys).toBeDefined();
      // expect(baseCollection).to.respondTo('keys');
    });
    test('should have a method map', () => {
      expect(baseCollection.map).toBeDefined();
      // expect(baseCollection).to.respondTo('map');
    });
    test('should have a method set', () => {
      expect(baseCollection.set).toBeDefined();
      // expect(baseCollection).to.respondTo('set');
    });
    test('should have a method values', () => {
      expect(baseCollection.values).toBeDefined();
      // expect(baseCollection).to.respondTo('values');
    });
    // TODO: Fix this test after merge, because BaseCollection.destroy is misspelled
    test('should have a method destroy', () => {
      expect(baseCollection.destroy).toBeDefined();
      // expect(baseCollection).to.respondTo('destroy');
    });
  });

  describe('usage with simple data', () => {
    beforeEach(() => {
      baseCollection = new BaseCollection();
      data.forEach((item, i) => {
        const key = Object.keys(item)[0];
        baseCollection.set(key, item[key]);
      });
    });
    afterEach(() => {
      baseCollection = null;
    });
    test('should return an array when calling values()', () => {
      expect(baseCollection.values()).toBeInstanceOf(Array);
    });
    test('should return an array when calling keys()', () => {
      expect(baseCollection.keys()).toBeInstanceOf(Array);
    });
    test('should return the correct size', () => {
      expect(baseCollection.size).toBe(data.length);
    });
    test('should return all keys when calling keys()', () => {
      expect(baseCollection.keys()).toEqual(keysFlattened);
    });
    test('should return all values when calling values()', () => {
      expect(baseCollection.values()).toEqual(valsFlattened);
    });
    test('should not return the same value when calling set() for keys from different set() calls', () => {
      expect(baseCollection.get('keyC')).not.toEqual(baseCollection.get('keyB'));
    });
    test('should return true for a key that exists when calling has()', () => {
      expect(baseCollection.has('keyC')).toBe(true);
    });
    test('should return false for a key that exists when calling has()', () => {
      expect(baseCollection.has('keyX')).toBeFalsy();
    });
    test('should iterate over all values using every()', () => {
      const values = [];
      const isInCollection = baseCollection.every((val) => {
        values.push(val);
        return true;
      });
      expect(baseCollection.values()).toEqual(values);
      expect(isInCollection).toBe(true);
      expect(values).toHaveLength(data.length);
    });
    test('should iterate over all values using forEach()', () => {
      const values = [];
      baseCollection.forEach((val) => {
        values.push(val);
      });
      expect(baseCollection.values()).toEqual(values);
      expect(values).toHaveLength(data.length);
    });
    test('should iterate over all values using map()', () => {
      const values = baseCollection.map((val) => {
        return val;
      });
      expect(baseCollection.values()).toEqual(values);
      expect(values).toHaveLength(data.length);
    });
    test('should not iterate over all values using every()', () => {
      const values = [];
      const isInCollection = baseCollection.every((val) => {
        if (val === 'value c') return false;
        values.push(val);
        return true;
      });
      expect(baseCollection.values()).not.toEqual(values);
      expect(isInCollection).toBeFalsy();
      expect(values).not.toHaveLength(data.length);
    });
    test('should properly destroy the BaseCollection instance', () => {
      baseCollection.destroy();
      expect(baseCollection._data).toBe(null);
      expect(baseCollection._hash).toBe(null);
    });
  });

  describe('usage with complex data', () => {
    beforeEach(() => {
      baseCollection = new BaseCollection();
      keysComplex.forEach((keys, i) => {
        baseCollection.set(keys, valsComplexFlattened[i]);
      });
    });
    afterEach(() => {
      baseCollection = null;
    });
    test('should return an array when calling values()', () => {
      expect(baseCollection.values()).toBeInstanceOf(Array);
    });
    test('should return an array when calling keys()', () => {
      expect(baseCollection.keys()).toBeInstanceOf(Array);
    });
    test('should return the correct size', () => {
      expect(baseCollection.size).toBe(data.length);
    });
    test('should return all keys when calling keys()', () => {
      expect(baseCollection.keys()).toEqual(keysComplexFlattened);
    });
    test('should return all values when calling values()', () => {
      expect(baseCollection.values()).toEqual(valsComplexFlattened);
    });
    test('should return the same value when calling set() with an array for a key', () => {
      expect(baseCollection.get('keyC')).toBe(baseCollection.get('keyC3'));
    });
    test('should not return the same value when calling set() for keys from different set() calls', () => {
      expect(baseCollection.get('keyC')).not.toEqual(baseCollection.get('keyB'));
    });
    test('should return true for a key that exists when calling has()', () => {
      expect(baseCollection.has('keyC2')).toBe(true);
    });
    test('should return false for a key that exists when calling has()', () => {
      expect(baseCollection.has('keyX')).toBeFalsy();
    });
    test('should return true when passing an array of keys with only 1 valid key when calling has()', () => {
      expect(baseCollection.has(['a', 'b', 'keyC', 'd'])).toBe(true);
    });
    test('should return false when passing an array of keys with no valid key when calling has()', () => {
      expect(baseCollection.has(['a', 'b', 'c', 'd'])).toBeFalsy();
    });
    test('should iterate over all values using every()', () => {
      const values = [];
      const isInCollection = baseCollection.every((val) => {
        values.push(val);
        return true;
      });
      expect(baseCollection.values()).toEqual(values);
      expect(isInCollection).toBe(true);
      expect(values).toHaveLength(data.length);
    });
    test('should iterate over all values using forEach()', () => {
      const values = [];
      baseCollection.forEach((val) => {
        values.push(val);
      });
      expect(baseCollection.values()).toEqual(values);
      expect(values).toHaveLength(data.length);
    });
    test('should iterate over all values using map()', () => {
      const values = baseCollection.map((val) => {
        return val;
      });
      expect(baseCollection.values()).toEqual(values);
      expect(values).toHaveLength(data.length);
    });
    test('should not iterate over all values using every()', () => {
      const values = [];
      const isInCollection = baseCollection.every((val) => {
        if (val === 'value c') return false;
        values.push(val);
        return true;
      });
      expect(baseCollection.values()).not.toEqual(values);
      expect(isInCollection).toBeFalsy();
      expect(values).not.toHaveLength(data.length);
    });
    test('should properly destroy the BaseCollection instance', () => {
      baseCollection.destroy();
      expect(baseCollection._data).toBe(null);
      expect(baseCollection._hash).toBe(null);
    });
  });
});
