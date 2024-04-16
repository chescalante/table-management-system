import { useState } from "react";
import NavBar from "./components/NavBar";
import PlacesList from "./components/PlacesList";
import ReserveForm from "./components/ReserveForm";
import { PlacesResult } from "./types";

function App() {
  const [selectedPlace, setSelectedPlace] = useState<PlacesResult | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center gap-5">
      <NavBar />

      {!selectedPlace && <PlacesList onSelect={setSelectedPlace} />}
      {selectedPlace && (
        <ReserveForm
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </main>
  );
}

export default App;
