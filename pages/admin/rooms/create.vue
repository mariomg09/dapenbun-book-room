<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah Ruangan Baru</h2>
    <RoomForm @formSubmitted="roomCreated" />
  </div>
</template>

<script>
import RoomForm from "~/components/admin/rooms/RoomForm.vue";

export default {
  name: "AdminRoomCreate",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Tambah Ruangan",
    };
  },

  components: {
    RoomForm,
  },

  methods: {
    roomCreated() {
      alert("Ruangan berhasil ditambahkan!");
      this.$router.push("/admin/rooms");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
