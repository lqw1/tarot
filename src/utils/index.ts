import { RouteObject } from '../routers/interface';

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';

export const isString = (value: unknown): value is string =>
  typeof value === 'string';
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number';
export const isUndef = (value: unknown): value is undefined =>
  typeof value === 'undefined';

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRoute = (
  path: string,
  routes: RouteObject[] = []
): RouteObject => {
  let result: RouteObject = {};
  for (let item of routes) {
    if (item.path === path) return item;
    if (item.children) {
      const res = searchRoute(path, item.children);
      if (Object.keys(res).length) result = res;
    }
  }
  return result;
};

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  let browserLang = navigator.language
    ? navigator.language
    : navigator.browserLanguage;
  let defaultBrowserLang = '';
  if (
    browserLang.toLowerCase() === 'cn' ||
    browserLang.toLowerCase() === 'zh' ||
    browserLang.toLowerCase() === 'zh-cn'
  ) {
    defaultBrowserLang = 'zh';
  } else {
    defaultBrowserLang = 'en';
  }
  return defaultBrowserLang;
};

/**
 * @description 获取需要展开的 subMenu
 * @param {String} path 当前访问地址
 * @returns array
 */
export const getOpenKeys = (path: string) => {
  let newStr: string = '';
  let newArr: any[] = [];
  let arr = path.split('/').map((i) => '/' + i);
  for (let i = 1; i < arr.length - 1; i++) {
    newStr += arr[i];
    newArr.push(newStr);
  }
  return newArr;
};

/**
 * @description 使用递归处理路由菜单，生成一维数组，做菜单权限判断
 * @param {Array} menuList 所有菜单列表
 * @param {Array} newArr 菜单的一维数组
 * @return array
 */
export function handleRouter(routerList: RouteObject[], newArr: string[] = []) {
  routerList.forEach((item: RouteObject) => {
    typeof item === 'object' && item.path && newArr.push(item.path);
    item.children &&
      item.children.length &&
      handleRouter(item.children, newArr);
  });
  return newArr;
}

/**
 * @description 递归当前路由的 所有 关联的路由，生成面包屑导航栏
 * @param {String} path 当前访问地址
 * @param {Array} menuList 菜单列表
 * @returns array
 */
export const getBreadcrumbList = (
  path: string,
  menuList: Menu.MenuOptions[]
) => {
  let tempPath: any[] = [];
  try {
    const getNodePath = (node: Menu.MenuOptions) => {
      tempPath.push(node);
      // 找到符合条件的节点，通过throw终止掉递归
      if (node.path === path) {
        throw new Error('GOT IT!');
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i]);
        }
        // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        tempPath.pop();
      } else {
        // 找到叶子节点时，删除路径当中的该叶子节点
        tempPath.pop();
      }
    };
    for (let i = 0; i < menuList.length; i++) {
      getNodePath(menuList[i]);
    }
  } catch (e) {
    return tempPath.map((item) => item.title);
  }
};

/**
 * @description 双重递归 找出所有 面包屑 生成对象，就不用每次都去递归查找了
 * @param {String} menuList 当前菜单列表
 * @returns object
 */
export const findAllBreadcrumb = (
  menuList: Menu.MenuOptions[]
): { [key: string]: any } => {
  let handleBreadcrumbList: any = {};
  const loop = (menuItem: Menu.MenuOptions) => {
    // 下面判断代码解释 *** !item?.children?.length   ==>   (item.children && item.children.length > 0)
    if (menuItem?.children?.length)
      menuItem.children.forEach((item) => loop(item));
    else
      handleBreadcrumbList[menuItem.path] = getBreadcrumbList(
        menuItem.path,
        menuList
      );
  };
  menuList.forEach((item) => loop(item));
  return handleBreadcrumbList;
};
