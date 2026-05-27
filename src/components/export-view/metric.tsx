export function Metric({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-md border bg-background px-3 py-2">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
                {label}
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
                {value}
            </div>
        </div>
    );
}
