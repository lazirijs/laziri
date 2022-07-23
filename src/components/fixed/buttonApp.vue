<template>
  <a
    :href="link ? link : false"
    :target="target ? target : false"
    @click="$emit('action')"
    :class="theme ? theme : 'btnL2 w-5/12'"
    dir="rtl"
  >
    <h1 v-if="text" dir="auto" class="btnTxt">{{ text }}</h1>
    <svg-app :type="svg" theme="svg" :auto="true" />
  </a>
</template>

<script>
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { svgApp },
  props: {
    text: String,
    theme: String,
    svg: String,
    link: String,
    target: String,
  },
};
</script>
