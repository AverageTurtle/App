import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import { findBoorusWithValueByKey } from '~/assets/lib/rule-34-shared-resources/util/BooruUtils.js'

export default {
  computed: {
    ...mapState(['dashBoardData', 'booruData', 'searchData']),
    ...mapGetters(['getActiveBooru', 'getActiveBooruType']),

    routerQueries() {
      return this.$router.query
    },
  },

  watch: {
    '$router.query': (newVal, oldVal) => {
      console.log(newVal, oldVal)

      this.QueryHandler(newVal, oldVal)
    },
  },

  created() {
    // this.checkAndAddToStateURLQueries()

    this.setDefaultPageIDIfUndefined()

    // if (this.dashBoardData.data.length) {
    //   console.debug('Skip loading anything, we already have data')
    //   return
    // }

    // this.getPosts()
  },

  methods: {
    ...mapMutations([
      'tagManager',
      'booruDataManager',
      'errorManager',
      'setPID',
    ]),
    ...mapActions(['fetchWithMode', 'pidManager']),

    QueryHandler(newVal, oldVal) {
      if (newVal.pid === oldVal.pid) console.log('PID has NOT changed')
      else {
        console.log('New PID set')
        this.setPID(newVal.pid)
      }

      this.getPosts()
    },

    async getPosts() {
      // console.debug('Loading posts from mixin')
      await this.fetchWithMode({ mode: 'posts', returnMode: 'add' })
    },

    checkAndAddToStateURLQueries() {
      const { domain, pid, tags } = this.routerQueries

      /*
       * Domain
       */
      if (domain) {
        // Search for the domain
        const booruData = findBoorusWithValueByKey(
          domain,
          'domain',
          this.booruData.boorus
        )[0]

        // Check if domain data exists
        if (!booruData) {
          this.errorManager({
            operation: 'set',
            data: new Error(`The current domain "${domain}" couldnt be found`),
          })
          return
        }

        // console.debug(`Loading domain "${domain}" from URL query`)

        // Use query domain
        this.booruDataManager(domain)
      }

      /*
       * Page ID
       */
      if (pid) {
        // console.debug(`Loading PID "${pid}" from URL query`)

        this.pidManager({
          operation: 'specific',
          value: pid,
        })
      }

      /*
       * Tags
       */
      if (tags) {
        const tagArray = tags.split(',')

        // console.debug('Loading Tags from URL query')

        // console.log(tagArray)

        this.tagManager({
          operation: 'concat',
          tagArray,
        })
      }
    },

    setDefaultPageIDIfUndefined() {
      // Set PID on boot
      if (this.dashBoardData.pid === undefined) {
        // console.debug('Setting default PID')

        this.pidManager({
          operation: 'specific',
          value: this.getActiveBooruType.initialPageID,
        })
      }
    },

    // setURLQueries() {
    //   this.$router.push({
    //     // path: this.$route.path,
    //     query: {
    //       domain: this.stateDomain,
    //       pid: this.statePID,
    //       ...(this.stateTags && { tags: this.stateTags }),
    //     },
    //   })
    // },
  },
}
