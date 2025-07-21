<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Ruangan</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data ruangan...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat ruangan: {{ error }}
    </div>
    <div v-else>
      <RoomForm :room="room" @formSubmitted="roomUpdated" />
    </div>
  </div>
</template>

<script>
import RoomForm from "~/components/admin/rooms/RoomForm.vue";

export default {
  name: "AdminRoomEdit",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Edit Ruangan",
    };
  },

  components: {
    RoomForm,
  },

  data() {
    return {
      room: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      // Panggil API GET /api/rooms/{id} dengan with_relations=true untuk memuat fasilitas
      const response = await this.$axios.$get(
        `/rooms/${this.$route.params.id}?with_relations=true`
      );
      this.room = response.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data ruangan.";
      console.error("Error fetching room for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    roomUpdated() {
      alert("Ruangan berhasil diperbarui!");
      this.$router.push("/admin/rooms");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
