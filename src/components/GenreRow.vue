<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import type { Show } from '@/types/show.types';
import ShowCard from './ShowCard.vue';

const props = defineProps<{
  genre: string;
  shows: Show[];
}>();

watch(
  () => props.shows.length,
  async () => {
    await nextTick();
    updateScrollState();
  },
);

const rowRef = ref<HTMLDivElement | null>(null);

const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const updateScrollState = () => {
  const el = rowRef.value;
  if (!el) return;

  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth;
};

const scrollRight = () => {
  const el = rowRef.value;
  if (!el) return;

  el.scrollBy({
    left: el.clientWidth,
    behavior: 'smooth',
  });
};

const scrollLeft = () => {
  const el = rowRef.value;
  if (!el) return;

  el.scrollBy({
    left: -el.clientWidth,
    behavior: 'smooth',
  });
};

onMounted(async () => {
  await nextTick();
  updateScrollState();
});
</script>

<template>
  <section class="genre">
    <h2 class="title">
      {{ genre }}
      <span class="count">({{ shows.length }})</span>
    </h2>

    <div class="row-wrapper">
      <!-- Left arrow -->
      <button
        v-if="canScrollLeft"
        class="arrow left"
        @click="scrollLeft"
        aria-label="Scroll left"
      >
        ‹
      </button>

      <!-- Scrollable row -->
      <div ref="rowRef" class="row" @scroll="updateScrollState">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>

      <!-- Right arrow -->
      <button
        v-if="canScrollRight"
        class="arrow right"
        @click="scrollRight"
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  </section>
</template>

<style>
.genre {
  margin-bottom: 32px;
}

.title {
  margin: 0 0 8px 16px;
  font-size: 18px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.count {
  font-size: 14px;
  color: #888;
}
.row-wrapper {
  position: relative;
}

.row {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 0 48px;
  scroll-behavior: smooth;
}

/* Hide scrollbar (optional) */
.row::-webkit-scrollbar {
  display: none;
}

/* Arrows */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(217 76 62 / 60%);
  color: #fff;
  border: none;
  width: 32px;
  height: 48px;
  cursor: pointer;
  font-size: 24px;
  z-index: 2;
}

.arrow.left {
  left: 8px;
}

.arrow.right {
  right: 8px;
}

/* Mobile: hide arrows */
@media (max-width: 768px) {
  .arrow {
    display: none;
  }

  .row {
    padding: 0 16px;
  }
}
</style>
