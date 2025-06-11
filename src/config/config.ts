// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = '/form/basicForm';

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址，暂时没用）
export const TABS_BLACK_LIST: string[] = ['/403', '/404', '/500', '/login'];

export const MENUS_CONFIG: Menu.MenuOptions[] = [
  {
    path: '/form',
    title: '表单 Form',
    icon: 'TableOutlined',
    children: [
      {
        path: '/form/basicForm',
        title: '基础 Form',
        icon: '',
      },
      {
        path: '/form/validateForm',
        title: '校验 Form',
        icon: '',
      },
      {
        path: '/form/dynamicForm',
        title: '动态 Form',
        icon: '',
      },
    ],
  },
  {
    path: '/menu',
    title: '菜单',
    icon: 'ProfileOutlined',
    children: [
      {
        path: '/menu/menu1',
        title: '菜单1',
        icon: '',
      },
      {
        path: '/menu/menu2',
        title: '菜单2',
        icon: '',
        children: [
          {
            path: '/menu/menu2/menu21',
            title: '菜单2-1',
            icon: '',
          },
          {
            path: '/menu/menu2/menu22',
            title: '菜单2-2',
            icon: '',
            children: [
              {
                path: '/menu/menu2/menu22/menu221',
                title: '菜单2-2-1',
                icon: '',
              },
            ],
          },
        ],
      },
    ],
  },
];
