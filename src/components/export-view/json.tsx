import { Button } from "@/components/ui/button";
import { translateKnownIdsInValue } from "@/lib/parser";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

function JsonBlock({ value }: { value: unknown }) {
    return (
        <pre className="max-h-96 overflow-auto rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed text-foreground">
            {JSON.stringify(value, null, 2)}
        </pre>
    );
}

export function RawJsonToggle({
    label = "Raw JSON",
    value,
}: {
    label?: string;
    value: unknown;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const translatedValue = useMemo(
        () => translateKnownIdsInValue(value),
        [value],
    );

    return (
        <div className="grid gap-3">
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setIsVisible((current) => !current)}
            >
                {isVisible ? <EyeOff /> : <Eye />}
                {isVisible ? `Hide ${label}` : `Show ${label}`}
            </Button>
            {isVisible ? <JsonBlock value={translatedValue} /> : null}
        </div>
    );
}
