'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

	/* NPM */
	, noda = require('noda')
    
	/* in-package */
	, ching_unescape = noda.inRequire('lib/ching_unescape')
	
    ;

describe('lib, ching_unescape', () => {
    
    it('basic', () => {
		let output = ching_unescape('--%Y%M%D--', '%', (mask, cursor) => {
			if ( ['Y', 'M', 'D'].includes(mask[cursor]) ) {
				return mask[cursor].toLowerCase();	
			}
		});
		assert.equal(output, '--ymd--');
	});
	
	it('empty', () => {
		let output = ching_unescape('', '', o => null);
		assert.equal(output, '');
	});

	it('escape sequences not accepted', () => {
		let output = ching_unescape('%Y%M%D', '%', (mask, cursor) => null);
		assert.equal(output, 'YMD');
    });

	it('escape sequence made up of escape chars', () => {
		let output = ching_unescape('%Y%%M%D', '%', (mask, cursor) => {
			if ( ['Y', 'M', 'D'].includes(mask[cursor]) ) {
				return mask[cursor].toLowerCase();	
			}
		});
		assert.equal(output, 'y%Md');
	});
	
	it('escape sequences with more than one following characters', () => {
		let output = ching_unescape('%year/%month/%date', '%', (mask, cursor) => {
			let date = {
				year  : 1997,
				month : 7,
				date  : 1,
			};
			for (let name in date) {
				if (mask.substr(cursor, name.length) == name) {
					return { output: date[name], offset: name.length };
				}
			}
		});
		assert.equal(output, '1997/7/1');
    });
});