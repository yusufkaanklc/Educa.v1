import axios from "axios";

const getCategories = async (searchQuery) => {
  try {
    let queryString = "/courses/categories";
    if (searchQuery !== "" && searchQuery)
      queryString = `/courses/categories?categoryName=${searchQuery}`;
    const { data } = await axios.get(queryString);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export { getCategories };
