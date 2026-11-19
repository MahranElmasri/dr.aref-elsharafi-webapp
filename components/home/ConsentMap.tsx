"use client";

import { useState } from "react";

type Props = { embedUrl: string; placeUrl: string; title: string; consent: string; load: string; open: string; newTab: string };

// Two-click map: nothing is requested from Google until the visitor clicks "Karte laden".
export function ConsentMap({ embedUrl, placeUrl, title, consent, load, open, newTab }: Props) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <div className="map loaded">
        <iframe src={embedUrl} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    );
  }
  return (
    <div className="map">
      <span className="pin" aria-hidden="true" />
      <div className="map-consent">
        <p>{consent}</p>
        <div className="map-actions">
          <button className="btn btn-primary" type="button" onClick={() => setLoaded(true)}>{load}</button>
          <a className="btn btn-outline" href={placeUrl} target="_blank" rel="noopener">
            {open}<span className="sr-only"> {newTab}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
