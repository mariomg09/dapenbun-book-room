<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-blue-800 mb-8">
        Jadwal Ruangan Tersedia
      </h2>

      <!-- <div
        v-if="isLoggedIn && user"
        class="bg-white p-6 rounded-lg shadow-md mb-8 max-w-lg mx-auto"
      >
        <h3 class="text-xl font-semibold mb-2">Informasi Akun Anda</h3>
        <p><strong>Nama:</strong> {{ user.name }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Roles Anda:</strong>
          <span v-if="user.roles && user.roles.length > 0">
            {{ user.roles.map((role) => role.name).join(", ") }}
          </span>
          <span v-else class="italic text-gray-500"
            >Tidak ada role yang ditemukan.</span
          >
        </p>
        <p v-if="user.department_id">
          <strong>ID Departemen:</strong> {{ user.department_id }}
        </p>
        <p v-if="user.urusan_id">
          <strong>ID Urusan:</strong> {{ user.urusan_id }}
        </p>
      </div> -->
      <div v-if="loading" class="text-center text-gray-600 text-lg">
        Memuat jadwal...
      </div>
      <div v-else-if="error" class="text-center text-red-600 text-lg">
        Gagal memuat jadwal: {{ error }}
      </div>
      <div
        v-else-if="bookings.length === 0"
        class="text-center text-gray-500 text-lg"
      >
        Tidak ada booking yang disetujui saat ini.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
        >
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ booking.title }}
          </h3>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Ruangan:</span> {{ booking.room.name }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Waktu:</span>
            {{ formatTime(booking.start_time) }} -
            {{ formatTime(booking.end_time) }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Tanggal:</span>
            {{ formatDate(booking.start_time) }}
          </p>
          <p class="text-gray-700 mb-1">
            <span class="font-medium">Peserta:</span>
            {{ booking.participants }} orang
          </p>
          <p
            v-if="booking.information"
            class="text-gray-600 text-sm mt-2 italic"
          >
            "{{ booking.information }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; // Import mapGetters

export default {
  name: "IndexPage",
  layout: "default",

  head() {
    return {
      title: "Jadwal Publik",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Jadwal ketersediaan ruangan booking secara publik.",
        },
      ],
    };
  },

  data() {
    return {
      bookings: [],
      loading: true,
      error: null,
    };
  },

  computed: {
    ...mapGetters("auth", ["isLoggedIn", "user"]), // Map getters dari store auth
  },

  async fetch() {
    try {
      const response = await this.$axios.$get(
        "/public/bookings/schedule?with_relations=true"
      );
      this.bookings = response.data.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data.";
      console.error("Error fetching public schedule:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    formatDate(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatTime(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  // Tambahkan ini untuk debugging di konsol saat page dimuat
  mounted() {
    console.log("User state in IndexPage:", this.user);
    if (this.user && this.user.roles) {
      console.log(
        "User roles:",
        this.user.roles.map((r) => r.name)
      );
    } else if (this.isLoggedIn) {
      console.log("User is logged in, but roles data is missing or empty.");
    } else {
      console.log("User is not logged in.");
    }
  },
};
</script>

<style>
/* ... styling ... */
</style>
