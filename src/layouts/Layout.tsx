import Header from '@/compoments/Header';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="">
        <Outlet />
      </main>
    </>
  );
};
export default memo(MainLayout);
