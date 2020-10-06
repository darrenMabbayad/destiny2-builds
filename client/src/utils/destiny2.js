import axios from "axios";

const getManifestUrls = async () => {
  let res = await axios.get("/manifest");
  return res.data;
};

export { getManifestUrls };
