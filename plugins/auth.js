export default function ({ store, $axios }) {
  if (process.client) {
    const token = localStorage.getItem("auth_token");

    if (token) {
      $axios.setToken(token, "Bearer");
      store.commit("auth/SET_TOKEN", token);
      store.dispatch("auth/fetchUser");
    }
  }
}
