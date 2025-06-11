export {};

declare global {
  interface Window {
    jWeixin: any;
    wx: any;
    [key: string]: any;
  }

  interface Navigator {
    [key: string]: any;
  }
}
