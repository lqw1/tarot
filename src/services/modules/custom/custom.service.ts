import http from './../../';

export const uploadFile = (params: { formData: FormData }) => {
  return http.post<any>(`/api/upload`, params.formData);
};

export const addCard = (params: any) => {
  return http.post<any>(`/api/card/add`, params);
};
