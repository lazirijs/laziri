<template>
  <div v-if="data" class="grid-1 mb-[-2.5rem]">
    <div v-if="data.note" class="text-sub">
      {{ data.note }}
    </div>
    <input
      v-if="edit"
      @click="(e) => (e.target.value = null)"
      @change="fileData"
      class="hidden"
      type="file"
      id="get"
      accept="image/*"
    />
    <div
      :style="`background-image: url(${
        background ? background : data.background
      })`"
      class="bg h-32 rounded-xl"
      @click="edit ? getFile('background') : ''"
    >
      <div
        v-if="edit && (!file.background || proces === 'background')"
        class="w-full h-full bg-slate-700 bg-opacity-50 rounded-xl"
      >
        <div class="h-full text-white g-center">
          {{ !proces ? $t("store.photo") : $t("fixed.photoProses") }}
        </div>
      </div>
    </div>
    <div class="grid-1 transform -translate-y-10">
      <div class="bg-wh w-[5.5rem] h-[5.5rem] rounded-full m-auto g-center">
        <div
          class="avatar"
          :style="`background-image: url(${logo ? logo : data.logo})`"
          @click="edit ? getFile('logo') : ''"
        >
          <div
            v-if="edit && (!file.logo || proces === 'logo')"
            class="w-full h-full bg-slate-700 bg-opacity-50 rounded-full"
          >
            <svg-app
              :type="!proces ? 'camera' : 'processing'"
              theme="w-5"
              :auto="true"
              class="h-full text-white g-center"
            />
          </div>
        </div>
      </div>
      <div v-if="!edit" class="grid-1">
        <h1 dir="auto" class="text-title text-xl tracking-wider">
          {{ data.name }}
        </h1>
        <h1 v-if="data.slogan" dir="auto" class="text-dis">
          {{ data.slogan }}
        </h1>
        <div v-if="user" class="text-sub-1 m-auto">
          <div class="between w-6/12 m-auto">
            <a
              :href="`https://www.google.com/maps/dir/${data.userLocation.lat},${data.userLocation.lng}/${data.g.geopoint._lat},${data.g.geopoint._long}`"
              class="m-auto"
              target="_blank"
            >
              <svg-app type="distance" theme="w-3 rotate-45" :auto="true" />
            </a>
            <a
              v-if="data.seller"
              :href="`tel:${data.seller.phone}`"
              class="m-auto"
            >
              <svg-app type="phone" theme="w-3" :auto="true" />
            </a>
            <div
              @click="
                $copy(`https://laziri.com/store/${data.id}`);
                copied = true;
              "
              class="m-auto"
            >
              <svg-app
                :type="copied ? 'done' : 'link'"
                theme="w-3"
                :auto="true"
              />
            </div>
          </div>
        </div>
        <div v-if="data.id === user" class="grid-1">
          <div v-if="data.id === user" class="between">
            <button-app
              @action="$router.push('/ms/add/product')"
              :text="$t('fixed.add')"
              svg="+"
            />
            <button-app
              @action="$router.push('/ms/edit/store')"
              :text="$t('fixed.edit')"
              svg="edit"
            />
          </div>
          <div v-if="data.id === user" class="between">
            <button-app
              @action="$router.push('/ms')"
              :text="$t('order.group')"
              svg="order"
            />
            <button-app
              @action="$router.push('/ms/products')"
              :text="$t('product.group')"
              svg="products"
            />
          </div>
        </div>
        <button-app
          v-else
          @action="$router.push(`/store/${data.id}/cart`)"
          :text="$t('cart.title')"
          svg="cart"
        />
      </div>
      <div v-else class="grid-1">
        <input
          type="text"
          dir="auto"
          class="text-title w-7/12 input"
          :placeholder="$t('store.name')"
          v-model="name"
        />
        <input
          v-if="data.slogan || data.slogan != null"
          type="text"
          dir="auto"
          class="text-dis input"
          placeholder="slogan"
          v-model="slogan"
        />
        <h6 class="text-sub">slogan {{ $t("fixed.notRequired") }}</h6>
        <div
          v-if="
            (file.logo && file.logo.size > 1048576) ||
            (file.background && file.background.size > 1048576)
          "
          class="text-sub"
        >
          {{ $t("fixed.slowPhoto") }}
        </div>
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
    edit: Boolean,
    user: String,
    data: Object,
    msg: String,
  },
  data() {
    return {
      background: null,
      logo: null,
      name: null,
      slogan: null,
      type: null,
      file: {
        logo: null,
        background: null,
      },
      proces: null,
      copied: null,
    };
  },
  watch: {
    background(newValue) {
      this.$emit("background", newValue);
      this.$emit("file", this.file);
    },
    logo(newValue) {
      this.$emit("logo", newValue);
      this.$emit("file", this.file);
    },
    name(newValue) {
      this.$emit("name", newValue);
    },
    slogan(newValue) {
      this.$emit("slogan", newValue);
    },
    copied() {
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    },
  },
  created() {
    let dt = this.data;
    if (dt) {
      dt.name ? (this.name = dt.name) : "";
      dt.slogan ? (this.slogan = dt.slogan) : "";
    }
  },
  methods: {
    getFile(event) {
      this.type = event;
      document.getElementById("get").click();
    },
    fileData(e) {
      const file = e.target.files[0];
      const show = (data, image) => {
        this.type == "logo" ? (this.logo = image) : (this.background = image);
        this.type == "logo"
          ? (this.file.logo = data)
          : (this.file.background = data);
      };
      const ntc = (text) => {
        this.msg == text
          ? this.$emit("msg", text + " ")
          : this.$emit("msg", text);
      };
      const type = file.type ? file.type.startsWith("image/") : "NOT SUPPORTED";
      if (file && type) {
        this.proces = this.type;
        const resize = new FileReader();
        resize.readAsDataURL(file);
        resize.onload = (event) => {
          const imgElement = document.createElement("img");
          imgElement.src = event.target.result;
          imgElement.onload = (eu) => {
            const canvas = document.createElement("canvas");
            const max = 500;
            const image = {
              width: eu.target.width,
              height: eu.target.height,
            };
            const scaleSize = max / image.width;
            canvas.width = image.width > max ? max : image.width;
            canvas.height = image.height * (image.width > max ? scaleSize : 1);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(eu.target, 0, 0, canvas.width, canvas.height);
            const result = ctx.canvas.toDataURL("image/jpg");
            const xhr = new XMLHttpRequest();
            xhr.open("GET", result);
            xhr.responseType = "blob";
            xhr.onload = () => {
              const resizeResult =
                file.size > xhr.response.size ||
                (file.type && file.type == "image/webp");
              const data = {
                size: resizeResult ? xhr.response.size : file.size,
                image: resizeResult ? result : URL.createObjectURL(file),
              };
              if (data.size < 2097152) {
                show(resizeResult ? xhr.response : file, data.image);
              } else {
                ntc(this.$t("fixed.bigPhoto"));
              }
              this.proces = false;
            };
            xhr.send();
          };
        };
      }
    },
  },
};
</script>
