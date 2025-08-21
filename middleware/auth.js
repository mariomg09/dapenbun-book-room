export default async function ({ store, redirect }) {
  if (process.client && !store.getters["auth/isLoggedIn"]) {
    const token = localStorage.getItem("auth_token");

    if (token) {
      const success = await store.dispatch("auth/fetchUser");

      if (!success) {
        return redirect("/auth/login");
      }
    } else {
      return redirect("/auth/login");
    }
  } else if (!store.getters["auth/isLoggedIn"]) {
    return redirect("/auth/login");
  }
}
