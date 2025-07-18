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

    <div v-if="loading" class="text-center text-gray-600">
      Memuat ruangan...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat ruangan: {{ error }}
    </div>
    <div v-else>
      <RoomTable :rooms="rooms" @roomDeleted="fetchRooms" />
    </div>
  </div>
</template>

<script>
import RoomTable from "~/components/admin/rooms/RoomTable.vue";

export default {
  name: "AdminRoomIndex",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

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
        // Panggil API GET /api/rooms dengan with_relations=true untuk memuat fasilitas
        const response = await this.$axios.$get("/rooms?with_relations=true");
        this.rooms = response.data.data;
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
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
