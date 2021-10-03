import axios from "axios";
import { useQuery } from "react-query";

const fetchDrugs = async params => {
  const url = "/api/drugs";
  return (await axios.get(url, { params })).data;
};

export default function useDrugs(params) {
  return useQuery(["DRUGS", params], c => fetchDrugs(c.queryKey[1]));
}
