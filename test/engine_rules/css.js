var chai = require('chai');

chai.use(require('chai-string'));

var re = require('../../lib/re');

var assert = chai.assert;

describe(
	'CSS Rule Engine Tests',
	function() {
		'use strict';

		it(
			'should detect and replace improper hex format',
			function() {
				var rule = re.css.hexLowerCase;

				var input = '#fff';
				var output = '#FFF';
				var expectedWarning = 'Hex code should be all uppercase';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace redundant hex colors',
			function() {
				var rule = re.css.hexRedundant;

				var input = '#000000';
				var output = '#000';
				var expectedWarning = 'Hex code can be reduced to #000';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace missing integers',
			function() {
				var rule = re.css.missingInteger;

				var input = 'width: .1px';
				var output = 'width: 0.1px';
				var expectedWarning = 'Missing integer';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace list value spaces',
			function() {
				var rule = re.css.missingListValuesSpace;

				var input = 'clip: rect(0,0,0,0)';
				var output = 'clip: rect(0, 0, 0, 0)';
				var expectedWarning = 'Needs space between comma-separated values';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should ignore list value spaces in content properties',
			function() {
				var rule = re.css.missingListValuesSpace;

				var input = 'content: ",";';
				var output = 'content: ",";';
				var expectedWarning = 'Needs space between comma-separated values';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);

				assert.isFalse(result);
			}
		);

		it(
			'should detect and replace missing new lines',
			function() {
				var rule = re.css.missingNewlines;

				var input = '.foo {';
				var output = '\n.foo {';
				var expectedWarning = 'There should be a newline between "}" and ".foo {"';

				var context = {
					item: input,
					// This is actually working around a bug in the missing newlines
					// however, I need to fix it after the implementation of all of the tests
					// I'll do that later :)
					nextItem: '.foo {',
					previousItem: '}'
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace missing new lines around directives',
			function() {
				var rule = re.css.missingNewlines;

				var input = '@if $direction == vertical {';
				var output = '\n@if $direction == vertical {';
				var expectedWarning = 'There should be a newline between "}" and ".foo {"';

				var context = {
					item: input,
					// This is actually working around a bug in the missing newlines
					// however, I need to fix it after the implementation of all of the tests
					// I'll do that later :)
					nextItem: '.foo {',
					previousItem: '}'
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should ignore missing new lines around @else directives',
			function() {
				var rule = re.css.missingNewlines;

				var input = '@else if $direction == vertical {';

				var context = {
					item: input,
					// This is actually working around a bug in the missing newlines
					// however, I need to fix it after the implementation of all of the tests
					// I'll do that later :)
					nextItem: '.foo {',
					previousItem: '}'
				};

				var result = re.testLine(rule, input, context);

				assert.isFalse(result);
			}
		);

		it(
			'should detect missing selector space',
			function() {
				var rule = re.css.missingSelectorSpace;

				var input = '.foo{';
				var output = input;
				var expectedWarning = 'Missing space between selector and bracket';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace needless quotes',
			function() {
				var rule = re.css.needlessQuotes;

				var input = 'background: url("foo.png");';
				var output = 'background: url(foo.png);';
				var expectedWarning = 'Needless quotes';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace needless units',
			function() {
				var rule = re.css.needlessUnit;

				var input = 'width: 0px;';
				var output = 'width: 0;';
				var expectedWarning = 'Needless unit';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect trailing newlines',
			function() {
				var rule = re.css.trailingNewlines;

				var input = '}';
				var output = input;
				var expectedWarning = 'Needless new line';

				var context = {
					collection: ['', input, ''],
					index: 1,
					item: input,
					nextItem: '',
					previousItem: ''
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.equal(result, 1);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));

				context.item = '.foo {';
				result = re.testLine(rule, context.item, context);

				assert.equal(result, 2);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
			}
		);

		it(
			'should ignore newlines around comments in nested selectors',
			function() {
				var rule = re.css.trailingNewlines;

				var input = '{';

				var context = {
					collection: ['', input, '', '/* Comment */'],
					index: 1,
					item: input,
					nextItem: '',
					previousItem: ''
				};

				var result = re.testLine(rule, input, context);

				assert.isFalse(result);
			}
		);

		it(
			'should detect and replace trailing commas in selector',
			function() {
				var rule = re.css.trailingComma;

				var input = '.foo, {';
				var output = '.foo {';
				var expectedWarning = 'Trailing comma in selector';

				var context = {
					item: input
				};

				var result = re.testLine(rule, input, context);
				var lineNum = 1;

				assert.isTrue(result);
				assert.startsWith(re.getWarning(lineNum, input, result, rule, context), expectedWarning);
				assert.equal(output, re.replaceItem(lineNum, input, result, rule, context));
			}
		);

		it(
			'should detect and replace invalid border reset',
			function() {
				var rule = re.css._properties.invalidBorderReset;
				var prop = 'border';

				var input = ['', 'top', 'right', 'bottom', 'left'].reduce(
					function(prev, item, index) {
						var str = prop;

						if (item) {
							str += '-';
						}

						str += item + ': ';

						prev.push(
							str + 'none;',
							str + '0;',
							str + 'none 0;',
							str + 'none none;',
							str + '0 none;'
						);

						return prev;
					},
					[]
				);

				input.forEach(
					function(item, index) {
						var context = {
							item: item
						};

						var output = item.split(':')[0] + '-width: 0;';
						var expectedWarning = 'You should use "' + output + '"';

						var result = re.testLine(rule, item, context);
						var lineNum = 1;

						assert.isArray(result);
						assert.startsWith(re.getWarning(lineNum, item, result, rule, context), expectedWarning);
						assert.equal(output, re.replaceItem(lineNum, item, result, rule, context));
					}
				);
			}
		);

		it(
			'should detect and replace invalid property format',
			function() {
				var rule = re.css._properties.invalidFormat;

				var input = [
					'width:10px;',
					'width:	10px;',
					'width:    10px;'
				];

				var output = 'width: 10px;';
				var expectedWarning = 'There should be one space after ":"';

				input.forEach(
					function(item, index) {
						var context = {
							item: item
						};

						var result = re.testLine(rule, item, context);
						var lineNum = 1;

						assert.isTrue(result);
						assert.startsWith(re.getWarning(lineNum, item, result, rule, context), expectedWarning);
						assert.equal(output, re.replaceItem(lineNum, item, result, rule, context));
					}
				);
			}
		);
	}
);