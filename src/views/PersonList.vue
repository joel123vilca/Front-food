<template>
  <DefaultLayout>
    <div class="w-full p-4 rounded-lg shadow-lg bg-white">
      <!-- Título de la aplicación -->
      <h1 class="text-3xl font-semibold mb-6 text-center">
        Gestión de Usuarios
      </h1>

      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar usuario"
          class="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Tabla de usuarios -->
      <table class="min-w-full table-auto border-collapse mb-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Nombres
            </th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Teléfono
            </th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Dirección
            </th>
            <th class="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-t">
            <td class="py-3 px-6">{{ user.name }}</td>
            <td class="py-3 px-6">{{ user.phone }}</td>
            <td class="py-3 px-6">{{ user.address }}</td>
            <td class="py-3 px-6">
              <button
                @click="openEditModal(user)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none font-medium px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-100 transition duration-200"
              >
                Editar
              </button>
              <button
                @click="confirmDelete(user)"
                class="text-red-600 hover:text-red-800 focus:outline-none font-medium px-4 py-2 rounded-lg border border-red-600 hover:bg-red-100 ml-4 transition duration-200"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        @click="openCreateModal"
        class="text-blue-600 hover:text-blue-800 focus:outline-none font-medium px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-100 transition duration-200"
      >
        Agregar
      </button>
      <!-- Modal Crear/Editar -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h2 class="text-2xl font-semibold mb-4 text-center">
            {{ isEditMode ? "Editar Persona" : "Crear Persona" }}
          </h2>
          <form @submit.prevent="savePerson">
            <div class="mb-4">
              <input
                v-model="currentPerson.name"
                type="text"
                placeholder="Nombre"
                class="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div class="mb-4">
              <input
                v-model="currentPerson.phone"
                type="text"
                placeholder="Teléfono"
                class="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div class="mb-6">
              <input
                v-model="currentPerson.address"
                type="text"
                placeholder="Dirección"
                class="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div class="flex justify-between">
              <button
                type="submit"
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 w-full"
              >
                {{ isEditMode ? "Guardar Cambios" : "Crear Persona" }}
              </button>
              <button
                @click="closeModal"
                class="px-6 py-3 ml-4 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition duration-200 w-full"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Confirmación de Eliminación -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h2 class="text-xl font-semibold mb-4 text-center text-red-600">
            ¿Estás seguro de eliminar esta persona?
          </h2>
          <div class="flex justify-between">
            <button
              @click="deletePersonConfirmed"
              class="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200 w-full"
            >
              Eliminar
            </button>
            <button
              @click="closeDeleteModal"
              class="px-6 py-3 ml-4 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition duration-200 w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import apiClient from "@/services/api";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const persons = ref<any[]>([]);
const searchQuery = ref("");
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const currentPerson = ref({ id: null, name: "", phone: "", address: "" });
const personToDelete = ref<any>(null);

const fetchPersons = async () => {
  try {
    const response = await apiClient.get("/v1/persons");
    persons.value = response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
  }
};

onMounted(() => {
  fetchPersons();
});

const filteredUsers = computed(() => {
  return persons.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const openEditModal = (user: any) => {
  isEditMode.value = true;
  currentPerson.value = { ...user };
  showModal.value = true;
};

const openCreateModal = () => {
  isEditMode.value = false;
  currentPerson.value = { id: null, name: "", phone: "", address: "" };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePerson = async () => {
  try {
    if (isEditMode.value) {
      await apiClient.put(
        `/v1/persons/${currentPerson.value.id}/`,
        currentPerson.value
      );
    } else {
      await apiClient.post("/v1/persons/", currentPerson.value);
    }
    fetchPersons();
    closeModal();
  } catch (error) {
    console.error("Error saving person:", error);
  }
};

const confirmDelete = (user: any) => {
  personToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deletePersonConfirmed = async () => {
  if (personToDelete.value) {
    try {
      await apiClient.delete(`/v1/persons/${personToDelete.value.id}/`);
      fetchPersons();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  }
};
</script>

<style scoped>
/* Agregar estilos adicionales si es necesario */
</style>
