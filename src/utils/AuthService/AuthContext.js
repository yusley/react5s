import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const domain = "https://webmercale.mercale.net"
//const domain = "http://localhost:3000"
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState();
  const [loginError, setloginError] = useState();

  const navigate = useNavigate();

  const loginUser = async (email, password) => {

    const response = await fetch(`${domain}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    const data = await response.json();
    
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      setDataUser(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate('/' );
    } else if (response.status === 401){
      return 'Login ou senha incorretos!'
    } else{
      return `Ocorreu um erro desconhecido, código de erro ${response.status}, erro ${response.status.error}`
    }
  };
  
  const registerUser = async (email, password, first_name, last_name, office) => {
    const response = await fetch(`${domain}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password : password,
        first_name : first_name,
        last_name : last_name,
        office : office
      })
    });
    if (response.status === 201) {
      navigate('/login', { state: "Conta criada com sucesso! Vamos fazer o login :)"});
      return response.json()
      .then(response => response)
      .catch(err => console.log())
    } else {
      return response.json()
      .then(response => response)
      .catch(err => console.log())
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate('/login');
  };

  const contextData = {
    user,
    dataUser,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};