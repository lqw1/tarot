import http from './../../';

type UserInfoResonpse = {
  token: string;
  group: string;
  corpId: string;
  agentId: string;
  role: string;
  dataPermission: string;
};

export default {
  getUserInfo(params: { code: string }): Promise<UserInfoResonpse> {
    const url = `/v1/auth/user`;
    return http.get<UserInfoResonpse>(url, params);
  },
};
