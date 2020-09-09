import React from 'react';
import {
  useHistory,
  useLocation
} from "react-router-dom";
import bg from '../../images/bg.jpg';
import './newTrainer.css';

function LoginPage() {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/success" } };

  let login = () => {
    history.replace(from);
  };

  return (
    <>
      <div className="bg" style={{ backgroundImage: `url(${bg})` }}>
        <button onClick={login}>Log in</button>
      </div>

    </>
  );
}
export default LoginPage;
