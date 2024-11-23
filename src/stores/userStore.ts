import axios from "axios";
import { defineStore } from "pinia";

// URL de tu backend
const API_URL = "http://localhost:5001/api/usuarios";

// Definir el tipo de usuario
interface User {
  nombre_usuario: string;
  cantidad_de_platos: number;
  costo: number;
  pago: "Yape" | "Efe" | null; // Define los tipos posibles para el pago
}

// Definir el estado de la tienda Pinia
interface UserStoreState {
  users: User[]; // Lista de usuarios
  searchQuery: string; // Consulta para filtrar los usuarios
}

// Crear la tienda Pinia para manejar los usuarios
export const useUserStore = defineStore("userStore", {
  state: (): UserStoreState => ({
    users: [], // Lista vacía de usuarios inicialmente
    searchQuery: "", // Consulta vacía inicialmente
  }),
  getters: {
    totalPedidos: (state) => {
      return state.users.length;
    },
    totalPagados: (state) => {
      return state.users
        .filter((user) => user.pago)
        .reduce((acc, user) => acc + user.cantidad_de_platos * user.costo, 0);
    },
    totalPagadosCount: (state) => {
      return state.users.filter((user) => user.pago).length;
    },
  },
  actions: {
    // Obtener los usuarios desde la API
    async fetchUsers() {
      try {
        const response = await axios.get<User[]>(API_URL); // Tipar la respuesta como lista de usuarios
        this.users = response.data;
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
      }
    },

    // Agregar un nuevo usuario
    async addUser(newUser: User) {
      try {
        const response = await axios.post<User>(API_URL, newUser); // Tipar la respuesta de la creación del usuario
        this.users.push(response.data);
      } catch (error) {
        console.error("Error al agregar usuario", error);
      }
    },

    // Actualizar el método de pago de un usuario
    async updateUserPayment(
      nombre_usuario: string,
      newPayment: "Yape" | "Efe" | null
    ) {
      try {
        const response = await axios.put(`${API_URL}/${nombre_usuario}`, {
          pago: newPayment,
        });
        const user = this.users.find(
          (u) => u.nombre_usuario === nombre_usuario
        );
        if (user) {
          user.pago = response.data.pago;
        }
      } catch (error) {
        console.error("Error al actualizar el pago", error);
      }
    },

    // Eliminar un usuario
    async removeUser(nombre_usuario: string) {
      try {
        await axios.delete(`${API_URL}/${nombre_usuario}`);
        this.users = this.users.filter(
          (user) => user.nombre_usuario !== nombre_usuario
        );
      } catch (error) {
        console.error("Error al eliminar el usuario", error);
      }
    },
  },
});
