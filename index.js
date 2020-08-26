/*
 * arr-sort <https://github.com/tywei90/arr-sort>
 *
 * Copyright (c) 2018-2020, tywei90.
 * Released under the MIT License.
 */

'use strict';


/*
 * Flatten javascript objects into a single-depth object
 * Object Flatten <https://gist.github.com/penguinboy/762197>
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

// get compare function
function getCompFn(asc) {
	var sortFn;
	if(typeof asc === 'function'){
		sortFn = asc;
	}else{
		if(asc === false){
			sortFn = function(a, b){
				if(typeof a === 'string'){
					return b.localeCompare(a)
				}
				if(typeof a === 'number'){
					return b - a
				}
				return 0
			}
		}else{
			sortFn = function(a, b){
				if(typeof a === 'string'){
					return a.localeCompare(b)
				}
				if(typeof a === 'number'){
					return a - b
				}
				return 0
			}
		}
	}
	return sortFn
}

function getObjectValue (obj, attr) {
	if (attr.indexOf('.') === -1) {
		return obj[attr]
	} else {
		return flattenObject(obj)[attr]
	}
}


// select array whose attribute matches
function selObjArr(arr, attr, asc, ignore) {
	var outArr = [];
	var sortFn = getCompFn(asc);
	if(attr === undefined || arr.length === 0){
		return [];
	}
	if (!ignore) {
		arr.sort(function(a,b){return sortFn(getObjectValue(a, attr), getObjectValue(b, attr))});
	}
	var optIndex = 0;
	for(var i=0, len = arr.length-1; i<len; i++){
		if(sortFn(getObjectValue(arr[i], attr), getObjectValue(arr[i+1], attr))){
			optIndex = i;
			break
		}
		if(i == len-1){
			optIndex = len;
			break
		}
	}
	outArr = arr.slice(0, optIndex+1);
	return outArr
}

/**
 * Sort an object array by one or more properties
 *
 * @param { Object Array } `arr` The object array to sort.
 * @param { Object Array } `sortLists` One or more objects to sort by.
 * @return { Array } Returns a new deleted array.
 * @api public
 */
function arrSort(arr, sortLists) {
	// check params
	if (arr == null) {
    	return [];
  	}else if(Object.prototype.toString.call(arr) !== "[object Array]"){
  		throw new TypeError('PARAM MUST BE ARRAY');
  	}
  	if(sortLists == null){
		return arr;
	}else if(Object.prototype.toString.call(sortLists) !== "[object Array]"){
		throw new TypeError('PARAM MUST BE ARRAY');
	}
	var i = 0;
	var len = sortLists.length;
	var inArr = [];
	var outArr = [];
	if(!len){
		return arr;
	}
	// mark array item for follow-up deleting
	arr.forEach((item, index) => {
		if(Object.prototype.toString.call(item) !== "[object Object]"){
			throw new TypeError('PARAM MUST BE OBJECT ARRAY');
		}
		item.$$index = index
		inArr.push(item)
	});
	var isSort = false
	// the right method to use arguments.callee in strict mode
	var sortArrOuter = (function sortArrWrap(arr, sortList) {
		var filterArr = [];
		if (arr.length === 0) {
			return;
		}
		filterArr = selObjArr(arr, sortList.attr || '', sortList.asc, sortList.attr === sortLists[0].attr && isSort);
		if (!isSort && sortList.attr === sortLists[0].attr) {
			isSort = true
		}
		if(filterArr.length === 0){
			filterArr = arr;
		}
		if (filterArr.length === 1 || i >= len - 1) {
			outArr = outArr.concat(filterArr);
			// delete the corresponding original array element
			var newInArr = []
			var filterIndexArr = []
			for(var k=0,len1=filterArr.length; k<len1; k++){
				filterIndexArr.push(filterArr[k].$$index)
			}
			for(var j=0,len2=inArr.length; j<len2; j++){
				if (filterIndexArr.indexOf(inArr[j].$$index) === -1) {
					newInArr.push(inArr[j])
				}
			}
			inArr = newInArr
		} else {
			i++;
			sortArrWrap(filterArr, sortLists[i])
		}
	})
	var loopSortArr = (function loopSortArrWrap() {
		i = 0;
		sortArrOuter(inArr, sortLists[0]);
		if (inArr.length === 0) {
			return
		}
		loopSortArrWrap();
	})
	loopSortArr();
	outArr.forEach(item => {
		delete item.$$index
	});
	return outArr
}

module.exports = arrSort