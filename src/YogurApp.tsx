import { RouterProvider } from "react-router";
import { appRouter } from "./routes/app.router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

export const YogurApp = () => {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <RouterProvider router={appRouter} />
      </AuthProvider>
    </>
  );
};
