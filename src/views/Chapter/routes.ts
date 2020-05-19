import { lazy } from "react";

export default [
  {
    name: "Chapter",
    path: "/chapter/:bookId/:chapterId",
    component: lazy(() => import("./Chapter"))
  }
];
