import { AuthContext } from "@/context/AuthContext";
import { use, useState } from "react";
import { NavLink } from "react-router";
import { CustomButton } from "./CustomButton";
import { Menu, X } from "lucide-react";

const linkBase = "rounded-xl px-3 py-2 text-sm transition hover:bg-white/10";

const linkActive = "bg-white/10 text-white";
const linkInactive = "text-zinc-300";

export const CustomNavbar = () => {
  const [open, setOpen] = useState(false);
  const { logout, isAdmin, user } = use(AuthContext);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50  border-b border-white/40 backdrop-blur-md">
      <div className=" mx-auto max-w-5xl flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="">
          <h1 className="text-xl font-semibold sm:text-2xl">Yogurt App</h1>
          <p className="text-sm text-zinc-400">
            Control de caja, stock y movimientos
          </p>
        </div>

        <nav className="hidden gap-2 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Home
          </NavLink>
          {isAdmin && (
            <>
              <NavLink
                to="/ventas"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Ventas
              </NavLink>
              <NavLink
                to="/compras"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Compras
              </NavLink>
              <NavLink
                to="/stock"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Stock
              </NavLink>
              <NavLink
                to="/historial"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Historial
              </NavLink>
              <NavLink
                to="/deudas"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Deudas
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden lg:block">
          {user ? (
            <CustomButton onClick={handleLogout}>Cerrar session</CustomButton>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Iniciar session
            </NavLink>
          )}
        </div>
        <button
          type="button"
          onClick={handleMenu}
          className="rounded-xl px-3 py-2 text-2xl text-white transition hover:bg-white/10 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MENÚ MOBILE / TABLET */}
      {open && (
        <div className="border-t border-white/10 bg-black/80 px-4 py-4 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={handleMenu}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Home
            </NavLink>

            {isAdmin && (
              <>
                <NavLink
                  to="/ventas"
                  onClick={handleMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Ventas
                </NavLink>

                <NavLink
                  to="/compras"
                  onClick={handleMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Compras
                </NavLink>

                <NavLink
                  to="/stock"
                  onClick={handleMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Stock
                </NavLink>

                <NavLink
                  to="/historial"
                  onClick={handleMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Historial
                </NavLink>

                <NavLink
                  to="/deudas"
                  onClick={handleMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Deudas
                </NavLink>
              </>
            )}

            <div className="mt-2 border-t border-white/10 pt-3">
              {user && (
                <CustomButton onClick={handleLogout}>
                  Cerrar sesión
                </CustomButton>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
