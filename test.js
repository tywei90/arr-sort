'use strict';

require('mocha');
require('should');

var arrSort = require('./');

describe('error tips', function() {
    var arr = [{foo: 'y'}, {foo: 'z'}, {foo: 'x'}];
    it('should throw an error when invalid type of array are passed', function() {
        (function() {
            arrSort({});
        }).should.throw('array param MUST BE ARRAY');
    });

    it('should throw an error when invalid type of comparisonArgs are passed', function() {
        (function() {
            arrSort(arr, 2);
        }).should.throw('comparisonArgs param MUST BE ARRAY');
    });

    it('should throw an error when array elements are not an object', function() {
        (function() {
            arrSort([2, 'string'], [{attr:'foo'}]);
        }).should.throw('the item of array param MUST BE OBJECT');
    });

    it('should throw an error when comparisonArgs elements are not an object', function() {
        (function() {
            arrSort(arr, [2, 'string']);
        }).should.throw('the item of comparisonArgs param MUST BE OBJECT');
    });
});

describe('empty array', function() {
    it('should return an empty array when null or undefined is passed', function() {
        arrSort().should.eql([]);
        arrSort(undefined).should.eql([]);
        arrSort(null).should.eql([]);
    })
});

describe('original array', function() {
    var arr = [{foo: 'y'}, {foo: 'z'}, {foo: 'x'}];
    it('should return an original array when comparisonArgs is null or undefined', function() {
        arrSort(arr).should.eql([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}]);
        arrSort(arr, undefined).should.eql([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}]);
        arrSort(arr, null).should.eql([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}]);
    })
});

describe('basic sort', function() {
    it('should sort an array by the given object property', function() {
        var out = arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo'}]);
        out.should.eql([{foo: 'x'}, {foo: 'y'}, {foo: 'z'}]);
    });
    it('should sort an array in reverse order by the given object property', function() {
        var out = arrSort([{foo: 'y'}, {foo: 'z'}, {foo: 'x'}],[{attr:'foo', asc: false}]);
        out.should.eql([{foo: 'z'}, {foo: 'y'}, {foo: 'x'}]);
    });
});

describe('advanced sort', function() {
    it('should sort by multiple properties', function() {
        var array = [
            { foo: 'bbb', num: 4,  flag: 2 },
            { foo: 'aaa', num: 3,  flag: 1 },
            { foo: 'ccc', num: -6, flag: 2 },
            { foo: 'ccc', num: 8,  flag: 2 },
            { foo: 'bbb', num: 2,  flag: 4 },
            { foo: 'aaa', num: -3, flag: 4 }
        ];
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
        result.should.eql([ 
            { foo: 'aaa', num: 3,  flag: 1},
            { foo: 'ccc', num: -6, flag: 2},
            { foo: 'ccc', num: 8,  flag: 2},
            { foo: 'bbb', num: 4,  flag: 2},
            { foo: 'bbb', num: 2,  flag: 4},
            { foo: 'aaa', num: -3, flag: 4} 
        ]);
    });

    it('should sort by nested properties', function() {
        var array = [
            { locals: { foo: 'bbb', num: 4 },  flag: 2},
            { locals: { foo: 'aaa', num: 3 },  flag: 1},
            { locals: { foo: 'ccc', num: -6 }, flag: 2},
            { locals: { foo: 'ccc', num: 8 },  flag: 2},
            { locals: { foo: 'bbb', num: 2 },  flag: 4},
            { locals: { foo: 'aaa', num: -3 }, flag: 4},
        ];
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
        result.should.eql([ 
            { locals: { foo: 'aaa', num: 3 },  flag: 1},
            { locals: { foo: 'ccc', num: -6 }, flag: 2},
            { locals: { foo: 'ccc', num: 8 },  flag: 2},
            { locals: { foo: 'bbb', num: 4 },  flag: 2},
            { locals: { foo: 'bbb', num: 2 },  flag: 4},
            { locals: { foo: 'aaa', num: -3 }, flag: 4} 
        ]);
    });

    it('should sort by custom function', function() {
        var array = [
            { locals: { foo: 'bbb', num: 4 },  flag: -2},
            { locals: { foo: 'aaa', num: 3 },  flag: 1},
            { locals: { foo: 'ccc', num: -6 }, flag: 2},
            { locals: { foo: 'ccc', num: 8 },  flag: 2},
            { locals: { foo: 'bbb', num: 2 },  flag: 4},
            { locals: { foo: 'aaa', num: -3 }, flag: 4},
        ];
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
        result.should.eql([ 
            { locals: { foo: 'aaa', num: 3 },  flag: 1},
            { locals: { foo: 'ccc', num: -6 }, flag: 2},
            { locals: { foo: 'ccc', num: 8 },  flag: 2},
            { locals: { foo: 'bbb', num: 4 },  flag: -2},
            { locals: { foo: 'bbb', num: 2 },  flag: 4},
            { locals: { foo: 'aaa', num: -3 }, flag: 4}
        ]);
    });
});






