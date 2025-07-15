import axios,{ AxiosResponse, AxiosRequestConfig }from 'axios';
import {ApiParams,ApiConfig,ApiData} from './apiTypes'
import SimpleMetaMaskAuth from '@/utils/metaMask'

class ApiClient {
  private auth: SimpleMetaMaskAuth;
  constructor() {
    this.auth = SimpleMetaMaskAuth.getInstance();
    this.setupInterceptors();
  }
   // 设置请求拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    axios.interceptors.request.use((config) => {
      // 如果已连接钱包，添加钱包地址到请求头
      if (this.auth.getIsConnected()) {
        config.headers['X-Wallet-Address'] = this.auth.getWalletAddress();
      }
      
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      
      return config;
    });

    // 响应拦截器
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 认证失败，提示重新连接钱包
          this.showWalletPrompt();
        }
        return Promise.reject(error);
      }
    );
  }

  // 检查钱包连接状态
  private checkWalletConnection(): void {
    if (!this.auth.getIsConnected()) {
      this.showWalletPrompt();
      throw new Error('钱包未连接');
    }
  }

  // 显示钱包连接提示
  private showWalletPrompt(): void {
    const shouldConnect = confirm('需要连接 MetaMask 钱包才能继续操作');
    
    if (shouldConnect) {
      this.auth.connectWallet()
        .then(() => {
          alert('钱包连接成功！');
          window.location.reload();
        })
        .catch((error) => {
          alert(`连接失败: ${error.message}`);
        });
    }
  }
  /**S
   * GET 请求
   * @param url - 请求地址
   * @param params - 查询参数
   * @param config - 额外配置
   * @returns Promise<AxiosResponse>
   */
  async get<T = any>(
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
  async post<T = any>(
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
  async put<T = any>(
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
  async patch<T = any>(
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
   async delete<T = any>(
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