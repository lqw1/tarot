import * as Icons from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMount from "../../../hooks/useMount";
import { rootRouter } from "../../../routers";

import { useRecoilState } from "recoil";
import { MENUS_CONFIG } from "../../../config/config";
import { breadcrumbState } from "../../../store";
import { findAllBreadcrumb, getOpenKeys, searchRoute } from "../../../utils";

const AppMenu: React.FC = () => {
  const { pathname } = useLocation();
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [breadcrumbMaps, setBreadcrumbMaps] = useRecoilState(breadcrumbState);

  // 定义 menu 类型
  type MenuItem = Required<MenuProps>["items"][number];
  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  //  获取菜单列表, todo get menu data from api
  const getMenuList = (): Promise<Menu.MenuOptions[]> => {
    return new Promise((resolve, reject) => {
      resolve(MENUS_CONFIG);
    });
  };

  useMount(() => {
    console.log(rootRouter);
    getMenuList().then((data) => {
      setMenuList(deepLoopFloat(data));
      // 存储处理过后的所有面包屑导航栏到 redux 中
      setBreadcrumbMaps(findAllBreadcrumb(data));
    });
  });

  // 动态渲染 Icon 图标
  const customIcons: { [key: string]: any } = Icons;
  const addIcon = (name: string) => {
    return name ? React.createElement(customIcons[name]) : null;
  };

  // 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
  const deepLoopFloat = (
    menuList: Menu.MenuOptions[],
    newArr: MenuItem[] = []
  ) => {
    menuList.forEach((item: Menu.MenuOptions) => {
      // 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
      if (!item?.children?.length)
        return newArr.push(getItem(item.title, item.path, addIcon(item.icon!)));
      newArr.push(
        getItem(
          item.title,
          item.path,
          addIcon(item.icon!),
          deepLoopFloat(item.children)
        )
      );
    });
    return newArr;
  };

  // 刷新页面菜单保持高亮
  useEffect(() => {
    setSelectedKeys([pathname]);
    const open = getOpenKeys(pathname);
    console.log(open, pathname);
    setOpenKeys(open);
  }, [pathname]);

  // 设置当前展开的 subMenu
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length === 0 || openKeys.length === 1)
      return setOpenKeys(openKeys);
    const latestOpenKey = openKeys[openKeys.length - 1];
    if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
    setOpenKeys([latestOpenKey]);
  };

  const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
    const route = searchRoute(key, rootRouter);
    if (route.isLink) window.open(route.isLink, "_blank");
    navigate(key);
  };
  return (
    <Menu
      mode="inline"
      triggerSubMenuAction="click"
      selectedKeys={selectedKeys}
      onClick={clickMenu}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{ height: "100%", borderRight: 0 }}
      items={menuList}
    />
  );
};

export default AppMenu;
