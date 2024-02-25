import axios from "axios";

const getUsers = async () => {
  try {
    const { data } = await axios.get("/users/accounts");
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const registerUser = async (input) => {
  try {
    const { data } = await axios.post("/users/register", input);
    return data;
  } catch (error) {
    const errorList = [];
    if (error.response.data.validationErrors) {
      error.response.data.validationErrors.forEach((error) => {
        errorList.push(error.msg);
      });
      // eslint-disable-next-line no-throw-literal
      throw {
        message: errorList,
        status: error.response.status,
      };
    } else {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: error.response.data,
        status: error.response.status,
      };
    }
  }
};

const loginUser = async (input) => {
  try {
    await axios.post("/users/login", input);
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const logout = async () => {
  try {
    await axios.get("/users/logout");
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const getAccount = async () => {
  try {
    const { data } = await axios.get("/users/account");
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const updateAccount = async (input) => {
  try {
    const { data } = await axios.put("/users/account", input, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    const errorList = [];
    if (error.response.data.validationErrors) {
      error.response.data.validationErrors.forEach((error) => {
        errorList.push(error.msg);
      });

      // eslint-disable-next-line no-throw-literal
      throw {
        message: errorList,
        status: error.response.status,
      };
    } else {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: error.response.data,
        status: error.response.status,
      };
    }
  }
};

export { getUsers, registerUser, loginUser, getAccount, logout, updateAccount };
