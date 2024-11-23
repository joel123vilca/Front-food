<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useUserStore } from ".././stores/userStore";
import People from "../assets/icons/people.vue";
import Done from "../assets/icons/done.vue";
import Extra from "../assets/icons/extra.vue";
import Total from "../assets/icons/total.vue";

// Instanciar la store
const userStore = useUserStore();

// Obtener los datos de los usuarios al montar el componente
onMounted(() => {
  userStore.fetchUsers(); // Cambié 'usersStore' a 'userStore'
});

// Variables calculadas usando getters de la store
const totalPedidos = ref(userStore.totalPedidos); // Cambié 'usersStore' a 'userStore'
const totalPagados = ref(userStore.totalPagados); // Cambié 'usersStore' a 'userStore'
const totalPagadosCount = ref(userStore.totalPagadosCount); // Cambié 'usersStore' a 'userStore'
const extraAmount = ref(2); // Adicionales fijos definidos localmente
const totalCount = ref(totalPagados.value + extraAmount.value);

// Reactividad en caso de cambios en la store
watchEffect(() => {
  totalPedidos.value = userStore.totalPedidos; // Cambié 'usersStore' a 'userStore'
  totalPagados.value = userStore.totalPagados; // Cambié 'usersStore' a 'userStore'
  totalPagadosCount.value = userStore.totalPagadosCount; // Cambié 'usersStore' a 'userStore'
  totalCount.value = totalPagados.value + extraAmount.value;
});
</script>

<template>
  <div
    class="flex gap-10 w-full h-[150px] px-4 py-4 rounded-lg shadow-lg bg-[#FFF]"
  >
    <!-- Total de pedidos -->
    <div class="w-[350px] h-full items-center flex gap-3 border-r-2">
      <div
        class="bg-[#D3FFE7] w-[84px] h-[84px] flex items-center justify-center rounded-[50%]"
      >
        <People />
      </div>
      <div class="flex flex-col pt-4">
        <label class="text-[#ACACAC] text-[14px]">Total de pedidos</label>
        <span class="font-bold text-[32px]">{{ totalPedidos }}</span>
      </div>
    </div>

    <!-- Total de pagados -->
    <div class="w-[350px] h-full items-center flex gap-3 border-r-2">
      <div
        class="bg-[#D3FFE7] w-[84px] h-[84px] flex items-center justify-center rounded-[50%]"
      >
        <Done />
      </div>
      <div class="flex flex-col pt-4">
        <label class="text-[#ACACAC] text-[14px]">Total de pagados</label>
        <span class="font-bold text-[32px]">{{ totalPagadosCount }}</span>
      </div>
    </div>

    <!-- Adicionales -->
    <div class="w-[350px] h-full items-center flex gap-3 border-r-2">
      <div
        class="bg-[#D3FFE7] w-[84px] h-[84px] flex items-center justify-center rounded-[50%]"
      >
        <Extra />
      </div>
      <div class="flex flex-col pt-4">
        <label class="text-[#ACACAC] text-[14px]">Adicionales</label>
        <span class="font-bold text-[32px]">{{ extraAmount }}</span>
      </div>
    </div>

    <!-- Total S/ -->
    <div class="w-[350px] h-full items-center flex gap-3">
      <div
        class="bg-[#D3FFE7] w-[84px] h-[84px] flex items-center justify-center rounded-[50%]"
      >
        <Total />
      </div>
      <div class="flex flex-col pt-4">
        <label class="text-[#ACACAC] text-[14px]">Total S/.</label>
        <span class="font-bold text-[32px]">{{ totalCount }}</span>
      </div>
    </div>
  </div>
</template>
