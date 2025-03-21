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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  startDate: z.string().nonempty("Data de início é obrigatória."),
  endDate: z.string().nonempty("Data de término é obrigatória."),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: "Data de término deve ser posterior à data de início",
  path: ["endDate"],
});

interface IndicatorValue {
  indicador: string;
  valor: string;
}

const DataForm = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [groupingEnabled, setGroupingEnabled] = useState(true);

  const [valuesList, setValuesList] = useState<IndicatorValue[]>(() => {
    const initialValues: IndicatorValue[] = [];
    Object.values(dados.temasIndicadores).forEach(indicadores => {
      indicadores.forEach(indicador => {
        initialValues.push({ indicador, valor: '' });
      });
    });
    return initialValues;
  });

  console.log(valuesList)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  // Função para manipular a mudança de valor dos indicadores
    const handleValueChange = (indicador: string, value: string) => {
      setValuesList(prev => 
        prev.map(item => 
          item.indicador === indicador ? { ...item, valor: value } : item
        )
      );
    };
    
  // Verificar se todos os campos (datas e indicadores) estão preenchidos
  const allFieldsFilled =
  form.getValues().startDate &&
  form.getValues().endDate &&
  valuesList.every((val) => val.valor.trim() !== '');


  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      ...data,
      userId: user?.id,
      values: valuesList,
    };

    await api.post("/addData", payload);
    valuesList.forEach((val) => (val.valor = ''));
    form.reset();
    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="p-8 rounded-lg shadow-md w-3/6 mx-auto my-10 bg-white">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
        Cadastro de Dados
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center mb-4">
            <input
              id="grouping"
              type="checkbox"
              checked={groupingEnabled}
              onChange={() => setGroupingEnabled(!groupingEnabled)}
              className="mr-2"
            />
            <label htmlFor="grouping" className="text-gray-700 font-medium">
              Habilitar Agrupamento
            </label>
          </div>
          {groupingEnabled ? (
            <Accordion type="multiple">
              {Object.entries(dados.temasIndicadores).map(
                ([tema, indicadores]) => (
                  <AccordionItem key={tema} value={tema}>
                    <AccordionTrigger
                      className={`relative flex justify-between items-center p-4 rounded-lg transition-colors ${
                        indicadores.every(indicador => 
                          valuesList.some(
                            item => item.indicador === indicador && item.valor.trim() !== ''
                          )
                        )
                          ? "bg-green-300"
                          : "bg-white"
                      } shadow hover:bg-green-100`}
                    >
                      <span className="text-lg font-semibold hover:underline text-gray-700">
                        {tema}
                      </span>
                      <span
                        className={`text-green-500 absolute right-10 transition-opacity duration-200 ${
                          indicadores.every((indicador) =>
                            valuesList.some(
                              (item) => item.indicador === indicador && item.valor
                            )
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        style={{ textDecoration: "none" }}
                      >
                        ✓
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      {indicadores.map((indicador) => {
                        const index = valuesList.findIndex(item => item.indicador === indicador);
                        return (
                          <div key={indicador} className="mb-4">
                            <FormLabel className="text-gray-700 font-medium">
                              {indicador}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="Valor"
                                value={valuesList[index]?.valor || ''}
                                onChange={(e) => handleValueChange(indicador, e.target.value)}
                                className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none w-full"
                              />
                            </FormControl>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          ) : (
            Object.values(dados.temasIndicadores).flat().map((indicador) => {
              const index = valuesList.findIndex(item => item.indicador === indicador);
              return (
                <div key={indicador} className="mb-4">
                  <FormLabel className="text-gray-700 font-medium">
                    {indicador}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Valor"
                      value={valuesList[index]?.valor || ''}
                      onChange={(e) => handleValueChange(indicador, e.target.value)}
                      className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none w-full"
                    />
                  </FormControl>
                </div>
              );
            })
          )}

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Data de Início
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    min="2024-01-01"
                    max="2025-12-31"
                    className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Data de Término
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    min="2024-01-01"
                    max="2025-12-31"
                    className="border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className={`w-full ${
                  allFieldsFilled
                    ? "bg-blue-500"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md`}
                onClick={
                  allFieldsFilled ? () => setIsModalOpen(true) : undefined
                }
                disabled={!allFieldsFilled}
              >
                Enviar
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Confirmar Envio
                </DialogTitle>
                <DialogDescription>
                  Confira os dados preenchidos abaixo antes de confirmar:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <span className="font-semibold">PERÍODO DOS DADOS:</span>{" "}
                {form.getValues().startDate} e {form.getValues().endDate}
                <ul className="list-disc pl-5 max-h-60 overflow-y-scroll">
                  {valuesList.map((item, index) => (
                    <li key={index} className="my-2 text-gray-800">
                      <span className="font-semibold">{item.indicador}:</span>{" "}
                      {item.valor}
                    </li>
                  ))}
                </ul>
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
                  className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md"
                >
                  Confirmar Envio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Sucesso!
                </DialogTitle>
                <DialogDescription>
                  Dados enviados com sucesso!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md shadow-md"
                >
                  Fechar
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
