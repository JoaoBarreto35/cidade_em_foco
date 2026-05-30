import { Link } from 'react-router-dom';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Occurrence } from '../../../types/occurrence';
import { getCategoryById } from '../../../utils/categories';
import { getStatusInfo } from '../../../utils/statusLabels';

import styles from './styles.module.css';

type OccurrenceMapProps = {
  occurrences: Occurrence[];
  height?: 'compact' | 'default' | 'large';
  selectedOccurrenceId?: string;
  showPopupLink?: boolean;
  showHeatmap?: boolean;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER: Coordinates = {
  latitude: -23.3053,
  longitude: -45.9658,
};

function getMapCenter(occurrences: Occurrence[]): Coordinates {
  if (occurrences.length === 0) {
    return DEFAULT_CENTER;
  }

  const totals = occurrences.reduce(
    (accumulator, occurrence) => ({
      latitude: accumulator.latitude + occurrence.latitude,
      longitude: accumulator.longitude + occurrence.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: totals.latitude / occurrences.length,
    longitude: totals.longitude / occurrences.length,
  };
}

function getMapZoom(occurrences: Occurrence[], showHeatmap: boolean): number {
  if (occurrences.length === 0) {
    return 13;
  }

  if (showHeatmap) {
    return 12;
  }

  return occurrences.length > 1 ? 13 : 15;
}

function getMarkerClassName(status: Occurrence['status']): string {
  if (status === 'resolved') {
    return 'occurrence-marker occurrence-marker-success';
  }

  if (status === 'under_review' || status === 'resolution_suggested') {
    return 'occurrence-marker occurrence-marker-warning';
  }

  if (status === 'cancelled' || status === 'duplicated') {
    return 'occurrence-marker occurrence-marker-danger';
  }

  return 'occurrence-marker occurrence-marker-info';
}

function createMarkerIcon(occurrence: Occurrence, isSelected: boolean): L.DivIcon {
  const category = getCategoryById(occurrence.category);
  const selectedClass = isSelected ? ' occurrence-marker-selected' : '';

  return L.divIcon({
    className: `${getMarkerClassName(occurrence.status)}${selectedClass}`,
    html: `<span>${category.icon}</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
  });
}

function getHeatRadius(occurrence: Occurrence): number {
  const reportWeight = Math.min(occurrence.reportsCount, 4) * 5;
  const resolutionWeight = occurrence.status === 'resolved' ? -4 : 0;
  const reviewWeight = occurrence.status === 'under_review' ? 8 : 0;

  return Math.max(18, 24 + reportWeight + reviewWeight + resolutionWeight);
}

export function OccurrenceMap({
  occurrences,
  height = 'default',
  selectedOccurrenceId,
  showPopupLink = true,
  showHeatmap = false,
}: OccurrenceMapProps) {
  const center = getMapCenter(occurrences);
  const zoom = getMapZoom(occurrences, showHeatmap);
  const mapKey = `${center.latitude.toFixed(5)}-${center.longitude.toFixed(5)}-${occurrences.length}-${showHeatmap ? 'heat' : 'pins'}`;

  return (
    <div className={`${styles.wrapper} ${styles[height]}`}>
      <MapContainer
        key={mapKey}
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showHeatmap && occurrences.map((occurrence) => (
          <CircleMarker
            key={`heat-${occurrence.id}`}
            center={[occurrence.latitude, occurrence.longitude]}
            radius={getHeatRadius(occurrence)}
            pathOptions={{
              color: '#d97706',
              fillColor: '#f97316',
              fillOpacity: occurrence.status === 'resolved' ? 0.18 : 0.34,
              opacity: 0.22,
              weight: 1,
            }}
          />
        ))}

        {occurrences.map((occurrence) => {
          const category = getCategoryById(occurrence.category);
          const status = getStatusInfo(occurrence.status);

          return (
            <Marker
              key={occurrence.id}
              position={[occurrence.latitude, occurrence.longitude]}
              icon={createMarkerIcon(occurrence, selectedOccurrenceId === occurrence.id)}
              opacity={showHeatmap ? 0.82 : 1}
            >
              <Popup>
                <div className={styles.popup}>
                  <strong>
                    {category.icon} {occurrence.title}
                  </strong>
                  <span>{status.label}</span>
                  <p>{occurrence.reference}</p>
                  {showPopupLink && <Link to={`/occurrences/${occurrence.id}`}>Ver detalhes</Link>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
