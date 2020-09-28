import axios from "axios";

const queryDestinyApi = async query => {
  let res = await axios.post("/items", { query });
  console.log(res);
  return res.data;
};

export default queryDestinyApi;
