<template>
  <div class="grid-1">
    <ad-app />
    <div
      class="avatar"
      :style="`background-image: url(${user.photoURL})`"
    ></div>
    <div
      class="w-10/12 truncate text-2xl font-semibold text-center first-letter:uppercase m-auto"
    >
      {{ user.displayName }}
    </div>
    <nav class="between">
      <button-app
        @action="$router.push('/account')"
        :text="$t('order.group')"
        svg="order"
      />
      <button-app
        @action="$router.push('/account/stores')"
        :text="$t('store.group')"
        svg="store"
      />
    </nav>
    <router-view />
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";
import adApp from "@/components/fixed/adApp.vue";
import { user } from "@/Firebase";

export default {
  components: { adApp, buttonApp },
  data() {
    return {
      user: user(),
    };
  },
};
</script>
