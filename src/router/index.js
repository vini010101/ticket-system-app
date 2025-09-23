import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/views/layout/Layout.vue"),
    redirect: "/tickets",
    children: [
      {
        path: "tickets",
        name: "tickets",
        component: () => import("@/views/pages/ticket/Index.vue"),
        meta: { label: "Tickets" },
      },
      {
        path: "employees",
        name: "employees",
        component: () => import("@/views/pages/employee/Index.vue"),
        meta: { label: "Employees" },
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("@/views/pages/report/Index.vue"),
        meta: { label: "Reports" },
      },
    ],
  },

  {
    path: "/create-ticket",
    name: "create-ticket",
    component: () => import("@/views/pages/createticket/Index.vue"),
  },

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/pages/auth/Index.vue"),
    meta: { label: "Login" },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/pages/error/Index.vue"),
  },
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
