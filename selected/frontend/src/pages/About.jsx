// About Page Component
import Header from "../components/header";
import Footer from "../components/footer";

const About = () => (
  <div className="bg-sky-700 text-slate-100">
    <Header />
    <div id="spacer" className="h-20"></div>
    <div className="min-h-screen">
      <h2>About Page</h2>
    </div>
    <Footer />
  </div>
);

export default About;
