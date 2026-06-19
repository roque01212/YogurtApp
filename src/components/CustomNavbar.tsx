import { AuthContext } from "@/context/auth-context-value";
import { Menu, X } from "lucide-react";
import { use, useState } from "react";
import { NavLink } from "react-router";
import { CustomButton } from "./CustomButton";

const linkBase = "rounded-xl px-3 py-2 text-sm font-medium transition";
const linkActive = "bg-white/10 text-white";
const linkInactive = "text-zinc-400 hover:bg-white/5 hover:text-white";

export const CustomNavbar = () => {
  const [open, setOpen] = useState(false);
  const { logout, isAdmin, user } = use(AuthContext);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const handleMenu = () => {
    setOpen((prev) => !prev);
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? linkActive : linkInactive}`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#080611]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Yogurt App
          </h1>
          <p className="text-sm text-zinc-500">
            Caja, stock y movimientos
          </p>
        </div>

        <nav className="hidden gap-1 lg:flex">
          <NavLink to="/" end className={navClass}>
            Inicio
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/ventas" className={navClass}>
                Ventas
              </NavLink>
              <NavLink to="/compras" className={navClass}>
                Compras
              </NavLink>
              <NavLink to="/stock" className={navClass}>
                Stock
              </NavLink>
              <NavLink to="/caja" className={navClass}>
                Caja
              </NavLink>
              <NavLink to="/historial" className={navClass}>
                Historial
              </NavLink>
              <NavLink to="/deudas" className={navClass}>
                Deudas
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden lg:block">
          {user ? (
            <CustomButton onClick={handleLogout}>Cerrar sesion</CustomButton>
          ) : (
            <NavLink to="/login" className={navClass}>
              Iniciar sesion
            </NavLink>
          )}
        </div>

        <button
          type="button"
          onClick={handleMenu}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 lg:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#080611]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2">
            <NavLink to="/" end onClick={handleMenu} className={navClass}>
              Inicio
            </NavLink>

            {isAdmin && (
              <>
                <NavLink to="/ventas" onClick={handleMenu} className={navClass}>
                  Ventas
                </NavLink>
                <NavLink
                  to="/compras"
                  onClick={handleMenu}
                  className={navClass}
                >
                  Compras
                </NavLink>
                <NavLink to="/stock" onClick={handleMenu} className={navClass}>
                  Stock
                </NavLink>
                <NavLink to="/caja" onClick={handleMenu} className={navClass}>
                  Caja
                </NavLink>
                <NavLink
                  to="/historial"
                  onClick={handleMenu}
                  className={navClass}
                >
                  Historial
                </NavLink>
                <NavLink to="/deudas" onClick={handleMenu} className={navClass}>
                  Deudas
                </NavLink>
              </>
            )}

            <div className="mt-2 border-t border-white/10 pt-3">
              {user && (
                <CustomButton onClick={handleLogout}>Cerrar sesion</CustomButton>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
