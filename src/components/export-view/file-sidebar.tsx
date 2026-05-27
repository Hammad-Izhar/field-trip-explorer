import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    CheckSquare,
    ChevronsLeft,
    ChevronsRight,
    FileJson,
    Plus,
} from "lucide-react";
import { useRef, useState } from "react";
import type React from "react";
import type { ParsedFile } from "./types";
import { formatFileSize, getFileKey } from "./utils";

function hasDraggedFiles(event: React.DragEvent<HTMLElement>) {
    return Array.from(event.dataTransfer.types).includes("Files");
}

export function FileSidebar({
    allFilesSelected,
    deselectedFileKeys,
    files,
    inputRef,
    isCollapsed,
    parseResults,
    selectedFiles,
    onAddFiles,
    onClearAllFiles,
    onSelectAllFiles,
    onToggleCollapse,
    onToggleFile,
}: {
    allFilesSelected: boolean;
    deselectedFileKeys: Set<string>;
    files: File[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    isCollapsed: boolean;
    parseResults: Record<string, ParsedFile>;
    selectedFiles: File[];
    onAddFiles: (files: FileList | File[]) => void;
    onClearAllFiles: () => void;
    onSelectAllFiles: () => void;
    onToggleCollapse: () => void;
    onToggleFile: (file: File, checked: boolean) => void;
}) {
    const [isDraggingFiles, setIsDraggingFiles] = useState(false);
    const dragDepth = useRef(0);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) onAddFiles(event.target.files);
        event.target.value = "";
    };

    const handleDragEnter = (event: React.DragEvent<HTMLElement>) => {
        if (!hasDraggedFiles(event)) return;

        event.preventDefault();
        dragDepth.current += 1;
        setIsDraggingFiles(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
        if (!hasDraggedFiles(event)) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
        if (!hasDraggedFiles(event)) return;

        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        setIsDraggingFiles(dragDepth.current > 0);
    };

    const handleDrop = (event: React.DragEvent<HTMLElement>) => {
        if (!hasDraggedFiles(event)) return;

        event.preventDefault();
        dragDepth.current = 0;
        setIsDraggingFiles(false);

        if (event.dataTransfer.files.length > 0) {
            onAddFiles(event.dataTransfer.files);
        }
    };

    return (
        <aside
            className={cn(
                "relative overflow-hidden rounded-lg border bg-card shadow-ceti transition-colors",
                isDraggingFiles && "border-primary bg-secondary/40",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {isDraggingFiles ? (
                <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center border-2 border-dashed border-primary bg-background/80 p-4 text-center text-sm font-semibold text-primary">
                    Drop JSON files to add them
                </div>
            ) : null}
            <div
                className={cn(
                    "flex items-center justify-between gap-3 p-4",
                    isCollapsed && "justify-center p-3",
                )}
            >
                <div className={cn(isCollapsed && "sr-only")}>
                    <h2 className="font-heading text-xl text-foreground">
                        Session
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {files.length} JSON {files.length === 1 ? "file" : "files"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!isCollapsed ? (
                        <Button
                            aria-label="Add files"
                            size="icon"
                            variant="outline"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Plus />
                        </Button>
                    ) : null}
                    <Button
                        aria-label={
                            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                        }
                        size="icon"
                        variant="outline"
                        onClick={onToggleCollapse}
                    >
                        {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
                    </Button>
                </div>
                <Input
                    ref={inputRef}
                    multiple
                    accept=".json"
                    type="file"
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>
            {!isCollapsed ? (
                <>
                    <Separator />
                    <div className="flex items-center gap-2 p-3">
                        <Button
                            type="button"
                            variant={allFilesSelected ? "secondary" : "outline"}
                            size="sm"
                            className="min-w-0 flex-1"
                            onClick={onSelectAllFiles}
                            disabled={files.length === 0}
                        >
                            <CheckSquare />
                            Select all
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClearAllFiles}
                            disabled={selectedFiles.length === 0}
                        >
                            Clear
                        </Button>
                    </div>
                    <Separator />
                </>
            ) : null}
            <ScrollArea
                className={cn("h-[26rem]", isCollapsed && "h-[29.5rem]")}
            >
                <div className={cn("grid gap-2 p-3", isCollapsed && "px-2")}>
                    {files.map((file) => {
                        const fileKey = getFileKey(file);
                        const parseResult = parseResults[fileKey];
                        const checked = !deselectedFileKeys.has(fileKey);
                        const isInvalid = parseResult?.status === "invalid";

                        return (
                            <Label
                                key={fileKey}
                                className={cn(
                                    "grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border bg-background p-3 transition-colors hover:bg-secondary/60",
                                    checked && "border-primary/40 bg-secondary",
                                    isCollapsed &&
                                        "grid-cols-1 place-items-center gap-0 px-2 py-3",
                                )}
                            >
                                <Checkbox
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                        onToggleFile(file, value === true)
                                    }
                                />
                                <span
                                    className={cn(
                                        "grid min-w-0 gap-2",
                                        isCollapsed && "sr-only",
                                    )}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        <FileJson className="size-4 shrink-0 text-primary" />
                                        <span className="truncate text-sm font-semibold">
                                            {file.name}
                                        </span>
                                    </span>
                                    <span className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                        <Badge
                                            variant={
                                                isInvalid
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                        >
                                            {parseResult?.status ?? "loading"}
                                        </Badge>
                                    </span>
                                </span>
                            </Label>
                        );
                    })}
                </div>
            </ScrollArea>
            {isCollapsed ? (
                <div className="grid gap-2 border-t p-2">
                    <Button
                        aria-label="Add files"
                        size="icon"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                    >
                        <Plus />
                    </Button>
                    <Button
                        aria-label="Select all files"
                        size="icon"
                        variant={allFilesSelected ? "secondary" : "outline"}
                        onClick={onSelectAllFiles}
                        disabled={files.length === 0}
                    >
                        <CheckSquare />
                    </Button>
                </div>
            ) : null}
        </aside>
    );
}
