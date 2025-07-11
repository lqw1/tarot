import { message } from 'antd';
import { Toast } from 'antd-mobile';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { HttpStatus } from '../types/commonTypes';
import { checkStatus } from './helper/checkStatus';

// const axiosCanceler = new AxiosCanceler();
//  console.log(process.env.REACT_APP_API_BASE_URL, '999')
const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: process.env.REACT_APP_API_BASE_URL as string,
  // 设置超时时间（10s）
  timeout: 600000,
  // 跨域时候允许携带凭证
  // withCredentials: true,
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存本地储存当中
     */
    this.service.interceptors.request.use(
      // disable eslint for next line
      (config: any) => {
        // NProgress.start();
        // * 将当前请求添加到 pending 中
        // axiosCanceler.addPending(config);
        // * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
        // config.headers!.noLoading || showFullScreenLoading();
        const token: string = localStorage.getItem('token');
        return {
          ...config,
          headers: { ...config.headers, 'x-access-token': token },
        };
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;
        // NProgress.done();
        // * 在请求结束后，移除本次请求(关闭loading)
        // axiosCanceler.removePending(config);
        // tryHideFullScreenLoading();
        // if (data.code == ResultEnum.OVERDUE) {
        // 	localStorage.removeItem("token");
        // 	message.error(data.msg);
        // 	window.location.hash = "/login";
        // 	return Promise.reject(data);
        // }
        // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== HttpStatus.OK) {
          // message.error(data.msg);
          Toast.show({
            content: data.msg,
          });
          return Promise.reject(data);
        }
        // * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        // NProgress.done();
        // tryHideFullScreenLoading();
        // 请求超时单独判断，请求超时没有 response
        if (error.message.indexOf('timeout') !== -1)
          message.error('请求超时，请稍后再试');
        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        // // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) window.location.hash = '/500';
        return Promise.reject(error);
      }
    );
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, data?: object, _object = {}): Promise<T> {
    return this.service.post(url, data, _object);
  }
  put<T>(url: string, data?: object, _object = {}): Promise<T> {
    return this.service.put(url, data, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
}

export default new RequestHttp(config);
