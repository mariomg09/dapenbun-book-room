<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
        >Nama Urusan:</label
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

    <div class="mb-6">
      <label for="head_id" class="block text-gray-700 text-sm font-bold mb-2"
        >Kepala Urusan:</label
      >
      <select
        v-model="form.head_id"
        id="head_id"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option :value="null">-- Pilih Kepala Urusan --</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }} ({{ user.username }})
        </option>
      </select>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? "Perbarui" : "Tambah" }} Urusan
      </button>
      <NuxtLink
        to="/admin/urusan"
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
  name: "UrusanForm",
  props: {
    urusan: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        department_id: null,
        head_id: null,
      },
      departments: [],
      users: [],
      formError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.urusan;
    },
  },
  watch: {
    urusan: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.department_id = newVal.department_id;
          this.form.head_id = newVal.head_id;
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
      console.error("Error fetching departments for dropdown:", e);
    }

    try {
      const userResponse = await this.$axios.$get("/users?with_relations=true");
      this.users = userResponse.data.data.filter(
        (user) =>
          user.roles &&
          (user.roles.some((role) => role.name === "pimpinan") ||
            user.roles.some((role) => role.name === "admin"))
      );
    } catch (e) {
      this.formError =
        (this.formError ? this.formError + ", " : "") +
        "Gagal memuat daftar user untuk kepala urusan: " +
        (e.response?.data?.message || e.message);
      console.error("Error fetching users for head_id dropdown:", e);
    }
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(
            `/urusan/${this.urusan.id}`,
            this.form
          );
        } else {
          response = await this.$axios.$post("/urusan", this.form); // Perhatikan URL: /urusan (singular)
        }
        this.$emit("formSubmitted");
      } catch (e) {
        this.formError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat menyimpan urusan.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(", ");
        }
        console.error("Error submitting urusan form:", e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>
