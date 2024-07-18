'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

	/* NPM */
	, noda = require('noda')
    
	/* in-package */
	, parse = noda.inRequire('parse')
	, date_format = noda.inRequire('php')
    ;

describe('parse', () => {
    
    it('Ymd', () => {
		let date = '20190401';
		let d = parse(date, 'Ymd');
		assert.equal(date_format(d, 'Ymd'), date);
	});

	it('H:i:s', () => {
		let date = '08:29:59';
		let d = parse(date, 'H:i:s');
		assert.equal(date_format(d, 'H:i:s'), date);
	});

	it('Y-m-d', () => {
		let date = '2019-04-01';
		let d = parse(date, 'Y-m-d');
		assert.equal(date_format(d, 'Y-m-d'), date);
	});

	it('unmatched format', () => {
		assert.equal(null, parse('2019.04', 'Y-m'));
	});

	it('invalid "Y" (year)', () => {
		assert.equal(null, parse('200A', 'Y'));
	});

	it('invalid "m" (month)', () => {
		assert.equal(null, parse('00', 'm'));
		assert.equal(null, parse('13', 'm'));
	});

	it('invalid "d" (date)', () => {
		assert.equal(null, parse('00', 'd'));
		assert.equal(null, parse('32', 'd'));
	});

	it('invalid "H" (24 hour)', () => {
		assert.equal(null, parse('24', 'H'));
	});

	it('invalid i (minutes)', () => {
		assert.equal(null, parse('60', 'i'));
	});

	it('invalid s (seconds)', () => {
		assert.equal(null, parse('60', 's'));
	});
});