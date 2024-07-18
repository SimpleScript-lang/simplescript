'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	
	/* NPM */
	
	/* in-package */
	;

/**
 * @param  {string}   mask
 * @param  {char}     escape_char
 * @param  {Function} consumer
 * 
 * The consumer is invoked when escaped content found:
 * { string *output*, number *offset* } consumer(string *mask*, number *cursor*)
 */
function ching_unescape(mask, escape_char, consumer) {
	let cursor = 0, escaped = false;
	let output = '';
	while(cursor < mask.length) {
		if (escaped) {
			let ret = consumer(mask, cursor);
			if (typeof ret == 'string') {
				output += ret;
				cursor += 1;
			}
			else if (ret) {
				output += ret.output;
				cursor += ret.offset;
			}
			else {
				output += mask[cursor];
				cursor += 1;
			}
			escaped = false;
		}
		else {
			if (mask[cursor] === escape_char) {
				escaped = true;
			}
			else {
				output += mask[cursor];
			}
			cursor += 1;
		}
	} 

	return output;
}

module.exports = ching_unescape;