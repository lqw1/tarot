module.exports = {
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            [
              "postcss-px-to-viewport-8-plugin",
              {
                unitToConvert: "px",
                viewportWidth: 375,
                unitPrecision: 5,
                propList: ["*", "!font-size"],
                viewportUnit: "vw",
                fontViewportUnit: "vw",
                selectorBlackList: ["keep-px"],
                minPixelValue: 1,
                mediaQuery: false,
                replace: true,
                // exclude: /\/src\/[a-zA-Z0-9/]+\/PC\//,
                exclude: [/node_modules/],
                include: undefined,
                landscape: false,
                landscapeUnit: "vw",
                landscapeWidth: 568,
              },
            ],
          ],
        },
      },
    },
  },
};
