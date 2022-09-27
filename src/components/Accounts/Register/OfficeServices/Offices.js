import useAxios from "../../../../utils/useAxios";
import { useState } from "react";
import axios from "axios";

const baseURL = "https://webmercale.mercale.net";

function GetOfficeapi(){
    const [res, setRes] = useState("");
    const api = useAxios();

        const fetchData = async () => {
          try {
            const response = await api.get(`${baseURL}/office/`);
            setRes(response.data.response);
          } catch {
            setRes("Ocorreu um erro ao carregar os cargos");
          }
        };
        fetchData();
        return res
      }

function  GetOffice(){
    return axios.get(`${baseURL}/office/`)
    .then(response => response.data.results)
    .catch(err => console.log())
}

export default GetOffice;