import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "../pages/home/HomePage";
import { AppLayout } from "../ui/AppLayout";
import { ComprasPage } from "../pages/compras/ComprasPage";
import { VentasPage } from "../pages/ventas/VentasPage";
import { Login } from "../pages/login/Login";
import { DeudasPage } from "../pages/deudas/DeudasPage";
import { StockPage } from "../pages/stock/StockPage";
import { HistorialPage } from "../pages/historial/HistorialPage";
import { RetirarCajaPage } from "../pages/caja/RetirarCajaPage";
import {
  AuthenticatedRoute,
  NotAuthenticatedRoute,
  AdminRoute,
} from "@/components/routes/ProtectedRoutes";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <AppLayout />
      </AuthenticatedRoute>
    ),
    children: [
      { path: "/", element: <HomePage /> },

      {
        path: "historial",
        element: (
          <AdminRoute>
            <HistorialPage />
          </AdminRoute>
        ),
      },
      {
        path: "stock",
        element: (
          <AdminRoute>
            <StockPage />
          </AdminRoute>
        ),
      },
      {
        path: "compras",
        element: (
          <AdminRoute>
            <ComprasPage />
          </AdminRoute>
        ),
      },
      {
        path: "ventas",
        element: (
          <AdminRoute>
            <VentasPage />
          </AdminRoute>
        ),
      },
      {
        path: "deudas",
        element: (
          <AdminRoute>
            <DeudasPage />
          </AdminRoute>
        ),
      },
      {
        path: "caja",
        element: (
          <AdminRoute>
            <RetirarCajaPage />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <NotAuthenticatedRoute>
        <Login />
      </NotAuthenticatedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to={"/"} replace />,
  },
]);
