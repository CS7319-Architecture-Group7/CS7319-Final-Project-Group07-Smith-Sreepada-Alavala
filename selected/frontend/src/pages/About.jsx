// About Page Component
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => (
  <div className="bg-sky-700 text-slate-100">
    <Header />
    <div id="spacer" className="h-20"></div>
    <div className="min-h-screen">
      <div className="mb-5 text-center text-xl">
        <div className="font-display text-8xl">Quick Polls</div>
        <div className="font-display m-5 text-2xl">
          <p>Quick Polls is so Amazing!!!!</p>
          <p>Group 7 is also very great. Blah blah blah. </p>
          <p>Rays of light eminate from every orifice of our bodies!!!!</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
