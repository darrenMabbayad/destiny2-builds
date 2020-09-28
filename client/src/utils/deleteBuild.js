import axios from "axios";

const deleteBuild = id => {
  axios.delete(`/builds/${id}`);
};

export default deleteBuild;
