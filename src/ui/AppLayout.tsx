import { CustomNavbar } from "@/components/CustomNavbar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-black  to-purple-600   text-zinc-100 ">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar */}
        <CustomNavbar />
        {/* Content */}
        <main className="mx-auto max-w-5xl px-4 pt-20 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
