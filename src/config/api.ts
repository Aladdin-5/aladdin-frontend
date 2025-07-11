import axios,{ AxiosResponse, AxiosRequestConfig }from 'axios';
import {ApiParams,ApiConfig,ApiData} from './apiTypes'

class ApiClient {
  /**
   * GET 请求
   * @param url - 请求地址
   * @param params - 查询参数
   * @param config - 额外配置
   * @returns Promise<AxiosResponse>
   */
  get<T = any>(
    url: string, 
    params?: ApiParams, 
    config: ApiConfig = {}
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        params,
        url,
        ...config
      })
      .then((res: AxiosResponse<T>) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * POST 请求
   */
  post<T = any>(
    url: string, 
    data?: ApiData, 
    options: ApiConfig = {}
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data,
        ...options
      })
      .then((res: AxiosResponse<T>) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * PUT 请求
   */
  put<T = any>(
    url: string, 
    data?: ApiData
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        data,
        url
      })
      .then((res: AxiosResponse<T>) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(
    url: string, 
    data?: ApiData
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      axios({
        method: 'patch',
        data,
        url
      })
      .then((res: AxiosResponse<T>) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(
    url: string, 
    data?: ApiData
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        data
      })
      .then((res: AxiosResponse<T>) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}

// 创建并导出 API 客户端实例
const apiClient = new ApiClient();

export default apiClient;