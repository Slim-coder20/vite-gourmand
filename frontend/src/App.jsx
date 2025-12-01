import "./index.css";
import Header from "./components/header/Header";
import PromoBanner from "./components/promoBanner/PromoBanner";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";

function App() {
  return (
    <div className="app-container">
      <Header />
      <PromoBanner />
      <Hero />
      <main className="main-content">
        {/* Votre contenu principal ira ici */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
