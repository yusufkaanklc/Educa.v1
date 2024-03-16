import axios from "axios";

const getCategories = async (searchQuery) => {
  try {
    let queryString = "/api/categories";
    if (searchQuery !== "" && searchQuery)
      queryString = `/api/categories?categoryName=${searchQuery}`;
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

const createCategories = async (categoryData) => {
  try {
    const { data } = await axios.post(
      "/api/categories/add-category",
      categoryData
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export { getCategories, createCategories };
