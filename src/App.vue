<template>
  <div class="py-[3.8rem]">
    <header-app />
    <router-view class="p-4" />
  </div>
</template>

<script>
import headerApp from "@/components/fixed/headerApp.vue";

export default {
  components: { headerApp },
};
</script>
