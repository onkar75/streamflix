<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useShowsStore } from '@/stores/shows.store';

import { fetchShowById } from '@/services/tvmaze.api';

import ShowCast from '@/components/ShowCast.vue';

import type { Show } from '@/types/show.types';

const route = useRoute();
const router = useRouter();
const store = useShowsStore();

const showId = Number(route.params.id);

const show = ref<Show | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  const existingShow = store.shows.find((s) => s.id === showId);

  if (existingShow) {
    show.value = existingShow;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    show.value = await fetchShowById(showId);
  } catch(err) {
     error.value = `Show not found: ${err.message}`;
    show.value = null;
  } finally {
    loading.value = false;
  }
});

const posterImage = computed(() => show.value?.image?.original ?? null);

const premieredYear = computed(() =>
  show.value?.premiered ? new Date(show.value.premiered).getFullYear() : null,
);

const endedYear = computed(() =>
  show.value?.ended ? new Date(show.value.ended).getFullYear() : null,
);

const statusText = computed(() =>
  show.value?.status === 'Running' ? 'Running' : 'Ended',
);
</script>

<template>
  <div class="details-page">
    <button class="back" @click="router.back()">← Back</button>

    <div v-if="loading">Loading show details…</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="!show">Show not found.</div>

    <div v-else class="layout">
      <!-- Poster -->
      <div class="poster-wrapper">
        <img
          v-if="posterImage"
          :src="posterImage"
          :alt="show.name"
          loading="eager"
          class="poster"
        />
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Title -->
        <div class="title-row">
          <h1 class="title">{{ show.name }}</h1>
          <span class="rating">⭐ {{ show.rating?.average ?? 'N/A' }}</span>
        </div>

        <!-- Meta -->
        <div class="meta">
          <span v-if="premieredYear">
            {{ premieredYear }}{{ endedYear ? `–${endedYear}` : '–Present' }}
          </span>
          <span>•</span>
          <span>{{ show.runtime }} min</span>
          <span>•</span>
          <span>{{ statusText }}</span>
        </div>

        <!-- Genres -->
        <div class="genres">
          <span v-for="genre in show.genres" :key="genre" class="genre-chip">
            {{ genre }}
          </span>
        </div>

        <!-- Summary -->
        <section class="summary">
          <h2>Summary</h2>
          <div v-html="show.summary" class="paragraph"></div>
        </section>

        <!-- Details -->
        <section class="details">
          <h2>Details</h2>

          <div class="detail-row">
            <span class="label">Official site</span>
            <a
              v-if="show.officialSite"
              :href="show.officialSite"
              target="_blank"
            >
              {{ show.officialSite }}
            </a>
            <span v-else>—</span>
          </div>

          <div class="detail-row">
            <span class="label">Premiered</span>
            <span>{{ show.premiered ?? '—' }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Ended</span>
            <span>{{ show.ended ?? '—' }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Network</span>
            <span>{{ show.network?.name ?? '—' }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Language</span>
            <span>{{ show.language ?? '—' }}</span>
          </div>
        </section>
        <section>
          <!-- Show Cast-->

          <ShowCast :show-id="showId" />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-page {
  padding: 24px;
}

.back {
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 16px;
  color: inherit;
}

.back:hover {
  text-decoration: underline;
}

.layout {
  display: flex;
  gap: 32px;
  margin: 32px;
}

.poster-wrapper {
  width: clamp(260px, 22vw, 360px);
  flex-shrink: 0;
}

.poster {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 2 / 3;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
}

/* Content */
.content {
  flex: 1;
  min-width: 0;
  padding-top: 4px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 32px;
}

.rating {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 16px;
}

.meta {
  margin: 8px 0 16px;
  color: #888;
  display: flex;
  gap: 8px;
  font-size: 16px;
  letter-spacing: 0.02rem;
}

.genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.genre-chip {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--card-bg, #1a1a1a);
  border: 2px solid var(--border, #333);
  font-size: 16px;
}

/* Sections */
.summary,
.details {
  margin-bottom: 24px;
}

.summary h2,
.details h2 {
  font-size: 18px;
  margin-bottom: 8px;
}

.paragraph {
  line-height: 1.7;
  margin: 0;
}

.details .detail-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  margin-bottom: 8px;
}

.label {
  color: #888;
}

/* Responsive */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }

  .poster-wrapper {
    width: 100%;
    max-width: 300px;
  }

  .title {
    font-size: 24px;
  }
}
</style>
