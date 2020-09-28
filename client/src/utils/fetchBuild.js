import axios from "axios";

const fetchBuild = async buildId => {
  let res = await axios.get(`/builds/${buildId}`);
  return res.data;
};

export default fetchBuild;
