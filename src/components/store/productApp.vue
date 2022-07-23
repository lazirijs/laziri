<template>
  <div v-if="loading" class="screen animate-pulse">
    {{ $t("fixed.loading") }}
  </div>
  <div v-else-if="message" class="screen">
    {{ message }}
  </div>
  <div v-else-if="product" class="grid-1">
    <div
      v-if="product.status !== 'متوفر'"
      class="text-center m-auto text-xs font-medium text-slate-500 dark:text-slate-400"
    >
      {{ $t(product.note) }}
    </div>
    <div
      class="bg rounded-xl h-80"
      :style="`background-image: url(${product.image})`"
    ></div>
    <div dir="auto" class="w-full text-2xl font-bold">{{ product.name }}</div>
    <div dir="auto" class="w-full px-4 uppercase">
      <div class="w-full truncate start text-3xl font-bold tracking-widest">
        <span>{{ product.price }}</span>
        <span class="uppercase text-base mx-1"> dzd </span>
      </div>
    </div>
    <button-app
      v-if="product.store == user"
      @action="$router.push(`/ms/edit/product/${product.id}`)"
      :text="$t('fixed.edit')"
      svg="edit"
    />
    <div v-else class="grid-1">
      <div class="between">
        <button-app
          v-if="product.status == 'متوفر'"
          @action="cart()"
          theme="btnB2 w-5/12"
          :text="$t('cart.title')"
          :svg="product.cart == 'true' ? 'done' : 'cart'"
        />
        <div class="w-5/12 between m-auto">
          <span class="text-slate-400 text-sm">{{
            $t("product.quantity")
          }}</span>
          <span class="w-full text-center px-2 truncate between">
            <svg-app
              @action="quantity('plus')"
              type="+"
              theme="svg text-slate-400"
              :auto="true"
            />
            <span class="w-3/12 text-center text-lg">{{
              product.quantity
            }}</span>
            <svg-app
              @action="quantity('minus')"
              type="-"
              theme="svg text-slate-400"
              :auto="true"
            />
          </span>
        </div>
      </div>
      <div
        v-if="product.quantity != 1"
        class="w-10/12 m-auto center text-slate-400 text-sm"
      >
        {{ $t("product.total") }}
        <a
          dir="rtl"
          class="px-2 truncate start text-base tracking-wider font-medium"
        >
          <a class="uppercase text-xs mx-1"> dzd </a>
          {{ product.quantity * product.price }}
        </a>
      </div>
      <div
        v-if="product.status == 'غير متوفر'"
        class="text-sub text-slate-500 dark:text-slate-400"
      >
        {{ $t("product.changeData") }}
      </div>
    </div>
    <div v-if="product.description" class="grid-1">
      <div class="text-lg font-medium">{{ $t("product.description") }} :</div>
      <div dir="auto">{{ product.description }}</div>
    </div>
    <svg-app
      @action="more ? (more = false) : (more = true)"
      :type="more ? 'up' : 'menu2'"
      theme="svg text-slate-500 dark:text-slate-400"
    />
    <div v-if="more" class="text-sub grid-1">
      <div
        @click="
          $copy(
            `https://laziri.com/store/${product.store}/product/${productId}`
          );
          copied = true;
        "
        class="center"
      >
        <h1>{{ $t("product.copyLink") }}</h1>
        <svg-app :type="copied ? 'done' : 'link'" theme="w-3.5 mx-1 p-0.5" />
      </div>
      <h1>
        {{
          `${$t("fixed.createdTime", { type: $t("product.single") })} ${$date(
            product.time.seconds * 1000
          )}`
        }}
      </h1>
    </div>
  </div>
</template>

<script>
import buttonApp from "@/components/fixed/buttonApp.vue";
import svgApp from "@/components/fixed/svgApp.vue";
import { dbPs, user } from "@/Firebase";
import { ldb } from "@/scripts/db";
import { get } from "@/scripts/sc";

export default {
  components: { svgApp, buttonApp },
  data() {
    let path = window.location.href.split("/");
    let sP = get(`products-${path[4]}`);
    return {
      user: user().uid,
      loading: null,
      message: null,
      owner: user().uid == path[4],
      storeId: path[4],
      productId: path[6],
      tSP: sP ? sP : 0,
      product: null,
      copied: null,
      more: null,
    };
  },
  watch: {
    copied() {
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    },
  },
  created() {
    this.localData();
  },
  methods: {
    async localData(cart) {
      if (this.owner) {
        if (this.tSP > Date.now() || !navigator.onLine) {
          try {
            const product = await ldb.msproducts.get(this.productId);
            if (product) {
              this.product = product;
              this.loading = false;
            } else {
              this.getData();
            }
          } catch (err) {
            this.getData();
          }
        } else {
          this.getData();
        }
      } else if (this.tSP > Date.now() || !navigator.onLine || cart) {
        try {
          const product = await ldb.products.get(this.productId);
          if (product) {
            this.product = product;
          } else {
            this.getData();
          }
        } catch (err) {
          this.getData();
        }
      } else {
        this.getData();
      }
    },
    getData() {
      this.loading = true;
      dbPs
        .doc(this.productId)
        .get()
        .then((get) => {
          if (get.exists) {
            let product = get.data();
            product["id"] = get.id;
            product["cart"] = "false";
            product["quantity"] = 1;
            if (product.status == "غير متوفر") {
              product["note"] = "product.notAvailable";
            } else if (product.status == "خاص") {
              product["note"] = "product.privet";
            }
            this.product = product;
            return product.status;
          } else {
            this.message = this.$t("product.notExist");
            this.loading = false;
          }
        })
        .then(async (status) => {
          if (status == "خاص" && !this.owner) {
            this.message = this.$t("product.notAvailable");
            this.loading = false;
          } else {
            let product = await ldb.products.get(this.productId);
            if (product) {
              this.product.cart = product.cart;
              this.product.quantity = product.quantity;
              this.loading = false;
            } else {
              await ldb.products.put(this.product);
              this.loading = false;
            }
          }
        })
        .catch(() => {
          this.message = this.$t("product.errorLoading");
          this.loading = false;
        });
    },
    async quantity(update) {
      if (update == "minus" && this.product.quantity != 1) {
        await ldb.products.update(this.product.id, {
          quantity: this.product.quantity - 1,
        });
        this.localData("cart");
      } else if (update == "plus") {
        await ldb.products.update(this.product.id, {
          quantity: this.product.quantity + 1,
        });
        this.localData("cart");
      }
    },
    async cart() {
      if (this.product.cart == "true") {
        await ldb.products.update(this.product.id, { cart: "false" });
        this.localData("cart");
      } else {
        await ldb.products.update(this.product.id, { cart: "true" });
        this.localData("cart");
      }
    },
  },
};
</script>
