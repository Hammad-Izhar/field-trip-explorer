import type { ApiEvent, ApiExport } from "@/lib/parser";

export type ParsedFile =
    | {
          status: "loading";
          file: File;
      }
    | {
          status: "valid";
          file: File;
          data: ApiExport;
      }
    | {
          status: "invalid";
          file: File;
          errorTitle: string;
          errorMessages: string[];
      };

export type EventTimelineItem = {
    key: string;
    event: ApiEvent;
    fileName: string;
};

export type LocationTimelineItem = {
    location: ApiExport["locations"][number];
    fileName: string;
    key: string;
};
