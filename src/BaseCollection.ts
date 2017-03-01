'use strict';
import perfNow from './perfNow';

/**
 * A collection of key value pairs that holds a similar api to a Map, which is primarily used for
 * memoization and quick lookup of data. The key difference between a {@link BaseCollection} and a
 * Map is that a {@link BaseCollection} can have a many to one relationship between keys and values.
 * Meaning that you can store multiple keys which reference a single value.
 *
 * @example
 * const collection = new BaseCollection();
 * collection.set(['a', 'b', 'c'], 'abc');
 * collection.get('a'); // => 'abc'
 * collection.get('b'); // => 'abc'
 * collection.get('c'); // => 'abc'
 */
export default class BaseCollection {
  /**
   * The default value to be returned by {@link BaseCollection#get}.
   * @type  {any|undefined}
   * @private
   */
  private __defaultValue: any;

  /**
   * An {@link Array} that stores the values associated with the keys.
   * @type  {Array<any>}
   */
  private _data: Array<any>;

  /**
   * An {@link Object} used to store the keys.
   * @type  {any}
   */
  private _hash: any;

  /**
   * Stores the current timestamp of when the {@link BaseCollection} was instantiated or last
   * cleared.
   * @type  {number}
   */
  private _timestamp: number;

  /**
   * Creates a new {@link BaseCollection} object.
   * @param  {any|undefined}  [defaultValue=undefined]  Set the default value that is returned by
   * {@link BaseCollection#get}.
   */
  constructor();
  constructor(defaultValue);
  constructor(defaultValue?: undefined) {
    this.__defaultValue = defaultValue || undefined;
    this.clear();
  }

  /**
   * Returns the number of key/value pairs in the {@link BaseCollection} object.
   * This is an alias for {@link BaseCollection#size}.
   * @return  {number}  The number of elements in a {@link BaseCollection} object.
   */
  get length() {
    return this.size;
  }

  /**
   * Returns the number of key/value pairs in the {@link BaseCollection} object.
   * @return  {number}  The number of elements in a {@link BaseCollection} object.
   */
  get size() {
    return this._data.length;
  }

  /**
   * Returns the timestamp of when this {@link BaseCollection} instance was last cleared or
   * initialized.
   * @return  {number}  The timestamp of when this {@link BaseCollection} instance was last cleared
   *   or initialized.
   */
  get timestamp() {
    return this._timestamp;
  }

  /**
   * Removes all key/value pairs from the {@link BaseCollection} object.
   */
  clear() {
    this._data = [];
    this._hash = {};
    this._timestamp = perfNow();
  }

  /**
   * Creates a clone of this {@link BaseCollection}.
   * @return  {BaseCollection}  A copy of the {@link BaseCollection}.
   */
  clone() {
    const baseCollection = new BaseCollection();
    this._data.forEach((data, i) => {
      baseCollection._data[i] = data;
    });
    Object.keys(this._hash).forEach((key) => {
      baseCollection._hash[key] = this._hash[key];
    });
    return baseCollection;
  }

  /**
   * Replaces the values contained in this {@link BaseCollection} instance with the values of the
   * given {@link BaseCollection} instance.
   * @param  {BaseCollection}  baseCollection  The {@link BaseCollection} being copied.
   */
  copy(baseCollection) {
    this.clear();
    baseCollection.forEach((value, key) => {
      this.set(key, value);
    });
  }

  /**
   * Executes the provided `callback` function once for each element present in the
   * {@link BaseCollection}, in insertion order, until it finds one where `callback` returns a
   * `falsy` value (a value that becomes false when converted to a {@link Boolean}). If such an
   * element is found, the `every` method immediately returns `false`. Otherwise , if `callback`
   * returned a `true` value for all elements, 'every' will return `true`. If a `scope` parameter
   * is provided to `every()`, it will be passed to `callback` when invoked, for use as its `this`
   * value.
   *
   * The `callback` {@link Function} is invoked with three arguments:
   * - `currentValue`: The current element being processed in the {@link BaseCollection}.
   * - `index`: The index of the current element being processed in the {@link BaseCollection}.
   * - `collection`: The {@link BaseCollection} that `every()` is being applied to.
   *
   * @param  {function(currentValue:*, index:Number, collection:BaseCollection)}  callback  Function
   *   to execute for each element, taking three arguments.
   * @param  {*}  [scope]   Value to use as `this` when executing `callback`.
   * @return  {Boolean}   Returns `true` if the `callback` function returns a `truthy` value for
   *   every {@link BaseCollection} element; otherwise, `false`.
   */
  every(callback, scope) {
    const len = this.size;
    let i = 0;
    while (i < len) {
      const retVal = callback.call(scope, this._data[i], i, this._data);
      if (!retVal) {
        return false;
      }
      i += 1;
    }
    return true;
  }

