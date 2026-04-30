<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchShowCast } from '@/services/tvmaze.api';
import type { CastMember } from '@/types/cast.types';

const props = defineProps<{
  showId: number;
}>();

const cast = ref<CastMember[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    cast.value = await fetchShowCast(props.showId);
  } catch {
    cast.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="cast" v-if="cast.length">
    <h2>Casts</h2>

    <div class="cast-row">
      <div
        v-for="member in cast.slice(0, 12)"
        :key="member.person.id"
        class="cast-item"
      >
        <div class="avatar">
          <img
            v-if="member.person.image"
            :src="member.person.image.medium"
            :alt="member.person.name"
            loading="lazy"
          />
          <span v-else class="avatar-placeholder">
            {{ member.person.name.charAt(0) }}
          </span>
        </div>
        <p class="name">{{ member.person.name }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cast {
  margin-top: 32px;
  margin-bottom: 32px;
}

.cast h2 {
  font-size: 18px;
  margin-bottom: 12px;
}

.cast-row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.cast-item {
  width: 80px;
  flex-shrink: 0;
  text-align: center;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 8px;
  background: #222;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #aaa;
}

.name {
  font-size: 12px;
  line-height: 1.3;
  color: var(--text);
  opacity: 0.85;
}
</style>
