import { z } from "zod";

export const EVENT_FORM_ID_TO_TYPE = {
    "3fa85f64-5717-4562-b3fc-3d963f66afa6": "GroupBehaviour",
    "3fa85f64-5717-4562-b3fc-2c784f66afa6": "CetaceanObservation",
    "3fa85f75-5817-4562-b3fc-2c963f66afa6": "TagFollow",
    "4fa85f64-5717-4562-b3fc-2c963f66afa6": "ClusterTracker",
    "3fa85f64-5817-4562-b3fc-3d964f66afa6": "Drone",
    "3fa85f75-5717-4562-b3fc-2c963f66afa6": "ShitAndSkin",
    "3fa85f64-5817-4562-b3fc-2c963f66afa8": "Recording",
    "3fa85f64-5717-4562-b3fc-2c963f66afa7": "DailyEffort",
    "3fa85f64-5666-4562-b3fc-2c963f66afa6": "TagDeployment",
    "3fa96f64-6817-5673-b3fc-2c963f66afa6": "Encounter",
    "3fa85f64-5717-4562-b3fc-2c963f66afa6": "HydrophoneCheck",
    "3fa66f64-5717-4562-b3fc-2c963f66afa6": "PhotoIdentification",
    "35e6f453-fc45-4de9-a688-3aefb0f710b9": "TowedArray",

    // Present in the example file, but not in your form-id table:
    "49d40b40-458b-11f1-b483-ab5df37b39d9": "EquipmentChecklist",
} as const;

export const EVENT_FORM_NAME_TO_TYPE = {
    // Your original names
    Cetaceans: "CetaceanObservation",
    "Cluster Tracker DSWP": "ClusterTracker",
    "Daily effort": "DailyEffort",
    Drone: "Drone",
    "Encounters DSWP": "Encounter",
    "Generic events PRO": "GenericEvent",
    "Group behaviour DSWP": "GroupBehaviour",
    "Hydro acoustic point": "HydrophoneCheck",
    "Photo identification": "PhotoIdentification",
    Recordings: "Recording",
    Sampling: "ShitAndSkin",
    "TAG deploy DSWP": "TagDeployment",
    "TAG follow DSWP": "TagFollow",

    // Names actually present in the example export
    "Cluster Tracker": "ClusterTracker",
    "Photo ID": "PhotoIdentification",
    "Hydrophone Check": "HydrophoneCheck",
    "Group Behaviour (hourly)": "GroupBehaviour",
    Recording: "Recording",
    "DJI Drone": "Drone",
    "Tag Deployment": "TagDeployment",
    Encounter: "Encounter",
    "Towed Array": "TowedArray",
    "Daily Effort": "DailyEffort",
    "Daily Equiptment Checklist": "EquipmentChecklist",
    "Daily Equipment Checklist": "EquipmentChecklist",
} as const;

export const USER_ID_TO_NAME = {
    "208d3190-7477-1f69-b77f-43f7fc352ee3": "Shane Gero",
    "2a526a8e-fed3-4fbb-bc7b-20a7bcf6407d": "Byron Cobb",
    "2c3a8cd0-98b2-11ef-aee3-83fe1031976b": "Yaly Mevorach",
    "3ef8b460-bed6-11ef-b002-158ddaf73ae4": "AppStore Reviewer",
    "4c402cb0-007f-1044-a1ff-cbc735459610": "Zahrek Gonzalez-Peltier",
    "4cb56c10-f660-1043-a1ff-cbc735459610": "Yaniv Aluma",
    "5bc05f10-e2fa-11ef-be99-d5feedbbe569": "Pernille Tønnesen",
    "6403faa0-f708-1043-a1ff-cbc735459610": "Dean Gibbons",
    "74ec5500-f02b-11ef-b4e0-4f55298039e6": "Julian Browne",
    "845c7770-b833-11ef-9d35-235716128e35": "Odel Harve",
    "94078660-dd47-1058-923b-bbb1a66889e7": "Marine Team",
    "c6b75ca0-f7b7-1043-a1ff-cbc735459610": "Darren Gibbons",
    "d089ae00-e2fa-11ef-be99-d5feedbbe569": "Sushmita Bhattacharya",
    "de6443d0-73ea-1f69-b77f-43f7fc352ee3": "Sarah de Haas",
    "e00464f0-750b-1f69-b77f-43f7fc352ee3": "Courtney Baumgartner",
    "e40ea180-011e-1044-a1ff-cbc735459610": "Kevin George",
    "ef76c8f0-ba5e-11c0-8549-fba81ce0ca38": "Mapal Ishay",
    "2919a380-f88a-1043-a1ff-cbc735459610": "Odel Harve",
    "0f1b20c0-e8b0-1245-8c45-bb92235805ea": "Odel Harve",
    "8f4a0850-20f7-11f0-bb29-11a0c21e88c5": "Zethra Baron",
} as const;

