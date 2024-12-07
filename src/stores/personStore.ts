import { defineStore } from "pinia";
import api from "@/services/api";
import { Person } from "@/types/person";

export const usePersonStore = defineStore("personStore", {
  state: () => ({
    persons: [] as Person[],
  }),
  actions: {
    async fetchPersons() {
      try {
        this.persons = await api.get("/v1/persons");
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    },
  },
});
