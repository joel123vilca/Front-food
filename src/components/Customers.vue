<template>
  <div class="p-4 rounded-lg shadow-lg bg-[#FFF]">
    <!-- Título de la aplicación -->
    <h1 class="text-3xl font-semibold mb-4">Gestión de Usuarios</h1>

    <!-- Barra de búsqueda -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Buscar usuario"
      class="mb-4 p-2 border rounded w-full md:w-1/3"
    />

    <!-- Tabla de usuarios -->
    <table class="min-w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 text-left">Nombre de Usuario</th>
          <th class="py-2 px-4 text-left">Cantidad de Platos</th>
          <th class="py-2 px-4 text-left">Costo</th>
          <th class="py-2 px-4 text-left">Método de Pago</th>
          <th class="py-2 px-4 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in filteredUsers"
          :key="user.nombre_usuario"
          class="border-t"
        >
          <td class="py-2 px-4">
            <div class="flex gap-3">
              <span>{{ user.nombre_usuario }}</span>
              <div
                v-if="user.pago !== ''"
                class="bg-[#D3FFE7] text-green-500 w-[80px] h-[30px] rounded-lg text-center"
              >
                Pagado
              </div>
            </div>
          </td>
          <td class="py-2 px-4">{{ user.cantidad_de_platos }}</td>
          <td class="py-2 px-4">{{ user.costo }}</td>
          <td class="py-2 px-4">
            <select
              v-model="user.pago"
              @change="updateUserPayment(user.nombre_usuario, user.pago)"
              class="p-2 border rounded"
            >
              <option value="Yape">Yape</option>
              <option value="Efe">Efe</option>
              <option value="">Ninguno</option>
            </select>
          </td>
          <td class="py-2 px-4">
            <button
              @click="removeUser(user.nombre_usuario)"
              class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Botón para agregar usuario -->
    <div class="mt-4">
      <button
        @click="showAddUserModal = true"
        class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Agregar Usuario
      </button>
    </div>

    <!-- Modal para agregar un nuevo usuario -->
    <div
      v-if="showAddUserModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Agregar Nuevo Usuario</h2>

        <form @submit.prevent="addUser">
          <input
            v-model="newUser.nombre_usuario"
            type="text"
            placeholder="Nombre de Usuario"
            class="mb-2 p-2 border rounded w-full"
            required
          />
          <input
            v-model="newUser.cantidad_de_platos"
            type="number"
            placeholder="Cantidad de Platos"
            class="mb-2 p-2 border rounded w-full"
            required
          />
          <input
            v-model="newUser.costo"
            type="number"
            placeholder="Costo"
            class="mb-2 p-2 border rounded w-full"
            required
          />
          <select
            v-model="newUser.pago"
            class="mb-4 p-2 border rounded w-full"
            required
          >
            <option value="Yape">Yape</option>
            <option value="Efe">Efe</option>
            <option value="">Ninguno</option>
          </select>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showAddUserModal = false"
              class="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useUserStore } from ".././stores/userStore";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const searchQuery = ref("");
    const showAddUserModal = ref(false);
    const newUser = ref({
      nombre_usuario: "",
      cantidad_de_platos: 0,
      costo: 0,
      pago: "",
    });

    // Obtener los usuarios desde el store
    userStore.fetchUsers();

    // Filtrar los usuarios por la búsqueda
    const filteredUsers = computed(() => {
      return userStore.users.filter((user) =>
        user.nombre_usuario
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    // Agregar un nuevo usuario
    const addUser = async () => {
      if (newUser.value.nombre_usuario) {
        await userStore.addUser(newUser.value);
        showAddUserModal.value = false; // Cerrar el modal después de agregar
        newUser.value = {
          nombre_usuario: "",
          cantidad_de_platos: 0,
          costo: 0,
          pago: "",
        };
      }
    };

    // Actualizar el método de pago del usuario
    const updateUserPayment = async (
      nombre_usuario: string,
      newPayment: string
    ) => {
      await userStore.updateUserPayment(nombre_usuario, newPayment);
    };

    // Eliminar un usuario
    const removeUser = async (nombre_usuario: string) => {
      await userStore.removeUser(nombre_usuario);
    };

    return {
      searchQuery,
      filteredUsers,
      showAddUserModal,
      newUser,
      addUser,
      updateUserPayment,
      removeUser,
    };
  },
});
</script>
