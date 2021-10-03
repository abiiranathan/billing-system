import axios from "axios";
import { useQuery } from "react-query";

const fetchServices = async params => {
  const url = "/api/services";
  return (await axios.get(url, { params })).data;
};

export default function useDrugs(params) {
  return useQuery(["SERVICES", params], c => fetchServices(c.queryKey[1]));
}
