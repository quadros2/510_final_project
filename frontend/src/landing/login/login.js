import styles from './login.module.scss';
import React, {useState} from "react";
import axios from 'axios';
import Spinner from '../spinner/spinner';

function Login(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);
  const [isError, setIsError] = useState(false);


  function getToken() {
    return axios.post("https://textdata.org/api/login", { 
      username: username,
      password: password
    })
      .then(res => res.data.token)
      .catch(() => '')
  }

  async function loginClicked() {
    if (username !== "" && password !== "" && canSubmit) {
      setCanSubmit(false);
      setIsError(false)
      const token = await getToken();
      if (!token) {
        setIsError(true)
        setCanSubmit(true);
      } else {
        props.finished(token)
        setCanSubmit(true);
      }
    }
  }

  


  return(
    <div className={`${styles.LoginHolder} ${props.currentPos === 0 ? styles.Center : ""} ${props.currentPos === -1 ? styles.Left : ""}`}>
      
      <div style={{display: "flex", alignItems: "center", flexDirection: "column", gap: "5px"}}>
        <p className={styles.Title}>Log In</p>
        <p>Please Use Your CDL Credentials</p>
        <p style={{color: "red", textAlign: "center", display: (isError ? "block" : "none"), width: "80%"}}>Whoops, That Didn’t Work! Check Your Credentials and Try Again.</p>
      </div>

      <div className={styles.FieldHolder}>
        <div>
          <p>&nbsp;Username</p>
          <input type="text" className={styles.FormField} name="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div>
          <p>&nbsp;Password</p>
          <input type="password" onKeyDown={(e) => {if (e.key === 'Enter') loginClicked()}} className={styles.FormField} name="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
      </div>

      <div className={`${styles.Submit} ${(username !== "" && password !== "" && canSubmit) ? styles.Selectable : ""}`} onClick={loginClicked}>
        {!canSubmit ? <Spinner/> : "Log In"}
      </div>
    

    </div>
  );


}

export default Login;