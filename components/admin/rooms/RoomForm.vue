<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
        >Nama Ruangan:</label
      >
      <input
        v-model="form.name"
        type="text"
        id="name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="mb-4">
      <label for="capacity" class="block text-gray-700 text-sm font-bold mb-2"
        >Kapasitas:</label
      >
      <input
        v-model.number="form.capacity"
        type="number"
        id="capacity"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        min="0"
      />
    </div>

    <div class="mb-4">
      <label
        for="description"
        class="block text-gray-700 text-sm font-bold mb-2"
        >Deskripsi:</label
      >
      <textarea
        v-model="form.description"
        id="description"
        rows="3"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      ></textarea>
    </div>

    <div class="mb-4 flex items-center">
      <input
        v-model="form.available"
        type="checkbox"
        id="available"
        class="mr-2 leading-tight"
      />
      <label for="available" class="text-sm text-gray-700">Tersedia</label>
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2"
        >Fasilitas:</label
      >
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="facility in allFacilities"
          :key="facility.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :id="`facility-${facility.id}`"
            :value="facility.id"
            v-model="form.facility_ids"
            class="mr-2"
          />
          <label
            :for="`facility-${facility.id}`"
            class="text-sm text-gray-700"
            >{{ facility.name }}</label
          >
        </div>
      </div>
      <p v-if="facilitiesError" class="text-red-500 text-sm mt-2">
        {{ facilitiesError }}
      </p>
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? "Perbarui" : "Tambah" }} Ruangan
      </button>
      <NuxtLink
        to="/admin/rooms"
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
  name: "RoomForm",
  props: {
    room: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        capacity: 0,
        description: "",
        available: true,
        facility_ids: [],
      },
      allFacilities: [],
      formError: null,
      facilitiesError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.room;
    },
  },
  watch: {
    room: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.capacity = newVal.capacity;
          this.form.description = newVal.description;
          this.form.available = newVal.available;
          this.form.facility_ids = newVal.facilities
            ? newVal.facilities.map((f) => f.id)
            : [];
        }
      },
    },
  },
  async fetch() {
    try {
      const response = await this.$axios.$get("/facilities/options");
      this.allFacilities = response.data;
    } catch (e) {
      this.facilitiesError =
        "Gagal memuat daftar fasilitas: " +
        (e.response?.data?.message || e.message);
      console.error("Error fetching facilities for dropdown:", e);
    }
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(
            `/rooms/${this.room.id}`,
            this.form
          );
        } else {
          response = await this.$axios.$post("/rooms", this.form);
        }
        this.$emit("formSubmitted");
      } catch (e) {
        this.formError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat menyimpan ruangan.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(", ");
        }
        console.error("Error submitting room form:", e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>
