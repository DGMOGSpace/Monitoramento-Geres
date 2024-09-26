import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const FormSchema = z.object({
  dimensao: z.string().nonempty("Selecione uma dimensão."),
  macro: z.string().nonempty("Selecione uma macro."),
  geres: z.string().nonempty("Selecione uma Geres."),
  tema: z.string().nonempty("Selecione um tema."),
  indicador: z.string().nonempty("Selecione um indicador."),
  valor: z.number().min(1, "Valor é obrigatório."),
  data: z.string().nonempty("Data é obrigatória."),
});

const DataForm = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedMacro, setSelectedMacro] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dimensao: "",
      macro: "",
      geres: "",
      tema: "",
      indicador: "",
      valor: 0,
      data: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await api.post("/addData", { ...data, user });
    setIsModalOpen(false);
  };

  const renderSelectField = (
    name,
    label,
    options,
    placeholder,
    onChange = null
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onChange && onChange(value);
              }}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const handleModalOpen = () => {
    setFormData(form.getValues());
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 border rounded-lg shadow-lg w-3/6">
      <h2 className="text-3xl font-bold text-blue-500 text-center mb-6 ">
        Cadastro de Dados
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {renderSelectField(
              "dimensao",
              "Dimensão",
              dados.dimensao,
              "Selecione uma dimensão"
            )}
            {renderSelectField(
              "macro",
              "Macro",
              dados.macros.map((m) => m.macro),
              "Selecione uma macro",
              setSelectedMacro
            )}
            {renderSelectField(
              "geres",
              "Geres",
              selectedMacro
                ? dados.macros.find((m) => m.macro === selectedMacro)?.geres
                : [],
              "Selecione uma Geres"
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {renderSelectField("tema", "Tema", dados.tema, "Selecione um tema")}
            {renderSelectField(
              "indicador",
              "Indicador",
              dados.indicador,
              "Selecione um indicador"
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      placeholder="Valor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="w-full bg-blue-500"
                onClick={handleModalOpen}
              >
                Enviar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Envio</DialogTitle>
                <DialogDescription>
                  Confira os dados preenchidos abaixo antes de confirmar:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  <strong>Dimensão:</strong> {formData.dimensao}
                </p>
                <p>
                  <strong>Macro:</strong> {formData.macro}
                </p>
                <p>
                  <strong>Geres:</strong> {formData.geres}
                </p>
                <p>
                  <strong>Tema:</strong> {formData.tema}
                </p>
                <p>
                  <strong>Indicador:</strong> {formData.indicador}
                </p>
                <p>
                  <strong>Valor:</strong> {formData.valor}
                </p>
                <p>
                  <strong>Data:</strong> {formData.data}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)}>
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
