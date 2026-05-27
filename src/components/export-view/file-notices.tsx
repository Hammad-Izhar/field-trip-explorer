import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { ParsedFile } from "./types";
import { getFileKey } from "./utils";

function FileWarning({
    file,
}: {
    file: Extract<ParsedFile, { status: "invalid" }>;
}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="absolute left-4 top-3.5 size-4" />
            <div className="pl-6">
                <AlertTitle>
                    {file.file.name}: {file.errorTitle}
                </AlertTitle>
                <AlertDescription>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                        {file.errorMessages.map((message) => (
                            <li key={message}>{message}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </div>
        </Alert>
    );
}

export function LoadingCard({ file }: { file: File }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{file.name}</CardTitle>
                <CardDescription>Parsing file...</CardDescription>
            </CardHeader>
        </Card>
    );
}

export function ParsedFileNotices({ files }: { files: ParsedFile[] }) {
    return (
        <>
            {files.map((file) => {
                if (file.status === "invalid") {
                    return (
                        <FileWarning key={getFileKey(file.file)} file={file} />
                    );
                }
                if (file.status === "loading") {
                    return (
                        <LoadingCard
                            key={getFileKey(file.file)}
                            file={file.file}
                        />
                    );
                }
                return null;
            })}
        </>
    );
}
