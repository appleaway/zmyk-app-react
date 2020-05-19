export interface RouteConfig {
  path: string;
  name: string;
  component: React.LazyExoticComponent<
    (props: { [key: string]: any }) => JSX.Element
  >;
  children?: RouteConfig[];
}

let routes: RouteConfig[] = [];

const rc = require.context("../views", true, /routes\.ts$/);
rc.keys().forEach(key => {
  let defaultRoutes: Array<RouteConfig> = rc(key)["default"];
  if (defaultRoutes) {
    routes.push(...defaultRoutes);
  }
});
console.log("routes", routes);

export default routes;
