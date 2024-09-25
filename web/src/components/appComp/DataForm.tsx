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

const FormSchema = z.object({
  dimensao: z.string().nonempty({ message: "Selecione uma dimensão." }),
  origem: z.string().nonempty({ message: "Selecione uma origem." }),
  tema: z.string().nonempty({ message: "Selecione um tema." }),
  indicador: z.string().nonempty({ message: "Selecione um indicador." }),
  valor: z.string().min(1, { message: "Valor é obrigatório." }),
  data: z.string().min(1, { message: "Data é obrigatória." }),
  geres: z.string().min(1, { message: "Geres é obrigatória." }),
});

const DataForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dimensao: "",
      origem: "",
      tema: "",
      indicador: "",
      valor: "",
      data: "",
      geres: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Dados do formulário:", data);
    // Aqui você pode fazer um POST para enviar os dados ao backend
  };

  return (
    <div
      className="container relative pb-10 flex justify-center items-center bg-blue-400"
      style={{ blockSize: "100vh" }}
    >
      <div className="p-14 border rounded-lg w-4/6 bg-white shadow-lg shadow-blue-700">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-rows-4 w-full"
          >
            <div className="grid grid-cols-2 gap-5">
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
                name="origem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma origem" />
                        </SelectTrigger>
                        <SelectContent>
                          {dados.origem.map((item) => (
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
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Valor"
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
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input className="w-full" type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="geres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geres</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Geres"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
