<template>
  <div class="md:mx-auto xl:max-w-[600px] 3xl:max-w-[800px] px-4 xl:px-0 py-12">

    <!-- Step 1: Calendar -->
    <Calendar 
      v-if="step === 1"
      v-model="selectedDate"
      :weekday-format="'short'"
      :locale="'de-DE'" 
      class="rounded-md border w-fit mx-auto" 
    />

    <!-- Step 2: Time slots -->
    <div v-else-if="step === 2" class="mt-6">
      <p class="font-semibold">Gewähltes Datum: {{ formattedDate }}</p>
      
      <h3 class="mt-4 font-semibold">Wähle eine Uhrzeit:</h3>
      <div class="flex flex-col mt-2 space-y-2">
        <button
          v-for="slot in timeSlots"
          :key="slot"
          class="p-2 border rounded hover:bg-green-100"
          @click="selectTime(slot)"
        >
          {{ slot }}
        </button>
      </div>

      <button class="mt-4 text-sm text-gray-500 underline" @click="step = 1">
        Anderes Datum wählen
      </button>
    </div>

    <!-- Step 3: Personal info & Ort -->
    <div v-else-if="step === 3" class="mt-6">
      <p class="font-semibold">Gewähltes Datum & Zeit: {{ formattedDate }} - {{ selectedTime }}</p>
      
      <h3 class="mt-4 font-semibold">Deine Daten:</h3>
      <form @submit.prevent="submitBooking" class="flex flex-col mt-2 space-y-3">

        <input v-model="name" type="text" placeholder="Name" required class="p-2 border rounded" />
        <input v-model="email" type="email" placeholder="Email" required class="p-2 border rounded" />

        <!-- Ort selection -->
        <label class="mt-2 font-semibold">Ort / Terminart:</label>
        <select v-model="location" class="p-2 border rounded">
          <option value="call">Telefonat</option>
          <option value="office">Vor Ort: Rhowerk GmbH, Karl-Heine-Straße 20, 04229 Leipzig</option>
          <option value="teams">Microsoft Teams</option>
        </select>

        <input 
          v-if="location === 'call'" 
          v-model="phone" 
          type="tel" 
          placeholder="Telefonnummer" 
          required
          class="p-2 border rounded mt-2"
        />

        <h3 class="mt-4 font-semibold">Bitte gib alles an, was bei der Vorbereitung auf unser Meeting hilfreich sein könnte.</h3>
        <textarea
          v-model="notes"
          class="p-2 border rounded mt-2 resize-none"
          rows="4"
        ></textarea>

        <button type="submit" class="p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-3">
          Termin buchen
        </button>
      </form>

      <button class="mt-4 text-sm text-gray-500 underline" @click="step = 2">
        Andere Uhrzeit wählen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date"
import { ref, watch, computed } from "vue"
import { Calendar } from "@/components/ui/calendar"

// Step tracking: 1=date, 2=time, 3=personal info
const step = ref(1)
const notes = ref("")

// Selected date & time
const selectedDate = ref<DateValue | null>(null)
const selectedTime = ref("")

// Personal info
const name = ref("")
const email = ref("")
const phone = ref("")
const location = ref("call") // default selected option

// Example time slots (can later be dynamic per date)
const timeSlots = ref([
  "09:00", "09:45", "10:30", "11:15", "13:00", "13:45", "14:30"
])

// Computed formatted date
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const jsDate = new Date(
    selectedDate.value.year,
    selectedDate.value.month - 1,
    selectedDate.value.day
  )
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(jsDate)
})

// Automatically move to step 2 when a date is selected
watch(selectedDate, (date) => {
  if (date) step.value = 2
})

function selectTime(slot: string) {
  selectedTime.value = slot
  step.value = 3
}

async function submitBooking() {
  if (!selectedDate.value) return

  try {
    await $fetch('/api/send-booking-email', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        date: formattedDate.value, // send formatted string
        time: selectedTime.value,
        location: location.value,
        phone: location.value === 'call' ? phone.value : null,
        notes: notes.value
      }
    })

    navigateTo('/success')

    // Reset form
    step.value = 1
    selectedDate.value = null
    selectedTime.value = ''
    name.value = ''
    email.value = ''
    phone.value = ''
    location.value = 'call'
    notes.value = ''
  } catch (err) {
    console.error(err)
  }
}
</script>
