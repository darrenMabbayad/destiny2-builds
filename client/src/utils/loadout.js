import axios from "axios";

const fetchAllBuilds = async () => {
  let res = await axios.get("/builds");
  return res.data;
};

const fetchBuild = async buildId => {
  let res = await axios.get(`/builds/${buildId}`);
  return res.data;
};

const saveBuild = build => {
  console.log(build);
  axios
    .post("/builds/add", build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

const updateBuild = build => {
  axios
    .post(`/builds/update/${build._id}`, build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

const deleteBuild = id => {
  axios.delete(`/builds/${id}`);
};

export { fetchAllBuilds, fetchBuild, saveBuild, updateBuild, deleteBuild };
