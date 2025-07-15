
interface WindowWithEthereum extends Window {
  ethereum?: any;
}

class SimpleMetaMaskAuth {
  private static instance: SimpleMetaMaskAuth;
  private walletAddress: string | null = null;
  private isConnected: boolean = false;

  private constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
  }

  public static getInstance(): SimpleMetaMaskAuth {
    if (!SimpleMetaMaskAuth.instance) {
      SimpleMetaMaskAuth.instance = new SimpleMetaMaskAuth();
    }
    return SimpleMetaMaskAuth.instance;
  }

  // 检查是否安装了 MetaMask
  public isMetaMaskInstalled(): boolean {
    const { ethereum } = window as WindowWithEthereum;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  // 连接钱包
  public async connectWallet(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('请先安装 MetaMask 钱包');
    }

    try {
      const { ethereum } = window as WindowWithEthereum;
      
      // 请求连接
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('没有找到账户');
      }

      const address = accounts[0];
      this.walletAddress = address;
      this.isConnected = true;
      
      // 保存到本地存储
      this.saveToStorage();
      
      return address;
    } catch (error: any) {
      throw new Error(error.message || '连接失败');
    }
  }

  // 断开连接
  public disconnectWallet(): void {
    this.walletAddress = null;
    this.isConnected = false;
    this.clearStorage();
  }

  // 获取钱包地址
  public getWalletAddress(): string | null {
    return this.walletAddress;
  }

  // 检查是否已连接
  public getIsConnected(): boolean {
    return this.isConnected && !!this.walletAddress;
  }

  // 格式化地址显示
  public formatAddress(address: string | null): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // 监听账户变化
  private setupEventListeners(): void {
    if (!this.isMetaMaskInstalled()) return;

    const { ethereum } = window as WindowWithEthereum;
    
    // 监听账户变化
    ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.walletAddress = accounts[0];
        this.saveToStorage();
      }
    });
  }

  // 保存到本地存储
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('metamask_address', this.walletAddress || '');
      localStorage.setItem('metamask_connected', this.isConnected.toString());
    }
  }

  // 从本地存储加载
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const address = localStorage.getItem('metamask_address');
      const connected = localStorage.getItem('metamask_connected') === 'true';
      
      if (address && connected) {
        this.walletAddress = address;
        this.isConnected = true;
      }
    }
  }

  // 清除本地存储
  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metamask_address');
      localStorage.removeItem('metamask_connected');
    }
  }
}

export default SimpleMetaMaskAuth;