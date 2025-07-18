<template>
  <nav
    class="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex items-center justify-between z-50 h-16"
  >
    <NuxtLink to="/" class="flex items-center text-2xl font-semibold"
      ><img
        src="~/assets/img/dapenbun.png"
        alt="Dapenbun Logo"
        class="h-11 w-auto mr-2"
    /></NuxtLink>
    <div class="flex items-center space-x-4 mr-4">
      <button class="p-2 rounded-full hover:bg-gray-700">
        <SearchIcon class="w-6 h-6" />
      </button>

      <button class="p-2 rounded-full hover:bg-gray-700">
        <BellIcon class="w-6 h-6" />
      </button>

      <NuxtLink
        v-if="!isLoggedIn"
        to="/auth/login"
        class="flex items-center p-2 rounded-lg hover:bg-gray-700"
      >
        <UserIcon class="w-6 h-6 mr-2" />
        Login
      </NuxtLink>
      <a
        v-else
        @click="logout"
        class="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
      >
        <UserIcon class="w-6 h-6 mr-2" />
        Logout
      </a>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  ChevronDownIcon,
} from "vue-feather-icons";

export default {
  name: "AppNavbar",
  components: {
    SearchIcon,
    BellIcon,
    UserIcon,
    ChevronDownIcon,
  },
  computed: {
    ...mapState("ui", ["isSidebarOpen"]),
    ...mapGetters("auth", ["isLoggedIn", "user"]),
  },
  methods: {
    ...mapActions("ui", ["toggleSidebar"]),
    ...mapActions("auth", ["logout"]),
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* Pastikan tidak ada konflik CSS di sini atau global yang override */
</style>
