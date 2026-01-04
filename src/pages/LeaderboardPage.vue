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
  <div class="min-h-screen bg-[#1a1a1a] flex flex-col items-center py-8 px-4">
    <!-- Back button -->
    <div class="w-full max-w-4xl mb-4">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-[#c4a77d] hover:text-[#e8d5b5] font-isaac text-lg transition-colors"
      >
        <span class="text-2xl">&larr;</span>
        Back to Randomizer
      </RouterLink>
    </div>

    <!-- Leaderboard container -->
    <div class="relative w-full max-w-4xl">
      <!-- Paper background -->
      <div class="absolute inset-0 bg-[url('/img/page_blood.png')] bg-cover bg-center opacity-20 rounded-lg"></div>

      <!-- Content -->
      <div class="relative bg-[#2a2018]/95 border-4 border-[#4a3828] rounded-lg shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-[#1a1008] border-b-4 border-[#4a3828] p-6 text-center">
          <h1 class="font-isaac text-4xl md:text-5xl text-[#c4a77d] tracking-wider drop-shadow-lg">
            RANDOM CHARACTER + ENDING
          </h1>
          <p class="font-isaac text-[#8a7a5d] text-lg mt-2">
            Streak Leaderboard
          </p>
        </div>

        <!-- Table -->
        <div class="p-4 md:p-6">
          <div v-if="loading" class="text-center py-12">
            <span class="font-isaac text-2xl text-[#8a7a5d] animate-pulse">Loading...</span>
          </div>

          <div v-else-if="leaderboard.length === 0" class="text-center py-12">
            <span class="font-isaac text-2xl text-[#8a7a5d]">No records yet...</span>
          </div>

          <table v-else class="w-full">
            <thead>
              <tr class="border-b-2 border-[#4a3828]">
                <th class="font-isaac text-[#c4a77d] text-xl py-3 px-2 text-center w-20">RANK</th>
                <th class="font-isaac text-[#c4a77d] text-xl py-3 px-2 text-left">PLAYER</th>
                <th class="font-isaac text-[#c4a77d] text-xl py-3 px-2 text-center w-24">STREAK</th>
                <th class="font-isaac text-[#c4a77d] text-xl py-3 px-2 text-center w-24">STATUS</th>
                <th class="font-isaac text-[#c4a77d] text-xl py-3 px-2 text-center w-32">LINKS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in top10"
                :key="entry.rank"
                class="border-b border-[#3a2818] hover:bg-[#3a2818]/50 transition-colors"
                :class="{
                  'bg-[#4a3818]/30': entry.rank === 1,
                  'bg-[#3a3838]/20': entry.rank === 2,
                  'bg-[#3a2828]/20': entry.rank === 3
                }"
              >
                <!-- Rank -->
                <td class="py-4 px-2 text-center">
                  <span
                    class="font-isaac text-2xl"
                    :class="{
                      'text-yellow-400': entry.rank === 1,
                      'text-gray-300': entry.rank === 2,
                      'text-orange-400': entry.rank === 3,
                      'text-[#8a7a5d]': entry.rank > 3
                    }"
                  >
                    {{ entry.rank }}
                  </span>
                </td>

                <!-- Player name -->
                <td class="py-4 px-2">
                  <span class="font-isaac text-2xl text-[#e8d5b5]">
                    {{ entry.name }}
                  </span>
                </td>

                <!-- Streak PB -->
                <td class="py-4 px-2 text-center">
                  <span class="font-isaac text-3xl text-[#d4444c] drop-shadow-md">
                    {{ entry.pb }}
                  </span>
                </td>

                <!-- Status -->
                <td class="py-4 px-2 text-center">
                  <span v-if="entry.alive" class="font-isaac text-xl text-green-500">
                    ALIVE
                  </span>
                  <a
                    v-else
                    :href="entry.deathUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 font-isaac text-xl text-[#d4444c] hover:text-red-400 cursor-pointer transition-colors"
                    title="Watch how it ended"
                  >
                    DEAD
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </a>
                </td>

                <!-- Links -->
                <td class="py-4 px-2">
                  <div class="flex items-center justify-center gap-3">
                    <a
                      :href="entry.proofUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-8 h-8 flex items-center justify-center bg-[#4a3828] hover:bg-[#5a4838] rounded transition-colors"
                      title="Watch proof"
                    >
                      <svg class="w-5 h-5 text-[#c4a77d]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </a>
                    <a
                      :href="entry.twitchUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-8 h-8 flex items-center justify-center bg-[#9146FF]/80 hover:bg-[#9146FF] rounded transition-colors"
                      title="Twitch channel"
                    >
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="bg-[#1a1008] border-t-4 border-[#4a3828] p-4 text-center">
          <p class="font-isaac text-[#8a7a5d] text-sm mb-2">
            Want to submit your streak?
            <a
              href="mailto:desquilas@gmail.com?subject=TBOI Randomizer Streak Submission"
              class="text-[#c4a77d] hover:text-[#e8d5b5] underline"
            >
              Contact us
            </a>
          </p>
          <p class="font-isaac text-[#6a5a4d] text-xs">
            Include: Twitch/YouTube channel, current streak or PB, and death clip if ended
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
