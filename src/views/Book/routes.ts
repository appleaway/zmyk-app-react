import { lazy } from "react";

export default [
  {
    name: "Book",
    path: "/book/:id",
    component: lazy(() => import("./Book"))
  }
];
