# arr-sort [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tywei90/arr-sort/blob/master/LICENSE) [![NPM version](https://img.shields.io/npm/v/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![NPM monthly downloads](https://img.shields.io/npm/dm/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![NPM total downloads](https://img.shields.io/npm/dt/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![Windows Build Status](https://travis-ci.org/tywei90/arr-sort.svg?branch=master)](https://travis-ci.org/tywei90/arr-sort)

### [中文](./README.ch.md)

> Sort an object array by one or more properties even nested properties. Besides, you can determine the direction even supply a comparison function in each property sorting.

## Update

1.2.0 Version can provide much better performance at nearly 100x! Via code optimization and algorithm optimization. Such as when the length of input array  is 2000, the array sorting time, 1.1.0 Version use probably in 10s, 1.2.0 Version just use in 100ms.


## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save arr-sort
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add arr-sort
```

## Usage

Sort an array by the given object property:

```js
var arrSort = require('arr-sort');

var arr = [{foo: 'y'}, {foo: 'z'}, {foo: 'x'}];
arrSort(arr, [{attr:'foo'}]);
//=> [{foo: 'x'}, {foo: 'y'}, {foo: 'z'}]
```

**Reverse order**

```js
var arr = [{foo: 'y'}, {foo: 'z'}, {foo: 'x'}];
arrSort(arr, [{attr:'foo', asc: false}]);
//=> [{foo: 'z'}, {foo: 'y'}, {foo: 'x'}]
```

## Params

```js
arrSort(array, comparisonArgs);
```

* `array`: **{ Object Array }** The object array to sort
* `comparisonArgs`: **{ Object Array }** One or more objects to sort by. The element structure is like this: **{ 'attr': `attr`, 'asc': `asc` }**
    * `attr`: **{ String }** the attribute of the object
    * `asc`: **{ Boolean | Function }** point the direaction of sorting.
        * `true`: sort by ascending direction (default)
        * `false`: sort by descending direction
        * `function`: sort by a comparable function

## Note
* If `attr` is not found in object, this sorting round would be skip.
* The value of `attr` can be a string or a number. 
    * If string, we use `localeCompare` to sort by. 
    * If number, we just compare the amount of the number.
* The comparison function must follow the [sort function specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), if it is equal, it must return 0, otherwise the subsequent sorting will not participate! If there is not a return value of `function`, this sorting round would be skip.

## Examples

**1. Sort by multiple properties**

```js
var arrSort = require('arr-sort');

var array = [
  { foo: 'bbb', num: 4,  flag: 2 },
  { foo: 'aaa', num: 3,  flag: 1 },
  { foo: 'ccc', num: -6, flag: 2 },
  { foo: 'ccc', num: 8,  flag: 2 },
  { foo: 'bbb', num: 2,  flag: 4 },
  { foo: 'aaa', num: -3, flag: 4 }
];

// sort by `flag`, then `foo`, then `num`
var result = arrSort(array,
    [{
        attr: 'flag',
        asc: true
    },
    {
        attr: 'foo',
        asc: false
    },
    {
        attr: 'num',
        asc: true
    }]
);

console.log(result);
// [ { foo: 'aaa', num: 3,  flag: 1},
//   { foo: 'ccc', num: -6, flag: 2},
//   { foo: 'ccc', num: 8,  flag: 2},
//   { foo: 'bbb', num: 4,  flag: 2},
//   { foo: 'bbb', num: 2,  flag: 4},
//   { foo: 'aaa', num: -3, flag: 4} ]
```

**2. Sort by nested properties**

```js
var arrSort = require('arr-sort');

var array = [
  { locals: { foo: 'bbb', num: 4 },  flag: 2},
  { locals: { foo: 'aaa', num: 3 },  flag: 1},
  { locals: { foo: 'ccc', num: -6 }, flag: 2},
  { locals: { foo: 'ccc', num: 8 },  flag: 2},
  { locals: { foo: 'bbb', num: 2 },  flag: 4},
  { locals: { foo: 'aaa', num: -3 }, flag: 4},
];

// sort by `flag`, then `locals.foo`, then `locals.num`
var result = arrSort(array,
    [{
        attr: 'flag',
        asc: true
    },
    {
        attr: 'locals.foo',
        asc: false
    },
    {
        attr: 'locals.num',
        asc: true
    }]
);

console.log(result);
// [ { locals: { foo: 'aaa', num: 3 },  flag: 1},
//   { locals: { foo: 'ccc', num: -6 }, flag: 2},
//   { locals: { foo: 'ccc', num: 8 },  flag: 2},
//   { locals: { foo: 'bbb', num: 4 },  flag: 2},
//   { locals: { foo: 'bbb', num: 2 },  flag: 4},
//   { locals: { foo: 'aaa', num: -3 }, flag: 4} ]
```

**3. Sort by custom function**

If custom functions are supplied, array elements are sorted according to the return value of the compare function. See the [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for more details.

```js
var arrSort = require('arr-sort');

var array = [
  { locals: { foo: 'bbb', num: 4 },  flag: -2},
  { locals: { foo: 'aaa', num: 3 },  flag: 1},
  { locals: { foo: 'ccc', num: -6 }, flag: 2},
  { locals: { foo: 'ccc', num: 8 },  flag: 2},
  { locals: { foo: 'bbb', num: 2 },  flag: 4},
  { locals: { foo: 'aaa', num: -3 }, flag: 4},
];

// sort by `flag`, then `locals.foo`, then `locals.num`
var result = arrSort(array,
    [{
        attr: 'flag',
        asc: function(a,b){return (Math.abs(a) - Math.abs(b))}
    },
    {
        attr: 'locals.foo',
        asc: false
    },
    {
        attr: 'locals.num',
        asc: true
    }]
);

console.log(result);
// [ { locals: { foo: 'aaa', num: 3 },  flag: 1},
//   { locals: { foo: 'ccc', num: -6 }, flag: 2},
//   { locals: { foo: 'ccc', num: 8 },  flag: 2},
//   { locals: { foo: 'bbb', num: 4 },  flag: -2},
//   { locals: { foo: 'bbb', num: 2 },  flag: 4},
//   { locals: { foo: 'aaa', num: -3 }, flag: 4} ]
```

## About

### Related projects

* [arr-del](https://www.npmjs.com/package/arr-del): Delete array elements in one time by array consists of their indexes. | [homepage](https://github.com/tywei90/arr-del "Delete array elements in one time by array consists of their indexes.")

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**tywei90**

* [github/tywei90](https://github.com/tywei90)
* [blog/tywei90](https://www.wty90.com)

### License

Copyright © 2018, [tywei90](https://github.com/tywei90).
Released under the [MIT License](LICENSE).
