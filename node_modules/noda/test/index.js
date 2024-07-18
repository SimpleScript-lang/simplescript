/**
 * @author Youngoat@163.com
 * @create 2020-12-11
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, assert = require('assert')
	
	/* NPM */
	
	/* in-package */
	, noda = require('..')
	;

describe('Around Current Package', () => {

	it('currentPackage', () => {
		assert.strictEqual(noda.currentPackage().name, 'noda');
	});

	it('inExists', () => {
		assert(noda.inExists('package.json'));
		assert(!noda.inExists('nothing'));
	});

	it('inRead', () => {
		assert.strictEqual(noda.inRead('test/EXT/CHING.txt', 'utf8'), 'CHING');
	});

	it('inReaddir', () => {
		assert.deepStrictEqual(noda.inReaddir('test/EXT'), 
			[ 'CHING.js', 'CHING.json', 'CHING.txt' ]);
	});

	it('inRequire', () => {
		assert.strictEqual(noda.inRequire('test/EXT/CHING'), 'JS');
	});

	it('inRequireDir', () => {
		assert.deepStrictEqual(
			Object.keys(noda.inRequireDir('test/ME')),
			[ 'country', 'gender', 'name' ]);
	});

	it('inResolve', () => {
		assert.strictEqual(noda.inResolve('test/index.js'), __filename);
		assert.strictEqual(noda.inResolve('test'), __dirname);
	});
});

describe('Around Current Script File', () => {

	it('nextRead', () => {
		assert.strictEqual(noda.nextRead('EXT/CHING.txt', 'utf8'), 'CHING');
	});

	it('upResolve', () => {
		assert.strictEqual(
			noda.upResolve('package.json'),
			noda.inResolve('package.json')
		);
	});

	it('downResolve', () => {
		assert.strictEqual(
			noda.downResolve('ME'),
			noda.inResolve('test/ME')
		);
	});
});

describe('Others', () => {
	it('osRequire', () => {
		assert.strictEqual(noda.osRequire('./OS'), require('os').platform());
	});

	it('requireDir', () => {
		assert.deepStrictEqual(
			Object.keys(noda.requireDir('./ME')),
			[ 'country', 'gender', 'name' ]);
	});

	it('packageOf', () => {
		assert.strictEqual(
			noda.packageOf('mocha').name,
			'mocha'
		);
	});

	it('once', () => {
		let i = 0, j = 0;
		do {
			if (noda.count() == 1 && j == 0) i++;
			if (noda.count() == 1) i++;
			j++;
		} while(j < 10)
		assert.strictEqual(i, 2);
	});
});