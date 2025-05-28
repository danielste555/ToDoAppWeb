import { useState } from "react";
import axios from "axios";
import styles from "./styles/RegisterPage.module.css";
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5254/user/Auth/register",
        null,
        {
          params: { nom, prenom, numero, email, motDePasse: password },
        }
      );

      console.log("Inscription réussie :", response.data);
      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (error: any) {
      console.error("Erreur d'inscription :", error);
      if (error.response?.data === false) {
        setErrorMessage("Cet email est déjà utilisé.");}
      else{
        setErrorMessage(
        error.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer."
        );

      }
      
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <img
            src="https://th.bing.com/th/id/OIP.Oe0-lkAuMjvKRU6mhDryIwHaEB?rs=1&pid=ImgDetMain"
            alt="Todoist Logo"
            width="100"
          />
        </div>

        <h1>Créer un compte</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            placeholder="Votre nom..."
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            placeholder="Votre prenom..."
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Votre email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="numero">Numéro</label>
          <input
            type="tel"
            id="numero"
            placeholder="Votre numero..."
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            pattern="[0-9]{10}"
            title="10 chiffres sans espaces"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Votre mot de passe..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirmez votre mot de passe..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <span className={styles.errorMessage}>{errorMessage}</span>
          )}

          <button type="submit">S'inscrire</button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span>Déjà un compte ? </span>
            <Link to="/login">Se connecter</Link>
          </div>
        </form>
      </div>

      <div className={styles.rightPanel}>
        <img
          src="https://ccsmtl-mission-universitaire.ca/sites/mission_universitaire/files/media/image/Management.png"
          alt="Illustration"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
