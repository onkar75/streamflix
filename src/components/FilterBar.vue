<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  categories: string[];
}>();

/**
 * Emits filter changes to parent (HomePage)
 */
const emit = defineEmits<{
  (e: 'update:category', value: string): void;
  (e: 'update:rating', value: 'any' | 7 | 8 | 9): void;
}>();

/**
 * Local UI state
 */
const selectedCategory = ref('all');
const selectedRating = ref<'any' | 7 | 8 | 9>('any');

const onCategoryChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value;
  selectedCategory.value = value;
  emit('update:category', value);
};

const onRatingChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value;
  const rating = value === 'any' ? 'any' : (Number(value) as 7 | 8 | 9);
  selectedRating.value = rating;
  emit('update:rating', rating);
};

const reset = () => {
  selectedCategory.value = 'all';
  selectedRating.value = 'any';
};

defineExpose({ reset });
</script>

<template>
  <div class="filter-bar">
    <!-- Category -->
    <select class="select" :value="selectedCategory" @change="onCategoryChange">
      <option value="all">All categories</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>

    <!-- Rating -->
    <select class="select" :value="selectedRating" @change="onRatingChange">
      <option value="any">Any rating</option>
      <option value="9">9+</option>
      <option value="8">8+</option>
      <option value="7">7+</option>
    </select>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 12px 16px;
  background: var(--bg);
  margin-top: 16px;
}

/* Type toggle */
.type-toggle {
  display: flex;
  gap: 8px;
}

.type-toggle button {
  background: transparent;
  color: inherit;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
}

.type-toggle button.active {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.select {
  background: transparent;
  color: inherit;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
}

.type-toggle button,
.select {
  border: 1px solid var(--border);
}

.type-toggle button:hover,
.select:hover {
  border-color: var(--text);
}
</style>
