import axios from "axios";

const queryDestinyApi = async query => {
  let res = await axios.post("/items", { query });
  console.log(res);
  return res.data;
};

const getManifestUrls = async () => {
  let res = await axios.get("/manifest");
  return res.data;
};

export { queryDestinyApi, getManifestUrls };
