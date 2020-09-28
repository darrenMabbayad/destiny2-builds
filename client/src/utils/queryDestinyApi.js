import axios from "axios";

const queryDestinyApi = async query => {
  let res = await axios.post("/items", { query });
  return res.data;
};

export default queryDestinyApi;
