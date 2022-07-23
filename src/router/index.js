import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/Firebase";
import Error404 from "./error404App.vue";

import login from "@/views/loginApp.vue";
import home from "@/views/homeApp.vue";
import account from "@/views/accountApp.vue";
import orders from "@/components/account/ordersApp.vue";
import stores from "@/components/account/storesApp.vue";
import store from "@/views/storeApp.vue";
import product from "@/components/store/productApp.vue";
import cart from "@/components/store/cartApp.vue";
import order from "@/components/orders/orderApp.vue";
import business from "@/views/businessApp.vue";
import busStore from "@/components/business/store/storeApp.vue";
import create from "@/components/business/store/createStoreApp.vue";
import ms from "@/views/myStoreApp.vue";
import msOrders from "@/components/business/store/myStore/ordersApp.vue";
import msProducts from "@/components/business/store/myStore/productsApp.vue";
import editStore from "@/components/business/store/myStore/editStoreApp.vue";
import AddEditProduct from "@/components/business/store/myStore/addEditProductApp.vue";
import employee from "@/components/business/employee/employeeApp.vue";
import employeeOrders from "@/components/business/employee/ordersApp.vue";
import ads from "@/components/business/ads/adsApp.vue";
import contactUs from "@/views/contactUsApp.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition.y,
          left: savedPosition.x,
          behavior: "smooth",
        });
      }, 250);
    }
  },
  routes: [
    {
      path: "*",
      component: Error404,
    },
    {
      path: "/login",
      component: login,
      meta: { hideForAuth: true },
    },
    {
      path: "/",
      component: home,
      meta: { hideForAuth: true },
    },
    {
      path: "/account",
      component: account,
      children: [
        {
          path: "",
          component: orders,
        },
        {
          path: "stores",
          component: stores,
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: "/store/:id",
      component: store,
    },
    {
      path: "/store/:sid/product/:pid",
      component: product,
      meta: { requiresAuth: true },
    },
    {
      path: "/store/:id/cart",
      component: cart,
      meta: { requiresAuth: true },
    },
    {
      path: "/order/:id",
      component: order,
      meta: { requiresAuth: true },
    },
    {
      path: "/business",
      component: business,
    },
    {
      path: "/business/store",
      component: busStore,
    },
    {
      path: "/business/store/create",
      component: create,
      meta: { requiresAuth: true },
    },
    {
      path: "/ms",
      component: ms,
      children: [
        {
          path: "",
          component: msOrders,
        },
        {
          path: "products",
          component: msProducts,
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: "/ms/edit/store",
      component: editStore,
      meta: { requiresAuth: true },
    },
    {
      path: "/ms/add/product",
      alias: "/ms/edit/product/:id",
      component: AddEditProduct,
      meta: { requiresAuth: true },
    },
    {
      path: "/business/employee",
      component: employee,
      meta: { requiresAuth: true },
    },
    {
      path: "/orders/:id",
      component: employeeOrders,
      meta: { requiresAuth: true },
    },
    {
      path: "/business/ads",
      component: ads,
      meta: { requiresAuth: true },
    },
    {
      path: "/contactus",
      component: contactUs,
    },
  ],
});

router.beforeEach((to, from, next) => {
  auth().onAuthStateChanged((user) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!user) {
        next({ path: "/login" });
      } else {
        next();
      }
    } else {
      next();
    }

    if (to.matched.some((record) => record.meta.hideForAuth)) {
      if (user) {
        next({ path: "/account" });
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export default router;
