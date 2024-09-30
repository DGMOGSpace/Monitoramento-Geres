import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function Logs() {
  return (
    <Card className="shadow-md rounded-lg p-4 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Logs de Envio</CardTitle>
        <CardDescription className="text-gray-600">Veja os registros de envio de dados.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Aqui estarão os logs de envio de dados.</p>
      </CardContent>
    </Card>
  );
}
