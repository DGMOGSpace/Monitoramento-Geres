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

import { useAuth } from "./hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const navigate = useNavigate();

  const { signIn } = useAuth();
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(nome, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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

  const Auth = false; // Defina a condição de autenticação aqui

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("aqui vai ser o post", data);
  }

  return (
    <div
      className="container relative pb-10 flex justify-center items-center bg-blue-400"
      style={{ height: "100vh" }} // Use 'height' ao invés de 'blockSize'
    >
      {Auth ? (
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
                        <Input
                          className="w-full"
                          type="date"
                          placeholder="Data"
                          {...field}
                        />
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
      ) : (
        <div className="container h-full w-ful">
          <div className="p-5 shadow-2xl bg-white w-full text-center">
            <h1 className="text-5xl text-blue-400 font-bold ">
              Monitoramento - Geres
            </h1>
          </div>
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-400">
            {/* Coluna da esquerda */}
            <div className="flex justify-center items-center p-8">
              <div className="flex flex-col gap-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <Input
                  className="border border-gray-300 rounded-md p-2"
                  placeholder="Nome"
                  onChange={(e) => setNome(e.target.value)}
                />
                <Input
                  className="border border-gray-300 rounded-md p-2"
                  placeholder="Senha"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  className="mt-4 bg-green-700 text-white hover:bg-green-600 transition-colors"
                >
                  Entrar
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center p-8 ">
              <h2 className="text-xl font-semibold text-white">Instruções</h2>
              <p className="mt-2 text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
                eos molestias, sint perferendis inventore, perspiciatis iure
                itaque odio dolore consequuntur ipsum! Quaerat recusandae
                exercitationem itaque ex expedita enim fugiat repellendus?
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
