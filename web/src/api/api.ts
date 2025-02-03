import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:3020/",
  baseURL: "https://dgmog.saude.pe.gov.br/api/monitoramento-geres/",
});