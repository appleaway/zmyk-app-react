import { lazy } from "react";

export default [
  {
    name: "Category",
    path: "/category",
    component: lazy(() => import("./Category"))
  }
];
