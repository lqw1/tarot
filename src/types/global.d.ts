// * Menu
declare namespace Menu {
  interface MenuOptions {
    path: string;
    title: string;
    icon?: string;
    isLink?: string;
    close?: boolean;
    children?: MenuOptions[];
  }
}

// * Dropdown MenuInfo
declare interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}
