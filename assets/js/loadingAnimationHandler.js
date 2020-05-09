export default function loadingAnimationHandler(mode) {
  // console.debug(window.$nuxt.$root.$loading)

  if (Object.keys(window.$nuxt.$root.$loading).length === 0) {
    console.debug('Skipping animation until everything is loaded')

    return
  }

  switch (mode) {
    case 'start':
      // console.debug('Starting loading animation')

      window.$nuxt.$root.$loading.start()
      break

    case 'finish':
      // console.debug('Stopping loading animation')

      window.$nuxt.$root.$loading.finish()
      break

    default:
      throw new Error('No mode specified')
  }
}