<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-blue-800 mb-8">
        Jadwal Ruangan Tersedia Hari Ini
      </h2>

      <div v-if="loading" class="text-center text-gray-600 text-lg">
        Memuat jadwal...
      </div>
      <div v-else-if="error" class="text-center text-red-600 text-lg">
        Gagal memuat jadwal: {{ error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(roomBookings, roomName) in groupedBookings"
          :key="roomName"
          class="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            Ruangan: {{ roomName }}
          </h3>

          <div
            v-if="roomBookings.length === 0"
            class="text-center text-gray-500 mt-4"
          >
            <p>Tidak ada booking hari ini.</p>
          </div>
          <ul v-else class="space-y-4">
            <li
              v-for="booking in roomBookings"
              :key="booking.id"
              class="border-l-4 border-gray-400 pl-4"
            >
              <p class="text-gray-900 font-semibold">{{ booking.title }}</p>
              <p class="text-sm text-gray-700">
                Waktu: {{ formatTime(booking.start_time) }} -
                {{ formatTime(booking.end_time) }}
              </p>
              <p class="text-sm text-gray-700">
                Peserta: {{ booking.participants }} orang
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "schedule",
  layout: "default",

  data() {
    return {
      schedule: {}, // Mengubah `schedule` dari array menjadi objek
      loading: true,
      error: null,
    };
  },

  computed: {
    // Properti computed untuk mengelompokkan booking
    groupedBookings() {
      const groups = {};
      // Dapatkan daftar ruangan dari data()
      // Asumsi ada endpoint untuk mendapatkan semua ruangan
      // Ini akan kita perbaiki dengan memanggil API di 'created()'

      // Untuk sementara, kita bisa membuat array dummy atau memanggil API di created()

      // Contoh: Mengelompokkan booking berdasarkan nama ruangan
      if (this.schedule && this.schedule["Ruang A"]) {
        return this.schedule;
      }
      return {};
    },
  },

  async created() {
    try {
      const today = new Date().toISOString().split("T")[0];
      // --- PERBAIKAN DI SINI ---
      const res = await this.$axios.$get(
        `/public/bookings/schedule?date=${today}&with_relations=true`
      );
      // Pastikan data yang diambil adalah array di dalam res.data.data
      const bookings = res.data.data;

      const rooms = ["Ruang A", "Ruang B", "Ruang C"]; // Nama ruangan hardcode

      const schedule = {};
      rooms.forEach((roomName) => {
        schedule[roomName] = bookings.filter(
          (booking) => booking.room.name === roomName
        );
      });

      this.schedule = schedule;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan memuat data.";
    } finally {
      this.loading = false;
    }
  },

  methods: {
    formatTime(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
