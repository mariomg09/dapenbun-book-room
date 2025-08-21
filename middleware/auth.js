export default function ({ store, redirect }) {
  // Jika user tidak terautentikasi (tidak login)
  if (!store.getters["auth/isLoggedIn"]) {
    
    return redirect("/auth/login");
  }
}
