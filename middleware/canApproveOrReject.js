export default function ({ store, redirect }) {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const hasRole = store.getters["auth/hasRole"];

  if (!isLoggedIn) {
    return redirect("/auth/login");
  }

  if (!hasRole("pimpinan") && !hasRole("HR")) {
    return redirect("/");
  }
}
