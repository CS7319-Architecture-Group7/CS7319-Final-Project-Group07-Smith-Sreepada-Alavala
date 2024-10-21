// Splash Page Component
import Header from "./header";
import Footer from "./footer";

const SplashPage = () => (
  <div>
    <Header />
    <div className="min-h-screen">
      <div id="spacer" className="h-20"></div>
      <div className="mb-5 text-center text-xl text-blackfont-bold">
        <div>Quick Polls</div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SplashPage;
