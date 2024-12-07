<template>
  <DefaultLayout>
    <div class="w-full container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Gestión de Productos</h1>

      <!-- Botón para agregar producto -->
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        @click="openModal('add')"
      >
        Agregar Producto
      </button>

      <!-- Lista de productos -->
      <ul v-if="products.length" class="bg-gray-100 p-4 rounded">
        <li
          v-for="product in products"
          :key="product.id"
          class="flex justify-between items-center p-2 border-b"
        >
          <div>{{ product.name }} - {{ product.price }}$</div>
          <div class="space-x-2">
            <button
              class="text-green-600 hover:underline"
              @click="openModal('edit', product)"
            >
              Editar
            </button>
            <button
              class="text-red-600 hover:underline"
              @click="deleteProduct(product.id)"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
      <p v-else>No hay productos disponibles.</p>

      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded w-1/3">
          <h2 class="text-xl font-bold mb-4">
            {{ modalType === "add" ? "Agregar" : "Editar" }} Producto
          </h2>
          <form
            @submit.prevent="
              modalType === 'add' ? addProduct() : updateProduct()
            "
          >
            <div class="mb-4">
              <label class="block mb-1 text-sm font-bold">Nombre:</label>
              <input
                v-model="modalData.name"
                type="text"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1 text-sm font-bold">Precio:</label>
              <input
                v-model="modalData.price"
                type="number"
                step="0.01"
                class="w-full border p-2 rounded"
                required
              />
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                @click="closeModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api"; // Configuración de Axios
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// Definición del tipo de producto
interface Product {
  id?: any; // Opcional para productos nuevos
  name: string;
  price: number;
}

const products = ref<Product[]>([]); // Lista de productos
const isModalOpen = ref(false);
const modalType = ref<"add" | "edit">("add"); // Tipado estricto para el tipo de modal
const modalData = ref<Product>({ name: "", price: 0 }); // Datos del modal

// Fetch inicial de productos
const fetchProducts = async () => {
  try {
    const response = await api.get<Product[]>("/v1/product");
    products.value = response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Abrir modal
const openModal = (type: "add" | "edit", product?: Product) => {
  modalType.value = type;
  isModalOpen.value = true;
  modalData.value = product ? { ...product } : { name: "", price: 0 };
};

// Cerrar modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Crear producto
const addProduct = async () => {
  try {
    const response = await api.post<Product>("/v1/product", modalData.value);
    products.value.push(response.data);
    closeModal();
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

// Actualizar producto
const updateProduct = async () => {
  try {
    const response = await api.put<Product>(
      `/v1/product/${modalData.value.id}/`,
      modalData.value
    );
    const index = products.value.findIndex((p) => p.id === modalData.value.id);
    if (index !== -1) {
      products.value[index] = response.data;
    }
    closeModal();
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

// Eliminar producto
const deleteProduct = async (id: number) => {
  try {
    await api.delete(`/v1/product/${id}/`);
    products.value = products.value.filter((p) => p.id !== id);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
/* Estilos opcionales */
</style>
