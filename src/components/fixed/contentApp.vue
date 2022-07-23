<template>
  <div class="grid-1 mb-6">
    <div class="bg h-32 rounded-xl" :style="`background-image: url(${bg})`">
      <div
        class="w-full h-full bg-slate-800 text-white rounded-xl bg-opacity-60 center font-bold"
      >
        {{ center }}
      </div>
    </div>
    <div class="text-title">{{ title }}</div>
    <div class="text-dis">{{ description }}</div>
  </div>
</template>

<script>
export default {
  props: {
    bg: String,
    center: String,
    title: String,
    description: String,
  },
};
</script>
