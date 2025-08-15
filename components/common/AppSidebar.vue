<template>
  <div
    :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    class="bg-gray-800 text-white min-h-screen flex flex-col transition-all duration-300 fixed left-0 top-16 z-40"
    style="height: calc(100vh - 4rem)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <nav class="flex-grow pt-4">
      <ul class="space-y-2 px-2">
        <SidebarLink to="/" icon="HomeIcon" text="Beranda" />
        <SidebarLink
          to="/bookings/schedule"
          icon="CalendarIcon"
          text="Jadwal Harian"
        />
        <SidebarLink
          v-if="isLoggedIn"
          to="/my-bookings"
          icon="CalendarIcon"
          text="Booking Saya"
        />

        <SidebarLink
          v-if="canApproveOrReject"
          to="/approvals/bookings"
          icon="CheckSquareIcon"
          text="Antrean Persetujuan"
        />

        <li
          v-if="hasRole('admin')"
          :class="{ 'flex justify-center': !isSidebarOpen }"
          class="text-gray-400 text-sm uppercase pt-2 pb-1"
        >
          <span v-if="isSidebarOpen" class="pl-2">Admin Panel</span>
          <SettingsIcon v-else class="icon" :class="iconSize" />
        </li>

        <li
          v-if="hasRole('HR') && hasRole('pimpinan')"
          :class="{ 'flex justify-center': !isSidebarOpen }"
          class="text-gray-400 text-sm uppercase pt-2 pb-1"
        >
          <span v-if="isSidebarOpen" class="pl-2">HR Panel</span>
          <SettingsIcon v-else class="icon" :class="iconSize" />
        </li>

        <SidebarLink
          v-if="hasRole('admin') || (hasRole('pimpinan') && hasRole('HR'))"
          to="/admin/bookings"
          icon="CalendarIcon"
          text="Manajemen Booking"
        />
        <SidebarLink
          v-if="hasRole('admin')"
          to="/admin/users"
          icon="UsersIcon"
          text="Manajemen User"
        />
        <SidebarLink
          v-if="hasRole('admin')"
          to="/admin/roles"
          icon="KeyIcon"
          text="Manajemen Role"
        />
        <SidebarLink
          v-if="hasRole('admin')"
          to="/admin/departments"
          icon="FileTextIcon"
          text="Departemen"
        />
        <SidebarLink
          v-if="hasRole('admin')"
          to="/admin/urusan"
          icon="FileTextIcon"
          text="Urusan"
        />
        <SidebarLink
          v-if="hasRole('admin') || (hasRole('pimpinan') && hasRole('HR'))"
          to="/admin/facilities"
          icon="TvIcon"
          text="Fasilitas"
        />
        <SidebarLink
          v-if="hasRole('admin') || (hasRole('pimpinan') && hasRole('HR'))"
          to="/admin/rooms"
          icon="GridIcon"
          text="Ruangan"
        />
        <SidebarLink
          v-if="hasRole('admin')"
          to="/admin/status"
          icon="CheckCircleIcon"
          text="Status"
        />
        <SidebarLink
          v-if="hasRole('admin') || (hasRole('pimpinan') && hasRole('HR'))"
          to="/admin/audit-logs"
          icon="ClipboardIcon"
          text="Log Audit"
        />
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  SettingsIcon,
  UsersIcon,
  KeyIcon,
  FileTextIcon,
  TvIcon,
  GridIcon,
  CheckCircleIcon,
  ClipboardIcon,
  CheckSquareIcon,
} from "vue-feather-icons";

export default {
  name: "AppSidebar",
  computed: {
    ...mapState("ui", ["isSidebarOpen"]),
    ...mapGetters("auth", ["isLoggedIn", "user", "hasRole"]),
    canApproveOrReject() {
      const isPurePimpinan = this.hasRole("pimpinan") && !this.hasRole("HR");
      const isCombinedHRandPimpinan =
        this.hasRole("pimpinan") && this.hasRole("HR");
      return isPurePimpinan || isCombinedHRandPimpinan || this.hasRole("admin");
    },
    iconSize() {
      return this.isSidebarOpen ? "size-6 mr-3" : "size-5";
    },
  },
  methods: {
    ...mapActions("ui", ["setSidebarState"]),
    handleMouseEnter() {
      this.setSidebarState(true);
    },
    handleMouseLeave() {
      this.setSidebarState(false);
    },
  },
  components: {
    HomeIcon,
    UserIcon,
    CalendarIcon,
    SettingsIcon,
    UsersIcon,
    KeyIcon,
    FileTextIcon,
    TvIcon,
    GridIcon,
    CheckCircleIcon,
    ClipboardIcon,
    CheckSquareIcon,
    SidebarLink: {
      props: ["to", "icon", "text"],
      computed: {
        ...mapState("ui", ["isSidebarOpen"]),
        iconSize() {
          return this.isSidebarOpen ? "size-6 mr-3" : "size-5";
        },
      },
      components: {
        HomeIcon,
        CalendarIcon,
        UsersIcon,
        KeyIcon,
        FileTextIcon,
        TvIcon,
        GridIcon,
        CheckCircleIcon,
        ClipboardIcon,
        CheckSquareIcon,
      },
      render(h) {
        const IconComponent = this.$options.components[this.icon];
        return h("li", {}, [
          h(
            "NuxtLink",
            {
              props: { to: this.to },
              class: [
                "flex items-center p-2 rounded-lg hover:bg-gray-700",
                { "justify-center": !this.isSidebarOpen },
              ],
            },
            [
              h(IconComponent, { class: ["icon", this.iconSize] }),
              this.isSidebarOpen
                ? h(
                    "span",
                    { class: "whitespace-nowrap overflow-hidden" },
                    this.text
                  )
                : null,
            ]
          ),
        ]);
      },
    },
  },
};
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
.nuxt-link-active {
  background-color: rgba(55, 65, 81, 0.7);
  color: white;
}
</style>
