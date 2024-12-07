// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PersonList from "@/views/PersonList.vue";
import MenuList from "@/views/MenuList.vue";
import OrderList from "@/views/OrderList.vue";
import Dashboard from "@/components/Customers.vue";
import MenuOrders from "@/views/MenuOrders.vue";
import PaidOrders from "@/views/PaidOrders.vue";
import ProductList from "@/views/ProductList.vue";
import Login from "@/views/Login.vue"; // Asegúrate de tener este componente de Login

// Rutas de la aplicación
const routes: Array<RouteRecordRaw> = [
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/persons", component: PersonList, meta: { requiresAuth: true } },
  { path: "/products", component: ProductList, meta: { requiresAuth: true } },
  { path: "/menus", component: MenuList, meta: { requiresAuth: true } },
  {
    path: "/menu/:id/orders",
    component: MenuOrders,
    meta: { requiresAuth: true },
  },
  {
    path: "/menu/:id/delivery",
    component: PaidOrders,
    meta: { requiresAuth: true },
  },
  {
    path: "/menu/:id/dashboard",
    component: OrderList,
    meta: { requiresAuth: true },
  },
  { path: "/orders", component: OrderList, meta: { requiresAuth: true } },
  { path: "/login", component: Login }, // Agregar la ruta del login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("access_token"); // Comprobar si el token existe
  // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirigir al login si no está autenticado
  } else {
    next(); // Si está autenticado, continuar con la navegación
  }
});

export default router;
