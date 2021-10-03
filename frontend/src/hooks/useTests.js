import axios from "axios";
import { useQuery } from "react-query";

const fetchTests = async params => {
  const url = "/api/lab";
  return (await axios.get(url, { params })).data;
};

export default function useTests(params) {
  return useQuery(["TESTS", params], c => fetchTests(c.queryKey[1]));
}
