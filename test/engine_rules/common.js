var chai = require('chai');
var _ = require('lodash');

chai.use(require('chai-string'));

var re = require('../../lib/re');

var assert = chai.assert;

describe(
	'Common Rule Engine Tests',
	function() {
		'use strict';

		it(
			'should detect and replace mixed spaces and tabs',
			function() {
				var rule = re.common.mixedSpaces;

				var tests = {
					'	 ': '	',
					'	 	': '		',
					'	  ': '		',
					'	    ': '		'
				};

				_.forEach(
					tests,
					function(output, input) {
						var context = {
							item: input
						};

						var result = re.testLine(rule, input, context);
						var lineNum = 1;

						assert.isTrue(result);
						assert.startsWith(re.getWarning(lineNum, input, result, rule, context), rule.message.split(':')[0]);
						assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
					}
				);
			}
		);

		it(
			'should detect and replace invalid whitespace',
			function() {
				var MAP_WHITESPACE = re.common._MAP_WHITESPACE;

				var rule = re.common.invalidWhiteSpace;

				var tests = {};

				_.forEach(
					MAP_WHITESPACE,
					function(item, index) {
						tests['foo' + index + 'bar'] = 'foo' + item + 'bar';
					}
				);

				_.forEach(
					tests,
					function(output, input) {
						var context = {
							item: input
						};

						var result = re.testLine(rule, input, context);
						var lineNum = 1;

						assert.isTrue(result);
						assert.startsWith(re.getWarning(lineNum, input, result, rule, context), rule.MSG);
						assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
					}
				);
			}
		);
	}
);