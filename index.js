/*
 * arr-sort <https://github.com/tywei90/arr-sort>
 *
 * Copyright (c) 2018-2022, tywei90.
 * Released under the MIT License.
 * version: 1.2.0
 */

'use strict';



/**
 * Flatten javascript objects into a single-depth object
 *
 * @param { Object } `ob` The object to flatten.
 * @return { Object } Returns single-depth object.
 * @api private
 */
function flattenObject(ob) {
	var toReturn = {};
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}


/**
 * get compare function
 *
 * @param { Function | Boolean } `asc` comparison order.
 * @return { Function } Returns comparison function.
 * @api private
 */
function getCompFn(asc) {
	var sortFn;
	if (typeof asc === 'function') {
		sortFn = asc;
	} else {
		if (asc === false) {
			sortFn = function (a, b) {
				if (typeof a === 'string') {
					return b.localeCompare(a)
				}
				if (typeof a === 'number') {
					return b - a
				}
				return 0
			}
		} else {
			sortFn = function (a, b) {
				if (typeof a === 'string') {
					return a.localeCompare(b)
				}
				if (typeof a === 'number') {
					return a - b
				}
				return 0
			}
		}
	}
	return sortFn
}


/**
 * if not nested properties, optimize performance
 *
 * @param { Object } `obj` The object to get value.
 * @param { attr } `attr` object key.
 * @return { any } Returns object value.
 * @api private
 */
function getObjectValue(obj, attr) {
	if (attr.indexOf('.') === -1) {
		return obj[attr]
	} else {
		return flattenObject(obj)[attr]
	}
}


/**
 * select diff arrays and same arrays whose attribute matches
 *
 * @param { Object Array } `arr` The object array to select.
 * @param { String } `attr` object key.
 * @param { Function | Boolean } `asc` comparison order.
 * @param { Boolean } `ignore` if skip sort.
 * @return { Array } Returns [diff arrays, same arrays].
 * @api private
 */
function selObjArr(arr, attr, asc, ignore) {
	var sortFn = getCompFn(asc);
	if (attr === undefined || arr.length === 0) {
		return [
			[],
			[]
		];
	}
	if (arr.length === 1) {
		return [arr.concat(), []];
	}
	if (!ignore) {
		arr.sort(function (a, b) {
			return sortFn(getObjectValue(a, attr), getObjectValue(b, attr))
		});
	}
	// firstly, select diff arrays whose attribute matches
	var diffIndex = 0;
	for (var i = 0, len = arr.length - 1; i < len; i++) {
		if (!sortFn(getObjectValue(arr[i], attr), getObjectValue(arr[i + 1], attr))) {
			diffIndex = i;
			break
		}
		if (i == len - 1) {
			diffIndex = len + 1;
			break
		}
	}
	var diffArr = arr.slice(0, diffIndex);

	// then, select same arrays whose attribute matches
	var sameIndex = 0;
	var leftArr = arr.slice(diffIndex);
	for (var j = 0, len2 = leftArr.length - 1; j < len2; j++) {
		if (sortFn(getObjectValue(leftArr[j], attr), getObjectValue(leftArr[j + 1], attr))) {
			sameIndex = j;
			break
		}
		if (j == len2 - 1) {
			sameIndex = len2;
			break
		}
	}
	var sameArr = leftArr.slice(0, sameIndex + 1);
	return [diffArr, sameArr]
}


/**
 * Sort an object array by one or more properties
 *
 * @param { Object Array } `arr` The object array to sort.
 * @param { Object Array } `sortList` One or more objects to sort by.
 * @return { Array } Returns a new deleted array.
 * @api public
 */
function arrSort(arr, sortList) {
	// check params
	if (arr == null) {
		return [];
	} else if (Object.prototype.toString.call(arr) !== "[object Array]") {
		throw new TypeError('array param MUST BE ARRAY');
	}

	if (sortList == null) {
		return arr;
	} else if (Object.prototype.toString.call(sortList) !== "[object Array]") {
		throw new TypeError('comparisonArgs param MUST BE ARRAY');
	}

	var i = 0;
	var len = sortList.length;
	var inArr = [];
	var outArr = [];
	var isSorted = false

	if (!len) {
		return arr;
	}

	arr.forEach((item, index) => {
		if (Object.prototype.toString.call(item) !== "[object Object]") {
			throw new TypeError('the item of array param MUST BE OBJECT');
		}
		// mark array item for follow-up deleting
		item.$$index = index
		inArr.push(item)
	});

	sortList.forEach(item => {
		if (Object.prototype.toString.call(item) !== "[object Object]") {
			throw new TypeError('the item of comparisonArgs param MUST BE OBJECT');
		}
	});

	function sortInner(arr, sortObj) {
		if (arr.length === 0) {
			return;
		}
		// mark first attr sorted, optimize performance
		var ignore = sortObj.attr === sortList[0].attr && isSorted
		var filterArr = selObjArr(arr, sortObj.attr || '', sortObj.asc, ignore);
		if (!isSorted) {
			isSorted = true
		}

		// if pick out matched arrays, push into outArr
		if (filterArr[0].length || i >= len - 1) {
			var rsArr = filterArr[0].concat(i >= len - 1 ? filterArr[1] : [])
			outArr = outArr.concat(rsArr);
			// delete the corresponding array, update inArr
			var newInArr = []
			var filterIndexArr = []
			for (var k = 0, len1 = rsArr.length; k < len1; k++) {
				filterIndexArr.push(rsArr[k].$$index)
			}
			for (var j = 0, len2 = inArr.length; j < len2; j++) {
				if (filterIndexArr.indexOf(inArr[j].$$index) === -1) {
					newInArr.push(inArr[j])
				}
			}
			inArr = newInArr
			// free the memory
			rsArr = null
			newInArr = null
			filterIndexArr = null
		}

		// if there is left arrays, next turn
		if (filterArr[1].length && i < len - 1) {
			i++;
			sortInner(filterArr[1], sortList[i])
		}
	}

	function sortOuter() {
		i = 0;
		sortInner(inArr, sortList[0]);
		if (inArr.length === 0 || arr.length === outArr.length) {
			return
		}
		sortOuter();
	}

	sortOuter();
	outArr.forEach(item => {
		delete item.$$index
	});

	return outArr
}

module.exports = arrSort