<template>
  <div v-if="loading && path[4] == 'edit'" class="screen animate-pulse">
    {{ $t("fixed.loading") }}
  </div>
  <div v-else-if="message" class="screen">
    {{ message }}
  </div>
  <div
    v-else-if="path[4] == 'add' || (path[4] == 'edit' && product.store)"
    class="grid-1"
  >
    <div class="center text-title z-10">
      <div @click="select = true" class="relative between">
        {{ $t("product.status.title") }}
        <div v-if="!select" class="mx-4">
          <div v-if="product.status == 'متوفر'">
            {{ $t("product.status.available") }}
          </div>
          <div v-else-if="product.status == 'غير متوفر'">
            {{ $t("product.status.notAvailable") }}
          </div>
          <div v-else-if="product.status == 'خاص'">
            {{ $t("product.status.privet") }}
          </div>
        </div>
        <svg-app v-if="!select" type="down" theme="svg" />
      </div>
      <div
        v-if="select"
        @click="select = false"
        class="absolute w-full center translate-y-24"
      >
        <div
          :class="`grid-1 left-50 w-${
            $doc('html').lang == 'fr' ? '5' : '3'
          }/12 p-4 bg-slate-200 dark:bg-slate-300 text-slate-700 rounded-xl text-center shadow-gray-700 shadow-2xl`"
        >
          <div @click="product.status = 'متوفر'">
            {{ $t("product.status.available") }}
          </div>
          <div @click="product.status = 'غير متوفر'">
            {{ $t("product.status.notAvailable") }}
          </div>
          <div @click="product.status = 'خاص'">
            {{ $t("product.status.privet") }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!preview" :class="`${product.image ? 'grid-2' : 'center'}`">
      <div
        @click="getFile()"
        class="light2 h-40 g-center text-sm text-center rounded-xl"
      >
        <div>
          <svg-app
            :type="!proces ? 'camera' : 'processing'"
            theme="w-6 m-auto"
          />
          <div class="text-dis pt-4">
            {{ !proces ? $t("product.photo") : $t("fixed.photoProces") }}
          </div>
        </div>
        <input
          @click="(e) => (e.target.value = null)"
          @change="fileData"
          class="hidden"
          type="file"
          id="get"
          accept="image/*"
        />
      </div>
      <product-app
        v-if="product.image"
        :data="product"
        @action="preview = true"
      />
    </div>
    <div
      v-else
      @click="preview = false"
      class="bg rounded-xl h-80"
      :style="`background-image: url(${product.image})`"
    ></div>
    <div v-if="file && file.size > 1048576" class="text-sub">
      {{ $t("fixed.slowPhoto") }}
    </div>
    <input-app
      :text="product.name"
      @sync="product.name = $event"
      :title="$t('product.name')"
      svg="@"
    />
    <input-app
      :text="product.price"
      @sync="product.price = $event"
      :title="$t('product.price')"
      type="number"
      svg="money"
    />
    <input-app
      :text="product.description"
      @sync="product.description = $event"
      :title="$t('product.description')"
      svg="doc"
      type="textarea"
      :max="200"
    />
    <h6 class="text-sub pb-6">
      {{ $t("product.description") + " " + $t("fixed.notRequired") }}
    </h6>
    <button-app
      @action="show('confirm')"
      :text="this.path[4] == 'add' ? $t('fixed.add') : $t('fixed.save')"
      :svg="this.path[4] == 'add' ? '+' : 'upload'"
    />
    <div class="text-sub grid-1">
      <h1 v-html="$t('product.unsplash')"></h1>
      <h1>
        {{
          $t("fixed.delay", {
            type: $t(path[4] == "add" ? "product.single" : "fixed.update"),
          })
        }}
      </h1>
      <div v-if="path[4] == 'edit'" @click="show('delete')" class="center">
        <h1>{{ $t("product.delete.title") }}</h1>
        <svg-app type="trash" theme="w-3.5 mx-1 p-0.5" />
      </div>
    </div>

    <alert-app
      :data="alert"
      :proces="proces"
      @skip="alert = false"
      @action="action()"
    />
    <notice-app :msg="msg" />
  </div>
</template>

<script>
import productApp from "@/components/fixed/productApp.vue";
import buttonApp from "@/components/fixed/buttonApp.vue";
import noticeApp from "@/components/fixed/noticeApp.vue";
import alertApp from "@/components/fixed/alertApp.vue";
import inputApp from "@/components/fixed/inputApp.vue";
import { dbPs, user, strg, srv } from "@/Firebase";
import svgApp from "@/components/fixed/svgApp.vue";
import { get, remove } from "@/scripts/sc";
import { ldb } from "@/scripts/db";

export default {
  components: { alertApp, buttonApp, inputApp, noticeApp, svgApp, productApp },
  data() {
    return {
      path: window.location.href.split("/"),
      loading: null,
      message: null,
      file: null,
      product: {
        store: user().uid,
        name: null,
        image: null,
        price: null,
        description: null,
        status: "متوفر",
        time: srv.serverTimestamp(),
      },
      preview: null,
      select: null,
      proces: null,
      alert: null,
      msg: null,
      uploading: 0,
    };
  },
  watch: {
    uploading() {
      if (this.alert) {
        this.show("uploading");
      }
    },
  },
  beforeCreate() {
    if (!get("seller")) {
      this.$router.push("/business/store");
    }
  },
  created() {
    this.path[4] == "add" ? "" : this.localData();
  },
  methods: {
    async localData() {
      if (get(`products-${this.product.store}`) > Date.now()) {
        try {
          const product = await ldb.msproducts.get(this.path[6]);
          if (product) {
            delete product.id;
            delete product.cart;
            delete product.quantity;
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
        .doc(this.path[6])
        .get()
        .then((get) => {
          if (get.exists) {
            get.data().store === this.product.store
              ? (this.product = get.data())
              : this.$router.push(
                  `/store/${get.data().store}/product/${get.id}`
                );
          } else {
            this.message = this.$t("product.notExist");
          }
        })
        .then(async () => {
          await ldb.msproducts.update(this.path[6], this.product);
          this.loading = false;
        })
        .catch(() => {
          this.message = this.$t("product.errorLoading");
          this.loading = false;
        });
    },
    show(type) {
      if (type == "confirm") {
        let p = this.product;
        let a = [p.image, p.name, p.price];
        if (this.file == null && this.path[4] == "add") {
          this.ntc(this.$t("product.choosePhoto"));
        } else if (a.includes(null) || a.includes("")) {
          this.ntc(this.$t("fixed.fillAllData"));
        } else {
          this.alert = {
            type: "upload",
            title: this.$t("fixed.confirm"),
            svg: "doc",
            description: this.$t("fixed.confirmData"),
            action: "confirm",
          };
        }
      } else if (type == "uploading") {
        this.alert = {
          title: this.$t("fixed.upload"),
          svg: "upload",
          description: this.$t("fixed.uploading", { value: this.uploading }),
          err: true,
        };
      } else if (type == "uploaded") {
        this.alert = {
          title: this.$t("fixed.done"),
          svg: "done",
          description: this.$t("fixed.uploaded", {
            class: this.$t("product.single"),
            type:
              this.path[4] == "add"
                ? this.$t("fixed.create")
                : this.$t("fixed.edit"),
          }),
          action: "oky",
          err: true,
        };
      } else if (type == "delete") {
        this.alert = {
          type: "delete",
          title: this.$t("product.delete.title"),
          svg: "trash",
          description: this.$t("product.delete.confirm"),
          action: "confirm",
        };
      } else if (type == "failedUploading") {
        this.alert = {
          type: "error",
          title: this.$t("fixed.uploadFailed"),
          svg: "error",
          description: this.$t("fixed.uploadFailedDesc"),
          action: "oky",
          err: true,
        };
      } else if (type == "failedDeleting") {
        this.alert = {
          type: "error",
          title: this.$t("product.delete.title"),
          svg: "error",
          description: this.$t("product.delete.fail"),
          action: "oky",
          err: true,
        };
      }
      this.proces = false;
    },
    action() {
      if (this.alert.type == "upload") {
        this.upload();
        this.show("uploading");
      } else if (this.alert.type == "error") {
        this.alert = false;
      } else if (this.alert.type == "delete") {
        if (this.alert.svg == "trash") {
          this.deleteProduct();
          this.alert = {
            title: this.$t("product.delete.title"),
            svg: "trash",
            description: this.$t("product.delete.process"),
            err: true,
          };
        } else if (this.alert.svg == "done") {
          this.$router.push("/ms/products");
        }
      } else if (this.path[4] == "edit") {
        this.$router.back();
      } else {
        this.file = null;
        this.product.name = null;
        this.product.image = null;
        this.product.price = null;
        this.product.description = "";
        this.product.status = "متوفر";
        this.product.time = srv.serverTimestamp();
        this.preview = null;
        this.select = null;
        this.proces = null;
        this.alert = null;
        this.msg = null;
        this.uploading = 0;
      }
    },
    getFile() {
      document.getElementById("get").click();
    },
    fileData(e) {
      const file = e.target.files[0];
      const anImage = file.type
        ? file.type.startsWith("image/")
        : "NOT SUPPORTED";
      if (file && anImage) {
        this.proces = true;
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
                this.product.image = data.image;
                this.file = resizeResult ? xhr.response : file;
              } else {
                this.ntc(this.$t("fixed.bigPhoto"));
              }
              this.proces = false;
            };
            xhr.send();
          };
        };
      }
    },
    ntc(text) {
      this.msg == text ? (this.msg = text + " ") : (this.msg = text);
    },
    upload() {
      const uploadData = () => {
        if (this.path[4] == "add") {
          let product = this.product;
          delete product.image;
          dbPs
            .add(product)
            .then((doc) => {
              uploadImg(doc.id);
            })
            .catch(() => {
              this.show("failedUploading");
            });
        } else {
          delete this.product.time;
          dbPs
            .doc(this.path[6])
            .update(this.product)
            .then(async () => {
              await ldb.msproducts.update(this.path[6], this.product);
              this.show("uploaded");
            })
            .catch(() => {
              this.show("failedUploading");
            });
        }
      };
      const uploadImg = (id) => {
        let storage = strg()
          .ref(`/users/${this.product.store}/store/products/${id}`)
          .put(this.file);
        storage.on(
          `state_changed`,
          (snapshot) => {
            let progres = (
              (snapshot.bytesTransferred / snapshot.totalBytes) *
              99
            ).toFixed(0);
            this.uploading = progres;
          },
          () => {
            if (this.path[4] == "add") {
              dbPs
                .doc(id)
                .delete()
                .then(() => {
                  this.show("failedUploading");
                })
                .catch(() => {
                  this.show("failedUploading");
                });
            } else {
              this.show("failedUploading");
            }
          },
          () => {
            storage.snapshot.ref.getDownloadURL().then((url) => {
              if (this.path[4] == "add") {
                dbPs
                  .doc(id)
                  .update({
                    image: url,
                  })
                  .then(async () => {
                    remove(`products-${this.product.store}`);
                    this.show("uploaded");
                  })
                  .catch(() => {
                    dbPs
                      .doc(id)
                      .delete()
                      .then(() => {
                        this.show("failedUploading");
                      })
                      .catch(() => {
                        this.show("failedUploading");
                      });
                  });
              } else {
                this.product.image = url;
                uploadData();
              }
            });
          }
        );
      };

      if (this.path[4] == "add") {
        uploadData();
      } else {
        if (this.file) {
          uploadImg(this.path[6]);
        } else {
          uploadData();
        }
      }
    },
    deleteProduct() {
      dbPs
        .doc(this.path[6])
        .delete()
        .then(() => {
          strg()
            .ref(`/users/${this.product.store}/store/products/${this.path[6]}`)
            .delete()
            .then(() => {
              ldb.msproducts.delete(this.path[6]).then(() => {
                this.alert = {
                  type: "delete",
                  title: this.$t("product.delete.title"),
                  svg: "done",
                  description: this.$t("product.delete.done"),
                  action: "oky",
                  err: true,
                };
              });
            });
        })
        .catch(() => {
          this.show("failedDeleting");
        });
    },
  },
};
</script>
