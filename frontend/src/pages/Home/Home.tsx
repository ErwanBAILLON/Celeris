import { useUserStore } from '../../store/userStore';

const Home = () => {

  const { user, setUser, clearUser } = useUserStore();

  return (
    <div className="p-5">
      <p>Nom : {user.username}</p>
      <p>Email : {user.email}</p>
      <button onClick={() => setUser({ username: 'Alice', email: 'alice@mail.com' })}>
        Se connecter
      </button>
      <button onClick={clearUser}>Déconnexion</button>
    </div>
  );
}

export default Home;
