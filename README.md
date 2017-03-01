When using [jest](https://facebook.github.io/jest/) and [ts-jest](https://github.com/kulshekhar/ts-jest) to test
my TypeScript repo I'm running across issues where the coverage report that is printed to console shows incorrect
data and line numbers.

`BaseCollection.ts` should have `100%` test coverage, while `perfNow.ts` should have `0%` (no tests written).

### Example output

```sh
yarn test v0.21.3
$ jest
 PASS  src/BaseCollection.spec.ts
  BaseCollection
    default values
      ✓ should have default size of 0 (2ms)
      ✓ should return undefined for a key not in the collection when calling get('foo')
      ✓ should return false for a key not in the collection when calling has('foo') (1ms)
      ✓ should return empty array when calling values()
      ✓ should return empty array when calling keys()
    api
      ✓ should have a method clear
      ✓ should have a method clone
      ✓ should have a method copy (1ms)
      ✓ should have a method every
      ✓ should have a method forEach
      ✓ should have a method get
      ✓ should have a method has
      ✓ should have a method keys
      ✓ should have a method map
      ✓ should have a method set
      ✓ should have a method values
      ✓ should have a method destroy
    usage with simple data
      ✓ should return an array when calling values() (4ms)
      ✓ should return an array when calling keys()
      ✓ should return the correct size
      ✓ should return all keys when calling keys() (1ms)
      ✓ should return all values when calling values() (1ms)
      ✓ should not return the same value when calling set() for keys from different set() calls
      ✓ should return true for a key that exists when calling has()
      ✓ should return false for a key that exists when calling has() (1ms)
      ✓ should iterate over all values using every()
      ✓ should iterate over all values using forEach()
      ✓ should iterate over all values using map() (1ms)
      ✓ should not iterate over all values using every()
      ✓ should properly destroy the BaseCollection instance
    usage with complex data
      ✓ should return an array when calling values()
      ✓ should return an array when calling keys()
      ✓ should return the correct size
      ✓ should return all keys when calling keys()
      ✓ should return all values when calling values() (1ms)
      ✓ should return the same value when calling set() with an array for a key
      ✓ should not return the same value when calling set() for keys from different set() calls (1ms)
      ✓ should return true for a key that exists when calling has()
      ✓ should return false for a key that exists when calling has() (1ms)
      ✓ should return true when passing an array of keys with only 1 valid key when calling has()
      ✓ should return false when passing an array of keys with no valid key when calling has() (1ms)
      ✓ should iterate over all values using every()
      ✓ should iterate over all values using forEach() (1ms)
      ✓ should iterate over all values using map()
      ✓ should not iterate over all values using every()
      ✓ should properly destroy the BaseCollection instance

-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------------|----------|----------|----------|----------|----------------|
All files          |    84.85 |    88.89 |    69.57 |    84.54 |                |
 BaseCollection.ts |    84.27 |    92.86 |    66.67 |    84.09 |... 47,48,49,76 |
 perfNow.ts        |       90 |       75 |      100 |    88.89 |              5 |
-------------------|----------|----------|----------|----------|----------------|
Test Suites: 1 passed, 1 total
Tests:       46 passed, 46 total
Snapshots:   0 total
Time:        1.661s
Ran all test suites.
✨  Done in 2.54s.
```

### Relevant Issue Links

- https://github.com/kulshekhar/ts-jest/issues/97
- https://github.com/kulshekhar/ts-jest/issues/42#issuecomment-256792842
- https://github.com/facebook/jest/issues/1907#issuecomment-254032111
- https://github.com/kulshekhar/ts-jest/issues/61
- https://github.com/kulshekhar/ts-jest/issues/42#issuecomment-256792842
