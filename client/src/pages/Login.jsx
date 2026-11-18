import {useState} from "react";
  import {useNavigate,useLocation} from "react-router-dom";
  import { useAuth } from "../context/AuthContext.jsx";
  import { login as loginAPI } from "../services/api.js";
  
  export default function Login(){
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const[error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const {login} = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    if(!email || !password){
      setError("please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password  must be at least 6 characters");
      return;
    }
    try {
      setError("");
      const user = await loginAPI(email,password);
      login(user);

      if(user.role==="admin"){
        navigate("/admin");
      } else{
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }
    } catch{
      setError("Invalid email or password");
    }
  }
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="page-title text-center">
            Login
          </h2>
        
        {error && <p className="text-danger"> {error}</p>}
        
          <form onSubmit={handleSubmit}>
          
            <div className="mb-3">
              <label >Email</label>
              <input type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}