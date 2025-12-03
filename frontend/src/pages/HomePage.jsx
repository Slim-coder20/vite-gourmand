import Header from "../components/header/Header";
import PromoBanner from "../components/promoBanner/PromoBanner";
import Footer from "../components/footer/Footer";
import Hero from "../components/hero/Hero";
import HowItWorks from "../components/howItWorks/HowItWorks";
import MenuList from "../components/menuList/menuList";

function HomePage() {
  return (
    <div className="app-container">
      <Header />
      <PromoBanner />
      <Hero />
      <main className="main-content">
        <HowItWorks />
        <MenuList />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;

