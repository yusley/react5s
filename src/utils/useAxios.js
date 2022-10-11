import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "./AuthService/AuthContext";

const baseURL = "https://webmercale.mercale.net";
//const baseURL = "http://localhost:3000";

const useAxios = () => {
  const { authTokens, user, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}`}
    
  });

  axiosInstance.interceptors.request.use(async req => {
    const user = jwt_decode(authTokens.access);
    const userRefresh = jwt_decode(authTokens.refresh);
    const userData = JSON.parse(localStorage.getItem("authTokens"));
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 10000000;
    const isExpiredRefresh = dayjs.unix(userRefresh.exp).diff(dayjs()) < 1;

    if (isExpiredRefresh){
      logoutUser()
      return req
    }

    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}/token/refresh/`, {
      refresh: authTokens.refresh
    });
    
    response.data.refresh = authTokens.refresh;
    response.data.user = userData.user;
    localStorage.setItem("authTokens", JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;