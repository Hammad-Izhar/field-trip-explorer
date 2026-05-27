import { useEffect, useMemo } from "react";
import {
    CircleMarker,
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { LocationTimelineItem } from "./types";
import { formatDate } from "./utils";

const DEVICE_COLORS = [
    "#4b06eb",
    "#00a4c7",
    "#c54d9b",
    "#0f8f7b",
    "#d77a1f",
    "#4b5b7e",
];

type DeviceLocationGroup = {
    deviceId: string;
    deviceName: string;
    color: string;
    locations: LocationTimelineItem[];
};

function FitMapBounds({
    bounds,
    boundsKey,
}: {
    bounds?: LatLngBoundsExpression;
    boundsKey: string;
}) {
    const map = useMap();

    useEffect(() => {
        if (!bounds) return;

        map.fitBounds(bounds, {
            animate: false,
            maxZoom: 16,
            padding: [28, 28],
        });
    }, [bounds, boundsKey, map]);

    return null;
}

export function LocationMap({
    locations,
    selectedLocationKey,
    onSelectLocation,
}: {
    locations: LocationTimelineItem[];
    selectedLocationKey?: string;
    onSelectLocation: (locationKey: string) => void;
}) {
    const groups = locations.reduce<DeviceLocationGroup[]>((deviceGroups, item) => {
        const groupIndex = deviceGroups.findIndex(
            (group) => group.deviceId === item.location.device.id,
        );

        if (groupIndex >= 0) {
            deviceGroups[groupIndex].locations.push(item);
            return deviceGroups;
        }

        deviceGroups.push({
            deviceId: item.location.device.id,
            deviceName: item.location.device.name,
            color: DEVICE_COLORS[deviceGroups.length % DEVICE_COLORS.length],
            locations: [item],
        });

        return deviceGroups;
    }, []);
    const boundsKey = locations
        .map(
            ({ location }) =>
                `${location.device.id}:${location.latitude},${location.longitude}`,
        )
        .join("|");
    const bounds = useMemo(
        () =>
            locations.length
                ? (locations.map(({ location }) => [
                      location.latitude,
                      location.longitude,
                  ]) as LatLngBoundsExpression)
                : undefined,
        [locations],
    );
    const center = (
        locations[0]
            ? [locations[0].location.latitude, locations[0].location.longitude]
            : [15.414, -61.37]
    ) as LatLngExpression;

    return (
        <div className="grid gap-3 rounded-md border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Map
                </h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {groups.map((group) => (
                        <span
                            key={group.deviceId}
                            className="inline-flex items-center gap-1.5"
                        >
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: group.color }}
                            />
                            {group.deviceName}
                        </span>
                    ))}
                </div>
            </div>
            <div className="relative aspect-[16/10] min-h-96 overflow-hidden rounded-md border bg-secondary">
                <MapContainer
                    center={center}
                    zoom={12}
                    className="size-full"
                    scrollWheelZoom
                >
                    <FitMapBounds bounds={bounds} boundsKey={boundsKey} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {groups.map((group) => {
                        const positions = group.locations.map(
                            ({ location }) =>
                                [
                                    location.latitude,
                                    location.longitude,
                                ] as LatLngExpression,
                        );

                        return (
                            <Polyline
                                key={group.deviceId}
                                pathOptions={{
                                    color: group.color,
                                    opacity: 0.68,
                                    weight: 3,
                                }}
                                positions={positions}
                            />
                        );
                    })}
                    {groups.flatMap((group) =>
                        group.locations.map(({ location, fileName, key }) => {
                            const isSelected = key === selectedLocationKey;

                            return (
                                <CircleMarker
                                    key={key}
                                    center={[
                                        location.latitude,
                                        location.longitude,
                                    ]}
                                    eventHandlers={{
                                        click: () => onSelectLocation(key),
                                    }}
                                    pathOptions={{
                                        color: isSelected
                                            ? "#171b22"
                                            : "#ffffff",
                                        fillColor: isSelected
                                            ? "#00cff8"
                                            : group.color,
                                        fillOpacity: 0.9,
                                        opacity: 1,
                                        weight: isSelected ? 3 : 2,
                                    }}
                                    radius={isSelected ? 8 : 5}
                                >
                                    <Popup>
                                        <div className="grid gap-1 text-sm">
                                            <strong>{group.deviceName}</strong>
                                            <span>{formatDate(location.dateUtc)}</span>
                                            <span>{fileName}</span>
                                            <span>
                                                {location.latitude.toFixed(5)},{" "}
                                                {location.longitude.toFixed(5)}
                                            </span>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        }),
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
