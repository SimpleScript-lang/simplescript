'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

function ordinal_suffix(d) {
	let suffix = 'th';
	let d2 = d % 100;
	if (d2 < 10 || d2 > 20) {
		switch (d2 % 10) {
			case 1:
				suffix = 'st';
				break;
		
			case 2:
				suffix = 'nd';
				break;
			
			case 3:
				suffix = 'rd';
				break;
		}
	}
	return suffix;
}

function ordinal(n) {
	let suffix = ordinal_suffix(n);
	return n + suffix;
}

ordinal.suffix = ordinal_suffix;

module.exports = ordinal;