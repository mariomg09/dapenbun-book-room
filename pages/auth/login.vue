<template>
  <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">Login ke Akun Anda</h2>

    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2"
          >Username:</label
        >
        <input
          v-model="loginForm.username"
          type="text"
          id="username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Password:</label
        >
        <input
          v-model="loginForm.password"
          type="password"
          id="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
        >
          Login
        </button>
        <!-- <NuxtLink to="/auth/register" class="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
          Belum punya akun? Register!
        </NuxtLink> -->
      </div>
      <p v-if="loginError" class="text-red-500 text-sm mt-4">{{ loginError }}</p>
      <p v-if="loginSuccess" class="text-green-500 text-sm mt-4">{{ loginSuccess }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex"; // Import mapActions untuk memanggil aksi Vuex

export default {
  name: "LoginPage",
  layout: "auth", // Gunakan layout 'auth' yang baru dibuat

  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginError: null,
      loginSuccess: null,
    };
  },

  methods: {
    ...mapActions("auth", ["login"]),

    async login() {
      this.loginError = null;
      this.loginSuccess = null;
      try {
        const success = await this.$store.dispatch("auth/login", this.loginForm);

        if (success) {
          this.loginSuccess = "Login berhasil! Mengarahkan ke dashboard...";
          this.$store.commit("auth/SET_USER");
          this.$router.push("/");
        } else {
          this.loginError = "Login gagal. Periksa username dan password Anda.";
        }
      } catch (e) {
        this.loginError =
          "Terjadi kesalahan saat login: " + (e.response?.data?.message || e.message);
        console.error("Login error:", e.response?.data || e);
      }
    },
  },

  mounted() {
    if (this.$store.getters["auth/isLoggedIn"]) {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
/* Styling khusus untuk halaman login */
</style>
