import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const Map: React.FC<GoogleMapProps> = ({ latitude, longitude, accuracy }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.innerHTML = `
        (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}", v: "weekly"});
      `;
      document.head.appendChild(script);
    };

    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

        const position = { lat: latitude, lng: longitude };

        const mapInstance = new Map(mapRef.current, {
          zoom: 15,
          center: position,
          mapId: "USER_LOCATION_MAP",
          mapTypeControl: false,
          fullscreenControl: false,
        });

        const marker = new AdvancedMarkerElement({
          map: mapInstance,
          position: position,
          title: "Your Location",
        });

        if (typeof accuracy === 'number') {
          new window.google.maps.Circle({
            map: mapInstance,
            center: position,
            radius: accuracy,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.1,
          });
        }

        mapInstanceRef.current = mapInstance;
        markerRef.current = marker;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    if (!window.google) {
      window.initMap = initMap;
      loadGoogleMaps();
    } else {
      initMap();
    }

    return () => {

      if (mapInstanceRef.current) {
      }
    };
  }, [latitude, longitude, accuracy]);

  return <div ref={mapRef} className="google-map" style={{ width: '100%', height: '100%' }} />;
};

export default Map;