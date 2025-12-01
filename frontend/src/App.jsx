import "./index.css";
import Header from "./components/header/Header";
import PromoBanner from "./components/promoBanner/PromoBanner";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <PromoBanner />
      <main className="main-content">
        {/* Votre contenu principal ira ici */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
