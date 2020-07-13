<template>
  <div class="relative flex m-0 rounded-full material-container">
    <!-- Cloud icon -->
    <div for="domain-selector" class="inline-flex items-center pl-2 pr-1">
      <CloudIcon class="w-4 h-4 icon text-primary" />
    </div>

    <!-- Selector -->
    <select
      :value="getActiveBooru.domain"
      aria-label="Selector that changes the domain where the content is pulled from"
      class="inline-flex items-center font-light outline-none appearance-none text-primary bg-elevation"
      @change="changeDomain($event.target.value)"
    >
      <!-- Loop for every option -->
      <option
        v-for="booru in getFilteredBooruList"
        :key="booru.domain"
        :aria-label="'Changes the domain to ' + booru.domain"
        :value="booru.domain"
      >
        {{ booru.domain }}
      </option>
    </select>

    <!-- Drop icon -->
    <div class="inline-flex items-center pl-1 pr-2">
      <ChevronDownIcon class="w-4 h-4 icon text-default" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

// Third party
import { ChevronDownIcon, CloudIcon } from 'vue-feather-icons'

import fireAnalytics from '~/assets/js/analytics'

export default {
  name: 'DomainSelector',

  components: { ChevronDownIcon, CloudIcon },

  computed: {
    ...mapState('booru', ['posts']),
    ...mapGetters('booru', ['getActiveBooru', 'getFilteredBooruList']),
  },

  methods: {
    ...mapActions('booru', [
      'activeBooruManager',
      'pidManager',
      'addedTagsManager',
      'fetchPosts',
    ]),

    // Changes that we have to do when changing domain so request is not malformed
    async changeDomain(domain) {
      await this.activeBooruManager(domain)

      await this.pidManager({ operation: 'reset' })

      await this.addedTagsManager({ operation: 'reset' })

      this.fetchPosts()

      fireAnalytics('domain', { domain: this.getActiveBooru.domain })
    },
  },
}
</script>