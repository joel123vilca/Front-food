<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white">
      <ul>
        <li>
          <router-link
            to="/persons"
            class="block py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Usuarios
          </router-link>
        </li>
        <li>
          <router-link
            to="/products"
            class="block py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Productos
          </router-link>
        </li>
        <li>
          <router-link
            to="/menus"
            class="block py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Menus
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Personaliza el sidebar si lo necesitas */
</style>
