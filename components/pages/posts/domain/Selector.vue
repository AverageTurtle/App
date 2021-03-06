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
      <optgroup label="Default">
        <!-- Loop for every option -->
        <option
          v-for="booru in filteredDefaultBooruList"
          :key="booru.domain"
          :aria-label="'Changes the domain to ' + booru.domain"
          :value="booru.domain"
          :selected="getActiveBooru.domain === booru.domain"
        >
          {{ booru.domain }}
        </option>
      </optgroup>

      <optgroup label="Custom">
        <template v-if="isUserPremium">
          <option
            v-for="booru in filteredPremiumBooruList"
            :key="booru.domain"
            :aria-label="'Changes the domain to ' + booru.domain"
            :value="booru.domain"
            :selected="getActiveBooru.domain === booru.domain"
          >
            {{ booru.domain }}
          </option>
        </template>
        <option value="Add booru">&lt;Add Booru&gt;</option>
      </optgroup>
    </select>

    <!-- Drop icon -->
    <div class="inline-flex items-center pl-1 pr-2">
      <ChevronDownIcon class="w-4 h-4 icon text-default" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// Third party
import { ChevronDownIcon, CloudIcon } from 'vue-feather-icons'

import { findBoorusWithValueByKey } from '~/assets/lib/rule-34-shared-resources/util/BooruUtils.js'
import fireAnalytics from '~/assets/js/analytics'

export default {
  name: 'DomainSelector',

  components: { ChevronDownIcon, CloudIcon },

  computed: {
    ...mapGetters('user', ['getUserSettings']),
    ...mapGetters('booru', [
      'getActiveBooru',
      'getDefaultBooruList',
      'getPremiumBooruList',
    ]),
    ...mapGetters('premium', ['isUserPremium']),

    filteredDefaultBooruList() {
      return this.getUserSettings.nsfw.value
        ? findBoorusWithValueByKey(true, 'nsfw', this.getDefaultBooruList)
        : findBoorusWithValueByKey(false, 'nsfw', this.getDefaultBooruList)
    },

    filteredPremiumBooruList() {
      return this.getUserSettings.nsfw.value
        ? findBoorusWithValueByKey(true, 'nsfw', this.getPremiumBooruList)
        : findBoorusWithValueByKey(false, 'nsfw', this.getPremiumBooruList)
    },
  },

  methods: {
    ...mapActions('booru', [
      'activeBooruManager',
      'pidManager',
      'addedTagsManager',
      'fetchPosts',
    ]),

    changeDomain(domain) {
      // Redirect to premium page
      if (domain === 'Add booru') {
        this.$router.push({ name: 'premium' })
        return
      }

      this.activeBooruManager({ operation: 'search', value: domain })

      this.pidManager({ operation: 'reset' })

      this.addedTagsManager({ operation: 'reset' })

      this.fetchPosts()

      fireAnalytics('domain', { domain: this.getActiveBooru.domain })
    },
  },
}
</script>
