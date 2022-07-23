<template>
  <div
    v-if="ad.endDate > Date.now()"
    :href="ad.link.url"
    :target="ad.link.target"
    class="bg h-14 rounded-xl"
    :style="`background-image: url(${ad.content})`"
  >
    <div
      class="w-full h-full flex justify-between text-white text-xs opacity-10 py-2 px-2.5"
    >
      <h1>{{ $t("fixed.ad") }}</h1>
      <h1>{{ ad.advertiser }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ad: {
        content: "https://bit.ly/3Q3McTi",
        advertiser: "PEPSI",
        link: {
          url: false,
          target: false,
        },
        endDate: 9999999999999,
      },
    };
  },
};
</script>
