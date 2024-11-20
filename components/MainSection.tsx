"use client";
import React from "react";
import Phases from "./main/phases/Phases";
import { useAppSelector } from "@/lib/hooks";
import { phaseItemsMapping, viewNames } from "./Static";

const MainSection = () => {
  const currentViewId = useAppSelector((state) => state.general.currentViewId);
  const currentProject = useAppSelector(
    (state) => state.project.currentProject
  );

  return (
    <main className="w-full min-h-screen h-full px-6 py-8 blur-background h-screen overflow-y-auto">
      {currentViewId === viewNames.IDENTIFY_A_NEED ? (
        <Phases
          heading="Identify a need"
          items={phaseItemsMapping["identifyANeed"]}
          chatName={viewNames.IDENTIFY_A_NEED}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.VALIDATE_THE_NEED ? (
        <Phases
          heading="Validate the need"
          items={phaseItemsMapping["validateTheNeed"]}
          chatName={viewNames.VALIDATE_THE_NEED}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.SOLUTION_IDEATION ? (
        <Phases
          heading="Solution ideation"
          items={phaseItemsMapping["solutionIdeation"]}
          chatName={viewNames.SOLUTION_IDEATION}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.AUDIENCE_TARGETING ? (
        <Phases
          heading="Audience Targeting"
          items={phaseItemsMapping["audienceTargeting"]}
          chatName={viewNames.AUDIENCE_TARGETING}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.MARKET_VALIDATION ? (
        <Phases
          heading="Market Validation"
          items={phaseItemsMapping["marketValidation"]}
          chatName={viewNames.MARKET_VALIDATION}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.MVP_FEATURES ? (
        <Phases
          heading="Define MVP Features"
          items={phaseItemsMapping["mVPFeatures"]}
          chatName={viewNames.MVP_FEATURES}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.MVP_DEVELOPMENT ? (
        <Phases
          heading="Plan MVP Development"
          items={phaseItemsMapping["mVPDevelopment"]}
          chatName={viewNames.MVP_DEVELOPMENT}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.BUILD_MVP ? (
        <Phases
          heading="Build MVP"
          items={phaseItemsMapping["buildMVP"]}
          chatName={viewNames.BUILD_MVP}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.MVP_LAUNCH ? (
        <Phases
          heading="Plan MVP Launch"
          items={phaseItemsMapping["mVPLaunch"]}
          chatName={viewNames.MVP_LAUNCH}
          curProjectId={currentProject?.id}
        />
      ) : currentViewId === viewNames.POST_LAUNCH ? (
        <Phases
          heading="Post-launch actions"
          items={phaseItemsMapping["postLaunch"]}
          chatName={viewNames.POST_LAUNCH}
          curProjectId={currentProject?.id}
        />
      ) : (
        ""
      )}
    </main>
  );
};

export default MainSection;
