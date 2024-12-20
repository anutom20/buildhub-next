"use client";
import { BsBank } from "react-icons/bs";
import { BiDetail, BiTargetLock } from "react-icons/bi";
import { GoGraph } from "react-icons/go";
import {
  IoChatboxOutline,
  IoDiamondOutline,
  IoExtensionPuzzleOutline,
  IoFlaskOutline,
  IoKeyOutline,
} from "react-icons/io5";
import {
  IoIosSearch,
  IoIosCheckmarkCircleOutline,
  IoIosSettings,
} from "react-icons/io";
import { FaBook, FaChartSimple, FaRegLightbulb, FaUser } from "react-icons/fa6";
import { GrMenu, GrReddit } from "react-icons/gr";
import { FaProjectDiagram, FaHammer, FaBrain } from "react-icons/fa";
import { SlRocket } from "react-icons/sl";
import { RiWechat2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import { MdOutlineCable, MdSupportAgent } from "react-icons/md";
import { GoGoal } from "react-icons/go";
import { MdGroups2 } from "react-icons/md";
import { TbLayersDifference, TbPlant, TbTargetArrow } from "react-icons/tb";
import { PiFlowArrowFill, PiRocketLaunch } from "react-icons/pi";
import {
  CiCalendar,
  CiGlobe,
  CiTrophy,
  CiUser,
  CiWarning,
} from "react-icons/ci";
import { GiOpenPalm } from "react-icons/gi";
import { HiOutlinePuzzlePiece } from "react-icons/hi2";
import { TfiReload } from "react-icons/tfi";
import { LuScaling } from "react-icons/lu";

const iconSize = 24;

const viewNames = {
  /* Main */
  OVERVIEW: "overview",
  CHATS: "chats",
  TASKS: "tasks",
  CENTRAL_CONTEXT_BANK: "centralContextBank",
  /* Phases */
  IDENTIFY_A_NEED: "identifyANeed",
  VALIDATE_THE_NEED: "validateTheNeed",
  SOLUTION_IDEATION: "solutionIdeation",
  AUDIENCE_TARGETING: "audienceTargeting",
  MARKET_VALIDATION: "marketValidation",
  MVP_FEATURES: "mVPFeatures",
  MVP_DEVELOPMENT: "mVPDevelopment",
  MVP_LAUNCH: "mVPLaunch",
  POST_LAUNCH: "postLaunch",

  /* Others */
  SUPPORT: "support",
  FEEDBACK: "feedback",
};

const mainSectionItems = [
  { icon: <BiDetail />, text: "Overview", name: viewNames.OVERVIEW },
  { icon: <IoChatboxOutline />, text: "Chats", name: viewNames.CHATS },
  {
    icon: <BsBank />,
    text: "Central Context Bank",
    name: viewNames.CENTRAL_CONTEXT_BANK,
  },
];

const phasesSectionItems = [
  {
    icon: <IoIosSearch />,
    text: "Identify a need",
    name: viewNames.IDENTIFY_A_NEED,
  },
  {
    icon: <IoIosCheckmarkCircleOutline />,
    text: "Validate the need",
    name: viewNames.VALIDATE_THE_NEED,
  },
  {
    icon: <FaRegLightbulb />,
    text: "Solution ideation",
    name: viewNames.SOLUTION_IDEATION,
  },
  {
    icon: <BiTargetLock />,
    text: "Audience Targeting",
    name: viewNames.AUDIENCE_TARGETING,
  },
  {
    icon: <GoGraph />,
    text: "Market validation",
    name: viewNames.MARKET_VALIDATION,
  },
  {
    icon: <GrMenu />,
    text: "Define MVP Features",
    name: viewNames.MVP_FEATURES,
  },
  {
    icon: <FaProjectDiagram />,
    text: "Plan MVP Development",
    name: viewNames.MVP_DEVELOPMENT,
  },
  { icon: <SlRocket />, text: "Plan MVP Launch", name: viewNames.MVP_LAUNCH },
  {
    icon: <RiWechat2Line />,
    text: "Post-launch actions",
    name: viewNames.POST_LAUNCH,
  },
];

const otherSectionItems = [
  { icon: <MdSupportAgent />, text: "Support", name: viewNames.SUPPORT },
  { icon: <VscFeedback />, text: "Feedback", name: viewNames.FEEDBACK },
];

const identifyANeedItems = [
  {
    icon: <GoGoal size={iconSize} />,
    heading: "Define the problem",
    desc: "Have a clearly articulated pain point.",
    special: false,
  },
  {
    icon: <MdGroups2 size={iconSize} />,
    heading: "Identify affected groups",
    desc: "Initial ideas about who might be experiencing this problem.",
    special: false,
  },
  {
    icon: <FaBrain size={iconSize} />,
    heading: "Reasoning",
    desc: "Brainstorm ideas for problems and pain points using our reasoning AI.",
    special: true,
  },
];

const validateTheNeedItems = [
  {
    icon: <IoIosCheckmarkCircleOutline size={iconSize} />,
    heading: "Evidence",
    desc: "Proof that the problem impacts many people.",
    special: false,
  },
  {
    icon: <IoIosSearch size={iconSize} />,
    heading: "Insights",
    desc: "See how people are trying to solve the problem.",
    special: false,
  },
  {
    icon: <TbPlant size={iconSize} />,
    heading: "Confirm potential",
    desc: "Confidence that solving the need has market potential.",
    special: false,
  },
  {
    icon: <GrReddit size={iconSize} />,
    heading: "Reddit API",
    desc: "Search for posts related to your need to get an early understanding of market demand.",
    special: true,
  },
];

const solutionIdeationItems = [
  {
    icon: <IoExtensionPuzzleOutline size={iconSize} />,
    heading: "Define a solution",
    desc: "A clearly defined solution that addresses the need.",
    special: false,
  },
  {
    icon: <PiFlowArrowFill size={iconSize} />,
    heading: "Basic Outline",
    desc: "A basic outline of how your solution will work.",
    special: false,
  },
  {
    icon: <TbLayersDifference size={iconSize} />,
    heading: "Differentiation",
    desc: "Clarify how your solution is different from existing alternatives.",
    special: false,
  },
  {
    icon: <FaBrain size={iconSize} />,
    heading: "Reasoning",
    desc: "Brainstorm potential solutions to the validated need using our reasoning AI.",
    special: true,
  },
];

const audienceTargetingItems = [
  {
    icon: <CiUser size={iconSize} />,
    heading: "Ideal customer profile",
    desc: "A clear definition of your ideal customer.",
    special: false,
  },
  {
    icon: <TbTargetArrow size={iconSize} />,
    heading: "Audience insights",
    desc: "A deeper understanding of your target audience.",
    special: false,
  },
  {
    icon: <CiTrophy size={iconSize} />,
    heading: "Pain points and goals",
    desc: "Identify the specific pain points and goals of your target audience.",
    special: false,
  },
  {
    icon: <FaUser size={iconSize} />,
    heading: "User persona",
    desc: "Create a detailed user persona based on your target audience.",
    special: true,
  },
];

const marketValidationItems = [
  {
    icon: <GoGraph size={iconSize} />,
    heading: "Market confidence",
    desc: "Confirmation there's a viable market for your product.",
    special: false,
  },
  {
    icon: <FaChartSimple size={iconSize} />,
    heading: "Data on interest",
    desc: "Collect real data showing demand for your solution.",
    special: false,
  },
  {
    icon: <GiOpenPalm size={iconSize} />,
    heading: "Willingness to pay",
    desc: "Understand potential customers' readiness to pay.",
    special: false,
  },
];

const mVPFeaturesItems = [
  {
    icon: <IoKeyOutline size={iconSize} />,
    heading: "List core features",
    desc: "Prioritize and list the 3-5 key core features of your MVP.",
    special: false,
  },
  {
    icon: <IoDiamondOutline size={iconSize} />,
    heading: "MVP value proposition",
    desc: "A solid explanation of how your MVP delivers value to users.",
    special: false,
  },
];

const mVPDevelopmentItems = [
  {
    icon: <MdOutlineCable size={iconSize} />,
    heading: "MVP timeline",
    desc: "A basic timeline with key milestones for MVP development.",
    special: false,
  },
  {
    icon: <FaBook size={iconSize} />,
    heading: "Resource planning",
    desc: "Understand the resources needed for building your MVP.",
    special: false,
  },
  {
    icon: <CiWarning size={iconSize} />,
    heading: "Challenges & risks",
    desc: "Identify potential challenges and risks in the development process.",
    special: false,
  },
];

const mVPLaunchItems = [
  {
    icon: <PiRocketLaunch size={iconSize} />,
    heading: "Launch Strategy",
    desc: "A clear plan for introducing your MVP to your target audience.",
    special: false,
  },
  {
    icon: <CiGlobe size={iconSize} />,
    heading: "Marketing channels",
    desc: "Identify the channels you will use to reach potential users.",
    special: false,
  },
  {
    icon: <CiCalendar size={iconSize} />,
    heading: "Launch timeline",
    desc: "A timeline for executing your launch activities.",
    special: false,
  },
];

const postLaunchItems = [
  {
    icon: <VscFeedback size={iconSize} />,
    heading: "Feedback system",
    desc: "A process for collecting and analyzing user feedback.",
    special: false,
  },
  {
    icon: <TfiReload size={iconSize} />,
    heading: "Improvement plan",
    desc: "Identify the key areas for iteration and improvement.",
    special: false,
  },
  {
    icon: <LuScaling size={iconSize} />,
    heading: "Scaling strategy",
    desc: "A plan in place for scaling and growing your product.",
    special: false,
  },
];

const initialChatMessage = {
  identifyANeed: {
    user: "",
    bot: "Hey there , i am here to help you identify the need , this is the 1st step , start by telling me your name",
  },
  validateTheNeed: {
    user: "",
    bot: "Hey there , i am here to help you validate the need  , this is the 2nd step , tell me if you're ready to begin",
  },
  solutionIdeation: {
    user: "",
    bot: "Hey there , i am here to help you with the solution ideation  , this is the 3rd step , tell me if you're ready to begin",
  },
  audienceTargeting: {
    user: "",
    bot: "Hey there , i am here to help you with the audience targeting  , this is the 4th step , tell me if you're ready to begin. We will also be creating your user persona in this step",
  },
  marketValidation: {
    user: "",
    bot: "Hey there , i am here to help you with market validation  , this is the 5th step , tell me if you're ready to begin",
  },
  mVPFeatures: {
    user: "",
    bot: "Hey there , i am here to help you with defining the mVP features  , this is the 6th step , tell me if you're ready to begin",
  },
  mVPDevelopment: {
    user: "",
    bot: "Hey there , i am here to help you plan the MVP development  , this is the 7th step , tell me if you're ready to begin",
  },
  mVPLaunch: {
    user: "",
    bot: "Hey there , i am here to help you plan the MVP launch  , this is the 8th step , tell me if you're ready to begin",
  },
  postLaunch: {
    user: "",
    bot: "Hey there , i am here to help you with post-launch actions  , this is the 9th step , tell me if you're ready to begin",
  },
};

const phaseItemsMapping = {
  identifyANeed: identifyANeedItems,
  validateTheNeed: validateTheNeedItems,
  solutionIdeation: solutionIdeationItems,
  audienceTargeting: audienceTargetingItems,
  marketValidation: marketValidationItems,
  mVPFeatures: mVPFeaturesItems,
  mVPDevelopment: mVPDevelopmentItems,
  mVPLaunch: mVPLaunchItems,
  postLaunch: postLaunchItems,
};

const phaseNamesMapping = {
  identifyANeed: "Identify A Need",
  validateTheNeed: "Validate The Need",
  solutionIdeation: "Solution Ideation",
  audienceTargeting: "Audience Targeting",
  marketValidation: "Market Validation",
  mVPFeatures: "MVP Features",
  mVPDevelopment: "MVP Development",
  mVPLaunch: "MVP Launch",
  postLaunch: "Post Launch",
};

export {
  initialChatMessage,
  mainSectionItems,
  phasesSectionItems,
  otherSectionItems,
  phaseItemsMapping,
  phaseNamesMapping,
  viewNames,
};
