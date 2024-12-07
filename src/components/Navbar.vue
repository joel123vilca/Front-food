<template>
  <nav class="w-full border-b-1 border-gray-300 shadow-2xl p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-sm md:text-lg font-bold">Gestión ADP</h1>
      <ul class="flex space-x-4">
        <li>
          <div
            class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
          >
            <button
              type="button"
              class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="w-8 h-8 rounded-full"
                :src="LogoADP"
                alt="user photo"
              />
            </button>
            <div class="px-4 py-3">
              <span class="block text-sm text-gray-900 dark:text-white"
                >ADP</span
              >
            </div>
          </div>
        </li>
        <li>
          <button
            @click="logout"
            class="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoADP from "@/assets/icons/logoADP.jpg";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const logout = async () => {
  try {
    await api.post(
      "/logout/",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Enviar el token JWT en la cabecera
        },
      }
    );
    localStorage.removeItem("access_token"); // Eliminar el token
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  } catch (error) {
    localStorage.removeItem("access_token"); // Eliminar el token
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    console.error("Logout failed:", error);
  }
};
</script>
