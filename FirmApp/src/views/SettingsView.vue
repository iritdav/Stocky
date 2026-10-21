<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

const dailyCalorieGoal = ref(auth.dailyCalorieGoal.value)
const saved = ref(false)

async function handleSave() {
  await auth.updateGoal(Number(dailyCalorieGoal.value))
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="settings-view">
    <AppHeader title="Settings" />

    <AppCard class="settings-view__section">
      <h2 class="settings-view__heading">Daily calorie goal</h2>
      <form class="settings-view__form" @submit.prevent="handleSave">
        <AppInput v-model="dailyCalorieGoal" type="number" min="0" required />
        <AppButton type="submit">Save</AppButton>
        <p v-if="saved" class="settings-view__saved">Saved!</p>
      </form>
    </AppCard>

    <AppCard class="settings-view__section">
      <AppButton variant="secondary" @click="router.push({ name: 'onboarding' })">
        Recalculate calorie goal
      </AppButton>
    </AppCard>

    <AppCard class="settings-view__section">
      <AppButton variant="secondary" @click="router.push({ name: 'weight-tracker' })">
        Weight Tracker
      </AppButton>
    </AppCard>

    <AppCard class="settings-view__section">
      <AppButton variant="danger" @click="handleLogout">Log out</AppButton>
    </AppCard>
  </div>
</template>

<style scoped>
.settings-view {
  padding-bottom: calc(var(--nav-height, 60px) + 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-view__section {
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-view__heading {
  font-size: 1rem;
}

.settings-view__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-view__saved {
  color: var(--color-primary, #2f9e67);
  font-size: 0.85rem;
}
</style>
