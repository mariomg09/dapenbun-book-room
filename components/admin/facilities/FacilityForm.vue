<template>
  <form
    @submit.prevent="submitForm"
    class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
  >
    <div class="mb-4">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
        >Nama Fasilitas:</label
      >
      <input
        v-model="form.name"
        type="text"
        id="name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>

    <div class="flex items-center justify-between">
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
      >
        {{ isEditing ? "Perbarui" : "Tambah" }} Fasilitas
      </button>
      <NuxtLink
        to="/admin/facilities"
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
  name: "FacilityForm",
  props: {
    facility: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
      },
      formError: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.facility;
    },
  },
  watch: {
    facility: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
        }
      },
    },
  },
  methods: {
    async submitForm() {
      this.formError = null;
      try {
        let response;
        if (this.isEditing) {
          response = await this.$axios.$put(
            `/facilities/${this.facility.id}`,
            this.form
          );
        } else {
          response = await this.$axios.$post("/facilities", this.form);
        }
        this.$emit("formSubmitted");
      } catch (e) {
        this.formError =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat menyimpan fasilitas.";
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          this.formError = errors.join(", ");
        }
        console.error("Error submitting facility form:", e);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus form */
</style>