  /**
   * Executes `callback` once for each element present in the {@link BaseCollection} object, in
   * insertion order. If a `scope` parameter is provided to `forEach()`, it will be passed to
   * `callback` when invoked, for use as its `this` value.
   *
   * The `callback` {@link Function} is invoked with three arguments:
   * - `currentValue`: The current element being processed in the {@link BaseCollection}.
   * - `index`: The index of the current element being processed in the {@link BaseCollection}.
   * - `collection`: The {@link BaseCollection} that `every()` is being applied to.
   *
   * @param  {function(currentValue:*, index:Number, collection:BaseCollection)}  callback  Function
   *   to execute for each element, taking three arguments.
   * @param  {*}  [scope]   Value to use as `this` when executing `callback`.
   */
  forEach(callback, scope) {
    const len = this.size;
    let i = 0;
    while (i < len) {
      callback.call(scope, this._data[i], i, this._data);
      i += 1;
    }
  }

  /**
   * Returns the `value` associated to the `key`, or `undefined` or the `defaultValue` if there is
   * none.
   * @param  {String|Number|Array<String|Number>}  key  The key of the element to return from the
   *   {@link BaseCollection} object. If an {@link Array} is passed, the value for the first valid
   *   key that is found will be returned.
   * @return  {*}  Returns the element associated with the specified `key`, or `undefined` or the
   *   `defaultValue` if the `key` can't be found in the {@link BaseCollection} object.
   */
  get(key) {
    let keys = [];
    let val;
    if (Array.isArray(key)) {
      keys = [...key];
    } else {
      keys = [key];
    }
    while (keys.length) {
      val = this._data[this._hash[keys.pop()]];
      if (val) return val;
    }
    return this.__defaultValue;
  }

  /**
   * Returns a {@link Boolean} asserting whether a `value` has been associated to the `key` in the
   * {@link BaseCollection} object or not.
   * @param  {String|Number|Array<String|Number>}  key  The `key` of the element to test for
   *   presence in the {@link BaseCollection} object. If an {@link Array} is passed, `true` will be
   *   returned for the first valid key that is found; otherwise `false`.
   * @return  {Boolean}  Returns `true` if an element with the specified `key` exists in the
   *   {@link BaseCollection} object; otherwise `false`.
   */
  has(key) {
    let keys = [];
    if (Array.isArray(key)) {
      keys = [...key];
    } else {
      keys = [key];
    }
    while (keys.length) {
      if (keys.pop() in this._hash) return true;
    }
    return false;
  }

  /**
   * Returns a new Iterator object that contains the `keys` for each element in the
   * {@link BaseCollection} object in insertion order.
   * @return  {array}  Returns a new Iterator object that contains the `keys` for each element in
   *   the {@link BaseCollection} object in insertion order.
   */
  keys() {
    return Object.keys(this._hash);
  }

  /**
   * Executes `callback` once for each element present in the {@link BaseCollection} object, in
   * insertion order, and constructs a new {@link Array} from the results. If a `scope` parameter is
   * provided to `map()`, it will be passed to `callback` when invoked, for use as its `this` value.
   *
   * The `callback` {@link Function} is invoked with three arguments:
   * - `currentValue`: The current element being processed in the {@link BaseCollection}.
   * - `index`: The index of the current element being processed in the {@link BaseCollection}.
   * - `collection`: The {@link BaseCollection} that `every()` is being applied to.
   *
   * @param  {function(currentValue:*, index:Number, collection:BaseCollection)}  callback  Function
   *   to execute for each element, taking three arguments.
   * @param  {*}  [scope]  Value to use as `this` when executing `callback`.
   * @return  {array}  A new {@link Array} from the results.
   */
  map(callback, scope) {
    const len = this.size;
    const results = [];
    let i = 0;
    while (i < len) {
      results[i] = callback.call(scope, this._data[i], i, this._data);
      i += 1;
    }
    return results;
  }

  /**
   * Sets the value for the key in the {@link BaseCollection} object.
   * @param  {String|Number|Array<String|Number>}  key  The `key` of the element to add to the
   *   {@link BaseCollection} object. If the key is an {@link Array} a `key` will be set for each
   *   element in that array that points to the `value`.
   * @param  {*}  value  The `value` of the element to add to the {@link BaseCollection} object.
   */
  set(key, value) {
    this._data.push(value);
    const index = this._data.length - 1;
    if (Array.isArray(key)) {
      key.forEach((k) => {
        this._hash[k] = index;
      });
    } else {
      this._hash[key] = index;
    }
  }

  /**
   * Returns a new {@link Array} that contains the values for each element in the
   * {@link BaseCollection} object in insertion order.
   * @return  {array}  Returns a new {@link Array} that contains the values for each element in the
   *   {@link BaseCollection} object in insertion order.
   */
  values() {
    return [...this._data];
  }

  /**
   * Destroy this {@link BaseCollection} instance.
   */
  destroy() {
    this._data = null;
    this._hash = null;
  }
}
