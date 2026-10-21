<script setup>
const links = [
  { to: { name: 'daily-log' }, label: 'Log' },
  { to: { name: 'food-library' }, label: 'Library' },
  { to: { name: 'settings' }, label: 'Settings' },
]
</script>

<template>
  <nav class="bottom-nav">
    <div class="bottom-nav__links">
      <RouterLink
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        class="bottom-nav__link"
        active-class="bottom-nav__link--active"
      >
        {{ link.label }}
      </RouterLink>
    </div>
    <RouterLink :to="{ name: 'log-food' }" class="bottom-nav__log-button" aria-label="Log food">
      +
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height, 60px);
  display: flex;
  background: var(--color-surface, #fff);
  border-top: 1px solid var(--color-border, rgba(60, 60, 60, 0.12));
  z-index: 50;
}

.bottom-nav__links {
  flex: 1;
  display: flex;
}

.bottom-nav__link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
  font-weight: 600;
}

.bottom-nav__link--active {
  color: var(--color-primary, #2f9e67);
}

.bottom-nav__log-button {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  background: var(--color-primary, #2f9e67);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  border: 3px solid var(--color-surface, #fff);
}
</style>
