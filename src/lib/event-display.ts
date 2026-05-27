const EVENT_TYPE_LABELS: Record<string, string> = {
    CetaceanObservation: "Cetacean Observation",
    ClusterTracker: "Cluster Tracker",
    DailyEffort: "Daily Effort",
    Drone: "Drone",
    Encounter: "Encounter",
    EquipmentChecklist: "Equipment Checklist",
    GenericEvent: "Generic Event",
    GroupBehaviour: "Group Behaviour",
    HydrophoneCheck: "Hydrophone Check",
    PhotoIdentification: "Photo Identification",
    Recording: "Recording",
    ShitAndSkin: "Shit And Skin",
    TagDeployment: "Tag Deployment",
    TagFollow: "Tag Follow",
    TowedArray: "Towed Array",
    UnknownEvent: "Unknown Event",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
    CetaceanObservation: "#2563eb",
    ClusterTracker: "#0891b2",
    DailyEffort: "#65a30d",
    Drone: "#7c3aed",
    Encounter: "#dc2626",
    EquipmentChecklist: "#64748b",
    GenericEvent: "#475569",
    GroupBehaviour: "#db2777",
    HydrophoneCheck: "#0d9488",
    PhotoIdentification: "#ea580c",
    Recording: "#9333ea",
    ShitAndSkin: "#ca8a04",
    TagDeployment: "#16a34a",
    TagFollow: "#0284c7",
    TowedArray: "#4f46e5",
    UnknownEvent: "#71717a",
};

export function formatEventTypeLabel(eventType: string) {
    return (
        EVENT_TYPE_LABELS[eventType] ??
        eventType
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    );
}

export function getEventTypeColor(eventType: string) {
    return EVENT_TYPE_COLORS[eventType] ?? EVENT_TYPE_COLORS.UnknownEvent;
}
