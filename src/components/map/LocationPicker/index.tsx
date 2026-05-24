import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './styles.module.css';

export type PickerCoordinates = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  value: PickerCoordinates | null;
  onChange: (coordinates: PickerCoordinates) => void;
  height?: 'compact' | 'default';
};

const DEFAULT_CENTER: PickerCoordinates = {
  latitude: -23.3053,
  longitude: -45.9658,
};

const pickerIcon = L.divIcon({
  className: 'occurrence-marker occurrence-marker-info occurrence-marker-selected',
  html: '<span>📍</span>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -38],
});

function MapClickHandler({
  onChange,
}: {
  onChange: (coordinates: PickerCoordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function RecenterMap({ coordinates }: { coordinates: PickerCoordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], map.getZoom(), {
      animate: true,
    });
  }, [coordinates.latitude, coordinates.longitude, map]);

  return null;
}

export function LocationPicker({ value, onChange, height = 'default' }: LocationPickerProps) {
  const center = value ?? DEFAULT_CENTER;

  return (
    <div className={`${styles.wrapper} ${styles[height]}`}>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onChange={onChange} />
        <RecenterMap coordinates={center} />

        {value && <Marker position={[value.latitude, value.longitude]} icon={pickerIcon} />}
      </MapContainer>
    </div>
  );
}
