<template>
  <DefaultLayout>
    <div class="w-full p-4 md:p-6 lg:p-8 rounded-lg shadow-lg bg-white">
      <h1
        class="text-xs md:text-xl font-semibold mb-4 text-center sm:text-left"
      >
        Pedidos del domingo 8 de diciembre
      </h1>
      <div class="flex flex-col md:flex-row gap-4 mt-4 w-full">
        <div
          class="p-4 rounded-lg shadow-lg bg-teal-300 flex items-center gap-4"
        >
          <div>
            <orders></orders>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-bold">{{ totalOrders }}</span>
            <span class="text-sm font-extralight text-gray-500"
              >TOTAL PEDIDOS</span
            >
          </div>
        </div>
        <div
          class="p-4 rounded-lg shadow-lg bg-amber-200 flex items-center gap-4"
        >
          <div>
            <delivered></delivered>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-bold">{{ pendingOrders }}</span>
            <span class="text-sm font-extralight text-gray-500"
              >PEDIDOS PAGADOS</span
            >
          </div>
        </div>
        <div
          class="p-4 rounded-lg shadow-lg bg-rose-400 flex items-center gap-4"
        >
          <div>
            <pending></pending>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-bold">{{
              totalOrders - deliveredOrders
            }}</span>
            <span class="text-sm font-extralight text-gray-500"
              >PEDIDOS PENDIENTES</span
            >
          </div>
        </div>
        <div
          class="p-4 rounded-lg shadow-lg bg-green-500 flex items-center gap-4"
        >
          <div>
            <revenue></revenue>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-bold">{{ deliveredOrders }}</span>
            <span class="text-sm font-extralight text-gray-500"
              >PEDIDOS ENTREGADOS</span
            >
          </div>
        </div>
        <div
          class="w-80 p-4 rounded-lg shadow-lg bg-violet-300 flex items-center gap-8"
        >
          <div class="flex flex-col gap-2">
            <div
              class="flex gap-2 items-center border border-gray-500 p-2 rounded-md"
            >
              <img :src="IconoYape" alt="yape" class="h-8 w-8 ml-4" />
              <span class="text-xs font-bold"
                >S/.{{ paymentTotals.totalYape * 13 }}</span
              >
            </div>
            <div
              class="flex gap-2 items-center border border-gray-500 p-2 rounded-md"
            >
              <img :src="IconoCash" alt="cash" class="h-8 w-8 ml-4" />
              <span class="text-xs font-bold"
                >S/. {{ paymentTotals.totalCash * 13 }}</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-4xl font-bold">
              S/.
              {{
                paymentTotals.totalYape * 13 + paymentTotals.totalCash * 13
              }}</span
            >
            <span class="text-sm font-extralight text-gray-500">TOTAL </span>
          </div>
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
              <th class="py-2 px-4 text-left">Nombre</th>
              <th class="py-2 px-4 text-left">N° platos</th>
              <th class="py-2 px-4 text-left">Estado</th>
              <th class="py-2 px-4 text-left">Tipo de Pago</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="border-t">
              <td class="py-2 px-4">{{ user.name }}</td>
              <td class="py-2 px-4">{{ user.counts }}</td>
              <td class="py-2 px-4">
                <div class="flex items-center gap-2">
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
              <td class="py-2 px-4">
                <div v-if="user.paid_with_yape" class="flex gap-3 items-center">
                  <img
                    v-if="user.payment_type === 'YAPE'"
                    :src="IconoYape"
                    alt="yape"
                    class="h-8 w-8 ml-4"
                  />
                  <img
                    v-else
                    :src="IconoCash"
                    alt="cash"
                    class="h-8 w-8 ml-4"
                  />
                  <span class="text-xs font-bold">{{ user.payment_type }}</span>
                </div>
                <div v-else class="flex gap-3 items-center">
                  <button
                    @click="openConfirmationModalPay(user)"
                    class="bg-green-500 text-white p-2 text-xs rounded hover:bg-green-600"
                  >
                    Pagar
                  </button>
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
      <!-- Modal para pagar -->
      <div
        v-if="showModalPay"
        class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
          <h2 class="text-xl mb-4">Realizar Pago</h2>
          <div>Seleccionar medio de pago:</div>
          <div
            class="flex items-center ps-4 border border-gray-200 hover:bg-gray-200 rounded dark:border-gray-700 mt-4 cursor-pointer"
          >
            <input
              id="bordered-radio-1"
              type="radio"
              value="YAPE"
              name="bordered-radio"
              v-model="selectedPayment"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <img :src="IconoYape" alt="yape" class="h-8 w-8 ml-4" />
            <label
              for="bordered-radio-1"
              class="py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >YAPE</label
            >
          </div>
          <div
            class="flex items-center ps-4 border border-gray-200 hover:bg-gray-200 rounded dark:border-gray-700 mt-4 cursor-pointer"
          >
            <input
              id="bordered-radio-2"
              type="radio"
              value="CASH"
              name="bordered-radio"
              v-model="selectedPayment"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <img :src="IconoCash" alt="cash" class="h-8 w-8 ml-4" />
            <label
              for="bordered-radio-2"
              class="py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >EFECTIVO</label
            >
          </div>

          <div class="mt-4 flex justify-center">
            <button
              @click="confirmPay"
              class="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Confirmar
            </button>
            <button @click="cancelPay" class="px-4 py-2 bg-gray-300 rounded">
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
import { useRoute } from "vue-router";
import apiClient from "@/services/api";
import IconoYape from "@/assets/icons/icono-yape.png";
import IconoCash from "@/assets/icons/icono-cash.png";
import orders from "@/assets/icons/orders.vue";
import delivered from "@/assets/icons/delivered.vue";
import revenue from "@/assets/icons/revenue.vue";
import pending from "@/assets/icons/pending.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const persons = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref("");
const route = useRoute();
const showModal = ref(false);
const showModalPay = ref(false);
const selectedUser = ref<any>(null);
const selectedPayment = ref("CASH");

