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
          <p>Quick Polls is amazing!!!!</p>
          <p>
            Authored by Group 7, this handy tool allows you to create online
            polls.
          </p>
          <p>
            Polls are purposely brief, asking one question and allowing for
            multiple choise answers.
          </p>
          <p>
            The polls results can be private for the author or public to all
            participants.
          </p>
          <p>
            Authors can create, delete, and update polls and view analysis of
            the poll statistics.
          </p>
          <p>Particpants can leave comments on polls for public viewing.</p>
          <p>We hope you enjoy Quick Polls and find it useful.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
