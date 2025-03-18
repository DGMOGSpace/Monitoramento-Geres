import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3021/",
  // baseURL: "https://dgmog.saude.pe.gov.br/api/monitoramento-geres/",
});