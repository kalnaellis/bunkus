import TopStripNav from './components/TopStripNav';
import SectionHero from './components/SectionHero';
import SectionPoster from './components/SectionPoster';
import SectionCTA from './components/SectionCTA';

function App() {
  return (
    <div className="page-shell">
      <TopStripNav />
      <main>
        <SectionHero />
        <SectionPoster
          id="section-two"
          headline="I MAKE RULES BEND"
          imageSrc="/bunkus/image-placeholder.svg"
          imageAlt="Cinematic placeholder for section two"
        />
        <SectionPoster
          id="section-three"
          headline="CASE CLOSED. LIPS CLOSED."
          imageSrc="/bunkus/image-placeholder.svg"
          imageAlt="Cinematic placeholder for section three"
          reverse
        />
        <SectionCTA />
      </main>
    </div>
  );
}

export default App;
