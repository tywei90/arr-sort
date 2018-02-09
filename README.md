# arr-sort [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tywei90/arr-sort/blob/master/LICENSE) [![NPM version](https://img.shields.io/npm/v/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort)

> Sort an object array by one or more properties even nested properties. Besides, you can determine the direction even supply a comparison function in each property sorting.

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

arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo'}]);
//=> [{foo: 'x'}, {foo: 'y'}, {foo: 'z'}]
```

**Reverse order**

```js
arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo', asc: false}]);
//=> [{foo: 'z'}, {foo: 'y'}, {foo: 'x'}]
```

## Params

```js
arrSort(array, comparisonArgs);
```

* `array`: **{Array}** The array to sort
* `comparisonArgs`: **{Object Array}**: One or more objects to use for sorting.

## Examples

**[Sort by multiple properties](examples/multiple-props.js)**

```js
var arrSort = require('arr-sort');

var posts = [
  { locals: { foo: 'bbb', num: 4 }, flag: 2},
  { locals: { foo: 'aaa', num: 3 }, flag: 1},
  { locals: { foo: 'ccc', num: -6 }, flag: 2},
  { locals: { foo: 'ccc', num: 8 }, flag: 2},
  { locals: { foo: 'bbb', num: 2 }, flag: 4},
  { locals: { foo: 'aaa', num: -3 }, flag: 4},
];

// sort by `flag`, then `locals.foo`, then `locals.num`
var result = arrSort(posts,
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
// [ { locals: { foo: 'aaa', num: 3 }, flag: 1},
//   { locals: { foo: 'ccc', num: -6 }, flag: 2},
//   { locals: { foo: 'ccc', num: 8 }, flag: 2},
//   { locals: { foo: 'bbb', num: 4 }, flag: 2},
//   { locals: { foo: 'bbb', num: 2 }, flag: 4},
//   { locals: { foo: 'aaa', num: -3 }, flag: 4} ]
```

## License

Copyright © 2018, [tywei90](https://github.com/tywei90).
Released under the [MIT License](LICENSE).
