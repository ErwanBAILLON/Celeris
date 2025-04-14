import { Colors } from "../../utils/colors";

const NotFound = () => {
  return (
    <div style={{ backgroundColor: Colors.BACKGROUND, color: Colors.WHITE, textAlign: 'center', padding: '20px', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" style={{ color: Colors.PRIMARY }}>Go to Home</a>
    </div>
  );
}

export default NotFound;