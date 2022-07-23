<template>
  <div
    @click="$emit('action')"
    class="bg-slate-50 dark:bg-slate-700 bg-0 h-40 rounded-xl"
    :style="`background-image: url(${data.background})`"
  >
    <div
      class="absolute top-0 w-full h-full rounded-xl bg-slate-800 bg-opacity-50"
    ></div>
    <div class="absolute w-full h-4/6 top-0 left-0 center z-0">
      <div class="avatar" :style="`background-image: url(${data.logo})`"></div>
    </div>
    <div class="absolute w-full h-2/6 bottom-0 left-0 px-2 start z-0">
      <div class="truncate text-white text-lg mx-auto font-bold">
        {{ data.name }}
      </div>
    </div>
    <div
      v-if="data.status == 'مغلق'"
      class="absolute top-0 w-full h-full rounded-xl bg-opacity-50 bg-slate-800 p-4"
    >
      <svg-app type="lock" theme="w-5 text-white" :auto="true" />
    </div>
  </div>
</template>

<script>
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { svgApp },
  props: {
    data: Object,
  },
};
</script>
