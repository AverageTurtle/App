# Rule 34 Progressive Web App (PWA)

Rule 34 redesigned in a beautiful and stunning style

![Dashboard Preview](.github/images/dashboard.png)
![Settings Preview](.github/images/settings.png)

## Visit it
**You can try it online on the next links, both run the same code from this repository**

[https://r34.app/](https://r34.app/)
> Powered by Github Pages

![Uptime Robot status](https://img.shields.io/uptimerobot/status/m783780173-8cc12bab199ae89671203f69?style=for-the-badge)

Or backup

[https://rule34-pwa.netlify.com/](https://rule34-pwa.netlify.com/)
> Powered by Netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/703629e2-193f-4bb0-9349-f02a22d50ed1/deploy-status)](https://app.netlify.com/sites/rule34-pwa/deploys)

# API

This PWA uses a json wrapper for the rule34.xxx XML API, it is developed and mantained by Kurozenzen and can be found [here](https://github.com/kurozenzen/r34-json-api).
The wrapper used in the PWA is a custom [forked version](https://github.com/VoidlessSeven7/Rule-34-PWA-API) from Kurozenzen that I have developed that has removed his analytics and has less usage since its only used by this PWA.

## Technologies used

#### Languages 
HTML, SCSS, Javascript

#### Technologies
NodeJS, NPM, NuxtJS, VueJS, Webpack, etc.

You should read [package.json](package.json) for the full list

## VSCode dependencies
ESLint, Prettier, Vetur

###### Recommended for developing
> File utils, Calamity theme

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
