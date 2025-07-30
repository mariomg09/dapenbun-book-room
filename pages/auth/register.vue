<template>
  <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">
      Daftar Akun Baru
    </h2>

    <form @submit.prevent="register">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
          >Nama Lengkap:</label
        >
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-4">
        <label for="username" class="block text-gray-700 text-sm font-bold mb-2"
          >Username:</label
        >
        <input
          v-model="form.username"
          type="text"
          id="username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email:</label
        >
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Password:</label
        >
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-6">
        <label
          for="password_confirmation"
          class="block text-gray-700 text-sm font-bold mb-2"
          >Konfirmasi Password:</label
        >
        <input
          v-model="form.password_confirmation"
          type="password"
          id="password_confirmation"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2"
          >Pilih Role:</label
        >
        <div v-if="loadingRoles" class="text-sm text-gray-500">
          Memuat roles...
        </div>
        <div v-else-if="rolesError" class="text-sm text-red-500">
          {{ rolesError }}
        </div>
        <div v-else class="grid grid-cols-2 gap-2">
          <div
            v-for="role in allRoles"
            :key="role.id"
            class="flex items-center"
          >
            <input
              type="checkbox"
              :id="`role-${role.id}`"
              :value="role.name"
              v-model="form.roles"
              class="mr-2"
            />
            <label :for="`role-${role.id}`" class="text-sm text-gray-700">{{
              role.name
            }}</label>
          </div>
        </div>
        <p
          v-if="!form.roles.length && !loadingRoles && !rolesError"
          class="text-sm text-red-500 mt-1"
        >
          Pilih setidaknya satu role.
        </p>
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
        >
          Daftar
        </button>
        <NuxtLink
          to="/auth/login"
          class="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
        >
          Sudah punya akun? Login!
        </NuxtLink>
      </div>

      <p v-if="registerError" class="text-red-500 text-sm mt-4">
        {{ registerError }}
      </p>
      <p v-if="registerSuccess" class="text-green-500 text-sm mt-4">
        {{ registerSuccess }}
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  layout: "auth",

  data() {
    return {
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: ["user"], // Default: Beri role 'user' secara otomatis jika tidak memilih
      },
      allRoles: [], // Untuk daftar semua roles yang bisa dipilih
      loadingRoles: true, // Status loading roles
      rolesError: null, // Error jika gagal memuat roles
      registerError: null,
      registerSuccess: null,
    };
  },

  async fetch() {
    this.loadingRoles = true;
    this.rolesError = null;
    try {
      const response = await this.$axios.$get("/auth/roles/options");
      this.allRoles = response.data;
    } catch (e) {
      this.rolesError =
        "Gagal memuat daftar role: " + (e.response?.data?.message || e.message);
      console.error("Error fetching roles for register form:", e);
    } finally {
      this.loadingRoles = false;
    }
  },

  methods: {
    async register() {
      this.registerError = null;
      this.registerSuccess = null;
      if (!this.form.roles.length) {
        this.registerError = "Pilih setidaknya satu role.";
        return;
      }

      try {
        const response = await this.$axios.$post("/auth/register", this.form);

        this.registerSuccess =
          response.message || "Pendaftaran berhasil! Silakan login.";
        this.$router.push("/auth/login");
      } catch (e) {
        this.registerError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat mendaftar.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.registerError = errors.join(", ");
        }
        console.error("Register error:", e.response?.data || e);
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
/* Styling khusus halaman register */
</style>
