import { Navigate, useRoutes } from "react-router-dom";
import { RouteObject } from "./interface";

// * 导入所有router

// * 处理路由
export const routerArray: RouteObject[] = [];
function importAll(r: any) {
  r.keys().forEach((x: any) => {
    const routes = r(x).default;
    if (routes.length > 1) {
      routes.forEach((y) => {
        routerArray.push(y);
      });
    } else {
      routerArray.push(routes[0]);
    }
  });
}

importAll(require.context("./modules/", true, /\.tsx$/));

export const rootRouter: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" />,
    meta: {
      title: "",
      hideInMenu: true,
    },
  },
  ...routerArray,
  {
    path: "*",
    meta: {
      title: "404",
      hideInMenu: true,
    },
    element: <Navigate to="/home" />,
  },
];

const Router = () => {
  const routes = useRoutes(rootRouter as any);
  return routes;
};

export default Router;
