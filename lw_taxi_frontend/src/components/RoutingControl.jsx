import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export default function RoutingControl({ currentPos, destination, setRouteInfo }) {
  const map = useMap();

  useEffect(() => {
    if (!currentPos || !destination || !destination[0]) return;

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(currentPos[0], currentPos[1]),
        L.latLng(destination[0], destination[1])
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1"  
      }),
      lineOptions: {
        addWaypoints: false,
        styles: [{ color: "#0A84FF", weight: 5 }]
      },
      show: false,
      fitSelectedRoutes: true
    })

      .on("routesfound", function (e) {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2);
        const duration = Math.round(route.summary.totalTime / 60);

        setRouteInfo({ distance, duration });
      })

      .on("routingerror", (err) => {
        console.error("Routing Error:", err);
      })

      .addTo(map);

    return () => map.removeControl(routing);
  }, [currentPos, destination]);

  return null;
}
