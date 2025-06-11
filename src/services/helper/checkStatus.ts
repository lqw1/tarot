import { Toast } from 'antd-mobile';

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      Toast.show({
        content: '请求失败！请您稍后重试',
      });
      break;
    case 401:
      Toast.show({
        content: '登录失效！请您重新登录',
      });
      break;
    case 403:
      Toast.show({
        content: '当前账号无权限访问！',
      });
      break;
    case 404:
      Toast.show({
        content: '你所访问的资源不存在！',
      });
      break;
    case 405:
      Toast.show({
        content: '请求方式错误！请您稍后重试',
      });
      break;
    case 408:
      Toast.show({
        content: '请求超时！请您稍后重试',
      });
      break;
    case 500:
      Toast.show({
        content: '服务异常！',
      });
      break;
    case 502:
      Toast.show({
        content: '网关错误',
      });
      break;
    case 503:
      Toast.show({
        content: '服务不可用！',
      });
      break;
    case 504:
      Toast.show({
        content: '网关超时',
      });
      break;
    default:
      Toast.show({
        content: '请求失败！',
      });
  }
};
