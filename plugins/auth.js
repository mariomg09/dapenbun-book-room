export default function ({ store, $axios }) {
  // Ketika aplikasi dimuat, cek apakah ada token di localStorage
  if (process.client) {
    const token = localStorage.getItem("auth_token");

    if (token) {
      $axios.setToken(token, "Bearer");
      store.commit("auth/SET_TOKEN", token);
      store.dispatch("auth/fetchUser");
    }
  }
}
