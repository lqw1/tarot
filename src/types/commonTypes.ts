export interface IBaseProps {
  [key: string]: any;
}

export enum HttpStatus {
  OK = 200,
  NoContent = 204,
  Created = 201,
  UnAuthorized = 401,
  BadRequest = 400,
}

export interface WechatSdkType {
  noncestr: string;
  signature: string;
  timestamp: string;
}
