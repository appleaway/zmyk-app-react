import { lazy } from "react";

export default [
  {
    name: "More",
    path: "/more/:typeId",
    component: lazy(() => import("./More"))
  }
];
