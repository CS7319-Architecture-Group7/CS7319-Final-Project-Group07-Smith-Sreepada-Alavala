// Splash Page
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";

const SplashPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-sky-700 text-slate-100">
      <Header />
      <div className="min-h-screen">
        <div id="spacer" className="h-30"></div>
        <div className="mb-5 text-center text-xl">
          <div>Quick Polls</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SplashPage;
