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
        // Simpan token di localStorage
        if (process.client) {
          localStorage.setItem("auth_token", token);
        }

        this.$axios.setToken(token, "Bearer");
        commit("SET_TOKEN", token);
        commit("SET_LOGIN_STATUS", true);

        await dispatch("fetchUser");
        return true;
      } else {
        throw new Error("Token tidak diterima setelah login.");
      }
    } catch (error) {
      console.error(
        "Login gagal",
        error.response?.data?.message || error.message
      );
      return false;
    }
  },

  async logout({ commit }) {
    try {
      await this.$axios.$post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      commit("LOGOUT");

      // Hapus token dari localStorage
      if (process.client) {
        localStorage.removeItem("auth_token");
      }

      this.$axios.setToken(false);
      return true;
    }
  },

  async fetchUser({ commit, state }) {
    try {
      // Jika ada token di state atau localStorage
      let token = state.token;
      if (!token && process.client) {
        token = localStorage.getItem("auth_token");
      }

      if (token) {
        this.$axios.setToken(token, "Bearer");
        const response = await this.$axios.$get("/user");

        commit("SET_TOKEN", token);
        commit("SET_USER", response.data);
        commit("SET_LOGIN_STATUS", true);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Gagal memuat user:", error);

      // Jika token invalid/expired, bersihkan semua data auth
      commit("LOGOUT");
      if (process.client) {
        localStorage.removeItem("auth_token");
      }
      this.$axios.setToken(false);

      return false;
    }
  },

  // Action untuk refresh token jika diperlukan
  async refreshToken({ commit, dispatch }) {
    try {
      if (!process.client) return false;

      const token = localStorage.getItem("auth_token");
      if (!token) return false;

      const response = await this.$axios.$post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newToken = response.access_token;
      if (newToken) {
        localStorage.setItem("auth_token", newToken);
        this.$axios.setToken(newToken, "Bearer");
        commit("SET_TOKEN", newToken);

        await dispatch("fetchUser");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Refresh token gagal:", error);
      dispatch("logout");
      return false;
    }
  },
};

export const getters = {
  isLoggedIn: (state) => state.loggedIn,
  user: (state) => state.user,
  token: (state) => state.token,
  hasRole: (state) => (role) => {
    return state.user?.roles?.some((r) => r.name === role);
  },
};