const menuId = route.params.id || 1;

// Inicializar el store y cargar los datos de las personas
const fetchPersons = async () => {
  try {
    const response = await apiClient.get(`v1/orders/products/${menuId}/`);
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
    (total, user) => (user.paid_with_yape ? total + (user.counts || 0) : total),
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
const openConfirmationModal = (user: any) => {
  selectedUser.value = user;
  showModal.value = true;
};

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
        showModal.value = false;
      });
  }
};

// Cancelar la acción y cerrar el modal
const cancelDelivery = () => {
  if (selectedUser.value) {
    selectedUser.value.picked_up = !selectedUser.value.picked_up;
  }
  showModal.value = false;
};

const openConfirmationModalPay = (user: any) => {
  selectedUser.value = user;
  showModalPay.value = true;
};
const confirmPay = () => {
  if (selectedUser.value) {
    const user = selectedUser.value;
    const updateData = {
      paid_with_yape: true,
      payment_type: selectedPayment.value,
    };
    apiClient
      .patch(`v1/order/${user.order_id}/update-payment-status/`, updateData)
      .then((response) => {
        console.log("Pedido actualizado:", response.data);
      })
      .catch((error) => {
        console.error("Error actualizando el pedido:", error);
      })
      .finally(() => {
        fetchPersons();
        showModalPay.value = false;
      });
  }
};
const cancelPay = () => {
  showModalPay.value = false;
};

const filteredUsers = computed(() => {
  return persons.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalOrders = computed(() => {
  return persons.value.reduce((total, user) => total + (user.counts || 0), 0);
});

const paymentTotals = computed(() => {
  const totalYape = persons.value
    .filter(
      (person) =>
        person.paid_with_yape === true && person.payment_type === "YAPE"
    )
    .reduce((acc, person) => acc + person.counts, 0);

  const totalCash = persons.value
    .filter(
      (person) =>
        person.paid_with_yape === true && person.payment_type === "CASH"
    )
    .reduce((acc, person) => acc + person.counts, 0);
  console.log("lega", totalCash, totalYape);
  return {
    totalYape,
    totalCash,
  };
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
