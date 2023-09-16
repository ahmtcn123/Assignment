<template>
  <v-app-bar flat>
    <v-app-bar-title d>
      <v-icon icon="mdi-information" />
      Market App
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-toolbar-items v-for="category in categories" :key="category.id">
      <v-btn @click="navigateToCategory(category.id)">
        {{ category.name }}
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const categories = ref<{
  name: string,
  id: number
}[]>([]);

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/category/get');
    const data = await response.json();
    if (data.status === 200) {
      categories.value = data.data.filter((category: any) => category.parent_id === null);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

onMounted(() => {
  fetchCategories();
});

const navigateToCategory = (categoryId: number) => {
  console.log(categoryId);
  window.location.href = `?category_id=${categoryId}`
};
</script>
