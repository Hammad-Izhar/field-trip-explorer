import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BarList } from "./bar-list";
import { ParsedFileNotices } from "./file-notices";
import { RawJsonToggle } from "./json";
import { Metric } from "./metric";
import type { ParsedFile } from "./types";
import {
    countBy,
    formatDate,
    formatShortDate,
    getFileKey,
    getTimestamp,
    getValidFiles,
    sortCounts,
} from "./utils";

export function FieldTripPanel({ files }: { files: ParsedFile[] }) {
    const validFiles = getValidFiles(files);
    const fieldTrips = validFiles.map((file) => file.data.fieldTrip);
    const memberRows = sortCounts(
        fieldTrips.reduce<Record<string, number>>((counts, fieldTrip) => {
            fieldTrip.members.forEach((member) => {
                counts[member.name] = (counts[member.name] ?? 0) + 1;
            });
            return counts;
        }, {}),
    );
    const boatRows = sortCounts(
        countBy(fieldTrips, (fieldTrip) => fieldTrip.boat.name),
    );
    const headRows = sortCounts(
        countBy(fieldTrips, (fieldTrip) => fieldTrip.headOfFieldTripUser.name),
    );
    const timestamps = fieldTrips.flatMap((fieldTrip) => [
        getTimestamp(fieldTrip.fieldTripStartDateUtc),
        getTimestamp(fieldTrip.fieldTripEndDateUtc),
    ]);
    const starts = timestamps.length ? Math.min(...timestamps) : undefined;
    const ends = timestamps.length ? Math.max(...timestamps) : undefined;

    return (
        <div className="grid gap-4">
            <ParsedFileNotices files={files} />
            {validFiles.length ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Field trip summary</CardTitle>
                        <CardDescription>
                            {validFiles.length} selected{" "}
                            {validFiles.length === 1 ? "mission" : "missions"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Metric
                                label="Missions"
                                value={validFiles.length}
                            />
                            <Metric label="Boats" value={boatRows.length} />
                            <Metric
                                label="Unique members"
                                value={memberRows.length}
                            />
                            <Metric
                                label="Date span"
                                value={
                                    starts && ends
                                        ? `${formatShortDate(starts)} - ${formatShortDate(ends)}`
                                        : "None"
                                }
                            />
                        </div>
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="grid gap-3">
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                                    Crew participation
                                </h3>
                                <BarList rows={memberRows} />
                            </div>
                            <div className="grid gap-5">
                                <div className="grid gap-3">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                                        Boats
                                    </h3>
                                    <BarList rows={boatRows} />
                                </div>
                                <div className="grid gap-3">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                                        Heads of field trip
                                    </h3>
                                    <BarList rows={headRows} />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            {validFiles.map((file) => {
                                const { fieldTrip } = file.data;
                                return (
                                    <div
                                        key={getFileKey(file.file)}
                                        className="grid gap-3 rounded-md border bg-background p-3"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {file.file.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {fieldTrip.boat.name} -{" "}
                                                    {fieldTrip.fieldTripState}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {fieldTrip.members.length}{" "}
                                                members
                                            </Badge>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <Metric
                                                label="Start"
                                                value={formatDate(
                                                    fieldTrip.fieldTripStartDateUtc,
                                                )}
                                            />
                                            <Metric
                                                label="End"
                                                value={formatDate(
                                                    fieldTrip.fieldTripEndDateUtc,
                                                )}
                                            />
                                            <Metric
                                                label="Head"
                                                value={
                                                    fieldTrip
                                                        .headOfFieldTripUser
                                                        .name
                                                }
                                            />
                                            <Metric
                                                label="Exported"
                                                value={formatDate(
                                                    fieldTrip.exportDateUtc,
                                                )}
                                            />
                                        </div>
                                        <RawJsonToggle value={fieldTrip} />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
