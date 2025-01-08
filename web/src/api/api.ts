import axios from "axios";

export const api = axios.create({
  baseURL: "http://dgmog.saude.pe.gov.br/api/monitoramento-geres/",
});