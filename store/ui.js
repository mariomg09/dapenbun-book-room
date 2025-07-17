export const state = () => ({
  isSidebarOpen: true,
});

export const mutations = {
  TOGGLE_SIDEBAR(state) {
    state.isSidebarOpen = !state.isSidebarOpen;
  },
  SET_SIDEBAR(state, value) {
    state.isSidebarOpen = value;
  },
};

export const actions = {
  toggleSidebar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  setSidebar({ commit }, value) {
    commit("SET_SIDEBAR", value);
  },
};
