(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var Grid = function () {
    function Grid(ctx) {
      classCallCheck(this, Grid);

      this.ctx = ctx;
    }

    createClass(Grid, [{
      key: "render",
      value: function render(ctx) {
        ctx.clearRect(0, 0, 640, 480);
      }
    }]);
    return Grid;
  }();

  var SPRITES = {
    player: {
      resting: [0, 360, 16, 16],
      runUp: [0, 378, 16, 16],
      runUpLeft: [0, 378, 16, 16],
      runDown: [0, 432, 16, 16],
      runRight: [18, 18, 16, 16],
      runLeft: [18, 90, 16, 16],
      cheering: [18, 380, 16, 16]
    },
    keeper: {
      resting: [162, 36, 16, 18]
    }
  };

  var Player = function () {
    function Player(ctx) {
      classCallCheck(this, Player);

      this.ctx = ctx;
      this.spriteImg = new Image();
      this.spriteImg.src = "sprites/sens_players.png";
    }

    createClass(Player, [{
      key: "render",
      value: function render(ctx, player) {
        var velocity = player.velocity;


        var sprites = SPRITES[player.sprites];
        var sprite = sprites.resting;

        if (player.hasScored) {
          sprite = sprites.cheering;
        } else if (velocity.y < 0) {
          sprite = sprites.runUp;
        } else if (velocity.y > 0) {
          sprite = sprites.runDown;
        } else if (velocity.x < 0) {
          sprite = sprites.runLeft;
        } else if (velocity.x > 0) {
          sprite = sprites.runRight;
        }

        ctx.drawImage.apply(ctx, [this.spriteImg].concat(toConsumableArray(sprite), [player.pos.x, player.pos.y, player.size * 2, player.size * 2]));

        this.prevState = player;
      }
    }]);
    return Player;
  }();

  var Ball = function () {
    function Ball(ctx) {
      classCallCheck(this, Ball);
      this.size = [16, 16];
      this.color = 'black';

      this.ctx = ctx;
    }

    createClass(Ball, [{
      key: 'render',
      value: function render(ctx, _ref) {
        var ball = _ref.ball;

        var spot = 3;

        for (var i = 1; i < 2; i++) {
          ctx.fillStyle = getColor(i);
          ctx.fillRect(ball.pos.x + i * spot, ball.pos.y, spot, spot);
        }
        for (var _i = 0; _i < 3; _i++) {
          ctx.fillStyle = getColor(_i + 1);
          ctx.fillRect(ball.pos.x + _i * spot, ball.pos.y + spot, spot, spot);
        }
        for (var _i2 = 0; _i2 < 3; _i2++) {
          ctx.fillStyle = getColor(_i2);
          ctx.fillRect(ball.pos.x + _i2 * spot, ball.pos.y + 2 * spot, spot, spot);
        }
        for (var _i3 = 1; _i3 < 2; _i3++) {
          ctx.fillStyle = getColor(_i3 + 1);
          ctx.fillRect(ball.pos.x + _i3 * spot, ball.pos.y + 3 * spot, spot, spot);
        }
      }
    }]);
    return Ball;
  }();

  function getColor(i) {
    return i % 2 === 0 ? 'white' : 'black';
  }

  var Goal = function () {
    function Goal(ctx) {
      classCallCheck(this, Goal);
      this.size = [16, 16];
      this.color = 'black';

      this.ctx = ctx;
    }

    createClass(Goal, [{
      key: 'render',
      value: function render(ctx, _ref) {
        var width = _ref.width;
        var x = _ref.x;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, 0, width, 20);
      }
    }]);
    return Goal;
  }();

  var Vector = function () {
    function Vector(x, y) {
      classCallCheck(this, Vector);

      this.x = x;
      this.y = y;
    }

    createClass(Vector, [{
      key: "add",
      value: function add(_ref) {
        var x = _ref.x;
        var y = _ref.y;

        return new Vector(this.x + x, this.y + y);
      }
    }, {
      key: "reverse",
      value: function reverse() {
        return new Vector(-this.x, -this.y);
      }
    }, {
      key: "multiply",
      value: function multiply(f) {
        return new Vector(f * this.x, f * this.y);
      }
    }, {
      key: "has",
      value: function has() {
        return this.x || this.y;
      }
    }]);
    return Vector;
  }();

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }

  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      object[key] = value;
    }
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return !!value && (type == 'object' || type == 'function');
  }

  var funcTag = '[object Function]';
  var genTag = '[object GeneratorFunction]';
  var objectProto$2 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto$2.toString;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8 which returns 'object' for typed array and weak map constructors,
    // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

  var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  var coreJsData = root['__core-js_shared__'];

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = Function.prototype.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return func + '';
      } catch (e) {}
    }
    return '';
  }

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  var nativeCreate = getNative(Object, 'create');

  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
  }

  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
  }

  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }

  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  var Map = getNative(root, 'Map');

  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map || ListCache)(),
      'string': new Hash()
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }

  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }

  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }

  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || resolver && typeof resolver != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function memoized() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }

  // Assign cache to `_.memoize`.
  memoize.Cache = MapCache;

  var _Symbol = root.Symbol;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
  }

  var symbolTag = '[object Symbol]';

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$1 = objectProto$5.toString;

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString$1.call(value) == symbolTag;
  }

  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined;
  var symbolToString = symbolProto ? symbolProto.toString : undefined;
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  var reLeadingDot = /^\./;
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoize(function (string) {
    string = toString(string);

    var result = [];
    if (reLeadingDot.test(string)) {
      result.push('');
    }
    string.replace(rePropName, function (match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
    });
    return result;
  });

  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }

  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
  }

  function baseSet(object, path, value, customizer) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        nested = object;

    while (nested != null && ++index < length) {
      var key = toKey(path[index]);
      if (isObject(nested)) {
        var newValue = value;
        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = objValue == null ? isIndex(path[index + 1]) ? [] : {} : objValue;
          }
        }
        assignValue(nested, key, newValue);
      }
      nested = nested[key];
    }
    return object;
  }

  function set$1(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  function now() {
    return Date.now();
  }

  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = isFunction(value.valueOf) ? value.valueOf() : value;
      value = isObject(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }

  var FUNC_ERROR_TEXT$2 = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$2);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          result = wait - timeSinceLastCall;

      return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }

    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now());
    }

    function debounced() {
      var time = now(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed `func` invocations and a `flush` method to
   * immediately invoke them. Provide `options` to indicate whether `func`
   * should be invoked on the leading and/or trailing edge of the `wait`
   * timeout. The `func` is invoked with the last arguments provided to the
   * throttled function. Subsequent calls to the throttled function return the
   * result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the throttled function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=true]
   *  Specify invoking on the leading edge of the timeout.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // Avoid excessively updating the position while scrolling.
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
   * jQuery(element).on('click', throttled);
   *
   * // Cancel the trailing throttled invocation.
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    if (isObject(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      'leading': leading,
      'maxWait': wait,
      'trailing': trailing
    });
  }

  function distance(v1, v2) {
    // euclidean distance between two vectors
    var sum = 0;
    sum += Math.pow(v1.x - v2.x, 2);
    sum += Math.pow(v1.y - v2.y, 2);
    return Math.sqrt(sum);
  }

  var _updates;

  var LEFT = 37;
  var UP = 38;
  var RIGHT = 39;
  var DOWN = 40;
  var SPACEBAR = 32;

  // actions
  var MOVE_LEFT = 'MOVE_LEFT';
  var MOVE_RIGHT = 'MOVE_RIGHT';
  var MOVE_UP = 'MOVE_UP';
  var STOP_MOVING = 'STOP_MOVING';
  var MOVE_DOWN = 'MOVE_DOWN';
  var KICK_BALL = 'KICK_BALL';

  // constants
  var SPEED = 3;
  var KICK_VELOCITY = 12;
  var PITCH_SIZE = [640, 480];
  var GOAL_WIDTH = 128;
  var PITCH_COLOR = "rgb(119, 152, 1)";

  var updates = (_updates = {}, defineProperty(_updates, MOVE_UP, function (state) {
    var player = state.player;

    var velocity = new Vector(player.velocity.x, -SPEED);
    return set$1(state, ['player', 'velocity'], velocity);
  }), defineProperty(_updates, MOVE_DOWN, function (state) {
    var player = state.player;

    var velocity = new Vector(player.velocity.x, SPEED);
    return set$1(state, ['player', 'velocity'], velocity);
  }), defineProperty(_updates, MOVE_RIGHT, function (state) {
    var player = state.player;

    var velocity = new Vector(SPEED, player.velocity.y);
    return set$1(state, ['player', 'velocity'], velocity);
  }), defineProperty(_updates, MOVE_LEFT, function (state) {
    var player = state.player;
    var ball = state.ball;

    var velocity = new Vector(-SPEED, player.velocity.y);

    set$1(state, ['player', 'velocity'], velocity);

    if (!player.hasBall) {
      // ball spin 
      var _velocity = ball.velocity;
      // only when the ball is still moving

      if (_velocity.y) {
        _velocity.x = _velocity.x + 0.2 * _velocity.y;
        set$1(state, ['ball', 'velocity'], _velocity);
      }
    }
    return state;
  }), defineProperty(_updates, STOP_MOVING, function (state, direction) {
    switch (direction) {
      case UP:
      case DOWN:
        return set$1(state, ['player', 'velocity'], new Vector(state.player.velocity.x, 0));
      case RIGHT:
      case LEFT:
        return set$1(state, ['player', 'velocity'], new Vector(0, state.player.velocity.y));
    }
    return state;
  }), defineProperty(_updates, KICK_BALL, function (state) {
    var player = state.player;

    if (!player.hasBall) {
      return state;
    }
    player.hasBall = false;
    // base the direction of the ball on the players current velocity
    var factor = [player.velocity.x === 0 ? 0 : player.velocity.x > 1 ? 1 : -1, player.velocity.y === 0 ? 0 : player.velocity.y > 1 ? 1 : -1];
    // kick the ball forwards when standing still
    if (factor[0] === 0 && factor[1] === 0) factor = [0, -1];
    var velocity = new (Function.prototype.bind.apply(Vector, [null].concat(toConsumableArray(factor.map(function (f) {
      return f * KICK_VELOCITY;
    })))))();
    return set$1(state, ['ball', 'velocity'], velocity);
  }), _updates);

  var Game = function () {
    function Game() {
      var _this = this;

      classCallCheck(this, Game);

      this.loop = function () {
        requestAnimationFrame(_this.loop);
        _this.update();
        _this.render();
      };

      // game world state
      this.state = {
        stepSize: 5,
        size: PITCH_SIZE,
        goal: {
          width: GOAL_WIDTH,
          x: Math.floor(PITCH_SIZE[0] / 2 - GOAL_WIDTH / 2)
        },
        player: {
          pos: new Vector(320, 460),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          hasScored: false,
          sprites: 'player'
        },
        team: [{
          pos: new Vector(360, 300),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          sprites: 'player'
        }, {
          pos: new Vector(100, 300),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          sprites: 'player'
        }],
        keeper: {
          pos: new Vector(304, 25),
          velocity: new Vector(0, 0),
          size: 16,
          hasBall: false,
          sprites: 'keeper'
        },
        ball: {
          pos: new Vector(320, 400),
          velocity: new Vector(0, 0),
          spin: new Vector(0, 0),
          acceleration: 0,
          size: 16
        }
      };

      // canvas 2d context
      this.ctx = this.getCanvas();

      this.addToRenderQueue([new Grid(this.ctx), function (state) {
        return state;
      }], [new Goal(this.ctx), function (state) {
        return state.goal;
      }], [new Player(this.ctx), function (state) {
        return state.player;
      }], [new Player(this.ctx), function (state) {
        return state.team[0];
      }], [new Player(this.ctx), function (state) {
        return state.team[1];
      }], [new Player(this.ctx), function (state) {
        return state.keeper;
      }], [new Ball(this.ctx), function (state) {
        return state;
      }]);

      // [new Defender(this.ctx), state => state]
      this.setupControls();

      // throttle flushing updates, prevents spamming events when holding 
      // down a direction key.
      this.flush = throttle(this.flush, 10, { leading: true });
      //  start the main loop
      this.loop();
    }

    createClass(Game, [{
      key: 'addToRenderQueue',
      value: function addToRenderQueue() {
        var _this2 = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.forEach(function (item) {
          _this2.renderQueue = _this2.renderQueue || [];
          _this2.renderQueue.push(item);
        });
      }
    }, {
      key: 'update',
      value: function update() {
        // move objects on the grid
        var _state = this.state;
        var ball = _state.ball;
        var player = _state.player;
        var team = _state.team;
        var keeper = _state.keeper;
        var size = _state.size;
        var goal = _state.goal;


        if (player.hasScored) {
          // console.log('HOORAY');
        }

        if (player.hasBall) {
          ball.pos.x = player.pos.x + Math.floor(ball.size / 2);
          ball.pos.y = player.pos.y - Math.floor(player.size / 2);
        }

        if (player.velocity.has()) {
          player.pos = player.pos.add(player.velocity);
        }
        team.forEach(function (teamMate) {
          if (teamMate.velocity.has()) {
            teamMate.pos = teamMate.pos.add(teamMate.velocity);
          }
        });

        if (ball.velocity.has()) {
          var newPos = ball.pos.add(ball.velocity);
          // damping
          ball.velocity.y = 0.97 * ball.velocity.y;
          if (Math.abs(ball.velocity.y) < 0.1) {
            ball.velocity.y = 0;
          }
          ball.velocity.x = 0.97 * ball.velocity.x;
          if (Math.abs(ball.velocity.x) < 0.1) {
            ball.velocity.x = 0;
          }
          set$1(this.state, 'ball', { pos: newPos, velocity: ball.velocity });
        }

        // move goalie!
        if (player.hasBall) {
          // relative x pos of player (to pitch with)
          var factorPlayerX = player.pos.x / size[0];
          keeper.pos = new Vector(goal.x + factorPlayerX * goal.width - keeper.size, keeper.pos.y);
        }

        // flock teammates, keep distance from player with ball
        var distRangeOffense = [150, 200];
        var distRangeScored = [20, 80];
        team.forEach(function (teamMate) {
          if ((player.hasBall || player.hasScored) && Math.floor(Math.random() * 10) === 0) {

            // distance to ball
            var distRange = player.hasScored ? distRangeScored : distRangeOffense;
            var dist = distance(teamMate.pos, player.pos);

            if (dist >= distRange[0] && dist < distRange[1]) {
              // stop moving
              teamMate.velocity = new Vector(0, 0);
            } else {
              // direction vector
              var dir = new Vector(player.pos.x - teamMate.pos.x, player.pos.y - teamMate.pos.y);
              // normalize!
              var hyp = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
              dir.x /= hyp;
              dir.y /= hyp;
              dir = dir.multiply(SPEED - 1);
              teamMate.velocity = dir;
              if (dist < distRange[0]) {
                teamMate.velocity = dir.reverse();
              }
            }
          }
        });

        this.collisionDetect();
      }
    }, {
      key: 'flush',
      value: function flush(actionType) {
        // flush update
        if (typeof updates[actionType] === 'function') {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          var newState = updates[actionType].apply(updates, [this.state].concat(args));
          this.state = newState;
          // detect collissions
        } else throw Error();
      }
    }, {
      key: 'collisionDetect',
      value: function collisionDetect() {
        var _state2 = this.state;
        var player = _state2.player;
        var ball = _state2.ball;
        var goal = _state2.goal;

        if (player.pos.x < ball.pos.x + ball.size && player.pos.x + player.size > ball.pos.x && player.pos.y + 3 < ball.pos.y + ball.size && player.pos.y + 3 + player.size > ball.pos.y) {
          // collision detected!
          this.state.player.hasBall = true;
        }

        if (ball.pos.x > goal.x && ball.pos.x < goal.x + goal.width && ball.pos.y < 20) {
          this.state.player.hasScored = true;
        }
      }
    }, {
      key: 'setupControls',
      value: function setupControls() {
        var _this3 = this;

        addEventListener('keydown', function (e) {
          var direction = e.keyCode;
          switch (direction) {
            case LEFT:
              _this3.flush(MOVE_LEFT);
              break;
            case UP:
              _this3.flush(MOVE_UP);
              break;
            case RIGHT:
              _this3.flush(MOVE_RIGHT);
              break;
            case DOWN:
              _this3.flush(MOVE_DOWN);
              break;
            case SPACEBAR:
              _this3.flush(KICK_BALL);
              break;
          }
        });
        addEventListener('keyup', function (e) {
          var direction = e.keyCode;
          _this3.flush(STOP_MOVING, direction);
        });
      }
    }, {
      key: 'getCanvas',
      value: function getCanvas() {
        var node = document.createElement('canvas');
        node.width = this.state.size[0];
        node.height = this.state.size[1];
        var root = document.getElementById('game');
        node.style.backgroundColor = PITCH_COLOR;
        root.appendChild(node);
        var ctx = node.getContext('2d');
        // we need the 8bit look, no anti aliasing please! :)
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        return ctx;
      }
    }, {
      key: 'render',
      value: function render() {
        var ctx = this.ctx;
        var state = this.state;

        this.renderQueue.forEach(function (item) {
          var _item = slicedToArray(item, 2);

          var obj = _item[0];
          var lens = _item[1];

          obj.render(ctx, lens(state));
        });
      }
    }]);
    return Game;
  }();

  new Game();

}));
//# sourceMappingURL=sensible.js.map
