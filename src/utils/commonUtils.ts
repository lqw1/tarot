import { RegUtil } from './regUtils';

export const getTimeZoneOffsetTimeStamp = (): number => {
  return new Date().getTimezoneOffset() * 60 * 1000;
};

export const downloadFile = (
  url: string,
  callback?: (...arg: any[]) => void
) => {
  const eleLink: HTMLAnchorElement = document.createElement('a');
  eleLink.download = url;
  eleLink.href = url;
  eleLink.style.display = 'none';

  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
  typeof callback === 'function' && callback();
};

export const openLink = (url: string, callback?: (...arg: any[]) => void) => {
  const eleLink: HTMLAnchorElement = document.createElement('a');
  eleLink.target = '_blank';
  eleLink.href = url;
  eleLink.style.display = 'none';

  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
  callback && callback();
};

export const convertFileToBase64 = (
  blob: Blob | File,
  callback: (...arg: any[]) => void
): void => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = (event) => {
    const base64 = event?.target?.result;
    typeof callback === 'function' && callback(base64);
  };
};

export const safetyInputText = (text: string): string => {
  if (typeof text !== 'string') return text;
  return text?.replace(RegUtil.inputTextPattern, '') ?? '';
};

export const copyToClipboard = (textToCopy: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
};

export const queryUrlByKey = (key: string): string | null => {
  const urlObj = new URL(window.location.href);
  return urlObj.searchParams.get(key);
};

export const isEqual = (paramsA: any, paramsB: any) => {
  if (isNaN(paramsA) && isNaN(paramsB)) return true;

  if (typeof paramsA !== 'object' && typeof paramsB !== 'object')
    return paramsA === paramsB;

  if (paramsA === null && paramsB === null) return true;

  for (const i in paramsA) {
    if (!paramsA?.hasOwnProperty(i)) continue;
    if (paramsA[i] !== paramsB[i]) return false;
  }

  return true;
};

export const deepClone = <T>(params: T): T => {
  if (typeof params !== 'object') return params;
  if (typeof params === null) return params;
  if (Array.isArray(params)) {
    const newArr = [];
    for (const i of params) {
      if (Array.isArray(params[i])) {
        deepClone(params[i]);
      } else {
        newArr.push(params[i]);
      }
    }

    return newArr as T;
  }

  const newObj: Record<string, any> = {};
  for (const i in params) {
    if (!params.hasOwnProperty(i)) continue;
    if (typeof params[i] === 'object') {
      deepClone(params[i]);
    } else {
      newObj[i] = params[i];
    }
  }
  return newObj as T;
};
