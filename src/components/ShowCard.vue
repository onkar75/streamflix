<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Show } from '@/types/show.types';

defineProps<{
  show: Show;
}>();
</script>

<template>
  <RouterLink
    :to="{ name: 'show-details', params: { id: show.id } }"
    class="card-link"
  >
    <article class="card">
      <img
        v-if="show.image"
        :src="show.image.medium"
        :alt="show.name"
        loading="lazy"
      />
      <span class="rating"> ⭐ {{ show.rating.average ?? 'N/A' }} </span>
    </article>
  </RouterLink>
</template>
<style scoped>
.card {
  width: 200px;
  position: relative;
  background: var(--card-bg);
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

.rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 6px;
  font-size: 12px;
  border-radius: 4px;
}
</style>
