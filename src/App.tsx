import { useDragAndDropUpload } from "@/hooks/use-drag-and-drop-upload";
import { useState } from "react";
import Header from "./components/header";
import Dropzone from "./components/dropzone";
import SelectedFilesView from "./components/selected-files-view";

type View = "upload" | "selected-files";

function App() {
    const [view, setView] = useState<View>("upload");
    const {
        addFiles,
        fileInputRef,
        isDragging,
        isLoading,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        onFileInputChange,
        selectedFiles,
    } = useDragAndDropUpload();

    const handleViewFiles = () => {
        setView("selected-files");
    };

    return (
        <main className="min-h-svh overflow-hidden bg-background text-foreground ceti-noise">
            <div className="mx-auto min-h-140 max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
                <div className="flex flex-col justify-between items-center gap-4">
                    <Header />

                    {view === "upload" ? (
                        <>
                            <div className="py-4" />
                            <Dropzone
                                fileInputRef={fileInputRef}
                                isDragging={isDragging}
                                isLoading={isLoading}
                                selectedFiles={selectedFiles}
                                onDragEnter={onDragEnter}
                                onDragLeave={onDragLeave}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                onFileInputChange={onFileInputChange}
                                onViewFiles={handleViewFiles}
                            />
                        </>
                    ) : (
                        <SelectedFilesView
                            files={selectedFiles}
                            onAddFiles={addFiles}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;
