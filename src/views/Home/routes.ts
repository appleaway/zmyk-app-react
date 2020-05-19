import { lazy } from 'react'

export default [
  {
    name: "Home",
    path: "/home",
    component: lazy(() => import("./Home"))
  }
];
