import axios from "axios";

const fetchAllBuilds = async () => {
  let res = await axios.get("/builds");
  return res.data;
};

export default fetchAllBuilds;
