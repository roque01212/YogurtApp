import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  onConfirm: () => void;
}

export const CustomAlert = ({ onConfirm }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-purple-500  ">Cobrar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-purple-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Decea Marcar como Pagado?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Esta acción no se puede deshacer. Esto marcará la venta como pagada
            y actualizará el historial de ventas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
