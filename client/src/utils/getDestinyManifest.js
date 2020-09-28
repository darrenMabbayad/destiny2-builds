import axios from "axios";

const getDestinyManifest = async () => {
  let res = await axios.get("/manifest");
  return res.data;
};

export default getDestinyManifest;
