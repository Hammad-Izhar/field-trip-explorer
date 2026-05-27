export function BarList({ rows }: { rows: [string, number][] }) {
    const maxValue = Math.max(1, ...rows.map(([, value]) => value));

    if (rows.length === 0) {
        return (
            <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                No data available.
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            {rows.map(([label, value]) => (
                <div
                    key={label}
                    className="grid grid-cols-[minmax(7rem,12rem)_minmax(0,1fr)_3rem] items-center gap-3"
                >
                    <div className="truncate text-sm font-medium" title={label}>
                        {label}
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{
                                width: `${Math.max(4, (value / maxValue) * 100)}%`,
                            }}
                        />
                    </div>
                    <div className="text-right text-sm font-semibold">
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
}
