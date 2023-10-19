/* eslint-disable */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Enforce 'table.dateTime' method to be called with specific parameters",
      category: 'Best Practices',
      recommended: true,
    },
  },
  create: function (context) {
    return {
      CallExpression: function (node) {
        const { callee, arguments: args } = node

        // Check if the called method is 'table.dateTime'
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'table' &&
          callee.property.name === 'dateTime'
        ) {
          // Check if the method is called with the expected parameters
          if (
            args.length !== 2 ||
            !args[1].properties.some(
              (prop) => prop.key.name === 'useTz' && prop.value.value === false,
            )
          ) {
            context.report({
              node,
              message:
                "The 'dateTime' column should be without timezone, call it with '{ useTz: false }'",
            })
          }
        }
      },
    }
  },
}

module.exports = rule
