"use client";
import React from "react";
import Phases from "./main/phases/Phases";
import { useAppSelector } from "@/lib/hooks";
import { phaseItemsMapping, viewNames } from "./static";

const MainSection = () => {
  const currentViewId = useAppSelector((state) => state.general.currentViewId);

  return (
    <main className="w-full min-h-screen h-full px-6 py-8 blur-background">
      {currentViewId === viewNames.IDENTIFY_A_NEED ? (
        <Phases
          heading="Identify a need"
          items={phaseItemsMapping["identifyANeed"]}
          chatName={viewNames.IDENTIFY_A_NEED}
        />
      ) : currentViewId === viewNames.VALIDATE_THE_NEED ? (
        <Phases
          heading="Validate the need"
          items={phaseItemsMapping["validateTheNeed"]}
          chatName={viewNames.VALIDATE_THE_NEED}
        />
      ) : currentViewId === viewNames.SOLUTION_IDEATION ? (
        <Phases
          heading="Solution ideation"
          items={phaseItemsMapping["solutionIdeation"]}
          chatName={viewNames.SOLUTION_IDEATION}
        />
      ) : currentViewId === viewNames.AUDIENCE_TARGETING ? (
        <Phases
          heading="Audience Targeting"
          items={phaseItemsMapping["audienceTargeting"]}
          chatName={viewNames.AUDIENCE_TARGETING}
        />
      ) : currentViewId === viewNames.MARKET_VALIDATION ? (
        <Phases
          heading="Market Validation"
          items={phaseItemsMapping["marketValidation"]}
          chatName={viewNames.MARKET_VALIDATION}
        />
      ) : currentViewId === viewNames.MVP_FEATURES ? (
        <Phases
          heading="Define MVP Features"
          items={phaseItemsMapping["mVPFeatures"]}
          chatName={viewNames.MVP_FEATURES}
        />
      ) : currentViewId === viewNames.MVP_DEVELOPMENT ? (
        <Phases
          heading="Plan MVP Development"
          items={phaseItemsMapping["mVPDevelopment"]}
          chatName={viewNames.MVP_DEVELOPMENT}
        />
      ) : currentViewId === viewNames.BUILD_MVP ? (
        <Phases
          heading="Build MVP"
          items={phaseItemsMapping["buildMVP"]}
          chatName={viewNames.BUILD_MVP}
        />
      ) : currentViewId === viewNames.MVP_LAUNCH ? (
        <Phases
          heading="Plan MVP Launch"
          items={phaseItemsMapping["mVPLaunch"]}
          chatName={viewNames.MVP_LAUNCH}
        />
      ) : currentViewId === viewNames.POST_LAUNCH ? (
        <Phases
          heading="Post-launch actions"
          items={phaseItemsMapping["postLaunch"]}
          chatName={viewNames.POST_LAUNCH}
        />
      ) : (
        ""
      )}
    </main>
  );
};

export default MainSection;
