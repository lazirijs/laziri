<template>
  <div :class="`grid-1 ${theme ? theme : 'light2'} rounded-xl p-4 relative`">
    <div
      v-if="type == 'textarea' && max"
      class="absolute bottom-0 left-0 w-full m-auto"
    >
      <div class="text-sub">
        {{ `${lengthValue}/${max}` }}
      </div>
    </div>
    <div class="between">
      <div dir="auto" class="text-title">{{ title }}</div>
      <svg-app :type="svg" theme="svg" />
    </div>
    <textarea
      v-if="type == 'textarea'"
      v-model="value"
      dir="auto"
      :placeholder="placeholder ? placeholder : `${$t('fixed.enter')} ${title}`"
      :maxlength="max ? max : false"
      class="w-full h-24 max-h-40 whitespace-pre-line text-center outline-none bg-transparent font-medium m-auto"
    ></textarea>
    <input
      v-else
      v-model="value"
      dir="auto"
      :type="type ? type : 'text'"
      :maxlength="max ? max : type === 'tel' ? 10 : false"
      :placeholder="placeholder ? placeholder : `${$t('fixed.enter')} ${title}`"
      class="w-full text-center outline-none bg-transparent font-medium m-auto"
    />
  </div>
</template>

<script>
import svgApp from "@/components/fixed/svgApp.vue";

export default {
  components: { svgApp },
  props: {
    title: String,
    svg: String,
    theme: String,
    text: [String, Number],
    placeholder: String,
    type: String,
    max: Number,
  },
  data() {
    return {
      value: null,
      lengthValue: 0,
    };
  },
  watch: {
    value(newValue) {
      this.$emit("sync", this.type == "number" ? Number(newValue) : newValue);
      this.lengthValue = String(newValue).length;
    },
    text(newValue) {
      this.value = newValue;
    },
  },
  created() {
    this.value = this.text;
  },
};
</script>
