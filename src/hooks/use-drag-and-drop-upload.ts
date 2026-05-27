import { useEffect, useRef, useState } from "react";
import type { DragEvent as ReactDragEvent } from "react";

function hasDraggedFiles(event: DragEvent) {
    return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

function getFileKey(file: File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

export function useDragAndDropUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const dragDepth = useRef(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addFiles = (files: FileList | File[]) => {
        const jsonFiles = Array.from(files).filter((file) =>
            file.name.toLowerCase().endsWith(".json"),
        );

        setSelectedFiles((currentFiles) => {
            const currentFileKeys = new Set(currentFiles.map(getFileKey));
            const newFiles = jsonFiles.filter(
                (file) => !currentFileKeys.has(getFileKey(file)),
            );

            return [...currentFiles, ...newFiles];
        });

        return jsonFiles;
    };

    const processFiles = (files: FileList | File[]) => {
        setIsLoading(true);

        try {
            addFiles(files);

            if (fileInputRef.current) fileInputRef.current.value = "";
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const preventFileNavigation = (event: DragEvent) => {
            if (hasDraggedFiles(event)) {
                event.preventDefault();
            }
        };

        window.addEventListener("dragover", preventFileNavigation);
        window.addEventListener("drop", preventFileNavigation);

        return () => {
            window.removeEventListener("dragover", preventFileNavigation);
            window.removeEventListener("drop", preventFileNavigation);
        };
    }, []);

    const onDragEnter = (event: ReactDragEvent<HTMLElement>) => {
        event.preventDefault();
        dragDepth.current += 1;
        setIsDragging(true);
    };

    const onDragOver = (event: ReactDragEvent<HTMLElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    const onDragLeave = (event: ReactDragEvent<HTMLElement>) => {
        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        setIsDragging(dragDepth.current > 0);
    };

    const onDrop = (event: ReactDragEvent<HTMLElement>) => {
        event.preventDefault();
        dragDepth.current = 0;
        setIsDragging(false);

        const { files } = event.dataTransfer;
        if (!files.length) return;

        processFiles(files);
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(event.target.files);
        }
    };

    return {
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
    };
}
