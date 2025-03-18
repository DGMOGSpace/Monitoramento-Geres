import { api } from "@/api/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
interface logsData {
  idUser: string;
  idForm: number;
  user: {
    fullName: string;
    geres: number;
    email: string;
  };
  geres: number;
  form: {
    id: number;
    execucao_do_orcamento_por_regional: number;
    taxa_de_satisfacao_municipios_apoio_geres: number;
    resolucao_acoes_competencias_geres: number;
    municipios_visitados: number;
    aproveitamento_cotas_exame_imagem: number;
    taxa_perda_primaria_upae: number;
    taxa_absenteismo: number;
    cumprimento_pes_quadrimestre: number;
    cumprimento_pes_exercicio: number;
    indice_qualificacao_acoes_vigilancia: number;
    aproveitamento_cotas_consultas_especializadas: number;
    municipios_instrumentos_gestao_sus_atualizados: number;
    implementacao_planejamento_estrategico: number;
    engajamento_gestores_reunioes_grupos_condutores_macrorregionais: number;
    integracao_grupos_condutores_rede_pri: number;
    participacao_gestores_reunioes_camara_tecnica_ct_cir: number;
    participacao_gestores_reunioes_cir: number;
    dataInicio: string;
    dataFinal: string;
  };
  timestamp: string;
}

export function Logs() {
  const [logsData, setLogsData] = useState<logsData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState<logsData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState(""); // Estado para armazenar o email pesquisado

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/logs");
      const sortedData = response.data.sort((a: logsData, b: logsData) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
      setLogsData(sortedData);
    };
    fetchData();
  }, []);

  const handleRowClick = (log: logsData) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;

  const filteredLogs = logsData.filter((log) =>
    log.user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <>
      <Card className="shadow-md rounded-lg p-4 mb-6 h-full grid grid-rows-[1fr_6fr_1fr]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Logs de Envio</CardTitle>
          <CardDescription className="text-gray-600">
            Veja os registros de envio de dados.
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Pesquisar por email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)} // Atualiza o estado com o valor do input
              className="mr-2"
            />
            {/* Aqui você pode adicionar o Toggle se desejar */}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Formulário</TableHead>
                <TableHead>GERES</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data de Referência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(log)}
                  className="cursor-pointer"
                >
                  <TableCell>{log.idForm}</TableCell>
                  <TableCell>{log.user.geres}</TableCell>
                  <TableCell>{log.user.fullName}</TableCell>
                  <TableCell>
                    {log.form.dataInicio} a {log.form.dataInicio}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <div className="p-4">
          <Pagination>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            <PaginationContent>
              {Array.from(
                { length: Math.ceil(filteredLogs.length / logsPerPage) }, // Usar filteredLogs para a contagem de páginas
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </PaginationContent>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredLogs.length / logsPerPage)
                  )
                )
              }
            />
          </Pagination>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Formulário</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <strong>Data de Referência:</strong>{" "}
                  {selectedLog.form.dataInicio} a {selectedLog.form.dataFinal}
                </li>
                <li>
                  <strong>Execução do Orçamento por Regional:</strong>{" "}
                  {selectedLog.form.execucao_do_orcamento_por_regional}
                </li>
                <li>
                  <strong>Taxa de Satisfação Municípios Apoio GERES:</strong>{" "}
                  {selectedLog.form.taxa_de_satisfacao_municipios_apoio_geres}
                </li>
                <li>
                  <strong>Resolução Ações Competências GERES:</strong>{" "}
                  {selectedLog.form.resolucao_acoes_competencias_geres}
                </li>
                <li>
                  <strong>Municípios Visitados:</strong>{" "}
                  {selectedLog.form.municipios_visitados}
                </li>
                <li>
                  <strong>Aproveitamento Cotas Exame Imagem:</strong>{" "}
                  {selectedLog.form.aproveitamento_cotas_exame_imagem}
                </li>
                <li>
                  <strong>Taxa de Perda Primária UPAE:</strong>{" "}
                  {selectedLog.form.taxa_perda_primaria_upae}
                </li>
                <li>
                  <strong>Taxa de Absentismo:</strong>{" "}
                  {selectedLog.form.taxa_absenteismo}
                </li>
                <li>
                  <strong>Cumprimento PES Quadrimestre:</strong>{" "}
                  {selectedLog.form.cumprimento_pes_quadrimestre}
                </li>
                <li>
                  <strong>Cumprimento PES Exercício:</strong>{" "}
                  {selectedLog.form.cumprimento_pes_exercicio}
                </li>
                <li>
                  <strong>Índice Qualificação Ações Vigilância:</strong>{" "}
                  {selectedLog.form.indice_qualificacao_acoes_vigilancia}
                </li>
                <li>
                  <strong>
                    Aproveitamento Cotas Consultas Especializadas:
                  </strong>{" "}
                  {
                    selectedLog.form
                      .aproveitamento_cotas_consultas_especializadas
                  }
                </li>
                <li>
                  <strong>
                    Municípios Instrumentos Gestão SUS Atualizados:
                  </strong>{" "}
                  {
                    selectedLog.form
                      .municipios_instrumentos_gestao_sus_atualizados
                  }
                </li>
                <li>
                  <strong>Implementação Planejamento Estratégico:</strong>{" "}
                  {selectedLog.form.implementacao_planejamento_estrategico}
                </li>
                <li>
                  <strong>
                    Engajamento Gestores Reuniões Grupos Condutores:
                  </strong>{" "}
                  {
                    selectedLog.form
                      .engajamento_gestores_reunioes_grupos_condutores_macrorregionais
                  }
                </li>
                <li>
                  <strong>Integração Grupos Condutores Rede PRI:</strong>{" "}
                  {selectedLog.form.integracao_grupos_condutores_rede_pri}
                </li>
                <li>
                  <strong>
                    Participação Gestores Reuniões Câmara Técnica CT Cir:
                  </strong>{" "}
                  {
                    selectedLog.form
                      .participacao_gestores_reunioes_camara_tecnica_ct_cir
                  }
                </li>
                <li>
                  <strong>Participação Gestores Reuniões CIR:</strong>{" "}
                  {selectedLog.form.participacao_gestores_reunioes_cir}
                </li>
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
