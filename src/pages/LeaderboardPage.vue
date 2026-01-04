<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const leaderboard = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('/data/leaderboard.json')
    leaderboard.value = await response.json()
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  } finally {
    loading.value = false
  }
})

const top10 = computed(() => leaderboard.value.slice(0, 10))
</script>

<template>
  <div class="min-h-screen bg-[#4a4a4a] flex flex-col items-center justify-center py-8 px-4">
    <!-- Paper note -->
    <div class="relative">
      <!-- Main paper with background image -->
      <div class="relative min-w-[550px] max-w-[650px]">
        <!-- Background image -->
        <img src="/img/page2.png" alt="" class="w-full h-auto" />

        <!-- Content overlay -->
        <div class="absolute inset-0 flex flex-col px-12 py-10">

        <!-- Title -->
        <h1 class="font-isaac text-5xl text-[#2a2a2a] text-center mb-1 tracking-wide"
            style="text-shadow: 1px 1px 0 rgba(0,0,0,0.1);">
          STREAK LADDER
        </h1>
        <p class="font-isaac text-lg text-[#5a5a5a] text-center mb-4">
          Random Character + Ending
        </p>


        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <span class="font-isaac text-xl text-[#4a4a4a]">Loading...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="leaderboard.length === 0" class="text-center py-8">
          <span class="font-isaac text-xl text-[#4a4a4a]">No records yet...</span>
        </div>

        <!-- List -->
        <div v-else class="space-y-2">
          <div
            v-for="entry in top10"
            :key="entry.rank"
            class="flex items-center gap-3 py-2 font-isaac text-2xl text-[#2a2a2a] group"
          >
            <!-- Rank number -->
            <span class="w-10 shrink-0">{{ entry.rank }}.</span>

            <!-- Player name -->
            <span :class="{ 'line-through decoration-2': !entry.alive }">
              {{ entry.name }}
            </span>

            <!-- Streak count -->
            <span class="text-[#6a4a4a] font-bold">
              ({{ entry.pb }})
            </span>

            <!-- Status -->
            <div class="w-24 text-center ml-auto">
              <span v-if="entry.alive" class="font-isaac text-lg text-green-700">
                ALIVE
              </span>
              <a
                v-else
                :href="entry.deathUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-1 font-isaac text-lg text-[#8a3a3a] hover:text-red-600 transition-colors"
                title="Watch how it ended"
              >
                DEAD
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </a>
            </div>

            <!-- Twitch link -->
            <a
              :href="entry.twitchUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-7 h-7 flex items-center justify-center bg-[#9146FF]/20 hover:bg-[#9146FF]/40 rounded transition-colors"
              title="Twitch channel"
            >
              <svg class="w-4 h-4 text-[#9146FF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </a>
          </div>
        </div>


        <!-- Footer -->
        <div class="text-center">
          <p class="font-isaac text-sm text-[#5a5a5a] mb-2">
            Want to submit your streak?
            <a
              href="mailto:desquilas@gmail.com?subject=TBOI Randomizer Streak Submission"
              class="text-[#4a4a6a] hover:text-[#2a2a4a] underline"
            >
              Contact us
            </a>
          </p>
          <p class="font-isaac text-xs text-[#7a7a7a]">
            Include: Twitch/YouTube channel, current streak or PB, and death clip if ended
          </p>
        </div>

        <!-- Back link -->
        <div class="mt-auto text-center">
          <RouterLink
            to="/"
            class="font-isaac text-lg text-[#5a5a5a] hover:text-[#2a2a2a] transition-colors"
          >
            ← Back to Randomizer
          </RouterLink>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
