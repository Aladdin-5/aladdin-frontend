import { RouteObject } from "react-router-dom";
import Layout from "@/layouts/Layout";
import AgentPage from "@/pages/agents/agentPage";
import CreateAgent from "@/pages/agents/createAgent";
import JobsPage from "@/pages/jobs/index";
import JobsCreate from "@/pages/jobs/create";
import JobDetailPage from "@/pages/jobs/detail";
import WalletPage from "@/pages/WalletPage";
import DAOPage from "@/pages/DAOPage";
import BillsPage from "@/pages/BillsPage";
import DashboardPage from "@/pages/dashboard/";
import PageNotFoundView from "@/compoments/PageNotFoundView";
import { lazy, Suspense } from "react";

const Routes: RouteObject[] = [];

const mainRoutes = {
  path: "/",
  element: <Layout />,
  children: [
    { path: "*", element: <AgentPage /> },
    { path: "/", element: <AgentPage /> },
    {
      path: "/agent",
      children: [
        { path: "", element: <AgentPage /> },
        { path: "create", element: <CreateAgent /> },
      ],
    },
    {
      path: "/jobs",
      children: [
        { path: "", element: <JobsPage /> },
        { path: "create", element: <JobsCreate /> },
      ],
    },
    { path: "/wallet", element: <WalletPage /> },
    {
      path: "/dashboard",
      children: [
        { path: "", element: <DashboardPage /> }, // Dashboard 主页面
        { path: "jobs/:jobId", element: <JobDetailPage /> }, // Dashboard 任务详情页面
      ],
    },
    { path: "/bills", element: <BillsPage /> },
    { path: "/dao", element: <DAOPage /> },
    { path: "404", element: <PageNotFoundView /> },
  ],
};

const DemoRoutes = {
  path: "yideng",
  element: <Layout />,
  // children: [{ path: 'test', element: <Test /> }],
};

Routes.push(mainRoutes, DemoRoutes);

export default Routes;
