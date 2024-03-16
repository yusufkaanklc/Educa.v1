import axios from "axios";

const getUsers = async () => {
  try {
    const { data } = await axios.get("/api/users/accounts");
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
    const { data } = await axios.post("/api/users/register", input);
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
    const { data } = await axios.post("/api/users/login", input);
    return data;
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
    await axios.get("/api/users/logout");
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
    const { data } = await axios.get("/api/users/account");
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
    const { data } = await axios.put("/api/users/account", input, {
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

const deleteAccount = async () => {
  try {
    await axios.delete("/api/users/account");
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

const enrollCourse = async (courseSlug) => {
  try {
    const { data } = await axios.post(`/api/courses/${courseSlug}/enroll`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};
const unenrollCourse = async (courseSlug) => {
  try {
    const { data } = await axios.post(`/api/courses/${courseSlug}/disenroll`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: error.response.data,
      status: error.response.status,
    };
  }
};

export {
  getUsers,
  registerUser,
  loginUser,
  getAccount,
  deleteAccount,
  logout,
  updateAccount,
  enrollCourse,
  unenrollCourse,
};
