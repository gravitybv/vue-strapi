# Vue Strapi

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> [Strapi](https://strapi.io) plugin for [Vue.js](https://vuejs.org)

This plugin is a port of [@nuxtjs/strapi](https://github.com/nuxt-community/strapi-module) to use it in Vue.js.
We refer to that documentation as the functionality is mainly the same.

- [✨ &nbsp;Release Notes](https://github.com/gravitybv/vue-strapi/releases)
- [📖 &nbsp;Read the documentation @nuxtjs/strapi](https://strapi.nuxtjs.org)

## Installation

1. Install the package using `npm install vue-strapi`
2. Import the plugin into your `main.js` with `import strapi from "./plugins/strapi"`
3. Use the plugin in Vue.js by adding `Vue.use(strapi)` in `main.js`

## Features

- Authentication support
- RESTful methods
- Adaptive SDK for API entities
- Handle errors with hooks

[📖 &nbsp;Read the documentation](https://strapi.nuxtjs.org)

## Configuration

You can configure the plugin just like the NuxtJS module. Below you will find an example:

```
Vue.use(strapi, {
  url: "http://localhost:1337",
  entities: ["posts"]
})
```

## Development

1. Clone this repository
2. Install dependencies using `npm install`
3. Start development server using `npm run serve`

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vue-strapi/latest.svg
[npm-version-href]: https://npmjs.com/package/vue-strapi

[npm-downloads-src]: https://img.shields.io/npm/dt/vue-strapi.svg
[npm-downloads-href]: https://npmjs.com/package/vue-strapi

[license-src]: https://img.shields.io/npm/l/vue-strapi.svg
[license-href]: https://npmjs.com/package/vue-strapi
