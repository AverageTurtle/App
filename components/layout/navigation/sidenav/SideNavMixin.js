import { mapState, mapMutations } from 'vuex'

export default {
  watch: {
    $route() {
      // console.log('route changed', this.$route)
      // console.log(this.$nuxt.$route.name)

      this.routeHandler()
    },
  },

  mounted() {
    this.routeHandler()
  },

  data() {
    return { isDashboard: false }
  },

  computed: {
    ...mapState('navigation', ['sideNav']),
  },

  methods: {
    ...mapMutations('navigation', ['setSideNavActive']),

    // Set different layout depending of the route
    routeHandler() {
      if (this.sideNav.isActive) this.setSideNavActive(false)

      switch (this.$nuxt.$route.name) {
        case 'index':
          this.isDashboard = true
          break

        default:
          this.isDashboard = false
          break
      }
    },
  },
}