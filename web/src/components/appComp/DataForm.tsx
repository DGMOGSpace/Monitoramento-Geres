import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dados } from "../../../config";
import { api } from "@/api/api";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  data: z.string().nonempty("Data é obrigatória."),
});

interface IndicatorValue {
  indicador: string;
  valor: string;
}

const DataForm = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valuesList, setValuesList] = useState<IndicatorValue[]>([]);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      data: "",
    },
  });

  const handleValueChange = (
    index: number,
    field: keyof IndicatorValue,
    value: string
  ) => {
    const newValuesList = [...valuesList];
    newValuesList[index][field] = value;
    setValuesList(newValuesList);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      ...data,
      user,
      values: valuesList,
    };

    await api.post("/addData", payload);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 rounded-lg shadow-md w-3/6 mx-auto my-10 bg-white">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Cadastro de Dados
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Data</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    min="2024-01-01"
                    max="2024-12-31"
                    className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {Object.entries(dados.temasIndicadores).map(([tema, indicadores]) => (
              <div key={tema} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-semibold text-lg text-gray-700 mb-3">{tema}</h3>
                {indicadores.map((indicador) => (
                  <div key={indicador} className="mb-4">
                    <FormLabel className="text-gray-700 font-medium">{indicador}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Valor"
                        className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                        onChange={(e) => {
                          const index = valuesList.findIndex((item) => item.indicador === indicador);
                          if (index >= 0) {
                            handleValueChange(index, "valor", e.target.value);
                          } else {
                            setValuesList([...valuesList, { indicador, valor: e.target.value }]);
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
            <DialogTrigger asChild>
              <Button
                type="button"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                Enviar
              </Button>
            </DialogTrigger>
            <DialogContent className="w-3/6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Confirmar Envio</DialogTitle>
                <DialogDescription>
                  Confira os dados preenchidos abaixo antes de confirmar:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  <strong>Data:</strong> {form.getValues().data}
                </p>
                <div>
                  <strong>Valores:</strong>
                  <ul className="list-disc pl-5">
                    {valuesList.map((item, index) => (
                      <li key={index} className="text-gray-800">
                        <strong>{item.indicador}:</strong> {item.valor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Confirmar Envio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
};

export default DataForm;
