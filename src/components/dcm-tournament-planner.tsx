"use client";

import { useEffect, useMemo, useState } from "react";

import { SectionTitle } from "@/components/section-title";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type TournamentMode = "singles" | "doubles";
type ScoringMode = "best-of-3" | "29-points";

type DrawTeam = {
  id: string;
  label: string;
  members: string[];
};

type Fixture = {
  id: string;
  sideA: string;
  sideB: string;
  note?: string;
};

type KnockoutMatch = {
  id: string;
  label: string;
  sideA: string;
  sideB: string;
  note?: string;
};

type KnockoutRound = {
  id: string;
  name: string;
  matches: KnockoutMatch[];
};

const STORAGE_KEY = "dcm-carrom-player-bank";
const starterNames = [
  "Akhil",
  "Vivendra",
  "Sai",
  "Dinesh",
  "Mahesh",
  "Devika",
  "Sneha",
  "Arshad",
  "Ajay",
  "Faisal"
];

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function mergeWithStarterNames(names: string[]) {
  return Array.from(new Set([...starterNames, ...names]));
}

function shuffleNames(values: string[]) {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function buildSinglesFixtures(names: string[]) {
  const shuffled = shuffleNames(names);
  const fixtures: Fixture[] = [];

  for (let index = 0; index < shuffled.length; index += 2) {
    const sideA = shuffled[index];
    const sideB = shuffled[index + 1];

    if (sideB) {
      fixtures.push({ id: `singles-${index}`, sideA, sideB });
    } else {
      fixtures.push({
        id: `singles-${index}`,
        sideA,
        sideB: "Bye",
        note: `${sideA} gets a bye this round`
      });
    }
  }

  return {
    teams: shuffled.map((name, index) => ({
      id: `single-${index}`,
      label: name,
      members: [name]
    })),
    fixtures,
    waitingList: [] as string[]
  };
}

function buildDoublesDraw(names: string[]) {
  const shuffled = shuffleNames(names);
  const teams: DrawTeam[] = [];
  const waitingList: string[] = [];

  for (let index = 0; index < shuffled.length; index += 2) {
    const first = shuffled[index];
    const second = shuffled[index + 1];

    if (first && second) {
      teams.push({
        id: `team-${index}`,
        label: `${first} & ${second}`,
        members: [first, second]
      });
    } else if (first) {
      waitingList.push(first);
    }
  }

  const fixtures: Fixture[] = [];

  for (let index = 0; index < teams.length; index += 2) {
    const sideA = teams[index];
    const sideB = teams[index + 1];

    if (sideB) {
      fixtures.push({
        id: `doubles-${index}`,
        sideA: sideA.label,
        sideB: sideB.label
      });
    } else {
      fixtures.push({
        id: `doubles-${index}`,
        sideA: sideA.label,
        sideB: "Bye",
        note: `${sideA.label} waits for the next round`
      });
    }
  }

  return { teams, fixtures, waitingList };
}

function getRoundName(participantSlots: number) {
  if (participantSlots <= 2) {
    return "Final";
  }

  if (participantSlots === 4) {
    return "Semifinal";
  }

  if (participantSlots === 8) {
    return "Quarterfinal";
  }

  if (participantSlots === 16) {
    return "Round of 16";
  }

  if (participantSlots === 32) {
    return "Round of 32";
  }

  return `Round of ${participantSlots}`;
}

function isPowerOfTwo(value: number) {
  return value > 0 && (value & (value - 1)) === 0;
}

function buildRoundSequence(
  seededEntries: string[],
  rounds: KnockoutRound[],
  roundPrefix: string
) {
  let currentEntries = [...seededEntries];
  let roundNumber = rounds.length + 1;

  while (currentEntries.length > 1) {
    const roundName = getRoundName(currentEntries.length);
    const matches: KnockoutMatch[] = [];
    const nextEntries: string[] = [];

    for (let matchIndex = 0; matchIndex < currentEntries.length; matchIndex += 2) {
      const matchNumber = matchIndex / 2 + 1;
      matches.push({
        id: `${roundPrefix}-${roundNumber}-match-${matchNumber}`,
        label: `Match ${matchNumber}`,
        sideA: currentEntries[matchIndex],
        sideB: currentEntries[matchIndex + 1]
      });

      if (currentEntries.length > 2) {
        nextEntries.push(`Winner of ${roundName} Match ${matchNumber}`);
      }
    }

    rounds.push({
      id: `${roundPrefix}-${roundNumber}`,
      name: roundName,
      matches
    });

    currentEntries = nextEntries;
    roundNumber += 1;
  }

  return rounds;
}

function buildKnockoutRounds(participants: string[]) {
  const totalParticipants = participants.length;
  const rounds: KnockoutRound[] = [];

  if (totalParticipants < 2) {
    return rounds;
  }

  if (isPowerOfTwo(totalParticipants)) {
    return buildRoundSequence(participants, rounds, "round");
  }

  const nextLowerPowerOfTwo = 2 ** Math.floor(Math.log2(totalParticipants));
  const preliminaryMatchCount = totalParticipants - nextLowerPowerOfTwo;
  const preliminaryParticipants = participants.slice(0, preliminaryMatchCount * 2);
  const byeParticipants = participants.slice(preliminaryMatchCount * 2);
  const preliminaryMatches: KnockoutMatch[] = [];

  for (let matchIndex = 0; matchIndex < preliminaryParticipants.length; matchIndex += 2) {
    const matchNumber = matchIndex / 2 + 1;
    preliminaryMatches.push({
      id: `round-1-match-${matchNumber}`,
      label: `Match ${matchNumber}`,
      sideA: preliminaryParticipants[matchIndex],
      sideB: preliminaryParticipants[matchIndex + 1]
    });
  }

  rounds.push({
    id: "round-1",
    name: "Preliminary",
    matches: preliminaryMatches
  });

  const nextRoundEntries = [
    ...byeParticipants,
    ...preliminaryMatches.map((match) => `Winner of Preliminary ${match.label}`)
  ];

  return buildRoundSequence(nextRoundEntries, rounds, "round");
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function DcmTournamentPlanner() {
  const [playerBank, setPlayerBank] = useState<string[]>(starterNames);
  const [newNames, setNewNames] = useState("");
  const [selectedNames, setSelectedNames] = useState<string[]>(starterNames);
  const [tournamentName, setTournamentName] = useState("DCM Carrom Tournament");
  const [tournamentMode, setTournamentMode] = useState<TournamentMode>("doubles");
  const [scoringMode, setScoringMode] = useState<ScoringMode>("best-of-3");
  const [drawTeams, setDrawTeams] = useState<DrawTeam[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [knockoutRounds, setKnockoutRounds] = useState<KnockoutRound[]>([]);
  const [waitingList, setWaitingList] = useState<string[]>([]);
  const [winner, setWinner] = useState("");
  const [runnerUp, setRunnerUp] = useState("");
  const [lastDrawTime, setLastDrawTime] = useState("");
  const [scheduleCopied, setScheduleCopied] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];

      if (Array.isArray(parsed) && parsed.length) {
        const mergedNames = mergeWithStarterNames(parsed);
        setPlayerBank(mergedNames);
        setSelectedNames(mergedNames);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeWithStarterNames(playerBank)));
  }, [playerBank]);

  const resultOptions = useMemo(() => {
    if (tournamentMode === "singles") {
      return selectedNames;
    }

    return drawTeams.map((team) => team.label);
  }, [drawTeams, selectedNames, tournamentMode]);

  function addNamesToBank() {
    const parsedNames = newNames
      .split("\n")
      .map(normalizeName)
      .filter(Boolean);

    if (!parsedNames.length) {
      return;
    }

    const nextBank = Array.from(new Set([...playerBank, ...parsedNames]));
    setPlayerBank(nextBank);
    setSelectedNames((current) => Array.from(new Set([...current, ...parsedNames])));
    setNewNames("");
  }

  function removeName(name: string) {
    setPlayerBank((current) => current.filter((item) => item !== name));
    setSelectedNames((current) => current.filter((item) => item !== name));
    setWinner((current) => (current === name ? "" : current));
    setRunnerUp((current) => (current === name ? "" : current));
  }

  function toggleSelection(name: string) {
    setSelectedNames((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  function generateDraw() {
    if (selectedNames.length < 2) {
      setDrawTeams([]);
      setFixtures([]);
      setKnockoutRounds([]);
      setWaitingList([]);
      setLastDrawTime("");
      return;
    }

    const result =
      tournamentMode === "singles"
        ? buildSinglesFixtures(selectedNames)
        : buildDoublesDraw(selectedNames);

    setDrawTeams(result.teams);
    setFixtures(result.fixtures);
    setKnockoutRounds(
      buildKnockoutRounds(
        tournamentMode === "singles"
          ? result.teams.map((team) => team.label)
          : result.teams.map((team) => team.label)
      )
    );
    setWaitingList(result.waitingList);
    setWinner("");
    setRunnerUp("");
    setLastDrawTime(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    );
  }

  function resetNameBank() {
    setPlayerBank(starterNames);
    setSelectedNames(starterNames);
    setDrawTeams([]);
    setFixtures([]);
    setKnockoutRounds([]);
    setWaitingList([]);
    setWinner("");
    setRunnerUp("");
    setLastDrawTime("");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterNames));
  }

  async function copyCompleteSchedule() {
    if (!knockoutRounds.length) {
      return;
    }

    const tournamentLabel = tournamentName || "DCM Carrom Tournament";
    const modeLabel = tournamentMode === "singles" ? "Singles" : "Doubles";
    const formatLabel = scoringMode === "best-of-3" ? "Best of 3" : "29 points";
    const scheduleText = [
      tournamentLabel,
      `${modeLabel} | ${formatLabel}`,
      "",
      ...knockoutRounds.flatMap((round) => [
        round.name,
        ...round.matches.map((match) => `${match.label}: ${match.sideA} vs ${match.sideB}`),
        ...round.matches
          .filter((match) => match.note)
          .map((match) => `Note: ${match.note}`),
        ""
      ])
    ]
      .join("\n")
      .trim();

    await navigator.clipboard.writeText(scheduleText);
    setScheduleCopied(true);
    window.setTimeout(() => setScheduleCopied(false), 2000);
  }

  async function downloadCelebrationCard(cardType: "winner" | "runner-up") {
    const subject = cardType === "winner" ? winner : runnerUp;

    if (!subject) {
      return;
    }

    const title = cardType === "winner" ? "Champion" : "Runner-up";
    const accentA = cardType === "winner" ? "#d9a441" : "#c7cedd";
    const accentB = cardType === "winner" ? "#c86b44" : "#8f7348";
    const accentC = cardType === "winner" ? "#fff2d2" : "#f5f7fb";
    const tournamentLabel = tournamentName || "DCM Carrom Tournament";
    const modeLabel = tournamentMode === "singles" ? "Singles" : "Doubles";
    const formatLabel = scoringMode === "best-of-3" ? "Best of 3" : "29 points";
    const safeSubject = escapeSvgText(subject);
    const safeTournament = escapeSvgText(tournamentLabel);
    const safeTitle = escapeSvgText(title);
    const safeMeta = escapeSvgText(`${modeLabel} | ${formatLabel}`);
    const safeHeadline = escapeSvgText(
      cardType === "winner" ? "Night of Champions" : "A Brilliant Finish"
    );
    const safeStamp = escapeSvgText(cardType === "winner" ? "No. 1 Finish" : "Grand Finalist");
    const safeFooter = escapeSvgText(
      cardType === "winner" ? "Celebration Poster" : "Finalist Celebration"
    );

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#121725" />
            <stop offset="50%" stop-color="#171f31" />
            <stop offset="100%" stop-color="#090c14" />
          </linearGradient>
          <radialGradient id="glowA" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stop-color="${accentA}" stop-opacity="0.28" />
            <stop offset="100%" stop-color="${accentA}" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="glowB" cx="80%" cy="0%" r="55%">
            <stop offset="0%" stop-color="${accentB}" stop-opacity="0.22" />
            <stop offset="100%" stop-color="${accentB}" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.06)" />
          </linearGradient>
          <linearGradient id="banner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${accentA}" />
            <stop offset="100%" stop-color="${accentB}" />
          </linearGradient>
        </defs>
        <rect width="1080" height="1350" fill="url(#bg)" />
        <rect width="1080" height="1350" fill="url(#glowA)" />
        <rect width="1080" height="1350" fill="url(#glowB)" />
        <g opacity="0.2">
          <circle cx="140" cy="150" r="10" fill="${accentA}" />
          <circle cx="230" cy="210" r="8" fill="${accentC}" />
          <circle cx="915" cy="190" r="12" fill="${accentA}" />
          <circle cx="980" cy="255" r="9" fill="${accentC}" />
          <circle cx="890" cy="1120" r="12" fill="${accentB}" />
          <circle cx="220" cy="1160" r="10" fill="${accentC}" />
        </g>
        <rect x="70" y="70" width="940" height="1210" rx="44" fill="rgba(10,18,24,0.5)" stroke="rgba(255,255,255,0.14)" stroke-width="2" />
        <rect x="110" y="110" width="300" height="64" rx="20" fill="url(#banner)" />
        <text x="142" y="151" fill="#090c14" font-size="24" font-family="Outfit, Arial, sans-serif" font-weight="800" letter-spacing="6">DCM FINALS</text>
        <text x="540" y="280" text-anchor="middle" fill="${accentA}" font-size="26" font-family="Outfit, Arial, sans-serif" font-weight="700" letter-spacing="8">${safeHeadline}</text>
        <circle cx="540" cy="500" r="128" fill="rgba(255,255,255,0.05)" />
        <circle cx="540" cy="500" r="108" fill="rgba(255,255,255,0.08)" stroke="${accentA}" stroke-width="8" />
        <circle cx="540" cy="500" r="88" fill="rgba(10,18,24,0.4)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
        <text x="540" y="486" text-anchor="middle" fill="${accentA}" font-size="22" font-family="Outfit, Arial, sans-serif" font-weight="700" letter-spacing="5">DCM</text>
        <text x="540" y="530" text-anchor="middle" fill="${accentC}" font-size="32" font-family="Space Grotesk, Arial, sans-serif" font-weight="700">${safeTitle}</text>
        <text x="540" y="705" text-anchor="middle" fill="#ffffff" font-size="84" font-family="Space Grotesk, Arial, sans-serif" font-weight="700">${safeSubject}</text>
        <text x="540" y="780" text-anchor="middle" fill="rgba(255,255,255,0.84)" font-size="36" font-family="Outfit, Arial, sans-serif">${safeTournament}</text>
        <rect x="182" y="860" width="716" height="74" rx="22" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" />
        <text x="540" y="908" text-anchor="middle" fill="${accentC}" font-size="28" font-family="Outfit, Arial, sans-serif" font-weight="700">${safeMeta}</text>
        <rect x="355" y="970" width="370" height="54" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <text x="540" y="1005" text-anchor="middle" fill="${accentA}" font-size="20" font-family="Outfit, Arial, sans-serif" font-weight="700" letter-spacing="4">${safeStamp}</text>
        <text x="540" y="1120" text-anchor="middle" fill="rgba(255,255,255,0.72)" font-size="28" font-family="Outfit, Arial, sans-serif">${safeFooter}</text>
        <text x="540" y="1188" text-anchor="middle" fill="rgba(255,255,255,0.48)" font-size="22" font-family="Outfit, Arial, sans-serif">Generated on Wednesday, July 29, 2026</text>
      </svg>
    `.trim();

    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const nextImage = new Image();
        nextImage.onload = () => resolve(nextImage);
        nextImage.onerror = () => reject(new Error("Unable to render celebration card."));
        nextImage.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pngBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });

      if (!pngBlob) {
        return;
      }

      const downloadUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${cardType}-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  return (
    <div className="dcm-grid pb-20">
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lux-panel premium-ring rounded-[26px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Saved Bank</p>
            <p className="mt-3 font-display text-4xl text-white">{playerBank.length}</p>
            <p className="mt-2 text-sm text-[var(--color-sand)]">Reusable every event</p>
          </div>
          <div className="lux-panel premium-ring rounded-[26px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Selected</p>
            <p className="mt-3 font-display text-4xl text-white">{selectedNames.length}</p>
            <p className="mt-2 text-sm text-[var(--color-sand)]">Ready for scheduling</p>
          </div>
          <div className="lux-panel premium-ring rounded-[26px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Mode</p>
            <p className="mt-3 font-display text-3xl text-white">
              {tournamentMode === "singles" ? "Singles" : "Doubles"}
            </p>
            <p className="mt-2 text-sm text-[var(--color-sand)]">
              {scoringMode === "best-of-3" ? "Best of 3" : "29 points"}
            </p>
          </div>
          <div className="lux-panel premium-ring rounded-[26px] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Last Generated</p>
            <p className="mt-3 font-display text-2xl text-white">{lastDrawTime || "Not yet"}</p>
            <p className="mt-2 text-sm text-[var(--color-sand)]">Current draw timestamp</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Step 1"
          title="Save your DCM player names"
          description="You can keep names ready here and use them whenever a new tournament comes up."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
            <div className="lux-chip mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Player Bank
            </div>
            <h3 className="font-display text-2xl text-white">Add names to the bank</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--color-mist)]">
              Add one name per line. Saved names stay available in this browser for future tournaments.
            </p>
            <textarea
              value={newNames}
              onChange={(event) => setNewNames(event.target.value)}
              placeholder={"Ram\nShyam\nMohan"}
              className="mt-5 min-h-48 w-full rounded-[28px] border border-white/10 bg-[rgba(8,10,14,0.35)] px-4 py-4 text-white outline-none transition focus:border-[var(--color-gold)]"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addNamesToBank}
                className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)] shadow-[0_12px_24px_rgba(223,172,87,0.16)] transition hover:translate-y-[-1px] hover:bg-[var(--color-gold-soft)]"
              >
                Save names
              </button>
              <button
                type="button"
                onClick={resetNameBank}
                className="rounded-full border border-white/15 px-5 py-3 text-white transition hover:bg-white/5"
              >
                Reset sample names
              </button>
            </div>
          </Card>

          <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="lux-chip mb-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Tournament Selection
                </div>
                <h3 className="font-display text-2xl text-white">Pick names for this tournament</h3>
                <p className="mt-2 text-sm text-[var(--color-mist)]">
                  Tap names to include or remove them from the current tournament list.
                </p>
              </div>
              <Badge className="bg-[var(--color-emerald)]/14 text-[var(--color-cream)]">{selectedNames.length} selected</Badge>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {playerBank.map((name) => {
                const isSelected = selectedNames.includes(name);

                return (
                  <div
                    key={name}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                      isSelected
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-white shadow-[0_8px_18px_rgba(223,172,87,0.1)]"
                        : "border-white/10 bg-white/5 text-[var(--color-mist)]"
                    }`}
                  >
                    <button type="button" onClick={() => toggleSelection(name)} className="font-medium">
                      {name}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeName(name)}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-[var(--color-sand)] transition hover:bg-white/5"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Step 2"
          title="Generate chit-style random draws"
          description="Choose singles or doubles, use best of 3 or 29 points, and randomize every tournament."
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
          <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
            <div className="lux-chip mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Setup Control
            </div>
            <h3 className="font-display text-2xl text-white">Tournament setup</h3>
            <div className="mt-5 space-y-4">
              <label className="block text-sm text-[var(--color-mist)]">
                Tournament name
                <input
                  value={tournamentName}
                  onChange={(event) => setTournamentName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[rgba(8,10,14,0.35)] px-4 py-3 text-white outline-none transition focus:border-[var(--color-gold)]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[var(--color-mist)]">Tournament type</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {[
                      { key: "singles", label: "Singles" },
                      { key: "doubles", label: "Doubles" }
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setTournamentMode(option.key as TournamentMode)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          tournamentMode === option.key
                            ? "bg-[var(--color-gold)] text-[var(--color-ink)] shadow-[0_10px_20px_rgba(223,172,87,0.18)]"
                            : "border border-white/15 text-white hover:bg-white/5"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-mist)]">Scoring format</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {[
                      { key: "best-of-3", label: "Best of 3" },
                      { key: "29-points", label: "29 points" }
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setScoringMode(option.key as ScoringMode)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          scoringMode === option.key
                            ? "bg-[var(--color-gold)] text-[var(--color-ink)] shadow-[0_10px_20px_rgba(223,172,87,0.18)]"
                            : "border border-white/15 text-white hover:bg-white/5"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generateDraw}
                className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)] shadow-[0_14px_28px_rgba(223,172,87,0.18)] transition hover:translate-y-[-1px] hover:bg-[var(--color-gold-soft)]"
              >
                Generate knockout schedule
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawTeams([]);
                  setFixtures([]);
                  setKnockoutRounds([]);
                  setWaitingList([]);
                  setWinner("");
                  setRunnerUp("");
                  setLastDrawTime("");
                }}
                className="rounded-full border border-white/15 px-5 py-3 text-white transition hover:bg-white/5"
              >
                Clear draw
              </button>
            </div>
            <div className="mt-6 rounded-[28px] border border-white/10 bg-[rgba(8,10,14,0.35)] p-5 text-sm text-[var(--color-mist)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Tournament</p>
                  <p className="mt-2 text-base text-white">{tournamentName || "DCM Carrom Tournament"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Bracket Output</p>
                  <p className="mt-2 text-base text-white">
                    {tournamentMode === "singles" ? selectedNames.length : Math.floor(selectedNames.length / 2)}{" "}
                    {tournamentMode === "singles" ? "players" : "teams"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Type</p>
                  <p className="mt-2 text-base text-white">{tournamentMode === "singles" ? "Singles" : "Doubles"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">Format</p>
                  <p className="mt-2 text-base text-white">
                    {scoringMode === "best-of-3" ? "Best of 3" : "29 points"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="lux-chip mb-3 inline-flex rounded-full px-3 py-1.5 text-[11px] font-medium text-[var(--color-gold)]">
                    Draw Output
                  </div>
                  <h3 className="font-display text-xl text-white sm:text-2xl">
                    {tournamentMode === "singles" ? "Singles list" : "Random doubles teams"}
                  </h3>
                </div>
                <Badge className="bg-white/6 px-3 py-1 text-[11px] tracking-[0.14em] text-[var(--color-sand)]">
                  {drawTeams.length} {tournamentMode === "singles" ? "entries" : "teams"}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {drawTeams.length ? (
                  drawTeams.map((team, index) => (
                    <div
                      key={team.id}
                      className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3.5 transition hover:bg-white/8"
                    >
                      <p className="text-[11px] font-medium text-[var(--color-gold)]">
                        {tournamentMode === "singles" ? `Player ${index + 1}` : `Team ${index + 1}`}
                      </p>
                      <p className="mt-2 text-base font-semibold leading-6 text-white sm:text-lg">
                        {team.label}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/15 p-6 text-sm text-[var(--color-mist)] sm:col-span-2">
                    Generate the draw to see the random player order or doubles team pairs.
                  </div>
                )}
              </div>
              {waitingList.length ? (
                <div className="mt-4 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-[var(--color-sand)]">
                  Waiting for pairing: {waitingList.join(", ")}
                </div>
              ) : null}
            </Card>

            <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="lux-chip mb-3 inline-flex rounded-full px-3 py-1.5 text-[11px] font-medium text-[var(--color-gold)]">
                    Bracket Board
                  </div>
                  <h3 className="font-display text-xl text-white sm:text-2xl">Knockout schedule till final</h3>
                  <p className="mt-2 text-sm text-[var(--color-mist)]">
                    Byes are inserted automatically whenever the count is not a full bracket size.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyCompleteSchedule}
                    disabled={!knockoutRounds.length}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {scheduleCopied ? "Copied" : "Copy schedule"}
                  </button>
                  <Badge className="bg-[var(--color-gold)]/12 px-3 py-1 text-[11px] tracking-[0.14em] text-[var(--color-cream)]">
                    {knockoutRounds.length} rounds
                  </Badge>
                </div>
              </div>
              <div className="section-divider mt-6" />
              <div className="mt-6">
                {knockoutRounds.length ? (
                  <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3.5 shadow-[0_18px_38px_rgba(3,6,16,0.18)] sm:p-4">
                    <div className="space-y-3">
                      {knockoutRounds.map((round) => (
                        <div
                          key={round.id}
                          className="rounded-[20px] border border-white/10 bg-white/5 p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-medium text-[var(--color-gold)]">{round.name}</p>
                              <p className="mt-1 text-[11px] text-[var(--color-mist)]">
                                {round.matches.length} match{round.matches.length > 1 ? "es" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            {round.matches.map((match) => (
                              <div
                                key={match.id}
                                className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-3"
                              >
                                <p className="text-[10px] font-medium text-[var(--color-gold)]">{match.label}</p>
                                <div className="mt-2 grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-center">
                                  <p className="text-sm font-semibold leading-5 text-white">{match.sideA}</p>
                                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-mist)] md:text-center">
                                    vs
                                  </p>
                                  <p className="text-sm font-semibold leading-5 text-white">{match.sideB}</p>
                                </div>
                                {match.note ? (
                                  <p className="mt-2 text-[10px] leading-4 text-[var(--color-sand)]">
                                    {match.note}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/15 p-6 text-sm text-[var(--color-mist)]">
                    Generate the matches and the full knockout schedule will appear here till the final.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Step 3"
          title="Make winner and runner-up cards"
          description="After the tournament, choose the final result and keep a clean card ready for sharing."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px]">
            <div className="lux-chip mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Result Setup
            </div>
            <h3 className="font-display text-2xl text-white">Final result</h3>
            <div className="mt-5 space-y-4">
              <label className="block text-sm text-[var(--color-mist)]">
                Winner
                <select
                  value={winner}
                  onChange={(event) => setWinner(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[rgba(8,10,14,0.35)] px-4 py-3 text-white outline-none transition focus:border-[var(--color-gold)]"
                >
                  <option value="">Select winner</option>
                  {resultOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-[var(--color-mist)]">
                Runner-up
                <select
                  value={runnerUp}
                  onChange={(event) => setRunnerUp(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[rgba(8,10,14,0.35)] px-4 py-3 text-white outline-none transition focus:border-[var(--color-gold)]"
                >
                  <option value="">Select runner-up</option>
                  {resultOptions
                    .filter((option) => option !== winner)
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => downloadCelebrationCard("winner")}
                disabled={!winner}
                className="w-full rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)] shadow-[0_12px_24px_rgba(226,185,107,0.18)] transition hover:bg-[var(--color-gold-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download winner image
              </button>
              <button
                type="button"
                onClick={() => downloadCelebrationCard("runner-up")}
                disabled={!runnerUp}
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download runner-up image
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--color-mist)]">
              Downloads as a PNG image. On mobile, it will save through your browser or phone download flow so you can share it anywhere.
            </p>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="board-glow premium-ring relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,rgba(217,164,65,0.24),rgba(31,41,64,0.9),rgba(10,12,18,0.99))] p-0">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,245,221,0.16),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(217,164,65,0.18),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(200,107,68,0.14),transparent_28%)]" />
              <div className="relative aspect-[4/5] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="inline-flex rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/14 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-cream)]">
                      Winner
                    </p>
                    <p className="mt-4 break-words font-display text-3xl text-white sm:text-4xl">
                      {winner || "Select the winner"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-sand)]">
                      {tournamentName || "DCM Carrom Tournament"}
                    </p>
                  </div>
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-[var(--color-gold)]/35 bg-[radial-gradient(circle_at_30%_30%,rgba(255,245,221,0.22),rgba(217,164,65,0.18),rgba(255,255,255,0.04))] text-center shadow-[0_18px_30px_rgba(217,164,65,0.16)] sm:h-16 sm:w-16">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--color-cream)]">NO 1</span>
                  </div>
                </div>
                <div className="mt-6 flex h-[calc(100%-5.5rem)] flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 sm:p-6">
                  <div className="grid flex-1 place-items-center text-center">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-gold)]">Champion Card</p>
                      <p className="mt-4 font-display text-2xl text-white sm:text-3xl">Night of Champions</p>
                      <p className="mt-4 break-words font-display text-4xl text-white sm:text-5xl">
                        {winner || "Winner Name"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-[var(--color-mist)]">
                      {tournamentMode === "singles" ? "Singles champion" : "Doubles champion"}
                    </div>
                    <div className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-[var(--color-cream)]">
                      {scoringMode === "best-of-3" ? "Best of 3" : "29 points"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="premium-ring relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,rgba(199,206,221,0.14),rgba(143,115,72,0.16),rgba(31,41,64,0.92),rgba(10,12,18,0.99))] p-0">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,247,251,0.14),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(199,206,221,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(143,115,72,0.14),transparent_28%)]" />
              <div className="relative aspect-[4/5] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-cream)]">
                      Runner-up
                    </p>
                    <p className="mt-4 break-words font-display text-3xl text-white sm:text-4xl">
                      {runnerUp || "Select the runner-up"}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-mist)]">
                      {tournamentName || "DCM Carrom Tournament"}
                    </p>
                  </div>
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(245,247,251,0.18),rgba(199,206,221,0.12),rgba(255,255,255,0.05))] text-center shadow-[0_18px_30px_rgba(199,206,221,0.1)] sm:h-16 sm:w-16">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-cream)]">FINAL</span>
                  </div>
                </div>
                <div className="mt-6 flex h-[calc(100%-5.5rem)] flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 sm:p-6">
                  <div className="grid flex-1 place-items-center text-center">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-sand)]">Finalist Card</p>
                      <p className="mt-4 font-display text-2xl text-white sm:text-3xl">A Brilliant Finish</p>
                      <p className="mt-4 break-words font-display text-4xl text-white sm:text-5xl">
                        {runnerUp || "Runner-up Name"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-[var(--color-mist)]">
                      Proud finalist recognition
                    </div>
                    <div className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-[var(--color-cream)]">
                      {scoringMode === "best-of-3" ? "Best of 3" : "29 points"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
