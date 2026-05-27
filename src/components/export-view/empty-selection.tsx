import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export function EmptySelection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No files selected</CardTitle>
                <CardDescription>
                    Select one or more files in the sidebar to view parsed
                    content.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
