<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'daily-log' })
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}

async function handleGoogleLogin() {
  error.value = ''
  submitting.value = true
  try {
    await auth.loginWithGoogle()
    router.push({ name: 'daily-log' })
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-view">
    <h1 class="auth-view__title">Log in</h1>
    <form class="auth-view__form" @submit.prevent="handleSubmit">
      <AppInput v-model="email" type="email" label="Email" required />
      <AppInput v-model="password" type="password" label="Password" required />
      <p v-if="error" class="auth-view__error">{{ error }}</p>
      <AppButton type="submit" :disabled="submitting">Log in</AppButton>
    </form>
    <div class="auth-view__divider">or</div>
    <AppButton variant="secondary" :disabled="submitting" @click="handleGoogleLogin">
      Continue with Google
    </AppButton>
    <p class="auth-view__footer">
      No account?
      <RouterLink :to="{ name: 'signup' }">Sign up</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-view {
  max-width: 360px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-view__title {
  font-size: 1.5rem;
  text-align: center;
}

.auth-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-view__error {
  color: var(--color-danger, #d14343);
  font-size: 0.85rem;
}

.auth-view__divider {
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-soft, #888);
}

.auth-view__footer {
  text-align: center;
  font-size: 0.9rem;
}
</style>
