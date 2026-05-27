import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatEventTypeLabel, getEventTypeColor } from "@/lib/event-display";
import { Filter } from "lucide-react";
import { useState } from "react";
import { EventTimeline } from "./event-timeline";
import { ParsedFileNotices } from "./file-notices";
import { RawJsonToggle } from "./json";
import { Metric } from "./metric";
import type { ParsedFile } from "./types";
import {
    countBy,
    formatDate,
    getFieldValue,
    getFileKey,
    getTimestamp,
    getValidFiles,
    sortCounts,
} from "./utils";

export function EventsPanel({ files }: { files: ParsedFile[] }) {
    const validFiles = getValidFiles(files);
    const filesWithEvents = validFiles.map((parsedFile) => {
        const fileKey = getFileKey(parsedFile.file);
        const events = parsedFile.data.events
            .map((event) => ({
                key: `${fileKey}-${event.fieldTripEventId}`,
                event,
                fileName: parsedFile.file.name,
            }))
            .sort(
                (first, second) =>
                    getTimestamp(first.event.dateUtc) -
                    getTimestamp(second.event.dateUtc),
            );

        return {
            parsedFile,
            fileKey,
            events,
        };
    });
    const allEvents = filesWithEvents.flatMap(({ events }) => events);
    const eventTypes = Array.from(
        new Set(allEvents.map(({ event }) => event.eventType)),
    ).sort();
    const [eventTypeFilters, setEventTypeFilters] = useState<Set<string>>(
        () => new Set(),
    );
    const [selectedEventId, setSelectedEventId] = useState<
        string | undefined
    >();
    const hasEventTypeFilters = eventTypeFilters.size > 0;
    const filteredEvents = allEvents
        .filter(
            ({ event }) =>
                !hasEventTypeFilters || eventTypeFilters.has(event.eventType),
        )
        .sort(
            (first, second) =>
                getTimestamp(first.event.dateUtc) -
                getTimestamp(second.event.dateUtc),
        );
    const selectedEvent =
        filteredEvents.find((event) => event.key === selectedEventId) ??
        filteredEvents[0];
    const filesWithFilteredEvents = filesWithEvents.map((fileEvents) => {
        const filteredFileEvents = fileEvents.events.filter(
            ({ event }) =>
                !hasEventTypeFilters || eventTypeFilters.has(event.eventType),
        );
        const missionTimestamps = [
            getTimestamp(
                fileEvents.parsedFile.data.fieldTrip.fieldTripStartDateUtc,
            ),
            getTimestamp(
                fileEvents.parsedFile.data.fieldTrip.fieldTripEndDateUtc,
            ),
        ];

        return {
            ...fileEvents,
            filteredEvents: filteredFileEvents,
            minTimelineTimestamp: Math.min(...missionTimestamps),
            maxTimelineTimestamp: Math.max(...missionTimestamps),
        };
    });
    const eventTypeCounts = sortCounts(
        countBy(
            allEvents.map(({ event }) => event),
            (event) => event.eventType,
        ),
    );
    const toggleEventTypeFilter = (eventType: string, checked: boolean) => {
        setEventTypeFilters((currentFilters) => {
            const nextFilters = new Set(currentFilters);
            if (checked) {
                nextFilters.add(eventType);
            } else {
                nextFilters.delete(eventType);
            }
            return nextFilters;
        });
        setSelectedEventId(undefined);
    };

    return (
        <div className="grid gap-4">
            <ParsedFileNotices files={files} />
            {validFiles.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>
                            {filteredEvents.length} of {allEvents.length} parsed
                            events
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-3 sm:grid-cols-[18rem_minmax(0,1fr)]">
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <Filter className="size-4" />
                                        Event type
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="xs"
                                            onClick={() => {
                                                setEventTypeFilters(
                                                    new Set(eventTypes),
                                                );
                                                setSelectedEventId(undefined);
                                            }}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="xs"
                                            onClick={() => {
                                                setEventTypeFilters(new Set());
                                                setSelectedEventId(undefined);
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                                <ScrollArea className="h-36 rounded-md border bg-background">
                                    <div className="grid gap-1 p-2">
                                        {eventTypes.map((eventType) => (
                                            <Label
                                                key={eventType}
                                                className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary/60"
                                            >
                                                <Checkbox
                                                    checked={eventTypeFilters.has(
                                                        eventType,
                                                    )}
                                                    onCheckedChange={(value) =>
                                                        toggleEventTypeFilter(
                                                            eventType,
                                                            value === true,
                                                        )
                                                    }
                                                />
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <span
                                                        className="size-2.5 shrink-0 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                getEventTypeColor(
                                                                    eventType,
                                                                ),
                                                        }}
                                                    />
                                                    <span className="truncate text-sm">
                                                        {formatEventTypeLabel(
                                                            eventType,
                                                        )}
                                                    </span>
                                                </span>
                                            </Label>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="text-xs text-muted-foreground">
                                    {hasEventTypeFilters
                                        ? `${eventTypeFilters.size} selected`
                                        : "Showing all event types"}
                                </div>
                            </div>
                            <div className="flex flex-wrap content-end gap-2">
                                {eventTypeCounts.map(([eventType, count]) => (
                                    <Badge key={eventType} variant="secondary">
                                        <span
                                            className="size-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    getEventTypeColor(
                                                        eventType,
                                                    ),
                                            }}
                                        />
                                        {formatEventTypeLabel(eventType)}:{" "}
                                        {count}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            {filesWithFilteredEvents.map((file) => (
                                <EventTimeline
                                    key={file.fileKey}
                                    title={file.parsedFile.file.name}
                                    events={file.filteredEvents}
                                    minTimestamp={file.minTimelineTimestamp}
                                    maxTimestamp={file.maxTimelineTimestamp}
                                    selectedEventId={selectedEvent?.key}
                                    onSelectEvent={setSelectedEventId}
                                />
                            ))}
                        </div>
                        {selectedEvent ? (
                            <div className="grid gap-4 rounded-md border bg-background p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold">
                                            <span
                                                className="size-2.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        getEventTypeColor(
                                                            selectedEvent.event
                                                                .eventType,
                                                        ),
                                                }}
                                            />
                                            {formatEventTypeLabel(
                                                selectedEvent.event.eventType,
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(
                                                selectedEvent.event.dateUtc,
                                            )}{" "}
                                            - {selectedEvent.fileName}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {selectedEvent.event.device.name}
                                    </Badge>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <Metric
                                        label="Latitude"
                                        value={selectedEvent.event.latitude.toFixed(
                                            5,
                                        )}
                                    />
                                    <Metric
                                        label="Longitude"
                                        value={selectedEvent.event.longitude.toFixed(
                                            5,
                                        )}
                                    />
                                    <Metric
                                        label="Cluster"
                                        value={
                                            getFieldValue(
                                                selectedEvent.event,
                                                "ClusterNumber",
                                            ) ?? "None"
                                        }
                                    />
                                    <Metric
                                        label="Fields"
                                        value={
                                            Object.keys(
                                                selectedEvent.event.fields,
                                            ).length
                                        }
                                    />
                                </div>
                                <RawJsonToggle
                                    label="event JSON"
                                    value={selectedEvent.event}
                                />
                            </div>
                        ) : (
                            <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                                No events match the current filter.
                            </div>
                        )}
                        <RawJsonToggle
                            label="filtered events JSON"
                            value={filteredEvents.map(({ event }) => event)}
                        />
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
