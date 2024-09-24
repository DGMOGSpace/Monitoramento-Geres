import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { dados } from "./../config";

const FormSchema = z.object({
  dimensao: z.string().nonempty({ message: "Selecione uma dimensão." }),
  origem: z.string().nonempty({ message: "Selecione uma origem." }),
  tema: z.string().nonempty({ message: "Selecione um tema." }),
  indicador: z.string().nonempty({ message: "Selecione um indicador." }),
  valor: z.string().min(1, { message: "Valor é obrigatório." }),
  data: z.string().min(1, { message: "Data é obrigatória." }),
  geres: z.string().min(1, { message: "Geres é obrigatória." }),
});

function App() {
  const form = useForm<z.infer<typeof FormSchema>>({
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("aqui vai ser o post", data);
  }

  return (
    <div className="container relative pb-10">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
        <div className="flex w-full items-start justify-center py-4 md:pb-6 rounded border flex-col p-10">
          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap gap-5 w-full">
              {/* Grupo 1: Dimensão e Origem */}
              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="dimensao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensão</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
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
              </div>

              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="origem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            <div className="flex flex-wrap gap-5 w-full mt-4">
              {/* Grupo 2: Tema e Indicador */}
              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="tema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tema</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
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
              </div>

              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="indicador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicador</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            <div className="flex flex-wrap gap-5 w-full mt-4">
              {/* Grupo 3: Valor e Data */}
              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input placeholder="Valor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" placeholder="Data" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-5 w-full mt-4">
              {/* Grupo 4: Geres */}
              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name="geres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geres</FormLabel>
                      <FormControl>
                        <Input placeholder="Geres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="mt-4">Enviar</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default App;
