<template>
  <div
    @click="$emit('action')"
    class="bg rounded-xl h-40"
    :style="`background-image: url(${data.image});`"
  >
    <div
      class="absolute top-0 left-0 w-full h-full bg-center rounded-xl card-shadow z-0"
    ></div>
    <div class="absolute w-full bottom-0 left-0 p-2 z-0">
      <div
        dir="rtl"
        v-if="data.price >= 0"
        class="end text-yellow-500 text-2xl font-bold tracking-wider text-shadow"
      >
        <h1 class="uppercase text-xs tracking-widest mx-1 ordinal">dzd</h1>
        <h1 class="truncate" dir="ltr">{{ data.price }}</h1>
      </div>
      <h1
        dir="auto"
        class="truncate text-white break-words font-bold tracking-wider"
      >
        {{ data.name }}
      </h1>
    </div>
    <div
      v-if="data.status == 'غير متوفر' || data.status == 'خاص'"
      class="absolute top-0 w-full h-full rounded-xl bg-slate-800 bg-opacity-50 p-4"
    >
      <svg-app
        :type="data.status == 'غير متوفر' ? 'x' : 'eye-off'"
        theme="w-5 text-white"
        :auto="true"
      />
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
