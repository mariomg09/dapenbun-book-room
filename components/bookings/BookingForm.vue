<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <div class="mb-4">
      <label for="title" class="block text-gray-700 text-sm font-bold mb-2"
        >Judul Booking:</label
      >
      <input
        v-model="form.title"
        type="text"
        id="title"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-4">
      <label for="room_id" class="block text-gray-700 text-sm font-bold mb-2"
        >Ruangan:</label
      >
      <select
        v-model="form.room_id"
        id="room_id"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      >
        <option :value="null">-- Pilih Ruangan --</option>
        <option v-for="room in rooms" :key="room.id" :value="room.id">
          {{ room.name }} (Kapasitas: {{ room.capacity }})
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label for="start_time" class="block text-gray-700 text-sm font-bold mb-2"
        >Waktu Mulai:</label
      >
      <input
        v-model="form.start_time"
        type="datetime-local"
        id="start_time"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-4">
      <label for="end_time" class="block text-gray-700 text-sm font-bold mb-2"
        >Waktu Selesai:</label
      >
      <input
        v-model="form.end_time"
        type="datetime-local"
        id="end_time"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-4">
      <label
        for="participants"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Jumlah Peserta:</label
      >
      <input
        v-model.number="form.participants"
        type="number"
        id="participants"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        min="1"
      />
    </div>

    <div class="mb-6">
      <label
        for="information"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Informasi Tambahan:</label
      >
      <textarea
        v-model="form.information"
        id="information"
        rows="3"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      ></textarea>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? "Perbarui" : "Buat" }} Booking
      </button>
      <NuxtLink
        to="/my-bookings"
        class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800"
      >
        Batal
      </NuxtLink>
    </div>

    <p v-if="formError" class="text-red-500 text-sm mt-4">{{ formError }}</p>
  </form>
</template>

<script>
export default {
  name: "BookingForm",
  props: {
    booking: {
      type: Object,
      default: null, // Default null untuk mode buat baru
    },
  },
  data() {
    return {
      form: {
        title: "",
        room_id: null,
        start_time: "",
        end_time: "",
        participants: 1,
        information: "",
      },
      rooms: [], // Daftar ruangan untuk dropdown
      formError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.booking;
    },
  },
  watch: {
    booking: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.title = newVal.title;
          this.form.room_id = newVal.room_id;
          // Format waktu dari backend (YYYY-MM-DD HH:MM:SS) ke format input datetime-local (YYYY-MM-DDTHH:mm)
          this.form.start_time = newVal.start_time
            ? this.formatToDateTimeLocalInput(newVal.start_time)
            : "";
          this.form.end_time = newVal.end_time
            ? this.formatToDateTimeLocalInput(newVal.end_time)
            : "";
          this.form.participants = newVal.participants;
          this.form.information = newVal.information;
        } else {
          // Reset form untuk mode buat baru
          this.form = {
            title: "",
            room_id: null,
            start_time: "",
            end_time: "",
            participants: 1,
            information: "",
          };
        }
      },
    },
  },
  async fetch() {
    // Ambil daftar ruangan untuk dropdown
    try {
      const response = await this.$axios.$get("/rooms?with_relations=true");
      this.rooms = response.data.data;
    } catch (e) {
      this.formError =
        "Gagal memuat daftar ruangan: " +
        (e.response?.data?.message || e.message);
      console.error("Error fetching rooms for booking form:", e);
    }
  },
  methods: {
    // Metode baru untuk memformat waktu dari backend ke format input datetime-local
    formatToDateTimeLocalInput(isoString) {
      if (!isoString) return "";
      // Pastikan string datetime dari backend tidak ada 'Z' jika itu ISO, atau langsung format
      // Contoh: "2025-07-10 10:30:00" -> "2025-07-10T10:30"
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    // Metode baru untuk memformat waktu dari input datetime-local ke format backend (YYYY-MM-DD HH:MM:SS)
    formatToBackendDateTime(localDateTimeString) {
      if (!localDateTimeString) return "";
      // Contoh: "2025-07-10T10:30" -> "2025-07-10 10:30:00"
      return localDateTimeString.replace("T", " ") + ":00"; // Tambahkan detik '00'
    },
    async submitForm() {
      this.formError = null;
      try {
        // --- PERBAIKAN PENTING DI SINI ---
        // Buat objek form data yang akan dikirim ke API
        const dataToSend = {
          ...this.form,
          // Format ulang start_time dan end_time ke format yang diharapkan backend
          start_time: this.formatToBackendDateTime(this.form.start_time),
          end_time: this.formatToBackendDateTime(this.form.end_time),
        };

        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(
            `/bookings/${this.booking.id}`,
            dataToSend
          );
        } else {
          response = await this.$axios.$post("/bookings", dataToSend);
        }
        this.$emit("formSubmitted"); // Beri tahu parent bahwa form berhasil disubmit
      } catch (e) {
        this.formError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat menyimpan booking.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(", ");
        }
        console.error("Error submitting booking form:", e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>
