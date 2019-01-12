module.exports = function(babel) {
  var css = null;
  var style = null;
  var t = babel.types;
  var templateLiteral = null;

  function isJoinExpression(value) {
    return (
      value.expression.callee &&
      value.expression.callee.property &&
      value.expression.callee.property.name &&
      value.expression.callee.property.name.toLowerCase() === "join" &&
      t.isArrayExpression(value.expression.callee.object)
    );
  }

  function isTemplateLiteralWithExpressions(value) {
    return (
      t.isJSXExpressionContainer(value) &&
      t.isTemplateLiteral(value.expression) &&
      value.expression.expressions.length > 0
    );
  }

  function isTemplateLiteralWithString(value) {
    return (
      t.isJSXExpressionContainer(value) && t.isStringLiteral(value.expression)
    );
  }

  function isArrayWithJoin(value) {
    return t.isJSXExpressionContainer(value) && isJoinExpression(value);
  }

  function generateRequire(expression) {
    var require = t.callExpression(t.identifier("require"), [
      t.stringLiteral("react-native-dynamic-style-processor")
    ]);

    expression.object = t.callExpression(
      t.memberExpression(require, t.identifier("process")),
      [expression.object]
    );
    return expression;
  }

  function transformExpressions(expression) {
    if (t.isMemberExpression(expression)) {
      expression = generateRequire(expression);
    }

    if (t.isCallExpression(expression)) {
      if (expression.arguments.some(t.isMemberExpression)) {
        expression.arguments = expression.arguments.map(generateRequire);
      }
    }

    if (t.isConditionalExpression(expression)) {
      var test = expression.test;
      var consequent = expression.consequent;
      var alternate = expression.alternate;

      if (t.isUnaryExpression(test)) {
        if (t.isMemberExpression(test.argument)) {
          expression.test.argument = generateRequire(test.argument);
        }
      }

      if (t.isBinaryExpression(test)) {
        if (t.isMemberExpression(test.left)) {
          expression.test.left = generateRequire(test.left);
        }
        if (t.isMemberExpression(test.right)) {
          expression.test.right = generateRequire(test.right);
        }
      }

      if (t.isMemberExpression(consequent)) {
        expression.consequent = generateRequire(consequent);
      }
      if (t.isCallExpression(consequent)) {
        if (consequent.arguments.some(t.isMemberExpression)) {
          expression.consequent.arguments = consequent.arguments.map(
            generateRequire
          );
        }
      }
      if (t.isMemberExpression(alternate)) {
        expression.alternate = generateRequire(alternate);
      }
      if (t.isCallExpression(alternate)) {
        if (alternate.arguments.some(t.isMemberExpression)) {
          expression.alternate.arguments = alternate.arguments.map(
            generateRequire
          );
        }
      }
    }
    return expression;
  }

  return {
    name: "react-native-classname-to-dynamic-style",
    visitor: {
      JSXOpeningElement: {
        exit(path, state) {
          if (
            css === null ||
            t.isStringLiteral(css.node.value) ||
            isTemplateLiteralWithString(css.node.value)
          ) {
            return;
          }

          var isSameElement =
            css && style && css.parentPath.node !== style.parentPath.node;

          if (isArrayWithJoin(css.node.value)) {
            var elements = css.node.value.expression.callee.object.elements;
            if (css && style) {
              style.node.value = t.arrayExpression(
                [].concat(
                  elements.map(generateRequire),
                  style.node.value.expression
                )
              );
              css.replaceWith(style);
              style.remove();
            } else {
              style = css;
              style.node.name.name = "style";
              style.node.value = t.arrayExpression(
                elements.map(generateRequire)
              );
            }
          } else if (isSameElement || style == null) {
            css.node.value.expression = transformExpressions(
              css.node.value.expression
            );
            style = css;
            style.node.name.name = "style";
          } else if (css && style && templateLiteral === null) {
            css.node.value.expression = transformExpressions(
              css.node.value.expression
            );
            style.node.value = t.arrayExpression([
              css.node.value.expression,
              style.node.value.expression
            ]);
            css.remove();
          }
          templateLiteral = null;
          css = null;
          style = null;
        }
      },
      JSXAttribute: function JSXAttribute(path, state) {
        var name = path.node.name.name;
        if (name === "className") {
          css = path;
        } else if (name === "style") {
          style = path;
        }

        if (css === null) {
          return;
        }

        if (style && style.node.value.expression && templateLiteral) {
          style.node.value = t.arrayExpression(
            [].concat(
              templateLiteral.expression.expressions,
              style.node.value.expression
            )
          );
          css.replaceWith(style);
          style.remove();
          templateLiteral = null;
          css = null;
          style = null;
        } else if (isTemplateLiteralWithExpressions(css.node.value)) {
          var expressions = css.node.value.expression.expressions;
          css.node.value.expression.expressions = expressions.map(
            generateRequire
          );
          templateLiteral = css.node.value;
          css.node.value = t.arrayExpression(
            css.node.value.expression.expressions
          );
          css.node.name.name = "style";
        }
      }
    }
  };
};
