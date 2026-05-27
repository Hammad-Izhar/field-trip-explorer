import { formatEventTypeLabel, getEventTypeColor } from "@/lib/event-display";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import type { EventTimelineItem } from "./types";
import {
    formatDate,
    formatShortDate,
    getTimelinePosition,
    getTimestamp,
} from "./utils";

const CLUSTER_DISTANCE_PERCENT = 2.5;

type TimelineEventGroup = {
    id: string;
    events: EventTimelineItem[];
    left: number;
};

function getEventGroups(
    events: EventTimelineItem[],
    minTimestamp: number,
    maxTimestamp: number,
) {
    return events.reduce<TimelineEventGroup[]>((groups, item) => {
        const position = getTimelinePosition(
            getTimestamp(item.event.dateUtc),
            minTimestamp,
            maxTimestamp,
        );
        const left = 4 + position * 0.92;
        const previousGroup = groups.at(-1);

        if (
            previousGroup &&
            left - previousGroup.left <= CLUSTER_DISTANCE_PERCENT
        ) {
            previousGroup.events.push(item);
            previousGroup.left =
                previousGroup.events.reduce(
                    (total, { event }) =>
                        total +
                        (4 +
                            getTimelinePosition(
                                getTimestamp(event.dateUtc),
                                minTimestamp,
                                maxTimestamp,
                            ) *
                                0.92),
                    0,
                ) / previousGroup.events.length;
            return groups;
        }

        groups.push({
            id: item.key,
            events: [item],
            left,
        });
        return groups;
    }, []);
}

