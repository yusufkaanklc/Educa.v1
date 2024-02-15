import { Link, Navigate, Routes, Route } from "react-router-dom";
const loginPage = () => {
  return (
    <div>
      <form>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default loginPage;
