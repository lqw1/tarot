import React from "react";
import { LayoutIndex } from "../constant";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/lazyLoad";

// 表单 custom 模块
const customRouter: Array<RouteObject> = [
  {
    element: <LayoutIndex />,
    meta: {
      title: "tarot",
    },
    path: "/",
    children: [
      {
        path: "/home",
        element: lazyLoad(
          React.lazy(() => import("./../../pages/home/index"))
        ),
        meta: {
          requiresAuth: true,
          title: "home",
          key: "home",
        },
      },
      {
        path: "/pay",
        element: lazyLoad(
          React.lazy(() => import("./../../pages/pay/index"))
        ),
        meta: {
          requiresAuth: true,
          title: "pay",
          key: "pay",
        },
      }
    ],
  },
];

export default customRouter;
