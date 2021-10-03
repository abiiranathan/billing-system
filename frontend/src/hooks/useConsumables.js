import axios from "axios";
import { useQuery } from "react-query";

const fetcher = async params => {
  const url = "/api/consumables";
  return (await axios.get(url, { params })).data;
};

export default function useConsumables(params) {
  return useQuery(["CONSUMABLES", params], c => fetcher(c.queryKey[1]));
}
