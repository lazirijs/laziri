<template>
  <div v-if="data" :class="data.err ? 'alert-back-white' : 'alert-back'">
    <div
      :class="`alert-front ${
        data.err ? '' : 'dark:border-2 dark:border-slate-700'
      }`"
    >
      <h1 v-if="data.title" class="text-title">
        {{ data.title }}
      </h1>
      <div v-if="data.svg" class="p-8 g-center">
        <svg-app :type="data.svg" theme="w-12" />
      </div>
      <div
        v-else-if="data.image"
        class="bg h-32 mx-4 rounded-xl"
        :style="`background-image:url(${data.image});`"
      ></div>
      <div v-else-if="data.video" class="px-4">
        <iframe
          class="w-full bg-slate-400 dark:bg-slate-700 rounded-xl"
          :src="`https://www.youtube.com/embed/${data.video}?autoplay=1&disablekb=1`"
        >
        </iframe>
      </div>
      <h1 v-if="data.description" class="text-dis">
        {{ data.description }}
      </h1>
      <h1 v-if="data.miniDescription" class="text-sub tracking-wider">
        {{ data.miniDescription }}
      </h1>
      <div dir="rtl" v-if="data.action" class="between pt-4">
        <button-app
          @action="!processing ? $emit('action') : ''"
          :text="data.action == 'confirm' ? $t('fixed.yes') : $t('fixed.ok')"
          :svg="!processing ? 'done' : 'processing'"
        />
        <button-app
          v-if="!processing && data.action != 'oky'"
          @action="$emit('skip')"
          :text="data.action == 'confirm' ? $t('fixed.no') : $t('fixed.skip')"
          svg="x"
        />
      </div>
    </div>
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { svgApp, buttonApp },
  props: {
    data: [Object, Boolean, null, undefined],
    proces: Boolean,
  },
  data() {
    return {
      processing: null,
    };
  },
  watch: {
    proces(newValue) {
      this.processing = newValue;
    },
  },
};
</script>
