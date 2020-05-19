import { lazy } from "react";
export default [
  {
    name: "Update",
    path: "/update",
    component: lazy(() => import("./Update"))
  }
];
