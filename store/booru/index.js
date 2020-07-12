import {
  booruList,
  findBoorusWithValueByKey,
  booruTypeList,
} from '~/assets/lib/rule-34-shared-resources/util/BooruUtils.js'

export const state = () => ({
  API: {
    url:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8100/'
        : 'https://api.r34.app/',
  },

  booru: {
    active: 0, // This is saved to localStorage // This is an index to booru.list
    list: booruList,
  },

  queries: {
    pid: undefined, // Initial PID is set from booru.active
  },

  posts: {
    data: [],
  },

  search: {
    addedTags: [],
    searchedTags: [],

    blacklistFilter: { isActive: false },
  },
})

export const getters = {
  getActiveBooru(state) {
    return state.booru.list[state.booru.active]
  },

  getActiveBooruType: (state, getters) => {
    return findBoorusWithValueByKey(
      getters.getActiveBooru.type,
      'type',
      booruTypeList
    )[0]
  },

  // This is only used for Selector.vue
  getFilteredBooruList: (state, getters, rootState) => {
    return rootState.user.settings.nsfw.value
      ? findBoorusWithValueByKey(true, 'nsfw', state.booru.list)
      : findBoorusWithValueByKey(false, 'nsfw', state.booru.list)
  },
}

export const mutations = {
  setActiveBooru(state, value) {
    state.booru.active = value
  },

  setPIDQuery(state, value) {
    state.queries.pid = value
  },

  setPostsData(state, value) {
    state.posts.data = value
  },

  setAddedTags(state, value) {
    state.search.addedTags = value
  },

  pushAddedTags(state, value) {
    state.search.addedTags.push(value)
  },

  setSearchedTags(state, value) {
    state.search.searchedTags = value
  },

  setBlacklistFilterActive(state, value) {
    state.search.blacklistFilter.isActive = value
  },
}

export const actions = {
  activeBooruManager({ state, commit }, domain) {
    // Search for the domain
    const booruData = findBoorusWithValueByKey(
      domain,
      'domain',
      state.booru.list
    )[0]

    const booruIndex = state.booru.list.indexOf(booruData) // findIndex could be used

    commit('setActiveBooru', booruIndex)
  },

  postsManager({ commit }, { operation, value }) {
    switch (operation) {
      case 'set':
        commit('setPostsData', value)
        break

      case 'concat':
        commit('setPostsData', [...new Set(state.posts.data.concat(value))])
        break

      default:
        throw new Error('No operation specified')
    }
  },

  pidManager({ state, commit, getters }, { operation, value }) {
    switch (operation) {
      case 'add':
        commit('setPIDQuery', state.queries.pid + 1)
        break

      case 'subtract':
        commit('setPIDQuery', state.queries.pid - 1)
        break

      case 'set':
        commit('setPIDQuery', value)
        break

      case 'reset':
        commit('setPIDQuery', getters.getActiveBooruType.initialPageID)
        break

      default:
        throw new Error('No operation specified')
    }
  },

  addedTagsManager({ state, commit }, { operation, value }) {
    switch (operation) {
      case 'add':
        // value: string
        if (!state.search.addedTags.includes(value))
          commit('pushAddedTags', value)
        break

      case 'concat':
        // value: string[]
        commit('setAddedTags', state.search.addedTags.concat(value))
        break

      case 'remove':
        // value: string
        commit(
          'setAddedTags',
          state.search.addedTags.filter((tag) => {
            return tag !== value
          })
        )
        break

      case 'reset':
        commit('setAddedTags', [])
        break

      default:
        throw new Error('No operation specified')
    }
  },

  searchedTagsManager({ commit }, { operation, value }) {
    switch (operation) {
      case 'set':
        commit('setSearchedTags', value)
        break

      case 'reset':
        commit('setSearchedTags', [])
        break

      default:
        throw new Error('No operation specified')
    }
  },

  createAPIURL({ getters, rootState }, { mode, postID, tag }) {
    const domainData = getters.getActiveBooru

    const queryObj = {
      posts: {
        limit: rootState.user.settings.postsPerPage.value,
        pid: rootState.booru.queries.pid,
        tags: rootState.booru.search.addedTags.join('+'),
        score: rootState.user.settings.score.value,
      },

      singlePost: {
        id: postID,
      },

      tags: { tag },
    }

    const url = new URL(
      rootState.booru.API.url + 'booru/' + domainData.type + '/' + mode
    )
    url.searchParams.append('domain', domainData.domain)

    switch (mode) {
      case 'posts':
        url.searchParams.append('limit', queryObj.posts.limit)
        url.searchParams.append('pid', queryObj.posts.pid)
        url.searchParams.append('tags', queryObj.posts.tags)
        url.searchParams.append('score', '>=' + queryObj.posts.score)
        break

      case 'single-post':
        url.searchParams.append('id', queryObj.singlePost.id)
        break

      case 'tags':
        url.searchParams.append('tag', queryObj.tags.tag)
        // url.searchParams.append('limit', queryObj.limit)
        break

      default:
        throw new Error('No mode specified')
    }

    if (domainData.config) {
      url.searchParams.append('config', JSON.stringify(domainData.config))
    }

    return url.toString()
  },

  async fetchPosts({ dispatch, commit }, mode) {
    const url = await dispatch('createAPIURL', { mode: 'posts' })

    const response = await dispatch(
      'simpleFetch',
      {
        url,
      },
      { root: true }
    )

    if (mode === 'concat') commit('concatPostsData', response)
    else commit('setPostsData', response)
  },

  async fetchSearchTag({ dispatch, commit }, tag) {
    const url = await dispatch('createAPIURL', { mode: 'tags', tag })

    const response = await dispatch(
      'simpleFetch',
      {
        url,
      },
      { root: true }
    )

    commit('setSearchedTags', response)
  },
}