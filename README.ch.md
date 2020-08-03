# arr-sort [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tywei90/arr-sort/blob/master/LICENSE) [![NPM version](https://img.shields.io/npm/v/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![NPM monthly downloads](https://img.shields.io/npm/dm/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![NPM total downloads](https://img.shields.io/npm/dt/arr-sort.svg?style=flat)](https://www.npmjs.com/package/arr-sort) [![Windows Build Status](https://travis-ci.org/tywei90/arr-sort.svg?branch=master)](https://travis-ci.org/tywei90/arr-sort)

### [English](./README.md)

> 根据一个或者多个属性对数组进行排序，支持嵌套的属性。而且可以在每个条件中指定排序的方向，并支持传入比较函数。

## 安装

采用 [npm](https://www.npmjs.com/) 安装:

```sh
$ npm install --save arr-sort
```

采用 [yarn](https://yarnpkg.com) 安装:

```sh
$ yarn add arr-sort
```

## 用法

通过给定的对象属性进行排序：

```js
var arrSort = require('arr-sort');

arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo'}]);
//=> [{foo: 'x'}, {foo: 'y'}, {foo: 'z'}]
```

**逆向排序**

```js
arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo', asc: false}]);
//=> [{foo: 'z'}, {foo: 'y'}, {foo: 'x'}]
```

## 参数

```js
arrSort(array, comparisonArgs);
```

* `array`: **{ Object Array }** 待排序的数组
* `comparisonArgs`: **{ Object Array }** 一个或者多个对象组成的数组。 结构如下：**{ 'attr': `attr`, 'asc': `asc` }**
    * `attr`: **{ String }** 对象属性
    * `asc`: **{ Boolean | Function }** 指定排序的方向
        * `true`: 升序（默认值）
        * `false`: 降序
        * `function`: 传入的比较函数

## 注意
* 如何没有提供 `attr` 属性, 则这次的排序会自动跳过
* `attr` 属性值类型可以是 string 或者 number
    * 如果是 string, 我们采用 `localeCompare` 去比较排序
    * 如果是 number, 我们直接比较值的大小
* 比较函数一定要遵循[sort函数规范](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)，如果是相等，一定要返回0，否则后续的排序不会参与！如果提供的比较函数没有返回值，则这次的排序会自动跳过

## 例子

**1. 多重条件排序**

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

**2. 嵌套的属性排序**

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

**3. 传入比较函数排序**

如果提供了比较函数，数组会根据其返回值排序。注意：比较函数一定要遵循[sort函数规范](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)，如果是相等，一定要返回0，否则后续的排序不会参与！

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

## 关于

### 相关项目

* [arr-del](https://www.npmjs.com/package/arr-del): 一次性删除数组指定index的元素 | [homepage](https://github.com/tywei90/arr-del "一次性删除数组指定index的元素")

### 集成测试

跑集成测试是一个非常好的熟悉一个项目及其API的方法。你可以通过以下命令安装依赖并跑测试：

```sh
$ npm install && npm test
```

### 作者

**tywei90**

* [github/tywei90](https://github.com/tywei90)
* [blog/tywei90](https://www.wty90.com)

### 许可证

Copyright © 2018, [tywei90](https://github.com/tywei90).
Released under the [MIT License](LICENSE).
