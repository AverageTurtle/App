<template>
  <div class="w-full overflow-hidden">
    <TransitionCollapse>
      <div v-if="isActive">
        <!-- Workaround for this not jumping is having a div before -->
        <div class="min-w-full tag-container">
          <button
            v-for="tag in tags"
            :key="tag"
            type="button"
            class="tag color-util"
            @click="fetchSpecificTag(tag)"
            v-text="tag"
          />
        </div>
      </div>
    </TransitionCollapse>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

// Components
import TransitionCollapse from '~/components/utils/TransitionCollapse.vue'

// JS
import { scrollToTop } from '~/assets/js/scrollUtils.js'

export default {
  components: { TransitionCollapse },

  props: {
    tags: {
      type: Array,
      default: () => [],
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    ...mapActions('booru', ['addedTagsManager', 'pidManager', 'fetchPosts']),

    fetchSpecificTag(tag) {
      this.pidManager({ operation: 'reset' })

      this.addedTagsManager({
        operation: 'reset',
      })

      this.addedTagsManager({
        operation: 'add',
        value: tag,
      })

      scrollToTop()

      this.fetchPosts()
    },
  },
}
</script>
