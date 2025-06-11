## 安装

通过 npm 安装 `npm install sa-sdk-javascript`

## Sensors 的项目环境

测试环境地址： `https://datatracking.zeiss.com.cn/sa?project=default`

正式环境地址: `https://datatracking.zeiss.com.cn/sa?project=production`

**\*正式环境数据接入请务必慎重小心，等测试环境数据稳定后再接入，防止数据的污染**

## 事件定义规则

详情请参考 excel 表中对应的规则

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf3056ca4beb46db92b730ae835ae783~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58e2d47b9324435aaca543a56034b3e4~tplv-k3u1fbpfcp-watermark.image?)

其中有些字段是必填的

- pagePool (属于哪个 SBU/部门)
- pageIdentifier (项目名称)
- pageCountry (用户所在的国家)
- pageArea (项目类型)
- pageLanguage (项目的语言类型，中文：zh-cn, 英文： en-us)

以上这些事件属性可以在 sensor 初始化的时候作为共有属性注册，不需要每次都重复发送自定义事件。

- eventName (事件名称)
- eventAction (用户动作，比如点击就是 Click)
- eventValue (需要追踪的数据内容，简要数据)
- eventDetail (需要追踪的数据内容，详情数据)

## H5 定义方法

```
import { isDev } from './isDev';
import { isLocal } from './isLocal';
export const sensors = require('sa-sdk-javascript');

export function initDataTracking() {
    const { REACT_APP_WECHAT_SENSORS_URI } = process.env;  //环境中读取sensors的后台地址

    sensors.init({
        server_url: REACT_APP_WECHAT_SENSORS_URI, //
        is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        use_client_time: true,
        send_type: 'beacon',
        heatmap: {
            //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
            clickmap: 'not_collect',
            //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
            scroll_notice_map: 'not_collect',
        },
        show_log: isDev || isLocal, // 只在本地和开发环境打印log
    });
    sensors.registerPage({
        platform_type: 'H5', // 公众号，h5都填写 H5
        project: 'mpQRC', // 项目名称
        pageArea: 'web', // 项目类型
        pageCountry: 'China', // 所在地区
        pageLanguage: 'zh-cn', // 语言
        pageIdentifier: 'mpQRC', // 项目名称
        pagePool: division, // 部门
    });
    sensors.quick('autoTrack'); //用于采集 $pageview 事件。
}

/**
 * tracking events
 * @param {*} eventName
 */
export function sendEvent(eventName, eventAction, eventValue, eventDetail) {
    const eventData = {
        eventName,
        eventAction,
        eventValue,
        eventDetail,
    };
    sensors.track(eventName, eventData);
}

```

## 微信小程序定义方法

微信小程序 SDK 下载地址：https://github.com/sensorsdata/sa-sdk-miniprogram/blob/master/dist/wechat/sensorsdata.esm.js
将文件保存到项目文件夹中。

```
import { isLocal } from "./../isLocal";
import sensors from "./sensorsdata.min.js";
// 配置初始化参数
export function SetSensorParams() {
  sensors.setPara({
    name: "sensors",
    server_url: "https://datatracking.zeiss.com.cn/sa?project=default",
    // 全埋点控制开关

    autoTrack: {
      appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
      appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
      appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
      pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
      pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
      mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集
      mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
      pageLeave: false // 默认为 false， true 则开启 $MPPageLeave事件采集
    },
    // 自定义渠道追踪参数，如 source_channel: ["custom_param"]
    source_channel: [],
    // 是否允许控制台打印查看埋点数据(建议开启查看)
    show_log: isLocal,
    // 是否允许修改 onShareAppMessage 里 return 的 path，用来增加(登录 ID，分享层级，当前的        path)，在 app onShow 中自动获取这些参数来查看具体分享来源、层级等
    allow_amend_share_path: true
  });
  sensors.registerApp({
      platform_type: "MiniProgram",
      project: "MED Online Traning",
      pageArea: "MiniProgram",
      pagePool: "MED",
      pageCountry: "China",
      pageLanguage: "zh-cn",
      pageIdentifier: "MED Online Traning"
  });
}

export function InitSensors(openId?: string) {
  // 如果能获取到 userid 不使用openid  sensors.setOpenid(openId);
  sensors.login(userid);

  sensors.init();
}

/**
 * tracking events
 * @param {*} eventName
 */
export function sendEvent(eventName, eventAction, eventValue, eventDetail) {
    const eventData = {
        eventName,
        eventAction,
        eventValue,
        eventDetail,
    };
    sensors.track(eventName, eventData);
}


```

## 数据后台地址

https://dataportal.zeiss.com.cn/login?project=default

## sdk 文档

https://www.sensorsdata.cn/2.0/manual/js_sdk.html
