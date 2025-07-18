export const state = () => ({
  loggedIn: false,
  token: null,
  user: null,
});

export const mutations = {
  SET_LOGIN_STATUS(state, status) {
    state.loggedIn = status;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
    state.loggedIn = !!user;
  },
  LOGOUT(state) {
    state.loggedIn = false;
    state.token = null;
    state.user = null;
  },
};

export const actions = {
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await this.$axios.$post("/auth/login", credentials);
      const token = response.access_token;

      if (token) {
        localStorage.setItem("auth_token", token);
        this.$axios.setToken(token, "Bearer");
        commit("SET_TOKEN", token);
        commit("SET_LOGIN_STATUS", true);
        dispatch("fetchUser");
        return true;
      } else {
        throw new Error("Token tidak diterima setelah login.");
      }
    } catch (error) {
      console.error("Login gagal", error.response?.data?.message || error.message);
      return false;
    }
  },

  async logout({ commit }) {
    try {
      await this.$axios.$post("/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      commit("LOGOUT");
      localStorage.removeItem("auth_token");
      this.$axios.setToken(false);
      return true;
    }
  },

  async fetchUser({ commit, getters }) {
    if (localStorage.getItem("auth_token") && !getters.isLoggedIn) {
      this.$axios.setToken(localStorage.getItem("auth_token"), "Bearer");
      try {
        const response = await this.$axios.$get("/user");
        commit("SET_USER", response.data);
        commit("SET_LOGIN_STATUS", true);
        return true;
      } catch (error) {
        console.error("Gagal memuat user:", error);
        commit("LOGOUT");
        return false;
      }
    }
    return false;
  },
};

export const getters = {
  isLoggedIn: (state) => state.loggedIn,
  user: (state) => state.user,
  hasRole: (state) => (role) => {
    return state.user?.roles?.some((r) => r.name === role);
  },
};
