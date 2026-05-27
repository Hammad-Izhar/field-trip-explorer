import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

interface Props {
    fileInputRef: React.ForwardedRef<HTMLInputElement>;
    isDragging: boolean;
    isLoading: boolean;
    selectedFiles: File[];
    onDragEnter: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
    onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
    onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onViewFiles: () => void;
}

function Dropzone({
    fileInputRef,
    isDragging,
    isLoading,
    selectedFiles,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onFileInputChange,
    onViewFiles,
}: Props) {
    return (
        <div className="w-4/5 grid gap-2">
            <Label
                id="file-dropzone"
                htmlFor="json-file-upload"
                className={cn(
                    "grid place-items-center h-100 self-center bg-white border-ceti-grey border-2 border-dashed rounded-lg cursor-pointer transition-color duration-500",
                    isDragging && "border-ceti-blue bg-ceti-blue/10",
                )}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <span className="flex flex-col items-center gap-3 px-4 text-center">
                    <span className="flex items-center gap-2">
                        <Download />
                        {isLoading
                            ? "Uploading API JSON Files..."
                            : "Drop API JSON Files here from the CETI App."}
                    </span>
                    {selectedFiles.length > 0 && (
                        <span className="text-sm text-ceti-grey">
                            {selectedFiles.map((file) => file.name).join(", ")}
                        </span>
                    )}
                </span>
                <Input
                    ref={fileInputRef}
                    id="json-file-upload"
                    multiple
                    accept=".json"
                    type="file"
                    className="hidden"
                    onChange={onFileInputChange}
                />
            </Label>
            <Button
                disabled={selectedFiles.length === 0}
                variant="default"
                className="w-full font-sans"
                onClick={onViewFiles}
            >
                View!
            </Button>
        </div>
    );
}

export default Dropzone;
