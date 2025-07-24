<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
        >Nama:</label
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
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :required="!isEditing"
      />
      <p v-if="isEditing" class="text-sm text-gray-500 mt-1">
        Kosongkan jika tidak ingin mengubah password.
      </p>
    </div>

    <div class="mb-4">
      <label
        for="password_confirmation"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Konfirmasi Password:</label
      >
      <input
        v-model="form.password_confirmation"
        type="password"
        id="password_confirmation"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :required="!isEditing && !!form.password"
      />
      <p v-if="isEditing && form.password" class="text-sm text-gray-500 mt-1">
        Isi jika mengubah password.
      </p>
    </div>

    <div class="mb-4">
      <label
        for="department_id"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Departemen:</label
      >
      <select
        v-model="form.department_id"
        id="department_id"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option :value="null">-- Pilih Departemen --</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label for="urusan_id" class="block text-gray-700 text-sm font-bold mb-2"
        >Urusan:</label
      >
      <select
        v-model="form.urusan_id"
        id="urusan_id"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option :value="null">-- Pilih Urusan --</option>
        <option v-for="urusan in urusans" :key="urusan.id" :value="urusan.id">
          {{ urusan.name }}
        </option>
      </select>
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">Roles:</label>
      <div v-if="loadingRoles" class="text-sm text-gray-500">
        Memuat roles...
      </div>
      <div v-else-if="rolesError" class="text-sm text-red-500">
        {{ rolesError }}
      </div>
      <div v-else class="grid grid-cols-2 gap-2">
        <div v-for="role in allRoles" :key="role.id" class="flex items-center">
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
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? "Perbarui" : "Tambah" }} User
      </button>
      <NuxtLink
        to="/admin/users"
        class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800"
      >
        Batal
      </NuxtLink>
    </div>

    <p v-if="formError" class="text-red-500 text-sm mt-4">{{ formError }}</p>
  </form>
</template>

<script>
export default {
  name: "UserForm",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        department_id: null,
        urusan_id: null,
        roles: [],
      },
      departments: [],
      urusans: [],
      allRoles: [],
      formError: null,
      loadingRoles: true,
      rolesError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.user;
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.username = newVal.username;
          this.form.email = newVal.email;
          this.form.department_id = newVal.department_id;
          this.form.urusan_id = newVal.urusan_id;
          this.form.roles = newVal.roles ? newVal.roles.map((r) => r.name) : [];
        }
      },
    },
  },
  async fetch() {
    try {
      const deptResponse = await this.$axios.$get("/departments");
      this.departments = deptResponse.data.data;
    } catch (e) {
      this.formError =
        "Gagal memuat daftar departemen: " +
        (e.response?.data?.message || e.message);
      console.error("Error fetching departments for user form:", e);
    }

    try {
      const urusanResponse = await this.$axios.$get("/urusan");
      this.urusans = urusanResponse.data.data;
    } catch (e) {
      this.formError =
        (this.formError ? this.formError + ", " : "") +
        "Gagal memuat daftar urusan: " +
        (e.response?.data?.message || e.message);
      console.error("Error fetching urusans for user form:", e);
    }

    this.loadingRoles = true;
    this.rolesError = null;
    try {
      const roleResponse = await this.$axios.$get("/roles");
      this.allRoles = roleResponse.data.data;
    } catch (e) {
      this.rolesError =
        "Gagal memuat daftar role: " + (e.response?.data?.message || e.message);
      console.error("Error fetching roles for user form:", e);
    } finally {
      this.loadingRoles = false;
    }
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        const formData = { ...this.form };
        delete formData.password_confirmation;

        if (this.isEditing && !formData.password) {
          delete formData.password;
        }

        if (this.isEditing) {
          response = await this.$axios.$put(`/users/${this.user.id}`, formData);
        } else {
          response = await this.$axios.$post("/users", formData);
        }
        this.$emit("formSubmitted");
      } catch (e) {
        this.formError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat menyimpan user.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(", ");
        }
        console.error("Error submitting user form:", e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>
