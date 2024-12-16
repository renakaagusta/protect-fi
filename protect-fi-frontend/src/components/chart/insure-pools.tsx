"use client";

import React from "react";
import { InsureTVL } from "./insure-tvl";
import { InsureVolume } from "./insure-volume";

export default function InsurePools() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <InsureTVL />
            <InsureVolume />
        </div>
    );
}
