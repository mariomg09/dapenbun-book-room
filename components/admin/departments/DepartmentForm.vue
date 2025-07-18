<template>
  <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama Departemen:</label>
      <input
        v-model="form.name"
        type="text"
        id="name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-6">
      <label for="head_id" class="block text-gray-700 text-sm font-bold mb-2">Kepala Departemen:</label>
      <select
        v-model="form.head_id"
        id="head_id"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option :value="null">-- Pilih Kepala Departemen --</option>
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
        {{ isEditing ? 'Perbarui' : 'Tambah' }} Departemen
      </button>
      <NuxtLink to="/admin/departments" class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800">
        Batal
      </NuxtLink>
    </div>

    <p v-if="formError" class="text-red-500 text-sm mt-4">{{ formError }}</p>
  </form>
</template>

<script>
export default {
  name: 'DepartmentForm',
  props: {
    department: {
      type: Object,
      default: null, // Default null untuk mode tambah
    },
  },
  data() {
    return {
      form: {
        name: '',
        head_id: null,
      },
      users: [], // Untuk daftar kepala departemen yang mungkin
      formError: null,
      isEditing: false,
    };
  },
  computed: {
    // Mengecek apakah form sedang dalam mode edit (jika ada prop department)
    isEditing() {
      return !!this.department;
    },
  },
  watch: {
    // Memuat data departemen ke form jika prop department berubah (untuk mode edit)
    department: {
      immediate: true, // Jalankan watcher segera setelah komponen dibuat
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.head_id = newVal.head_id;
        }
      },
    },
  },
  async fetch() {
    // Ambil daftar user untuk dropdown 'Kepala Departemen'
    try {
      const response = await this.$axios.$get('/users?with_relations=true'); // Ambil semua user, with_relations=true agar roles dimuat
      // Filter user yang bisa jadi kepala departemen (misal: punya role 'pimpinan' atau 'admin')
      this.users = response.data.data.filter(user => user.roles && (user.roles.some(role => role.name === 'pimpinan') || user.roles.some(role => role.name === 'admin')));
    } catch (e) {
      this.formError = 'Gagal memuat daftar user untuk kepala departemen: ' + (e.response?.data?.message || e.message);
      console.error('Error fetching users for head_id dropdown:', e);
    }
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(`/departments/${this.department.id}`, this.form);
        } else {
          response = await this.$axios.$post('/departments', this.form);
        }
        this.$emit('formSubmitted'); // Memberi tahu parent bahwa form berhasil disubmit
      } catch (e) {
        this.formError = e.response?.data?.message || e.message || 'Terjadi kesalahan saat menyimpan departemen.';
        if (e.response?.data?.errors) {
          // Tampilkan pesan validasi spesifik jika ada
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(', ');
        }
        console.error('Error submitting department form:', e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>