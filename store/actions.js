export default {
  // This a customisable Get request
  async axiosGet({ commit, dispatch }, dataObj) {
    // Reset errors cause we're trying again
    commit({
      type: dataObj.mutationToReturn,
      errors: null
    });

    // Debugging what url does it get
    // console.log(dataObj.url)
    // console.log(dataObj.mutationToReturn)

    // Actual axios get
    try {
      const response = await this.$axios.$get(
        this.state.generalData.apiUrl + dataObj.url
      );

      commit({
        type: dataObj.mutationToReturn,
        data: response
        // Sometimes its response sometimes its response.data
      });
      // console.log(response)
    } catch (error) {
      // console.error(error);
      commit({
        type: dataObj.mutationToReturn,
        errors: error
      });

      // Change to another Api
      dispatch("changeApi", {
        errors: error
      });
    }
  },

  // Change api to an alternative one
  async changeApi({ commit }) {
    if (this.state.generalData.apiUrl !== this.state.generalData.backupApiUrl) {
      //   console.log(`${dataObj.errors}, changing to alternative api`)

      await commit({
        type: "newApiUrl",
        newUrl: "https://r34-api-clone.herokuapp.com/"
      });
    }
  },

  // Change api to an alternative one
  async changePID({ commit }, dataObj) {
    if (dataObj.function === "add") {
      await commit("newDashBoardData", {
        pid: parseInt(this.state.dashBoardData.pid) + 1
      });
    } else if (dataObj.function === "subtract") {
      await commit("newDashBoardData", {
        pid: parseInt(this.state.dashBoardData.pid) - 1
      });
    } else if (dataObj.function === "reset") {
      await commit("newDashBoardData", {
        pid: 0
      });
    }
  },

  // Toggles the search (This is the way i found it to work since i cannot get components to talk to each other and im not doing a bus if i have vueX)
  async toggleSearchComponent({ commit }) {
    if (this.state.searchData.isActive) {
      await commit({
        type: "newSearchData",
        isActive: false
      });
    } else if (!this.state.searchData.isActive) {
      await commit({
        type: "newSearchData",
        isActive: true
      });
    }
  },

  async getAddedTags({ dispatch }) {
    await dispatch("axiosGet", {
      url: `posts?pid=${this.state.dashBoardData.pid}&limit=${
        this.state.generalData.postLimit
      }&tags=${this.state.searchData.tags.join("+")}`,
      mutationToReturn: "newDashBoardData"
    });
  }
};