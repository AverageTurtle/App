<template>
  <!-- Tags -->
  <div v-if="tags.length" class="w-full overflow-hidden">
    <TransitionCollapse>
      <div v-if="isActive">
        <!-- Workaround for this not jumping is having a div before -->
        <div class="tag-container min-w-full">
          <button
            v-for="tag in tags"
            :key="tag"
            type="button"
            class="tag color-util"
            @click="getSpecificTag(tag)"
            v-text="tag"
          />
        </div>
      </div>
    </TransitionCollapse>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

// Components
import TransitionCollapse from '~/components/utils/TransitionCollapse.vue'

export default {
  name: 'PostTags',

  components: { TransitionCollapse },

  props: {
    tags: {
      type: Array,
      default() {
        return undefined
      },
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    ...mapMutations(['resetPID', 'tagManager']),

    getSpecificTag(tag) {
      this.resetPID()

      this.tagManager({
        operation: 'reset',
      })

      this.tagManager({
        operation: 'add',
        tag: {
          name: tag,
        },
      })
    },
  },
}
</script>
