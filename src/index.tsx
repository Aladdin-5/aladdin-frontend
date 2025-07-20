
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"
import { WagmiProvider } from 'wagmi'
import './index.css';
import App from './pages/App';
import { config } from '@/utils/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
const container=document.getElementById('root')
if(!container){
    throw new Error('no root element')
}

const root = ReactDOM.createRoot(container);
root.render(
    <BrowserRouter>
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
         <App />
         </QueryClientProvider>

    </WagmiProvider>
    
     </BrowserRouter>
);

