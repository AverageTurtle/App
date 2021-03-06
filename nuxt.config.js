const isDevEnv = process.env.NODE_ENV === 'development'

export default {
  target: 'static',
  ssr: false,

  modern: isDevEnv ? undefined : 'client',

  // Generate 404 page for hosts
  generate: { fallback: true },

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: (titleChunk) =>
      titleChunk ? `${titleChunk} | Rule 34 App` : 'Rule 34 App',

    htmlAttrs: {
      lang: 'en',
    },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Browse the most popular boorus in the Rule 34 App',
      },
      {
        name: 'monetization',
        content: process.env.MONETIZATION_URI || '',
      },
    ],

    link: [
      // Font
      { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
      { rel: 'preconnect', href: 'https://rsms.me' },
      { rel: 'dns-prefetch ', href: 'https://rsms.me' },
    ],

    noscript: [{ innerHTML: 'This website requires JavaScript' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'var(--color-gradient-two)',
    // height: '5px',
    throttle: 300,
    // duration: 5000,
    continuous: true,
  },

  /*
   ** Customize the splash loading indicator
   */
  loadingIndicator: {
    name: 'cube-grid',
    color: '#121212',
    background: 'linear-gradient(152deg, #9b9be0 38%, #00d4ff 100%)',
  },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vuex-persist.js', mode: 'client', ssr: false },
    { src: '~/plugins/vue-matomo.js', mode: 'client', ssr: false },
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa', '@nuxtjs/sentry', '@nuxtjs/sitemap'],

  /*
   ** Progressive web app
   */
  pwa: {
    manifest: {
      name: 'Rule 34 App',
      short_name: 'Rule 34 App',
      lang: 'en',
      start_url: '/?utm_source=PWA',
      theme_color: '#121212',
      background_color: '#121212',
      shortcuts: [
        {
          name: 'Open Settings',
          short_name: 'Settings',
          description: 'Tweak your experience',
          url: '/settings?utm_source=PWA',
        },
      ],
    },
    meta: {
      /* meta options */
      ogHost: 'https://r34.app',
      mobileAppIOS: true,
    },
    // Icon is automatically proccessed from static/icon.png
  },

  workbox: {
    runtimeCaching: [
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: ['https://rsms.me/.*', 'https://r34.app/.*'],
        // Defaults to `networkFirst` if omitted
        // handler: 'networkFirst',
        // Defaults to `GET` if omitted
        // method: 'GET'
      },
    ],
  },

  /*
   ** Sentry.io
   */
  sentry: {
    dsn: process.env.SENTRY_DSN || '',

    lazy: true,

    disabled: isDevEnv,
    disableClientSide: false,
    disableServerSide: true,

    publishRelease: true,
    sourceMapStyle: 'hidden-source-map',

    // Additional config
    config: {
      ignoreErrors: [
        'Request rejected with status',
        'Failed to fetch',
        'AbortError',
        'NotAllowedError',
        'Network',
        'ResizeObserver loop limit exceeded',
        'vue-matomo',
      ],
    },
  },

  /*
   ** Sitemap configuration
   */
  sitemap: {
    hostname: 'https://r34.app',

    gzip: true,

    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
      lastmodrealtime: true,
    },

    // Static HTML files
    routes: ['/privacy-policy', '/terms-of-service'],
  },

  /*
   ** Build configuration
   */
  build: {
    // Necessary for CSS Purge
    extractCSS: true,

    //  Remove console.log everywhere
    terser: {
      terserOptions: {
        compress: {
          // drop_console: true,
          pure_funcs: ['console.log', 'console.debug'],
        },
      },
    },
  },

  telemetry: false,
}