export function EventTimeline({
    events,
    minTimestamp,
    maxTimestamp,
    selectedEventId,
    onSelectEvent,
    title = "Event timeline",
}: {
    events: EventTimelineItem[];
    minTimestamp: number;
    maxTimestamp: number;
    selectedEventId?: string;
    onSelectEvent: (eventId: string) => void;
    title?: string;
}) {
    const selectedEventIndex = events.findIndex(
        (item) => item.key === selectedEventId,
    );
    const hasPreviousEvent = selectedEventIndex > 0;
    const hasNextEvent =
        selectedEventIndex >= 0 && selectedEventIndex < events.length - 1;
    const eventGroups = getEventGroups(events, minTimestamp, maxTimestamp);
    const hasTimelineRange = minTimestamp > 0 || maxTimestamp > 0;
    const [openGroupId, setOpenGroupId] = useState<string>();
    const pinnedGroupIdRef = useRef<string | undefined>(undefined);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    const selectAdjacentEvent = (direction: -1 | 1) => {
        const nextEvent = events[selectedEventIndex + direction];
        if (nextEvent) onSelectEvent(nextEvent.key);
    };

    const clearCloseTimeout = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
    };

    const previewGroup = (groupId: string) => {
        clearCloseTimeout();
        setOpenGroupId(groupId);
    };

    const pinGroup = (groupId: string) => {
        clearCloseTimeout();
        const shouldClose = pinnedGroupIdRef.current === groupId;
        const nextGroupId = shouldClose ? undefined : groupId;
        pinnedGroupIdRef.current = nextGroupId;
        setOpenGroupId(nextGroupId);
    };

    const closePreviewGroup = (groupId: string) => {
        clearCloseTimeout();
        closeTimeoutRef.current = setTimeout(() => {
            setOpenGroupId((currentGroupId) => {
                if (
                    currentGroupId !== groupId ||
                    pinnedGroupIdRef.current === groupId
                ) {
                    return currentGroupId;
                }
                return undefined;
            });
        }, 180);
    };

    const closeGroup = () => {
        clearCloseTimeout();
        pinnedGroupIdRef.current = undefined;
        setOpenGroupId(undefined);
    };

    return (
        <div className="grid gap-3 rounded-md border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                    {title}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                        {hasTimelineRange
                            ? `${formatShortDate(minTimestamp)} - ${formatShortDate(maxTimestamp)}`
                            : "No events"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label="Select previous event"
                            disabled={!hasPreviousEvent}
                            onClick={() => selectAdjacentEvent(-1)}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label="Select next event"
                            disabled={!hasNextEvent}
                            onClick={() => selectAdjacentEvent(1)}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="relative h-20 rounded-md bg-muted/50">
                <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-border" />
                {eventGroups.map((group) => {
                    const isCluster = group.events.length > 1;
                    const isSelected = group.events.some(
                        (item) => item.key === selectedEventId,
                    );
                    const firstEvent = group.events[0].event;
                    const eventTypeLabel = formatEventTypeLabel(
                        firstEvent.eventType,
                    );
                    const eventTypeColor = getEventTypeColor(
                        firstEvent.eventType,
                    );

                    return isCluster ? (
                        <PopoverPrimitive.Root
                            key={group.id}
                            open={openGroupId === group.id}
                            onOpenChange={(open) => {
                                if (!open) closeGroup();
                            }}
                        >
                            <PopoverPrimitive.Anchor asChild>
                                <div
                                    className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: `${group.left}%` }}
                                >
                                    <button
                                        type="button"
                                        aria-label={`${group.events.length} events near ${formatDate(firstEvent.dateUtc)}`}
                                        aria-expanded={openGroupId === group.id}
                                        className={cn(
                                            "grid size-5 place-items-center rounded-full border-2 border-background bg-foreground text-[0.625rem] font-bold leading-none text-background shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/45",
                                            isSelected &&
                                                "size-6 bg-accent text-accent-foreground ring-3 ring-primary/25",
                                        )}
                                        onClick={() => pinGroup(group.id)}
                                        onFocus={() => previewGroup(group.id)}
                                        onMouseEnter={() =>
                                            previewGroup(group.id)
                                        }
                                        onMouseLeave={() =>
                                            closePreviewGroup(group.id)
                                        }
                                    >
                                        {group.events.length}
                                    </button>
                                </div>
                            </PopoverPrimitive.Anchor>
                            <PopoverPrimitive.Portal>
                                <PopoverPrimitive.Content
                                    align="center"
                                    side="top"
                                    sideOffset={8}
                                    collisionPadding={12}
                                    className="z-50 w-64 rounded-md border bg-popover p-2 text-popover-foreground shadow-lg outline-none"
                                    onEscapeKeyDown={closeGroup}
                                    onInteractOutside={closeGroup}
                                    onMouseEnter={() => previewGroup(group.id)}
                                    onMouseLeave={() =>
                                        closePreviewGroup(group.id)
                                    }
                                >
                                    <div className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
                                        {group.events.length} events
                                    </div>
                                    <div className="grid max-h-56 gap-1 overflow-auto">
                                        {group.events.map((item) => {
                                            const { event } = item;
                                            const itemTypeLabel =
                                                formatEventTypeLabel(
                                                    event.eventType,
                                                );
                                            return (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    className={cn(
                                                        "grid gap-0.5 rounded-md px-2 py-1.5 text-left text-xs hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45",
                                                        item.key ===
                                                            selectedEventId &&
                                                            "bg-secondary",
                                                    )}
                                                    onClick={() => {
                                                        onSelectEvent(item.key);
                                                        closeGroup();
                                                    }}
                                                >
                                                    <span className="flex min-w-0 items-center gap-2 font-semibold">
                                                        <span
                                                            className="size-2 shrink-0 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    getEventTypeColor(
                                                                        event.eventType,
                                                                    ),
                                                            }}
                                                        />
                                                        <span className="truncate">
                                                            {itemTypeLabel}
                                                        </span>
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {formatShortDate(
                                                            event.dateUtc,
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <PopoverPrimitive.Arrow className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-popover fill-popover" />
                                </PopoverPrimitive.Content>
                            </PopoverPrimitive.Portal>
                        </PopoverPrimitive.Root>
                    ) : (
                        <button
                            key={group.events[0].key}
                            type="button"
                            aria-label={`${eventTypeLabel} on ${formatDate(firstEvent.dateUtc)}`}
                            className={cn(
                                "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/45",
                                isSelected && "size-5 ring-3 ring-primary/25",
                            )}
                            style={{
                                left: `${group.left}%`,
                                backgroundColor: eventTypeColor,
                            }}
                            title={`${eventTypeLabel} - ${formatShortDate(firstEvent.dateUtc)}`}
                            onClick={() =>
                                onSelectEvent(group.events[0].key)
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}
