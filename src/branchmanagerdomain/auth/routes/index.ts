import { type RouteRecordRaw } from "vue-router"
import AuthLayout from "@/layouts/AuthLayout.vue"

export const routes: RouteRecordRaw[] = [
  {
    path: "/account",
    component: AuthLayout,
    redirect: { name: "app-account-sign-in" },
    children: [
      {
        path: "/account/sign-in",
        name: "app-account-sign-in",
        component: () => import("@/branchmanagerdomain/auth/views/SignIn.vue"),
        meta: { requiresAuth: false }
      }
    ]
  }
]
