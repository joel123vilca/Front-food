<template>
  <DefaultLayout>
    <div class="w-full p-4 md:p-6 lg:p-8 rounded-lg shadow-lg bg-white">
      <h1
        class="text-xs md:text-xl font-semibold mb-4 text-center sm:text-left"
      >
        Pedidos para entregar del domingo 8 de diciembre
      </h1>
      <div class="flex gap-4 mt-4">
        <div
          class="p-4 rounded-lg shadow-lg bg-[#FFF] flex flex-col items-center"
        >
          <span class="text-xs">Pedidos Pendientes</span>
          <span class="text-lg font-bold">{{ pendingOrders }}</span>
        </div>
        <div
          class="p-4 rounded-lg shadow-lg bg-[#FFF] flex flex-col items-center"
        >
          <span class="text-xs">Pedidos Entregados</span>
          <span class="text-lg font-bold">{{ deliveredOrders }}</span>
        </div>
        <div
          class="p-4 rounded-lg shadow-lg bg-[#FFF] flex flex-col items-center"
        >
          <span class="text-xs">Total (Platos):</span>
          <span class="text-lg font-bold">{{ totalOrders }}</span>
        </div>
      </div>

      <!-- Barra de búsqueda -->
      <div class="mb-4 mt-4 flex justify-center sm:justify-start">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar usuario"
          class="p-2 w-full sm:w-1/2 lg:w-1/3 border rounded"
        />
      </div>

      <!-- Tabla de pedidos -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 text-left text-xs md:text-lg">Nombre</th>
              <th class="py-2 px-4 text-left text-xs md:text-lg">N° platos</th>
              <th class="py-2 px-4 text-center text-xs md:text-lg">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-t">
              <td class="py-2 px-4">{{ user.name }}</td>
              <td class="py-2 px-4">{{ user.counts }}</td>
              <td class="py-2 px-4">
                <div class="flex items-center gap-2">
                  <img
                    v-if="user.payment_type === 'YAPE'"
                    :src="IconoYape"
                    alt="yape"
                    class="h-5 w-5 ml-4"
                  />
                  <img
                    v-else
                    :src="IconoCash"
                    alt="cash"
                    class="h-5 w-5 ml-4"
                  />
                  <span
                    v-if="user.picked_up"
                    class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-green-400"
                    >Entregado</span
                  >
                  <span
                    v-else
                    class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-gray-500"
                    >Pendiente</span
                  >
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="user.picked_up"
                      @change="openConfirmationModal(user)"
                      class="sr-only peer"
                      checked
                    />
                    <div
                      class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
                    ></div>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de confirmación -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
          <h2 class="text-xl mb-4">¿Confirmar entrega?</h2>
          <div class="mt-4 flex justify-center">
            <button
              @click="confirmDelivery"
              class="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Confirmar
            </button>
            <button
              @click="cancelDelivery"
              class="px-4 py-2 bg-gray-300 rounded"
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
import { useRoute } from "vue-router"; // Importar useRoute para obtener parámetros de la URL
import apiClient from "@/services/api";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

import IconoYape from "@/assets/icons/icono-yape.png";
import IconoCash from "@/assets/icons/icono-cash.png";

const persons = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const route = useRoute(); // Obtener acceso a la ruta actual
const showModal = ref(false); // Estado para mostrar el modal
const selectedUser = ref<any>(null); // Usuario seleccionado para la confirmación

// Obtener el menuId desde la URL
const menuId = route.params.id || 1; // Si no hay un menuId en la URL, por defecto es 2

// Inicializar el store y cargar los datos de las personas
const fetchPersons = async () => {
  try {
    const response = await apiClient.get(`/v1/unpaid-orders/${menuId}/`);
    persons.value = response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPersons();
});

const pendingOrders = computed(() => {
  return persons.value.reduce(
    (total, user) => (!user.picked_up ? total + (user.counts || 0) : total),
    0
  );
});

// Cantidad de platos entregados
const deliveredOrders = computed(() => {
  return persons.value.reduce(
    (total, user) => (user.picked_up ? total + (user.counts || 0) : total),
    0
  );
});

// Abrir el modal de confirmación
const openConfirmationModal = (user: any) => {
  selectedUser.value = user;
  showModal.value = true;
};

// Confirmar la entrega y cerrar el modal
const confirmDelivery = () => {
  if (selectedUser.value) {
    const user = selectedUser.value;
    const updateData = {
      picked_up: user.picked_up,
    };
    apiClient
      .patch(`v1/order/${user.order_id}/update-picked-status/`, updateData)
      .then((response) => {
        console.log("Pedido actualizado:", response.data);
      })
      .catch((error) => {
        console.error("Error actualizando el pedido:", error);
      })
      .finally(() => {
        showModal.value = false; // Cerrar el modal
      });
  }
};

// Cancelar la acción y cerrar el modal
const cancelDelivery = () => {
  if (selectedUser.value) {
    // Resetear el valor a lo que estaba antes de cambiar
    selectedUser.value.picked_up = !selectedUser.value.picked_up;
  }
  showModal.value = false; // Cerrar el modal
};

// Filtrar usuarios según la búsqueda
const filteredUsers = computed(() => {
  return persons.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalOrders = computed(() => {
  return persons.value.reduce((total, user) => total + (user.counts || 0), 0);
});
</script>

<style scoped>
/* Estilos del modal */
.fixed {
  position: fixed;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-white {
  background-color: white;
}

/* Hacer la tabla responsive */
table {
  width: 100%;
}

@media (max-width: 768px) {
  table {
    font-size: 0.875rem; /* Reduce el tamaño de fuente en dispositivos pequeños */
  }

  .p-2 {
    padding: 0.5rem;
  }

  .py-2,
  .px-4 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
