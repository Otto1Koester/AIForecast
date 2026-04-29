import { MethodologyAiApproach } from "@/components/methodology/MethodologyAiApproach";
import { MethodologyDataFlow } from "@/components/methodology/MethodologyDataFlow";
import { MethodologyForecasting } from "@/components/methodology/MethodologyForecasting";
import { MethodologyHero } from "@/components/methodology/MethodologyHero";
import { MethodologyMvpLimitations } from "@/components/methodology/MethodologyMvpLimitations";
import { MethodologyProductSurface } from "@/components/methodology/MethodologyProductSurface";
import { MethodologyReorder } from "@/components/methodology/MethodologyReorder";
import { MethodologyRisks } from "@/components/methodology/MethodologyRisks";
import { MethodologyRoadmap } from "@/components/methodology/MethodologyRoadmap";

export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <MethodologyHero />
      <MethodologyDataFlow />
      <MethodologyAiApproach />
      <MethodologyForecasting />
      <MethodologyReorder />
      <MethodologyRisks />
      <MethodologyProductSurface />
      <MethodologyMvpLimitations />
      <MethodologyRoadmap />
    </div>
  );
}
