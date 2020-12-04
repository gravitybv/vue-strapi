module.exports = {
  configureWebpack: {
    externals: process.env.NODE_ENV === "production" ? ["axios"] : []
  }
};
