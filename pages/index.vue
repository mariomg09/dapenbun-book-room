<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">Jadwal Ruangan Tersedia</h1>

      <div v-if="loading" class="text-center text-gray-600 text-lg">
        Memuat jadwal...
      </div>
      <div v-else-if="error" class="text-center text-red-600 text-lg">
        Gagal memuat jadwal: {{ error }}
      </div>
      <div v-else-if="bookings.length === 0" class="text-center text-gray-500 text-lg">
        Tidak ada booking yang disetujui saat ini.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="booking in bookings" :key="booking.id"
             class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ booking.title }}</h2>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Ruangan:</span> {{ booking.room.name }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Waktu:</span>
            {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Tanggal:</span>
            {{ formatDate(booking.start_time) }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Peserta:</span> {{ booking.participants }} orang
          </p>
          <p v-if="booking.information" class="text-gray-600 text-sm mt-2 italic">
            "{{ booking.information }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage', // Ubah nama komponen jika perlu
  layout: 'default', // Gunakan layout default Anda

  data() {
    return {
      bookings: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    try {
      // Panggil API publik untuk jadwal booking
      // Parameter with_relations=true agar mendapatkan user, room, dan status
      const response = await this.$axios.$get('/public/bookings/schedule?with_relations=true');
      this.bookings = response.data.data; // Akses 'data.data' karena ini respons paginated
    } catch (e) {
      this.error = e.response?.data?.message || e.message || 'Terjadi kesalahan saat memuat data.';
      console.error('Error fetching public schedule:', e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    formatDate(datetime) {
      // Memformat tanggal (contoh: 10 Juli 2025)
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    formatTime(datetime) {
      // Memformat waktu (contoh: 10:30)
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style>
/* Anda bisa menambahkan styling khusus untuk halaman ini di sini, atau mengandalkan Tailwind CSS */
</style>