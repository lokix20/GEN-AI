import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { DiseaseReportDTO } from "@haritha/shared-types";
import { analyzeCropImage } from "../../features/disease-detection/api.js";
import { getApiErrorMessage } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";

/** Extract the crop name from a plot label like "Plot A - Paddy" → "Paddy" */
function extractCropName(plotLabel: string): string {
  const parts = plotLabel.split("-");
  return parts.length > 1 ? parts[parts.length - 1].trim() : plotLabel.trim();
}

const SEVERITY_CONFIG = {
  healthy:  { label: "Healthy",         dot: "bg-green-500",  text: "text-green-700",  badge: "bg-green-100 text-green-800" },
  low:      { label: "Low Severity",    dot: "bg-yellow-400", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" },
  moderate: { label: "Moderate",        dot: "bg-orange-400", text: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
  high:     { label: "High Severity",   dot: "bg-red-500",    text: "text-red-700",    badge: "bg-red-100 text-red-800" },
  critical: { label: "Critical",        dot: "bg-red-700",    text: "text-red-900",    badge: "bg-red-200 text-red-900" },
} as const;

function formatActWithin(hours: number): string {
  if (hours >= 168) return `${Math.round(hours / 24)} days`;
  if (hours >= 48) return `${Math.round(hours / 24)} days`;
  return `${hours} hours`;
}
