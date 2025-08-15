<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Daftar Booking Umum</h2>

    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filter Booking</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="filter-title" class="block text-sm font-medium text-gray-700">Judul Booking:</label>
          <input
            type="text"
            v-model="filters.title"
            id="filter-title"
            placeholder="Cari judul..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label for="filter-room" class="block text-sm font-medium text-gray-700">Ruangan:</label>
          <select
            v-model.number="filters.room_id"
            id="filter-room"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Ruangan --</option>
            <option v-for="room in roomsOptions" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="filter-status" class="block text-sm font-medium text-gray-700">Status:</label>
          <select
            v-model.number="filters.status_id"
            id="filter-status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Status --</option>
            <option v-for="status in statusesOptions" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="filter-user" class="block text-sm font-medium text-gray-700">User:</label>
          <input
            type="number"
            v-model.number="filters.user_id"
            id="filter-user"
            placeholder="Cari User ID..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label for="filter-search-all" class="block text-sm font-medium text-gray-700">Cari Umum:</label>
          <input
            type="text"
            v-model="filters.search"
            id="filter-search-all"
            placeholder="Cari judul/info..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          @click="applyFilters"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Terapkan Filter
        </button>
        <button
          @click="resetFilters"
          class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
        >
          Reset
        </button>
      </div>
    </div>


    <div v-if="loading" class="text-center text-gray-600">Memuat booking...</div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat booking: {{ error }}
    </div>
    <div v-else-if="bookings.length === 0" class="text-center text-gray-500">
      Tidak ada booking yang ditemukan.
    </div>
    <div v-else>
      <BookingTable :bookings="bookings" @bookingDeleted="fetchBookings" />

      <!-- Kontrol Pagination -->
      <div class="flex justify-center mt-6">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Sebelumnya
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700', 'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50']">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Selanjutnya
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import BookingTable from "~/components/bookings/BookingTable.vue";

export default {
  name: "GeneralBookingsIndexPage",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Daftar Booking Umum",
    };
  },

  components: {
    BookingTable,
  },

  data() {
    return {
      bookings: [],
      loading: true,
      error: null,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
      // --- TAMBAHAN FILTER ---
      filters: {
        title: '',
        room_id: null,
        status_id: null,
        user_id: null, // Untuk filter berdasarkan user ID pembuat booking
        search: '', // Untuk search di title dan information
      },
      roomsOptions: [],    // Untuk dropdown filter ruangan
      statusesOptions: [], // Untuk dropdown filter status
      // --- AKHIR TAMBAHAN FILTER ---
    };
  },

  async fetch() {
    await Promise.all([
      this.fetchBookings(),
      this.fetchRoomsOptions(),    // Panggil untuk mengisi dropdown filter ruangan
      this.fetchStatusesOptions(), // Panggil untuk mengisi dropdown filter status
    ]);
  },

  methods: {
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          ...this.filters,
        };
        // Panggil API GET /api/bookings untuk semua booking
        const response = await this.$axios.$get("/bookings?with_relations=true", { params });
        
        this.bookings = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;

      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching general bookings:", e);
      } finally {
        this.loading = false;
      }
    },
    async fetchRoomsOptions() {
        try {
            const response = await this.$axios.$get('/rooms'); // Asumsi endpoint ini mengembalikan data paginasi
            this.roomsOptions = response.data.data; // Akses data.data
        } catch (e) {
            console.error('Error fetching rooms for filter dropdown:', e);
        }
    },
    async fetchStatusesOptions() {
        try {
            const response = await this.$axios.$get('/status/options'); // Endpoint untuk status options
            this.statusesOptions = response.data; // Akses response.data (karena options endpoint)
        } catch (e) {
            console.error('Error fetching statuses for filter dropdown:', e);
        }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchBookings();
      }
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchBookings();
    },
    resetFilters() {
      this.filters = {
        title: '',
        room_id: null,
        status_id: null,
        user_id: null,
        search: '',
      };
      this.currentPage = 1;
      this.fetchBookings();
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>