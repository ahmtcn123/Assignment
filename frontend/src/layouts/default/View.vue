<template>
  <v-main>
    <VLayoutItem model-value position="bottom" class="text-end" size="88">
      <div class="ma-4">
        <VBtn icon="mdi-plus" size="large" color="primary" elevation="8" @click="openFormDialog" />
      </div>
    </VLayoutItem>
    <router-view />
    <!-- Form Dialog -->
    <v-dialog v-model="formDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Create Product
        </v-card-title>
        <v-card-text>
          <div style="color: red;" v-if="validationError" class="error-message">{{ validationError }}</div>
          <br>
          <v-form @submit.prevent="submitForm">
            <!-- Corrected prop typings for v-file-input -->
            <v-file-input label="File" v-model="file" type="file" accept="image/jpg"></v-file-input>
            <v-text-field v-model="name" label="Name"></v-text-field>
            <v-select ref="select" v-model="selectedCategory" :items="options" item-title="name" item-value="id" label="selectedCategory"></v-select>
            <v-btn type="submit" color="primary">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const formDialog = ref(false);
const file = ref<null | any>(null);
const name = ref('');
const options = ref<{
  id: number;
  name: string;
}[]>([]);
const selectedCategory = ref(null);
const validationError = ref('');


const openFormDialog = () => {
  formDialog.value = true;
};

const fetchCategories = async () => {
  const response = await fetch('http://localhost:3000/api/category/get');
  const data = await response.json();

  const value = []

  console.log('data', data.data)
  if (data.status === 200 && data?.data) {
    for (const category of data.data) {
      for (const subCategory of category.children) {
        value.push({
          id: subCategory.id,
          name: subCategory.name,
        });
      }
    }
    console.log('?', value);
    options.value = value;
  }
}

const submitForm = () => {
  validationError.value = '';

  if (file.value && file?.value[0] && name && selectedCategory.value) {

    const formData = new FormData();
    console.log('file', file.value[0]);
    formData.append('file', file.value[0]);
    formData.append('name', name.value);
    formData.append('category_id', selectedCategory.value);

    fetch('http://localhost:3000/api/product/create', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        window.location.reload();
        formDialog.value = false;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    validationError.value = 'Please fill all fields';
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
