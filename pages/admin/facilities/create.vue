<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah Fasilitas Baru</h2>
    <FacilityForm @formSubmitted="facilityCreated" />
  </div>
</template>

<script>
import FacilityForm from '~/components/admin/facilities/FacilityForm.vue';

export default {
  name: 'AdminFacilityCreate',
  layout: 'default',
  middleware: ['auth'],
  // middleware: ['auth', 'role:admin'],

  head() {
    return {
      title: 'Tambah Fasilitas',
    };
  },

  components: {
    FacilityForm,
  },

  methods: {
    facilityCreated() {
      alert('Fasilitas berhasil ditambahkan!');
      this.$router.push('/admin/facilities');
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>