<template>
  <div
    id="notice"
    class="top z-10 transform -translate-y-20 transition duration-500"
  >
    <div
      v-if="msg != null && msg != undefined"
      class="bg-gray-700 text-white border-[1px] border-slate-500 break-words font-medium text-center p-2 rounded-xl shadow-gray-700 shadow-2xl"
    >
      {{ msg }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: [String, null, undefined],
  },
  watch: {
    msg() {
      let ntc = document.getElementById("notice").classList;
      ntc.remove("-translate-y-20");
      ntc.add("translate-y-20");
      setTimeout(() => {
        ntc.remove("translate-y-20");
        ntc.add("-translate-y-20");
      }, 5000);
    },
  },
};
</script>
