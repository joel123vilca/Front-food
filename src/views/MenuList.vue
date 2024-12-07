<template>
  <DefaultLayout>
    <div class="w-full p-4 rounded-lg shadow-lg bg-[#FFF]">
      <!-- Título de la aplicación -->
      <h1 class="text-3xl font-semibold mb-4">Gestión de Menús</h1>

      <!-- Barra de búsqueda -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar menú"
        class="mb-4 p-2 border rounded w-full md:w-1/3"
      />

      <!-- Tabla de menús -->
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 text-left">Nombre del Menú</th>
            <th class="py-2 px-4 text-left">Fecha</th>
            <th class="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="menu in filteredMenus" :key="menu.id" class="border-t">
            <td class="py-2 px-4">{{ menu.name }}</td>
            <td class="py-2 px-4">{{ menu.date }}</td>
            <td class="py-2 px-4 flex gap-4">
              <button
                @click="viewDetails(menu)"
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Realizar Pedidos
              </button>
              <button
                @click="viewDetailsPay(menu)"
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Gestionar Pedidos
              </button>
              <button
                @click="viewDetailsPicked(menu)"
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Entrega
              </button>
              <button
                @click="viewProducts(menu)"
                class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Ver Productos
              </button>
              <button
                @click="editMenu(menu)"
                class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Editar
              </button>
              <button
                @click="removeMenu(menu)"
                class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Botón para agregar un nuevo menú -->
      <button
        @click="openCreateMenuModal"
        class="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
      >
        Agregar Menú
      </button>

      <!-- Modal para agregar o editar un menú -->
      <div
        v-if="showMenuModal"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4">
            {{ isEditing ? "Editar Menú" : "Agregar Nuevo Menú" }}
          </h2>

          <form @submit.prevent="isEditing ? updateMenu() : addMenu()">
            <input
              v-model="currentMenu.name"
              type="text"
              placeholder="Nombre del Menú"
              class="mb-2 p-2 border rounded w-full"
              required
            />
            <input
              v-model="currentMenu.date"
              type="date"
              class="mb-2 p-2 border rounded w-full"
              required
            />

            <!-- Select para productos -->
            <div class="mb-2">
              <select
                v-model="currentMenu.selectedProduct.product_id"
                class="p-2 border rounded w-full"
                required
              >
                <option value="" disabled selected>Seleccionar Producto</option>
                <option
                  v-for="product in products"
                  :key="product.id"
                  :value="product.id"
                >
                  {{ product.name }}
                </option>
              </select>
            </div>

            <!-- Campo de cantidad -->
            <input
              v-model="currentMenu.selectedProduct.quantity"
              type="number"
              placeholder="Cantidad"
              class="mb-2 p-2 border rounded w-full"
              required
            />

            <div class="flex justify-end space-x-2">
              <button
                type="button"
                @click="closeMenuModal"
                class="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {{ isEditing ? "Actualizar" : "Agregar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import apiClient from "@/services/api";
import { useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
// Definimos variables reactivas
const menus = ref<any[]>([]);
const products = ref<any[]>([]); // Lista de productos
const loading = ref(true);
const router = useRouter();

// Variables para el modal y el menú actual
const showMenuModal = ref(false);
const isEditing = ref(false);
const currentMenu = ref({
  id: null,
  name: "",
  date: "",
  selectedProduct: { product_id: "", quantity: 0 },
});

// Filtrar menús por búsqueda
const searchQuery = ref("");
const filteredMenus = computed(() => {
  return menus.value.filter((menu) => {
    const menuName = menu.name ? menu.name.toLowerCase() : "";
    return menuName.includes(searchQuery.value.toLowerCase());
  });
});

// Función para obtener los menús
const fetchMenus = async () => {
  try {
    const response = await apiClient.get("/v1/menus");
    menus.value = response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
  } finally {
    loading.value = false;
  }
};

// Función para obtener los productos
const fetchProducts = async () => {
  try {
    const response = await apiClient.get("/v1/product");
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Función para agregar un nuevo menú
const addMenu = async () => {
  if (
    currentMenu.value.name &&
    currentMenu.value.date &&
    currentMenu.value.selectedProduct.product_id
  ) {
    const menu = {
      name: currentMenu.value.name,
      date: currentMenu.value.date,
      products: [
        {
          product_id: currentMenu.value.selectedProduct.product_id,
          quantity: currentMenu.value.selectedProduct.quantity,
        },
      ],
    };

    try {
      await apiClient.post("/v1/menus", menu);
      fetchMenus();
      closeMenuModal();
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  }
};

// Función para editar un menú
const editMenu = (menu: any) => {
  isEditing.value = true;
  currentMenu.value = {
    id: menu.id,
    name: menu.name,
    date: menu.date,
    selectedProduct: menu.products[0] || { product_id: "", quantity: 0 },
  };
  showMenuModal.value = true;
};

// Función para actualizar un menú
const updateMenu = async () => {
  if (
    currentMenu.value.name &&
    currentMenu.value.date &&
    currentMenu.value.selectedProduct.product_id
  ) {
    const menu = {
      name: currentMenu.value.name,
      date: currentMenu.value.date,
      products: [
        {
          product_id: currentMenu.value.selectedProduct.product_id,
          quantity: currentMenu.value.selectedProduct.quantity,
        },
      ],
    };

    try {
      await apiClient.put(`/v1/menus/${currentMenu.value.id}`, menu);
      const index = menus.value.findIndex(
        (menu) => menu.id === currentMenu.value.id
      );
      if (index !== -1) {
        menus.value[index] = { ...menus.value[index], ...menu };
      }
      closeMenuModal();
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  }
};

// Función para eliminar un menú
const removeMenu = async (menu: any) => {
  try {
    await apiClient.delete(`/v1/menus/${menu.id}`);
    menus.value = menus.value.filter((m) => m.id !== menu.id);
  } catch (error) {
    console.error("Error deleting menu:", error);
  }
};

// Función para abrir el modal de creación
const openCreateMenuModal = () => {
  isEditing.value = false;
  currentMenu.value = {
    id: null,
    name: "",
    date: "",
    selectedProduct: { product_id: "", quantity: 0 },
  };
  showMenuModal.value = true;
};

// Función para cerrar el modal
const closeMenuModal = () => {
  showMenuModal.value = false;
};

const viewDetails = (menu: any) => {
  router.push(`/menu/${menu.id}/orders`);
};

const viewDetailsPay = (menu: any) => {
  router.push(`/menu/${menu.id}/dashboard`);
};

const viewDetailsPicked = (menu: any) => {
  router.push(`/menu/${menu.id}/delivery`);
};

const viewProducts = (menu: any) => {
  console.log("Ver productos de:", menu);
};
// Al montar el componente, obtenemos los menús y productos
onMounted(() => {
  fetchMenus();
  fetchProducts();
});
</script>
