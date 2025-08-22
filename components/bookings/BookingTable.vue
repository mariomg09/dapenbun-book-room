<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Judul
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ruangan
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Instansi
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Waktu Mulai
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Waktu Selesai
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="booking in bookings" :key="booking.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ booking.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ booking.title }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ booking.room ? booking.room.name : "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ booking.instansi ? booking.instansi.name : "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ formatDateTime(booking.start_time) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ formatDateTime(booking.end_time) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="
                statusBadgeClass(booking.status ? booking.status.name : '')
              "
            >
              {{ booking.status ? booking.status.name : "N/A" }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/bookings/${booking.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
              v-if="canEditOrDelete(booking)"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(booking.id)"
              class="text-red-600 hover:text-red-900 cursor-pointer"
              v-if="canEditOrDelete(booking)"
            >
              Hapus
            </a>

            <a
              v-if="canApproveRejectButton(booking)"
              @click="approveBooking(booking.id)"
              class="text-green-600 hover:text-green-900 cursor-pointer ml-4"
            >
              Approve
            </a>
            <a
              v-if="canApproveRejectButton(booking)"
              @click="rejectBooking(booking.id)"
              class="text-orange-600 hover:text-orange-900 cursor-pointer ml-2"
            >
              Reject
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BookingTable",
  props: {
    bookings: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters("auth", ["user", "hasRole"]),
    pendingStatusId() {
      return 1;
    },
    pimpinanApprovedStatusId() {
      return 2;
    },
    approvedStatusId() {
      return 3;
    },
    rejectedStatusId() {
      return 4;
    },
  },
  methods: {
    formatDateTime(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    statusBadgeClass(statusName) {
      switch (statusName) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "pimpinan_approved":
          return "bg-blue-100 text-blue-800";
        case "approved":
          return "bg-green-100 text-green-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    },
    canEditOrDelete(booking) {
      const isMyBooking = this.user && booking.user_id === this.user.id;
      const isNotFinal =
        booking.status.name !== "approved" &&
        booking.status.name !== "rejected";
      const isAdmin = this.hasRole("admin");
      const isCombinedHRandPimpinan =
        this.hasRole("pimpinan") && this.hasRole("HR");

      return (isMyBooking && isNotFinal) || isAdmin || isCombinedHRandPimpinan;
    },
    canApproveRejectButton(booking) {
      const isPurePimpinan = this.hasRole("pimpinan") && !this.hasRole("HR");
      const isCombinedHRandPimpinan =
        this.hasRole("pimpinan") && this.hasRole("HR");
      const isHR = this.hasRole("HR");

      const bookingStatusName = booking.status ? booking.status.name : "";

      if (this.hasRole("admin")) return true;

      if (
        bookingStatusName === "approved" ||
        bookingStatusName === "rejected"
      ) {
        return false;
      }

      if (isCombinedHRandPimpinan) {
        const currentUserDeptId = this.user ? this.user.department_id : null;
        const bookingUserDeptId = booking.user
          ? booking.user.department_id
          : null;

        if (currentUserDeptId === bookingUserDeptId) {
          return (
            bookingStatusName === "pending" ||
            bookingStatusName === "pimpinan_approved"
          );
        } else {
          return bookingStatusName === "pimpinan_approved";
        }
      }

      if (isPurePimpinan) {
        const currentUserDeptId = this.user ? this.user.department_id : null;
        const bookingUserDeptId = booking.user
          ? booking.user.department_id
          : null;
        return (
          bookingStatusName === "pending" &&
          currentUserDeptId === bookingUserDeptId
        );
      }

      if (isHR && !isPurePimpinan) {
        return false;
      }

      return false;
    },
    async deleteBooking(id) {
      if (!confirm("Apakah Anda yakin ingin menghapus booking ini?")) return;
      try {
        await this.$axios.$delete(`/bookings/${id}`);
        this.$emit("bookingDeleted");
        alert("Booking berhasil dihapus!");
      } catch (e) {
        alert(
          "Gagal menghapus booking: " + (e.response?.data?.message || e.message)
        );
        console.error("Error deleting booking:", e);
      }
    },
    async approveBooking(id) {
      if (!confirm("Apakah Anda yakin ingin menyetujui booking ini?")) return;
      try {
        await this.$axios.$put(`/bookings/${id}/approve`);
        this.$emit("bookingDeleted");
        alert("Booking berhasil disetujui!");
      } catch (e) {
        alert(
          "Gagal menyetujui booking: " +
            (e.response?.data?.message || e.message)
        );
        console.error("Error approving booking:", e);
      }
    },
    async rejectBooking(id) {
      if (!confirm("Apakah Anda yakin ingin menolak booking ini?")) return;
      try {
        await this.$axios.$put(`/bookings/${id}/reject`);
        this.$emit("bookingDeleted");
        alert("Booking berhasil ditolak!");
      } catch (e) {
        alert(
          "Gagal menolak booking: " + (e.response?.data?.message || e.message)
        );
        console.error("Error rejecting booking:", e);
      }
    },
    confirmDelete(id) {
      if (confirm("Apakah Anda yakin ingin menghapus booking ini?")) {
        this.deleteBooking(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>
