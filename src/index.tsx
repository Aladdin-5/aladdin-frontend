
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"
import './index.css';
import App from './pages/App';

const container=document.getElementById('root')
if(!container){
    throw new Error('no root element')
}

const root = ReactDOM.createRoot(container);
root.render(
    <BrowserRouter>
     <App />
     </BrowserRouter>
);

