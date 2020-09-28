import axios from "axios";

const saveBuild = build => {
  console.log(build);
  axios
    .post("/builds/add", build)
    .then(res => console.log(res.data))
    .catch(error => console.error(error));
};

export default saveBuild;
