import { atom } from 'recoil';

export const breadcrumbState = atom({
  key: 'breadcrumbList',
  default: {} as { [key: string]: any },
});
