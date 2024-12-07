<template>
  <DefaultLayout>
    <div class="w-full p-4 rounded-lg shadow-lg bg-[#FFF]">
      <!-- Título de la aplicación -->
      <h1 class="text-3xl font-semibold mb-4">
        Gestión de Pedidos del {{ menu?.name }}
      </h1>
      <div class="flex justify-beetwen items-center">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar usuario"
          class="mb-4 p-2 border rounded w-full md:w-1/3"
        />
        <div
          class="mb-4 ml-10 p-2 rounded-lg shadow-lg bg-[#FFF] flex gap-2 border border-green-400"
        >
          <span>Total de Pedidos</span>
          <span>{{ totalOrders }}</span>
        </div>
      </div>
      <!-- Tabla de usuarios -->
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 text-left">Nombre de Usuario</th>
            <th class="py-2 px-4 text-left">Cantidad de Menús (platos)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-t">
            <td class="py-2 px-4">{{ user.name }}</td>
            <td class="py-2 px-4">
              <select
                v-model="user.order"
                @change="createOrder(user)"
                class="p-2 border rounded"
              >
                <option value="0">0</option>
                <option value="1">1 Plato</option>
                <option value="2">2 Platos</option>
                <option value="3">3 Platos</option>
                <option value="4">4 Platos</option>
                <option value="5">5 Platos</option>
                <option value="6">6 Platos</option>
                <option value="7">7 Platos</option>
                <option value="8">8 Platos</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router"; // Importar useRoute para obtener parámetros de la URL
import apiClient from "@/services/api";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const persons = ref<any[]>([]);
const orders = ref<any[]>([]);
const menu = ref<any>(null);

const loading = ref(true);
const searchQuery = ref("");
const route = useRoute(); // Obtener acceso a la ruta actual

// Obtener el menuId desde la URL
const menuId = route.params.id || 1; // Si no hay un menuId en la URL, por defecto es 2

// Inicializar el store y cargar los datos de las personas
const fetchPersons = async () => {
  try {
    const response = await apiClient.get("/v1/persons");
    persons.value = response.data;
  } catch (error) {
    console.error("Error fetching persons:", error);
  } finally {
    loading.value = false;
  }
};

const fetchOrdersByMenu = async () => {
  try {
    const response = await apiClient.get(`/v1/orders/products/${menuId}/`);
    orders.value = response.data;

    // Asignar la cantidad de platos a los usuarios
    persons.value.forEach((person) => {
      const order = orders.value.find((order) => order.person_id === person.id);
      if (order) {
        person.order = order.counts; // Establecer la cantidad de platos para esa persona
      } else {
        person.order = 0; // Si no tiene pedido, se establece en 0
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
};

const fetchMenuDetails = async () => {
  try {
    const response = await apiClient.get(`/v1/menus/${menuId}`);
    menu.value = response.data;
  } catch (error) {
    menu.value = null; // Reiniciar en caso de error
  } finally {
    loading.value = false; // Detener el estado de carga
  }
};

onMounted(() => {
  fetchPersons();
  fetchOrdersByMenu();
  fetchMenuDetails();
});

const createOrder = (user: any) => {
  const cantidad = user.order; // Obtener la cantidad seleccionada

  // Buscar si ya existe una orden para el usuario
  const existingOrder = orders.value.find(
    (order) => order.person_id === user.id
  );
  const product_id = menu.value.products[0].product.id;
  const orderData = {
    person: user.id, // Usar el id del usuario
    menu: menuId, // Usar el id del menú obtenido de la URL
    order_products: [
      {
        product: product_id, // ID del producto, puedes cambiarlo según corresponda
        quantity: cantidad, // Cantidad seleccionada
      },
    ],
  };

  if (existingOrder) {
    const updateDate = {
      quantity: cantidad,
    };
    apiClient
      .patch(`/v1/order/${existingOrder.order_id}/`, updateDate)
      .then((response) => {
        console.log("Orden actualizada con éxito:", response.data);
        fetchPersons();
        fetchOrdersByMenu();
      })
      .catch((error) => {
        console.error("Error actualizando la orden:", error);
      });
  } else {
    // Si no existe, crear una nueva con POST
    apiClient
      .post("/v1/order", orderData)
      .then((response) => {
        console.log("Orden creada con éxito:", response.data);
        fetchPersons();
        fetchOrdersByMenu();
      })
      .catch((error) => {
        console.error("Error creando la orden:", error);
      });
  }
};

// Filtrar usuarios según la búsqueda
const filteredUsers = computed(() => {
  return persons.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalOrders = computed(() => {
  return persons.value.reduce((total, user) => total + (user.order || 0), 0);
});
</script>
