import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptySelection } from "./export-view/empty-selection";
import { EventsPanel } from "./export-view/events-panel";
import { FieldTripPanel } from "./export-view/field-trip-panel";
import { FileSidebar } from "./export-view/file-sidebar";
import { LocationsPanel } from "./export-view/locations-panel";
import type { ParsedFile } from "./export-view/types";
import { getFileKey, parseFile } from "./export-view/utils";

interface Props {
    files: File[];
    onAddFiles: (files: FileList | File[]) => void;
}

function SelectedFilesView({ files, onAddFiles }: Props) {
    const [parseResults, setParseResults] = useState<
        Record<string, ParsedFile>
    >({});
    const [deselectedFileKeys, setDeselectedFileKeys] = useState<Set<string>>(
        () => new Set(),
    );
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const sidebarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let isCurrent = true;

        files.forEach((file) => {
            const key = getFileKey(file);

            parseFile(file).then((result) => {
                if (!isCurrent) return;

                setParseResults((currentResults) => ({
                    ...currentResults,
                    [key]: result,
                }));
            });
        });

        return () => {
            isCurrent = false;
        };
    }, [files]);

    const selectedFiles = useMemo(
        () => files.filter((file) => !deselectedFileKeys.has(getFileKey(file))),
        [deselectedFileKeys, files],
    );

    const selectedParseResults = selectedFiles.map(
        (file) => parseResults[getFileKey(file)] ?? { status: "loading", file },
    );

    const hasSelectedFiles = selectedParseResults.length > 0;
    const allFilesSelected =
        files.length > 0 && selectedFiles.length === files.length;

    const toggleFile = (file: File, checked: boolean) => {
        const fileKey = getFileKey(file);

        setDeselectedFileKeys((currentKeys) => {
            const nextKeys = new Set(currentKeys);
            if (checked) {
                nextKeys.delete(fileKey);
            } else {
                nextKeys.add(fileKey);
            }
            return nextKeys;
        });
    };

    const selectAllFiles = () => setDeselectedFileKeys(new Set());
    const clearAllFiles = () =>
        setDeselectedFileKeys(new Set(files.map((file) => getFileKey(file))));

    return (
        <section
            className={cn(
                "grid min-h-[34rem] w-full gap-4 transition-[grid-template-columns] lg:grid-cols-[18rem_minmax(0,1fr)]",
                isSidebarCollapsed && "lg:grid-cols-[4.25rem_minmax(0,1fr)]",
            )}
        >
            <FileSidebar
                allFilesSelected={allFilesSelected}
                deselectedFileKeys={deselectedFileKeys}
                files={files}
                inputRef={sidebarInputRef}
                isCollapsed={isSidebarCollapsed}
                parseResults={parseResults}
                selectedFiles={selectedFiles}
                onAddFiles={onAddFiles}
                onClearAllFiles={clearAllFiles}
                onSelectAllFiles={selectAllFiles}
                onToggleCollapse={() =>
                    setIsSidebarCollapsed((current) => !current)
                }
                onToggleFile={toggleFile}
            />

            <main className="min-w-0">
                <Tabs defaultValue="field-trip" className="gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-heading text-2xl text-foreground">
                                Parsed API export
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {selectedFiles.length} selected for inspection
                            </p>
                        </div>
                        <TabsList>
                            <TabsTrigger value="field-trip">
                                Field Trip
                            </TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                            <TabsTrigger value="locations">
                                Locations
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="field-trip">
                        {hasSelectedFiles ? (
                            <FieldTripPanel files={selectedParseResults} />
                        ) : (
                            <EmptySelection />
                        )}
                    </TabsContent>
                    <TabsContent value="events">
                        {hasSelectedFiles ? (
                            <EventsPanel files={selectedParseResults} />
                        ) : (
                            <EmptySelection />
                        )}
                    </TabsContent>
                    <TabsContent value="locations">
                        {hasSelectedFiles ? (
                            <LocationsPanel files={selectedParseResults} />
                        ) : (
                            <EmptySelection />
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </section>
    );
}

export default SelectedFilesView;
