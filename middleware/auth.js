export default function ({ store, redirect }) {
  // Jika user tidak terautentikasi (tidak login)
  if (!store.getters["auth/isLoggedIn"]) {
    // Redirect user ke halaman login
    return redirect("/auth/login");
  }
}