export const DEVICE_ID_TO_NAME = {
    "bed4e2c9-d420-4451-aad1-abb59f25147b": "ipad-1",
    "f7f8e0b9-dbf2-4620-9f4f-ab3cc5f923f2": "ipad-2",
    "87709fea-e9c0-4fa7-ba63-432548ab14e3": "ipad-3",
    "bec2c41e-1fd3-4d9f-b546-2bd5392c1015": "ipad-4",
    "ba50da08-5dd8-4e9b-b6fa-5bb7b2413a28": "ipad-5",
    "2bce34fb-9797-4507-bdb2-2ccf5609aa22": "ipad-6",
    "1a2ba7e0-2da2-47ae-a44e-1f13087d54e3": "ipad-7",

    // Present in the example export but not in your device lookup table:
    "d7bc152d-261e-4ae1-b606-a4beac130e1e": "unknown-device",
} as const;

export const BOAT_ID_TO_NAME = {
    "3fa85f64-5717-4562-b3fc-2c963f66afa6": "CETI 1",
    "4fa85f64-5717-4562-b3fc-2c963f66afa6": "CETI 2",
    "5fa85f64-5717-4562-b3fc-2c963f66afa6": "CETI 3",
    "4db11910-37ba-103b-a3bf-019a99b169db": "Training",
} as const;

const UuidSchema = z.uuid();
const DateTimeSchema = z.coerce.date();

type LookupTable = Record<string, string>;

function lookup<T extends LookupTable>(
    table: T,
    id: string,
): T[keyof T] | string {
    return table[id] ?? id;
}

export function translateKnownId(id: string): string {
    return lookup(USER_ID_TO_NAME, id) !== id
        ? lookup(USER_ID_TO_NAME, id)
        : lookup(DEVICE_ID_TO_NAME, id) !== id
          ? lookup(DEVICE_ID_TO_NAME, id)
          : lookup(BOAT_ID_TO_NAME, id) !== id
            ? lookup(BOAT_ID_TO_NAME, id)
            : lookup(EVENT_FORM_ID_TO_TYPE, id) !== id
              ? lookup(EVENT_FORM_ID_TO_TYPE, id)
              : id;
}

export function translateKnownIdsInValue(value: unknown): unknown {
    if (typeof value === "string") return translateKnownId(value);

    if (Array.isArray(value)) {
        return value.map((item) => translateKnownIdsInValue(item));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [
                translateKnownId(key),
                translateKnownIdsInValue(item),
            ]),
        );
    }

    return value;
}

function getEventType(
    fieldTripEventFormId: string,
    fieldTripEventFormName: string,
): string {
    return (
        EVENT_FORM_ID_TO_TYPE[
            fieldTripEventFormId as keyof typeof EVENT_FORM_ID_TO_TYPE
        ] ??
        EVENT_FORM_NAME_TO_TYPE[
            fieldTripEventFormName as keyof typeof EVENT_FORM_NAME_TO_TYPE
        ] ??
        "UnknownEvent"
    );
}

function normalizeFieldCode(fieldCode: string): string {
    return fieldCode.trim();
}

/**
 * Some numeric fields in the export are strings: "0", "1", "20", "1506.634".
 * This helper is useful in downstream typed event schemas.
 */
