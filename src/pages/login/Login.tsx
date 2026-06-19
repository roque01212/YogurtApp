import { use, useState } from "react";
import { AuthContext } from "../../context/auth-context-value";
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

  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080611] text-white">
        Cargando...
      </div>
    );
  }

  const onSubmit = async (loginLike: Login) => {
    setIsSubmitting(true);
    const isValid = await login(loginLike.email, loginLike.password);

    if (!isValid) toast.error("Correo o contrasena incorrectos.");

    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(126,34,206,0.3),transparent_34%),linear-gradient(180deg,#080611_0%,#12091f_56%,#2f1452_100%)] px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-200">Yogurt App</p>
          <h1 className="mt-1 text-2xl font-bold">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Accede a tu sistema de ventas y stock.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Correo electronico
            </label>

            <input
              type="email"
              className="min-h-11 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
              placeholder="tuemail@gmail.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-300">
                El correo es requerido
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Contrasena
            </label>

            <input
              type={visible ? "text" : "password"}
              className="min-h-11 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
              placeholder="********"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-300">
                La contrasena es requerida
              </p>
            )}
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="mt-2 min-h-10 text-sm text-zinc-400 hover:text-white"
            >
              {visible ? "Ocultar" : "Mostrar"} contrasena
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 font-semibold text-emerald-50 transition hover:bg-emerald-400/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
