<template>
  <div class="container mx-auto">
    <h1 class="text-xl font-bold mb-4">Detalle del Menú</h1>
    <div>
      <h2 class="text-lg font-semibold">Productos disponibles:</h2>
      <ul v-if="products.length">
        <li
          v-for="product in products"
          :key="product.id"
          class="p-2 border-b flex justify-between"
        >
          {{ product.name }} - {{ product.price }}$
          <button
            @click="addProductToMenu(product)"
            class="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Agregar
          </button>
        </li>
      </ul>
    </div>

    <div v-if="menuProducts.length" class="mt-6">
      <h2 class="text-lg font-semibold">Productos en el menú:</h2>
      <ul>
        <li
          v-for="menuProduct in menuProducts"
          :key="menuProduct.id"
          class="p-2 border-b"
        >
          {{ menuProduct.name }} - {{ menuProduct.price }}$
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/services/api";

export default defineComponent({
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const products = ref([]);
    const menuProducts = ref([]);

    const fetchProducts = async () => {
      try {
        const response = await api.get("/v1/product");
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchMenuProducts = async () => {
      try {
        const response = await api.get(`/v1/menus/${props.id}`);
        menuProducts.value = response.data.products;
      } catch (error) {
        console.error("Error fetching menu products:", error);
      }
    };

    const addProductToMenu = async (product: any) => {
      try {
        await api.post(`/v1/menus/${props.id}/add-product`, {
          product_id: product.id,
        });
        menuProducts.value.push(product);
      } catch (error) {
        console.error("Error adding product to menu:", error);
      }
    };

    onMounted(() => {
      fetchProducts();
      fetchMenuProducts();
    });

    return { products, menuProducts, addProductToMenu };
  },
});
</script>