export function maybeNumber(value: unknown): unknown {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (trimmed === "") return value;

    const number = Number(trimmed);
    return Number.isFinite(number) ? number : value;
}

/**
 * JSON value schema.
 */

const JsonPrimitiveSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
]);

export type JsonValue =
    | z.infer<typeof JsonPrimitiveSchema>
    | JsonValue[]
    | { [key: string]: JsonValue };

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
    z.union([
        JsonPrimitiveSchema,
        z.array(JsonValueSchema),
        z.record(z.string(), JsonValueSchema),
    ]),
);

export const RawEventFieldSchema = z.looseObject({
    value: JsonValueSchema.optional(),
    createdAt: DateTimeSchema,
    updatedAt: DateTimeSchema,
    fieldCode: z.string(),
});

export type RawEventField = z.infer<typeof RawEventFieldSchema>;

export const FieldTripSchema = z
    .looseObject({
        boatName: z.string(),
        fieldTripStartDateUtc: DateTimeSchema,
        fieldTripEndDateUtc: DateTimeSchema,
        exportDateUtc: DateTimeSchema,

        fieldTripId: UuidSchema,
        boatId: UuidSchema,
        headOfFieldTripUserId: UuidSchema,

        fieldTripState: z.string(),
        memberIds: z.array(UuidSchema),
    })
    .transform((fieldTrip) => ({
        ...fieldTrip,
        boat: {
            id: fieldTrip.boatId,
            name: lookup(BOAT_ID_TO_NAME, fieldTrip.boatId),
        },

        headOfFieldTripUser: {
            id: fieldTrip.headOfFieldTripUserId,
            name: lookup(USER_ID_TO_NAME, fieldTrip.headOfFieldTripUserId),
        },

        members: fieldTrip.memberIds.map((id) => ({
            id,
            name: lookup(USER_ID_TO_NAME, id),
        })),
    }));

export const RawEventSchema = z
    .looseObject({
        fieldTripEventFormName: z.string(),
        fieldTripEventId: UuidSchema,
        fieldTripId: UuidSchema,
        fieldTripEventFormId: UuidSchema,

        deviceId: UuidSchema,

        longitude: z.coerce.number(),
        latitude: z.coerce.number(),
        dateUtc: DateTimeSchema,

        data: z.record(UuidSchema, RawEventFieldSchema).default({}),
    })
    .transform((event) => {
        const eventType = getEventType(
            event.fieldTripEventFormId,
            event.fieldTripEventFormName,
        );

        const fields = Object.fromEntries(
            Object.entries(event.data).map(([fieldId, field]) => {
                const fieldCode = normalizeFieldCode(field.fieldCode);

                return [
                    fieldCode,
                    {
                        fieldId,
                        value: field.value,
                        createdAt: field.createdAt,
                        updatedAt: field.updatedAt,
                    },
                ];
            }),
        );

        return {
            ...event,

            eventType,

            device: {
                id: event.deviceId,
                name: lookup(DEVICE_ID_TO_NAME, event.deviceId),
            },

            /**
             * Nice semantic version:
             *
             * event.fields.ClusterNumber.value
             * event.fields.TimeOfPhoto.value
             * event.fields.NumberOfAdults.value
             */
            fields,
        };
    });

export type ApiEvent = z.infer<typeof RawEventSchema>;

/**
 * -----------------------------
 * Locations
 * -----------------------------
 */

export const LocationSchema = z
    .looseObject({
        fieldTripLocationId: UuidSchema,
        dateUtc: DateTimeSchema,
        longitude: z.coerce.number(),
        latitude: z.coerce.number(),
        deviceId: UuidSchema,
    })
    .transform((location) => ({
        ...location,
        device: {
            id: location.deviceId,
            name: lookup(DEVICE_ID_TO_NAME, location.deviceId),
        },
    }));

/**
 * -----------------------------
 * Whole API export
 * -----------------------------
 */

export const ApiExportSchema = z.object({
    fieldTrip: FieldTripSchema,
    events: z.array(RawEventSchema),
    locations: z.array(LocationSchema),
});

export type ApiExport = z.infer<typeof ApiExportSchema>;
