import { CustomNavbar } from "@/components/CustomNavbar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#080611] text-zinc-100">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(126,34,206,0.28),transparent_34%),linear-gradient(180deg,#080611_0%,#12091f_56%,#2f1452_100%)]">
        <CustomNavbar />
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
