export const state = () => ({
  isSidebarOpen: false,
});

export const mutations = {
  SET_SIDEBAR_STATE(state, isOpen) {
    state.isSidebarOpen = isOpen;
  },
  TOGGLE_SIDEBAR(state) {
    state.isSidebarOpen = !state.isSidebarOpen;
  },
};

export const actions = {
  setSidebarState({ commit }, isOpen) {
    commit("SET_SIDEBAR_STATE", isOpen);
  },
  toggleSidebar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
};
