<template>
  <div class="mx-auto w-full md:w-2/3 xl:w-1/2">
    <div
      class="material-container m-3 mb-2 fixed bottom-0 inset-x-0 p-2 text-default-text flex flex-col md:flex-row justify-between items-center"
    >
      <p class="text-sm mb-2">
        We use first party analytics, read our
        <nuxt-link to="/legal">Legal page</nuxt-link> for more information.
      </p>

      <!-- <a class="text-default-text-muted text-sm" href="/privacy-policy#opt-out"
      >Opt out</a
    > -->

      <button
        type="button"
        class="w-full md:w-auto text-lg border rounded px-2"
        @click="$matomo.rememberConsentGiven()"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Consent',
}
</script>
