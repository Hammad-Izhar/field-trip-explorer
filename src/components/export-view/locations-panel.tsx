import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { BarList } from "./bar-list";
import { ParsedFileNotices } from "./file-notices";
import { LocationMap } from "./location-map";
import { RawJsonToggle } from "./json";
import { Metric } from "./metric";
import type { ParsedFile } from "./types";
import {
    countBy,
    formatDate,
    getTimestamp,
    getValidFiles,
    sortCounts,
} from "./utils";

export function LocationsPanel({ files }: { files: ParsedFile[] }) {
    const validFiles = useMemo(() => getValidFiles(files), [files]);
    const allLocations = useMemo(
        () =>
            validFiles
                .flatMap((file) =>
                    file.data.locations.map((location) => ({
                        location,
                        fileName: file.file.name,
                        key: `${file.file.name}-${location.fieldTripLocationId}-${getTimestamp(location.dateUtc)}`,
                    })),
                )
                .sort(
                    (first, second) =>
                        getTimestamp(first.location.dateUtc) -
                        getTimestamp(second.location.dateUtc),
                ),
        [validFiles],
    );
    const [selectedLocationKey, setSelectedLocationKey] = useState<
        string | undefined
    >();
    const selectedLocation =
        allLocations.find(({ key }) => key === selectedLocationKey) ??
        allLocations[0];
    const timestamps = allLocations.map(({ location }) =>
        getTimestamp(location.dateUtc),
    );
    const minDate = timestamps.length ? Math.min(...timestamps) : undefined;
    const maxDate = timestamps.length ? Math.max(...timestamps) : undefined;
    const deviceRows = sortCounts(
        countBy(
            allLocations.map(({ location }) => location),
            (location) => location.device.name,
        ),
    );

    return (
        <div className="grid gap-4">
            <ParsedFileNotices files={files} />
            {validFiles.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Locations</CardTitle>
                        <CardDescription>
                            {allLocations.length} parsed points across{" "}
                            {validFiles.length} selected files
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Metric
                                label="Locations"
                                value={allLocations.length}
                            />
                            <Metric label="Devices" value={deviceRows.length} />
                            <Metric
                                label="First"
                                value={minDate ? formatDate(minDate) : "None"}
                            />
                            <Metric
                                label="Last"
                                value={maxDate ? formatDate(maxDate) : "None"}
                            />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                            <LocationMap
                                locations={allLocations}
                                selectedLocationKey={selectedLocation?.key}
                                onSelectLocation={setSelectedLocationKey}
                            />
                            <div className="grid content-start gap-3">
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                                    Device points
                                </h3>
                                <BarList rows={deviceRows} />
                            </div>
                        </div>
                        {selectedLocation ? (
                            <div className="grid gap-3 rounded-md border bg-background p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold">
                                            <MapPin className="size-4 text-primary" />
                                            {formatDate(
                                                selectedLocation.location
                                                    .dateUtc,
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedLocation.fileName}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {selectedLocation.location.device.name}
                                    </Badge>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Metric
                                        label="Latitude"
                                        value={selectedLocation.location.latitude.toFixed(
                                            5,
                                        )}
                                    />
                                    <Metric
                                        label="Longitude"
                                        value={selectedLocation.location.longitude.toFixed(
                                            5,
                                        )}
                                    />
                                </div>
                                <RawJsonToggle
                                    label="location JSON"
                                    value={selectedLocation.location}
                                />
                            </div>
                        ) : null}
                        <RawJsonToggle
                            label="all locations JSON"
                            value={allLocations.map(({ location }) => location)}
                        />
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
