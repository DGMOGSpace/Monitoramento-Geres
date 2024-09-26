import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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

const FormSchema = z.object({
  dimensao: z.string().nonempty({ message: "Selecione uma dimensão." }),
  origem: z.string().nonempty({ message: "Selecione uma origem." }),
  tema: z.string().nonempty({ message: "Selecione um tema." }),
  indicador: z.string().nonempty({ message: "Selecione um indicador." }),
  valor: z.number().min(1, { message: "Valor é obrigatório." }),
  data: z.string().min(1, { message: "Data é obrigatória." }),
  geres: z.string().min(1, { message: "Geres é obrigatória." }),
  macro: z.string().min(1, { message: "Geres é obrigatória." }),
});

const DataForm = () => {
  const { user } = useAuth();
  const [selectedMacro, setSelectedMacro] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dimensao: "",
      origem: "",
      tema: "",
      indicador: "",
      valor: 0,
      data: "",
      geres: "",
      macro: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await api.post("/addData", { ...data, user });
      console.log("Dados do formulário:", response.data);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div
      className="container relative pb-10 flex justify-center items-center bg-blue-400"
      style={{ inlineSize: "100vw" }}
    >
      <div className="p-14 border rounded-lg bg-white shadow-lg shadow-blue-700 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-rows-4 w-full"
          >
            <div className="grid grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="dimensao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensão</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma dimensão" />
                        </SelectTrigger>
                        <SelectContent>
                          {dados.dimensao.map((item) => (
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
              <FormField
                control={form.control}
                name="macro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Macro</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedMacro(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma macro" />
                        </SelectTrigger>
                        <SelectContent>
                          {dados.macros.map((item) => (
                            <SelectItem key={item.macro} value={item.macro}>
                              {item.macro}{" "}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="geres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecione a Geres:</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma macro" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMacro &&
                            dados.macros
                              .find((item) => item.macro === selectedMacro)
                              ?.geres.map((geres) => (
                                <SelectItem key={geres} value={geres}>
                                  {geres}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="tema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                          {dados.tema.map((item) => (
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

              <FormField
                control={form.control}
                name="indicador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicador</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um indicador" />
                        </SelectTrigger>
                        <SelectContent>
                          {dados.indicador.map((item) => (
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
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormDescription>
                      Insira os resultados (Numéricos)
                    </FormDescription>

                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Resultado do valor (Numérico)"
                        type="number"
                        min={0}
                        {...field}
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
                    <FormLabel>Data De Referência da Informação</FormLabel>
                    <FormControl>
                      <Input className="w-full" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5"></div>

            <div className="flex w-full gap-3">
              <Button type="submit" className="mt-4 w-1/6 bg-blue-500">
                Enviar
              </Button>
              <Button type="button" className="mt-4 w-1/6 bg-green-700">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DataForm;
