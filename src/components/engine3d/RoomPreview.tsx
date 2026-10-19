"use client";

import { RoomStudio } from "./RoomStudio";

export function RoomPreview() {
  return (
    <RoomStudio
      showVendorBar={false}
      canvasHeightClass="h-[380px] lg:min-h-[440px]"
    />
  );
}

