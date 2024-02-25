import axios from "axios";

const getCourses = async () => {
  try {
    const { data } = await axios.get("/courses");
    return data;
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data.message,
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
