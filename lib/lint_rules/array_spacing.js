var _ = require('lodash');
var base = require('../base');
var re = require('../re');

var isSingleLine = function(node) {
	return node.loc.start.line === node.loc.end.line;
};

module.exports = function(context) {
	return {
		ArrayExpression: function(node) {
			var source = context.getSource(node);

			if (isSingleLine(node) && re.REGEX_ARRAY_SURROUNDING_SPACE.test(source)) {
				var brackets = [];
				var surroundingSpaceTypes = [];

				source.replace(
					re.REGEX_ARRAY_SURROUNDING_SPACE,
					function(item, index, str) {
						var startIndex = 0;
						var endIndex = str.length;

						var leadingSpace = item.indexOf('[') > -1;

						if (leadingSpace) {
							endIndex = index + 1;
							surroundingSpaceTypes.push('leading');
						}
						else {
							startIndex = index + 1;
							surroundingSpaceTypes.push('trailing');
							brackets.push('...');
						}

						brackets.push(str.substring(startIndex, endIndex));

						if (leadingSpace) {
							brackets.push('...');
						}
					}
				);

				brackets = _.uniq(brackets);

				var message = base.sub('Remove {0} spaces: {1}', surroundingSpaceTypes.join(' and '), brackets.join(' '));

				context.report(node, message);
			}
		}
	};
};