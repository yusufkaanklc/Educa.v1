import axios from "axios";

const getCourses = async (titleQuery) => {
  try {
    if (titleQuery && titleQuery !== "") {
      const { data } = await axios.get(`/courses?title=${titleQuery}`);
      return data;
    }
    const { data } = await axios.get("/courses");
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const getCourse = async (courseSlug) => {
  try {
    const { data } = await axios.get(`/courses/${courseSlug}`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export { getCourses, getCourse };
