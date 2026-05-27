import {
    ApiExportSchema,
    type ApiEvent,
    type ApiExport,
} from "@/lib/parser";
import type { ParsedFile } from "./types";

export function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

export function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDate(value: Date | string | number) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function formatPath(path: PropertyKey[]) {
    return path.length > 0 ? path.join(".") : "root";
}

export async function parseFile(file: File): Promise<ParsedFile> {
    let json: unknown;

    try {
        json = JSON.parse(await file.text());
    } catch {
        return {
            status: "invalid",
            file,
            errorTitle: "Invalid JSON",
            errorMessages: ["This file could not be read as valid JSON."],
        };
    }

    const parsed = ApiExportSchema.safeParse(json);

    if (!parsed.success) {
        return {
            status: "invalid",
            file,
            errorTitle: "Schema validation failed",
            errorMessages: parsed.error.issues
                .slice(0, 6)
                .map((issue) => `${formatPath(issue.path)}: ${issue.message}`),
        };
    }

    return {
        status: "valid",
        file,
        data: parsed.data as ApiExport,
    };
}

export function getValidFiles(files: ParsedFile[]) {
    return files.filter(
        (file): file is Extract<ParsedFile, { status: "valid" }> =>
            file.status === "valid",
    );
}

export function countBy<T>(items: T[], getKey: (item: T) => string) {
    return items.reduce<Record<string, number>>((counts, item) => {
        const key = getKey(item);
        counts[key] = (counts[key] ?? 0) + 1;
        return counts;
    }, {});
}

export function sortCounts(counts: Record<string, number>) {
    return Object.entries(counts).sort(
        ([, firstCount], [, secondCount]) => secondCount - firstCount,
    );
}

export function getFieldValue(event: ApiEvent, fieldName: string) {
    const value = event.fields[fieldName]?.value;
    if (value === undefined || value === null || Array.isArray(value))
        return undefined;
    if (typeof value === "object") return undefined;
    return String(value);
}

export function getTimestamp(value: Date | string | number) {
    return new Date(value).getTime();
}

export function formatShortDate(value: Date | string | number) {
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(value));
}

export function getTimelinePosition(
    timestamp: number,
    minTimestamp: number,
    maxTimestamp: number,
) {
    if (minTimestamp === maxTimestamp) return 50;
    return ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * 100;
}

export function getMapPosition(
    value: number,
    minValue: number,
    maxValue: number,
) {
    if (minValue === maxValue) return 50;
    return ((value - minValue) / (maxValue - minValue)) * 88 + 6;
}
