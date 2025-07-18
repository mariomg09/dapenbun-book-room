<template>
  <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama Role:</label>
      <input
        v-model="form.name"
        type="text"
        id="name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-6">
      <label for="guard_name" class="block text-gray-700 text-sm font-bold mb-2">Guard Name:</label>
      <select
        v-model="form.guard_name"
        id="guard_name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option value="api">api</option> <option value="web">web</option> </select>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? 'Perbarui' : 'Tambah' }} Role
      </button>
      <NuxtLink to="/admin/roles" class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800">
        Batal
      </NuxtLink>
    </div>

    <p v-if="formError" class="text-red-500 text-sm mt-4">{{ formError }}</p>
  </form>
</template>

<script>
export default {
  name: 'RoleForm',
  props: {
    role: {
      type: Object,
      default: null, // Default null untuk mode tambah
    },
  },
  data() {
    return {
      form: {
        name: '',
        guard_name: 'api', // Default guard_name
      },
      formError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.role;
    },
  },
  watch: {
    role: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.guard_name = newVal.guard_name || 'api';
        }
      },
    },
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(`/roles/${this.role.id}`, this.form);
        } else {
          response = await this.$axios.$post('/roles', this.form);
        }
        this.$emit('formSubmitted');
      } catch (e) {
        this.formError = e.response?.data?.message || e.message || 'Terjadi kesalahan saat menyimpan role.';
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(', ');
        }
        console.error('Error submitting role form:', e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>