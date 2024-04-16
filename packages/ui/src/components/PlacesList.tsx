import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";
import envParsed from "../envParsed";
import { PlacesResponse, PlacesResult } from "../types";
import PlaceButton from "./PlaceButton";

function PlacesList({
  onSelect,
}: {
  onSelect?: (place: PlacesResult) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const isVisible = !!intersection?.isIntersecting;

  const [places, setPlaces] = useState<PlacesResult[]>([]);
  const [total, setTotal] = useState(0);
  const [lastId, setLastId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isVisible && !isLoading && (!lastId || total > places.length)) {
      setIsLoading(true);

      axios
        .get<PlacesResponse>(`${envParsed().APP_URL}/places`, {
          params: {
            lastId: lastId,
          },
        })
        .then((res) => {
          setPlaces((prev) => [...prev, ...res.data.results]);
          setTotal(res.data.total);
          setLastId(res.data.lastResult.id);
          setIsLoading(false);
        });
    }
  }, [isLoading, isVisible, lastId, places.length, total]);

  return (
    <>
      <div className="w-full max-w-2xl px-5 flex flex-col gap-10">
        <h1 className="font-semibold text-2xl md:text-3xl text-center">
          Select a place and make your reservation
        </h1>

        {places.map((place, index) => (
          <PlaceButton
            key={`place-${index}`}
            label={place.name}
            onClick={() => onSelect && onSelect(place)}
          />
        ))}

        {isLoading && <p className="text-center">Loading...</p>}
      </div>

      <div ref={intersectionRef} className="h-20" />
    </>
  );
}

export default PlacesList;
