module.exports = function(babel) {
  var css = null;
  var style = null;
  var t = babel.types;
  var templateLiteral = null;

  function isRequire(node) {
    return (
      node &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].init &&
      node.declarations[0].init.callee &&
      node.declarations[0].init.callee.name === "require"
    );
  }

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

  function generateRequire(name) {
    var require = t.callExpression(t.identifier("require"), [
      t.stringLiteral("react-native-dynamic-style-processor")
    ]);
    var d = t.variableDeclarator(name, require);
    return t.variableDeclaration("var", [d]);
  }

  function generateProcessCall(expression, state) {
    state.hasTransformedClassName = true;
    expression.object = t.callExpression(
      t.memberExpression(state.reqName, t.identifier("process")),
      [expression.object]
    );
    return expression;
  }

  function transformExpressions(expression, state) {
    if (t.isMemberExpression(expression)) {
      expression = generateProcessCall(expression, state);
    }

    if (t.isCallExpression(expression)) {
      if (expression.arguments.some(t.isMemberExpression)) {
        expression.arguments = expression.arguments.map(a =>
          generateProcessCall(a, state)
        );
      }
    }

    if (t.isConditionalExpression(expression)) {
      var test = expression.test;
      var consequent = expression.consequent;
      var alternate = expression.alternate;

      if (t.isUnaryExpression(test)) {
        if (t.isMemberExpression(test.argument)) {
          expression.test.argument = generateProcessCall(test.argument, state);
        }
      }

      if (t.isBinaryExpression(test)) {
        if (t.isMemberExpression(test.left)) {
          expression.test.left = generateProcessCall(test.left, state);
        }
        if (t.isMemberExpression(test.right)) {
          expression.test.right = generateProcessCall(test.right, state);
        }
      }

      if (t.isMemberExpression(consequent)) {
        expression.consequent = generateProcessCall(consequent, state);
      }
      if (t.isCallExpression(consequent)) {
        if (consequent.arguments.some(t.isMemberExpression)) {
          expression.consequent.arguments = consequent.arguments.map(a =>
            generateProcessCall(a, state)
          );
        }
      }
      if (t.isMemberExpression(alternate)) {
        expression.alternate = generateProcessCall(alternate, state);
      }
      if (t.isCallExpression(alternate)) {
        if (alternate.arguments.some(t.isMemberExpression)) {
          expression.alternate.arguments = alternate.arguments.map(a =>
            generateProcessCall(a, state)
          );
        }
      }
    }
    return expression;
  }

  return {
    name: "react-native-classname-to-dynamic-style",
    visitor: {
      Program: {
        enter(path, state) {
          state.reqName = path.scope.generateUidIdentifier(
            "react-native-dynamic-style-processor"
          );
        },
        exit(path, state) {
          if (!state.hasTransformedClassName) {
            return;
          }

          const lastImportOrRequire = path
            .get("body")
            .filter(p => p.isImportDeclaration() || isRequire(p.node))
            .pop();

          if (lastImportOrRequire) {
            lastImportOrRequire.insertAfter(generateRequire(state.reqName));
          } else {
            path.unshiftContainer("body", generateRequire(state.reqName));
          }
        }
      },
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
            var elements = css.node.value.expression.callee.object.elements.filter(function(v) {return !!v.object});
            if (css && style) {
              style.node.value = t.arrayExpression(
                [].concat(
                  elements.map(e => generateProcessCall(e, state)),
                  style.node.value.expression
                )
              );
              css.replaceWith(style);
              style.remove();
            } else {
              style = css;
              style.node.name.name = "style";
              style.node.value = t.arrayExpression(
                elements.map(e => generateProcessCall(e, state))
              );
            }
          } else if (isSameElement || style === null) {
            css.node.value.expression = transformExpressions(
              css.node.value.expression,
              state
            );
            style = css;
            style.node.name.name = "style";
          } else if (css && style && templateLiteral === null) {
            style.node.value = t.arrayExpression([
              transformExpressions(css.node.value.expression, state),
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
          css.node.value.expression.expressions = expressions.map(e =>
            generateProcessCall(e, state)
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
