import { use, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import type { Login } from "@/interface/login";
import { toast } from "sonner";

export function Login() {
  const { loading, login } = use(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [visible, setvisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Cargando...
      </div>
    );
  }

  const onSubmit = async (loginLike: Login) => {
    setIsSubmitting(true);
    const isValid = await login(loginLike.email, loginLike.password);

    if (!isValid) toast.error("Correo o/y contraseña no validios");

    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center  bg-linear-to-b from-black  to-purple-600 px-4 text-white border border-white/10">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Accedé a tu sistema de ventas de yogurt.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Correo electrónico
            </label>

            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              placeholder="tuemail@gmail.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 mt-3 text-sm">
                El Correo es requerido
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Contraseña
            </label>

            <input
              type={visible ? "text" : "password"}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-white/30"
              placeholder="••••••••"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 mt-3 text-sm">
                La contraseña es requerido
              </p>
            )}
            <button
              type="button"
              onClick={() => setvisible(!visible)}
              className="mt-2 text-sm text-zinc-400 hover:text-white"
            >
              {visible ? "Ocultar" : "Mostrar"} contraseña
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
