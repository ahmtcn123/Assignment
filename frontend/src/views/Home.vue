<template>
  <v-container>
    <template v-for="category in categories" :key="category.id">
      <h1 style="padding-top: 10px;">Popüler {{ category.name }}</h1>
      <div style="padding-top: 10px;" v-if="category.products.length === 0">
        <p>Ürün bulunamadı</p>
      </div>
      <v-row v-if="category.products.length > 0">
        <v-col v-for="product in category.products" :key="product.id" cols="12" sm="6" md="4" lg="3">
          <v-card>
            <!-- Display Product Information -->
            <v-img v-if="product.picture" :src="'http://localhost:3000/public/' + product.picture" aspect-ratio="1"></v-img>
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-actions class="pt-0">
              <v-dialog transition="dialog-bottom-transition" width="auto">
                <template v-slot:activator="{ props }">
                  <v-btn color="red" v-bind="props">Delete</v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card>
                    <v-toolbar color="red" title="Remove product"></v-toolbar>
                    <v-card-text class="pa-12">
                      Can't reverse when deleted.
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
                      <v-btn variant="text" @click="isActive.value = false; deleteProduct(product.id)">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <br>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const categories = ref([]);

const fetchCategories = async () => {
  try {
    let idParam = '';
    if (window.location.href.includes('?')) {
      idParam = '?' + window.location.href.split('?')[1];
    }
    const response = await fetch(`http://localhost:3000/api/category/get${idParam}`);
    const data = await response.json();

    if (data.status === 200 && data?.data) {
      for (const category of data.data) {
        if (category.children) {
          categories.value = [...categories.value, ...category.children];
        }

      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

onMounted(() => {
  fetchCategories();
});



async function deleteProduct(id) {
  console.log(categories.value);
  await fetch('http://localhost:3000/api/product/delete?id=' + id, {
    method: 'DELETE',
  });

  categories.value = categories.value.map(x => ({
    ...x,
    products: x.products.filter(y => y.id !== id)
  }));
}

</script>
