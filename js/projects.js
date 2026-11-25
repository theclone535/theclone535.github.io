/* =============================================================
   EDIT THIS FILE TO UPDATE YOUR PORTFOLIO
   You shouldn't need to touch index.html, main.js or style.css
   to add, remove or change projects.
   ============================================================= */

const SITE = {
  name: "Connor",
  tagline: "Game Programmer for games, and tools",
  intro:
    "Game development student in Australia. I work in Unreal Engine 5 and Unity, across C++, Blueprints, C# and Python.",

  // Each string is one paragraph in the About section.
  about: [
    "I'm studying game development and like working on the systems side of games: enemy AI, gameplay mechanics, and editor tools that save artists and designers time.",
    "Most of my recent work is in Unreal Engine 5, on both solo and team projects. Before that I built and shipped small games in Unity.",
  ],

  skills: {
    Engines: ["Unreal Engine 5", "Unity"],
    Languages: ["C++", "Blueprints", "C#", "Python"],
    "Comfortable with": ["Behavior Trees", "Editor tools", "Spline tools", "Publishing on itch.io"],
  },

  // Leave url as "" to hide a row.
  contact: [
    { label: "Email",   text: "Larkamconnor@gmail.com",           url: "mailto:larkamconnor@gmail.com" },
    { label: "itch.io", text: "theclone535.itch.io",         url: "https://theclone535.itch.io" },
    { label: "GitHub",  text: "github.com/theclone535",  url: "https://github.com/theclone535" },
    { label: "LinkedIn", text: "linkedin.com/Connor-larkam", url: "https://www.linkedin.com/in/connor-larkam-327b02390/" },
  ],
};

/* Filter buttons above the project list.
   A project shows under a filter if its `filters` list contains that id. */
const FILTERS = [
  { id: "all",    label: "All" },
  { id: "unreal", label: "Unreal" },
  { id: "unity",  label: "Unity" },
  { id: "tools",  label: "Tools" },
];

/* PROJECTS
   Order here = order on the page. Fields:
     title      Project name
     engine     Shown next to the title in the list
     year       "" to hide
     role       What you did / solo or team
     builtWith  List of languages, tools, systems
     filters    Which filter buttons it appears under
     summary    One or two sentences: what it is
     points     Bullet list: what YOU did
     image      Path to a screenshot, e.g. "images/foster-dogs.jpg" ("" shows a placeholder)
     youtube    YouTube video ID (the part after watch?v=), shown in the project window
     links      Buttons, e.g. { label: "Play on itch.io", url: "https://..." } ("" url hides it)
     credits    Optional small print, e.g. music attribution
     color      Placeholder colour used until you add an image
*/
const PROJECTS = [
  {
    title: "Foster Dogs",
    engine: "Unreal Engine 5",
    year: "2026",
    role: "AI programmer, team project",
    builtWith: ["C++", "Blueprints", "Behavior Trees"],
    filters: ["unreal"],
    summary:
      "A horror game where a demon dog hunts you through your own house. You keep it in check with a handheld console, playing minigames to manage its hunger, loneliness and anger.",
    points: [
      "Joined the team mid-development to fix and extend the demon dog's AI.",
      "Built an idle timer that tracks how long the player has been hiding, so the dog can narrow in on their location and start checking nearby rooms.",
      "increased the dogs behaviours so that it can sniff, hear, destroy hiding spots and has its stats enhanced when you don't keep it under control.",
    ],
    image: "",
    youtube: "",
    links: [{label: "Play on itch.io", url: "https://hotdogscc.itch.io/foster-dogs" },],
    credits: "",
    color: "#3A2C3E",
  },
  {
    title: "A Lone Adventure",
    engine: "Unity",
    year: "2023",
    role: "Solo developer",
    builtWith: ["C#", "2D"],
    filters: ["unity"],
    summary:
      "A free 2D platformer about a knight climbing up through a dungeon. There are no enemies, only traps.",
    points: [
      "Designed and built the whole game on my own in Unity.",
      "Built every challenge out of trap placement and platforming, with no enemies.",
      "Published it on itch.io, where it's free to play.",
    ],
    image: "",
    youtube: "",
    links: [
      { label: "Play on itch.io", url: "https://theclone535.itch.io/a-lone-adventure" }, // paste your itch.io game link here
    ],
    credits: "Music: Eric Skiff - A Night Of Dizzy Spells - Available at http://EricSkiff.com/music",
    color: "#3D4A2B",
  },
  {
    title: "Shop Interior Generator",
    engine: "Unreal Engine 5",
    year: "2026",
    role: "Solo, editor tool",
    builtWith: ["Blueprints", "Splines", "Editor utilities"],
    filters: ["unreal", "tools"],
    summary:
      "An editor tool that dresses a shop interior for you. Draw the floor plan with a spline, press a button, and it fills the space with shelf rows, stock and a checkout counter.",
    points: [
      "Built entirely in Blueprints, with editor buttons and input validation.",
      "Lays out shelf rows inside the spline footprint and places randomised items on every shelf.",
      "Made for level designers who need lots of shop interiors without hand-placing every prop.",
    ],
    image: "",
    youtube: "",
    links: [],
    credits: "",
    color: "#4A3A22",
  },
  {
    title: "Maya Line-Up Tool",
    engine: "Autodesk Maya",
    year: "2026",
    role: "Solo, pipeline tool",
    builtWith: ["Python"],
    filters: ["tools"],
    summary:
      "A scene clean-up script for Maya that lines up selected objects from the origin, so cluttered scenes are quick to sort and review.",
    points: [
      "Lines up any selection from the world origin with adjustable spacing.",
      "Supports start or centre alignment.",
      "Kept small in scope on purpose, and documented in a technical report.",
    ],
    image: "",
    youtube: "",
    links: [],
    credits: "",
    color: "#2E3F3C",
  },
  {
    title: "Dweezil",
    engine: "Unreal Engine 5",
    year: "2025",
    role: "Gameplay Mechanics Programmer, team project",
    builtWith: ["Blueprints"],
    filters: ["unreal"],
    summary:
      "A 3D roguelike board game built around Yahtzee. Each turn you roll five dice, and that same roll decides both your score and how far you move, so every roll counts twice.",
    points: [
      "Programmed the dice system in Blueprints: rolling five dice and scoring combinations on a Yahtzee-style scorecard",
      "Added power-ups and board events that give players more ways to build a high-scoring run.",
      "Programmed the dice system in Blueprints: rolling five dice and scoring combinations on a Yahtzee-style scorecard",
    ],
    image: "",
    youtube: "",
    links: [{ label: "Play on itch.io", url: "https://ellacoco.itch.io/dweezil" }],
    credits: "",
    color: "#2F3550",
  },
];
