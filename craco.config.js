module.exports = {
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            [
              "postcss-pxtorem",
              {
                rootValue: 16,
                unitPrecision: 5,
                propList: ["*"],
                selectorBlackList: ["keep-px"],
                replace: true,
                mediaQuery: false,
                minPixelValue: 1,
                exclude: [/node_modules/],
              },
            ],
          ],
        },
      },
    },
  },
};
