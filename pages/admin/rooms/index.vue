<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Ruangan</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/rooms/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Ruangan Baru
      </NuxtLink>
    </div>

    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filter Ruangan</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            for="filter-capacity"
            class="block text-sm font-medium text-gray-700"
            >Kapasitas:</label
          >
          <input
            type="number"
            v-model.number="filters.capacity"
            id="filter-capacity"
            placeholder="Filter kapasitas..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label
            for="filter-available"
            class="block text-sm font-medium text-gray-700"
            >Ketersediaan:</label
          >
          <select
            v-model="filters.available"
            id="filter-available"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Status --</option>
            <option :value="true">Tersedia</option>
            <option :value="false">Tidak Tersedia</option>
          </select>
        </div>
        <div>
          <label
            for="filter-search-all"
            class="block text-sm font-medium text-gray-700"
            >Cari Umum:</label
          >
          <input
            type="text"
            v-model="filters.search"
            id="filter-search-all"
            placeholder="Cari nama/deskripsi..."
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

    <div v-if="loading" class="text-center text-gray-600">
      Memuat ruangan...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat ruangan: {{ error }}
    </div>
    <div v-else-if="rooms.length === 0" class="text-center text-gray-500">
      Tidak ada ruangan yang ditemukan.
    </div>
    <div v-else>
      <RoomTable :rooms="rooms" @roomDeleted="fetchRooms" />

      <div class="flex justify-center mt-6">
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700',
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import RoomTable from "~/components/admin/rooms/RoomTable.vue";

export default {
  name: "AdminRoomIndex",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth', 'role:admin'], // Anda bisa aktifkan ini jika hanya admin yang bisa akses

  head() {
    return {
      title: "Manajemen Ruangan",
    };
  },

  components: {
    RoomTable,
  },

  data() {
    return {
      rooms: [],
      loading: true,
      error: null,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
      // --- TAMBAHAN FILTER ---
      filters: {
        name: "",
        capacity: null,
        available: null, // Menggunakan null untuk "Semua Status"
        search: "", // Untuk search di name dan description
      },
      // --- AKHIR TAMBAHAN FILTER ---
    };
  },

  async fetch() {
    await this.fetchRooms();
  },

  methods: {
    async fetchRooms() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          // Gabungkan filter ke params
          ...this.filters,
        };
        // Panggil API GET /api/rooms dengan with_relations=true untuk memuat fasilitas
        const response = await this.$axios.$get("/rooms?with_relations=true", {
          params,
        });

        // Asumsi respons API adalah { status: true, data: { current_page: ..., data: [...], ... } }
        this.rooms = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching rooms:", e);
      } finally {
        this.loading = false;
      }
    },
    // Metode untuk navigasi paginasi
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchRooms(); // Panggil ulang fetch data untuk halaman baru
      }
    },
    // Metode untuk menerapkan filter
    applyFilters() {
      this.currentPage = 1; // Reset ke halaman pertama saat filter diterapkan
      this.fetchRooms();
    },
    // Metode untuk mereset filter
    resetFilters() {
      this.filters = {
        name: "",
        capacity: null,
        available: null,
        search: "",
      };
      this.currentPage = 1; // Reset ke halaman pertama
      this.fetchRooms();
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
