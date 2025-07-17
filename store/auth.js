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
  async login({ commit }, credentials) {
    try {
      const response = await this.$axios.$post("/auth/login", credentials);
      const token = response.access_token;
      // Asumsi API Anda mengembalikan data user bersama token saat login
      // Jika tidak, Anda perlu memanggil endpoint /api/users/{id} atau /api/user setelah login berhasil
      const user = response.user || null;

      if (token) {
        localStorage.setItem("auth_token", token);
        this.$axios.setToken(token, "Bearer");
        commit("SET_TOKEN", token);
        commit("SET_USER", user); // Simpan user data
        commit("SET_LOGIN_STATUS", true);
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
      // Panggil endpoint logout di Laravel untuk menghapus token di server
      await this.$axios.$post("/logout");
    } catch (error) {
      // Log error logout tapi tetap lanjutkan proses logout lokal
      console.error("Logout API call failed, but logging out locally:", error);
    } finally {
      commit("LOGOUT");
      localStorage.removeItem("auth_token");
      this.$axios.setToken(false); // Hapus token dari header Axios
      return true;
    }
  },
  // Untuk memuat ulang data user jika hanya token yang ada (misal setelah refresh halaman)
  async fetchUser({ commit, getters }) {
    if (localStorage.getItem("auth_token") && !getters.isLoggedIn) {
      // Hanya fetch jika ada token tapi belum login di store
      this.$axios.setToken(localStorage.getItem("auth_token"), "Bearer");
      try {
        // Asumsi ada endpoint yang mengembalikan data user yang sedang login
        const response = await this.$axios.$get(
          "/users/" + (getters.user?.id || 1)
        ); // Atau GET /api/user jika ada endpoint universal
        commit("SET_USER", response.data);
        commit("SET_LOGIN_STATUS", true);
        return true;
      } catch (error) {
        console.error("Gagal memuat user setelah refresh:", error);
        commit("LOGOUT"); // Logout jika token tidak valid
        return false;
      }
    }
    return false;
  },
};

export const getters = {
  isLoggedIn: (state) => state.loggedIn,
  user: (state) => state.user,
  // Mengecek role user
  hasRole: (state) => (role) => {
    return (
      state.user &&
      state.user.roles &&
      state.user.roles.some((r) => r.name === role)
    );
  },
};
