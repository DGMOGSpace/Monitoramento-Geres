import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  dimensao: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  origem: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  tema: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  indicador: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  valor: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  data: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  geres: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
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
    toast({
      title: "Você enviou os seguintes valores:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="container relative pb-10">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
        <div className="flex w-2/5 items-center justify-center py-4 md:pb-6 rounded border">
          <Form {...form}>
            <FormField
              control={form.control}
              name="dimensao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default App;
