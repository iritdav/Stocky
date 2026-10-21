<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuth } from '@/composables/useAuth'

const auth = useAuth()
</script>

<template>
  <RouterView />
  <BottomNav v-if="auth.isAuthenticated.value" />
</template>
