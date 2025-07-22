export default function ({ store, redirect, route }) {
  const { roles } = route.meta; // Ambil roles yang dibutuhkan dari meta rute

  // Jika middleware ini tidak diberi parameter role di rute, lewati saja
  if (!roles) {
    return;
  }

  const userRoles = store.getters["auth/user"]?.roles?.map((r) => r.name) || [];
  const hasRequiredRole = roles.some((role) => userRoles.includes(role));

  // Jika user tidak punya role yang dibutuhkan
  if (!hasRequiredRole) {
    return redirect("/"); // Redirect ke halaman utama atau halaman 403
  }
}
