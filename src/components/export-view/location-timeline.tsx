import { cn } from "@/lib/utils";
import type { LocationTimelineItem } from "./types";
import {
    formatDate,
    formatShortDate,
    getTimelinePosition,
    getTimestamp,
} from "./utils";

export function LocationTimeline({
    locations,
    selectedLocationId,
    onSelectLocation,
}: {
    locations: LocationTimelineItem[];
    selectedLocationId?: string;
    onSelectLocation: (locationId: string) => void;
}) {
    const timestamps = locations.map(({ location }) =>
        getTimestamp(location.dateUtc),
    );
    const minTimestamp = timestamps.length ? Math.min(...timestamps) : 0;
    const maxTimestamp = timestamps.length ? Math.max(...timestamps) : 0;

    return (
        <div className="grid gap-3 rounded-md border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    Location timeline
                </h3>
                <div className="text-xs text-muted-foreground">
                    {locations.length
                        ? `${formatShortDate(minTimestamp)} - ${formatShortDate(maxTimestamp)}`
                        : "No locations"}
                </div>
            </div>
            <div className="relative h-16 rounded-md bg-muted/50">
                <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-border" />
                {locations.map(({ location, key }) => {
                    const isSelected =
                        location.fieldTripLocationId === selectedLocationId;
                    const left = getTimelinePosition(
                        getTimestamp(location.dateUtc),
                        minTimestamp,
                        maxTimestamp,
                    );

                    return (
                        <button
                            key={key}
                            type="button"
                            aria-label={`Location on ${formatDate(location.dateUtc)}`}
                            className={cn(
                                "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background bg-primary shadow-sm transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/45",
                                isSelected &&
                                    "size-5 bg-accent ring-3 ring-primary/25",
                            )}
                            style={{ left: `${4 + left * 0.92}%` }}
                            title={formatShortDate(location.dateUtc)}
                            onClick={() =>
                                onSelectLocation(location.fieldTripLocationId)
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}
