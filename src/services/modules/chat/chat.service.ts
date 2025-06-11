import http from './../../';

export const sendChat = (data: { message: string }) => {
  return http.post<any>(`/api/chat`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
