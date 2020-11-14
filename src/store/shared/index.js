export default {
  state: {
    loading: false,
    error: null,
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },

    setError(state, payload) {
      state.error = payload;
    },

    cleanError(state) {
      state.error = null;
    },
  },

  actions: {
    cleanError(context) {
      context.commit("cleanError");
    },
  },

  getters: {
    loading(state) {
      return state.loading;
    },

    error(state) {
      return state.error;
    },
  },
};
