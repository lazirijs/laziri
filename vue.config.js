const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    name: "Laziri",
    themeColor: "#1e293b",
    msTileColor: "#1e293b",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#ffffff",
  },
});
