import { useState } from "react";
import { login } from "../api/authApi";
import styles from "./styles/LoginPage.module.css";
import { JwtService } from '../services/jwt.service';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }

    try {
      const token = await login(email, password);
      console.log("Token reçu:", token);
      localStorage.setItem("token", token);
      setErrorMessage("");

      // Redirection vers page tasks
      navigate('/today');
    } catch (error: any) {
      console.error("Erreur de login:", error);
      setErrorMessage("Identifiants invalides.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <img
            src="https://th.bing.com/th/id/OIP.Oe0-lkAuMjvKRU6mhDryIwHaEB?rs=1&pid=ImgDetMain"
            alt="Todoist Logo"
            width="100"
          />
        </div>

        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <span className={styles.errorMessage}>{errorMessage}</span>
          )}

          <button type="submit">Se connecter</button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span>Pas encore de compte ? </span>
            <Link to="/register">Créer un compte</Link>
          </div>
        </form>
      </div>

      <div className={styles.rightPanel}>
        <img
          src="https://ccsmtl-mission-universitaire.ca/sites/mission_universitaire/files/media/image/Management.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default LoginPage;
