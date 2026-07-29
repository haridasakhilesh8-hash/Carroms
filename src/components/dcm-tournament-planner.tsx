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
  "Ram",
  "Ravi",
  "Kiran",
  "Siva",
  "Venu",
  "Pavan",
  "Mohan",
  "Arun"
];

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
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

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];

      if (Array.isArray(parsed) && parsed.length) {
        setPlayerBank(parsed);
        setSelectedNames(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playerBank));
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

  function downloadCelebrationCard(cardType: "winner" | "runner-up") {
    const subject = cardType === "winner" ? winner : runnerUp;

    if (!subject) {
      return;
    }

    const title = cardType === "winner" ? "Champion" : "Runner-up";
    const accentA = cardType === "winner" ? "#d9a441" : "#49b4ab";
    const accentB = cardType === "winner" ? "#c86b44" : "#6a4fdb";
    const accentC = cardType === "winner" ? "#fff2d2" : "#f0f6ff";
    const tournamentLabel = tournamentName || "DCM Carrom Tournament";
    const modeLabel = tournamentMode === "singles" ? "Singles" : "Doubles";
    const formatLabel = scoringMode === "best-of-3" ? "Best of 3" : "29 points";
    const safeSubject = escapeSvgText(subject);
    const safeTournament = escapeSvgText(tournamentLabel);
    const safeTitle = escapeSvgText(title);
    const safeMeta = escapeSvgText(`${modeLabel} | ${formatLabel}`);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
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
        </defs>
        <rect width="1600" height="900" fill="url(#bg)" />
        <rect width="1600" height="900" fill="url(#glowA)" />
        <rect width="1600" height="900" fill="url(#glowB)" />
        <g opacity="0.18">
          <circle cx="180" cy="125" r="10" fill="${accentA}" />
          <circle cx="250" cy="180" r="7" fill="${accentC}" />
          <circle cx="1360" cy="160" r="8" fill="${accentA}" />
          <circle cx="1440" cy="220" r="12" fill="${accentC}" />
          <circle cx="1320" cy="710" r="9" fill="${accentA}" />
          <circle cx="240" cy="760" r="8" fill="${accentC}" />
        </g>
        <rect x="95" y="85" width="1410" height="730" rx="42" fill="rgba(10,18,24,0.48)" stroke="rgba(255,255,255,0.16)" stroke-width="2" />
        <rect x="130" y="120" width="1340" height="80" rx="22" fill="rgba(255,255,255,0.05)" />
        <text x="160" y="171" fill="${accentA}" font-size="30" font-family="Outfit, Arial, sans-serif" font-weight="700" letter-spacing="10">DCM CARROMS CELEBRATION CARD</text>
        <text x="130" y="335" fill="${accentC}" font-size="72" font-family="Space Grotesk, Arial, sans-serif" font-weight="700">${safeTitle}</text>
        <text x="130" y="470" fill="#ffffff" font-size="108" font-family="Space Grotesk, Arial, sans-serif" font-weight="700">${safeSubject}</text>
        <text x="130" y="560" fill="rgba(255,255,255,0.84)" font-size="42" font-family="Outfit, Arial, sans-serif">${safeTournament}</text>
        <rect x="130" y="615" width="330" height="76" rx="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
        <text x="165" y="663" fill="${accentC}" font-size="30" font-family="Outfit, Arial, sans-serif" font-weight="600">${safeMeta}</text>
        <g transform="translate(1090 280)">
          <circle cx="110" cy="110" r="110" fill="rgba(255,255,255,0.06)" />
          <circle cx="110" cy="110" r="88" fill="rgba(255,255,255,0.1)" stroke="${accentA}" stroke-width="8" />
          <text x="110" y="108" text-anchor="middle" fill="${accentA}" font-size="26" font-family="Outfit, Arial, sans-serif" font-weight="700" letter-spacing="6">DCM</text>
          <text x="110" y="146" text-anchor="middle" fill="${accentC}" font-size="34" font-family="Space Grotesk, Arial, sans-serif" font-weight="700">${safeTitle}</text>
        </g>
        <text x="130" y="770" fill="rgba(255,255,255,0.62)" font-size="28" font-family="Outfit, Arial, sans-serif">Generated on Wednesday, July 29, 2026</text>
      </svg>
    `.trim();

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${cardType}-card.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <Card className="carrom-surface premium-ring overflow-hidden rounded-[32px] xl:sticky xl:top-24 xl:h-fit">
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="lux-chip mb-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    Draw Output
                  </div>
                  <h3 className="font-display text-2xl text-white">
                    {tournamentMode === "singles" ? "Singles list" : "Random doubles teams"}
                  </h3>
                </div>
                <Badge className="bg-white/6 text-[var(--color-sand)]">
                  {drawTeams.length} {tournamentMode === "singles" ? "entries" : "teams"}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {drawTeams.length ? (
                  drawTeams.map((team, index) => (
                    <div key={team.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                        {tournamentMode === "singles" ? `Player ${index + 1}` : `Team ${index + 1}`}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-white">{team.label}</p>
                      {tournamentMode === "doubles" ? (
                        <p className="mt-2 text-sm text-[var(--color-mist)]">{team.members.join(" + ")}</p>
                      ) : null}
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
                  <div className="lux-chip mb-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    Bracket Board
                  </div>
                  <h3 className="font-display text-2xl text-white">Knockout schedule till final</h3>
                  <p className="mt-2 text-sm text-[var(--color-mist)]">
                    Byes are inserted automatically whenever the count is not a full bracket size.
                  </p>
                </div>
                <Badge className="bg-[var(--color-gold)]/12 text-[var(--color-cream)]">
                  {knockoutRounds.length} rounds
                </Badge>
              </div>
              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {knockoutRounds.length ? (
                  knockoutRounds.map((round) => (
                    <div key={round.id} className="rounded-[24px] border border-white/10 bg-[rgba(8,10,14,0.32)] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">{round.name}</p>
                      <div className="mt-4 space-y-3">
                        {round.matches.map((match) => (
                          <div key={match.id} className="rounded-[20px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-mist)]">{match.label}</p>
                            <p className="mt-2 text-lg font-semibold text-white">
                              {match.sideA} <span className="text-[var(--color-gold)]">vs</span> {match.sideB}
                            </p>
                            {match.note ? (
                              <p className="mt-2 text-sm text-[var(--color-sand)]">{match.note}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
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
                className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)] shadow-[0_12px_24px_rgba(226,185,107,0.18)] transition hover:bg-[var(--color-gold-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download winner card
              </button>
              <button
                type="button"
                onClick={() => downloadCelebrationCard("runner-up")}
                disabled={!runnerUp}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download runner-up card
              </button>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="board-glow premium-ring overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,rgba(217,164,65,0.3),rgba(31,41,64,0.9),rgba(10,12,18,0.98))]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">Winner Celebration</p>
                  <p className="mt-4 font-display text-4xl text-white">{winner || "Select the winner"}</p>
                  <p className="mt-3 text-sm text-[var(--color-sand)]">{tournamentName || "DCM Carrom Tournament"}</p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-full border border-[var(--color-gold)]/35 bg-[radial-gradient(circle_at_30%_30%,rgba(255,245,221,0.18),rgba(217,164,65,0.16),rgba(255,255,255,0.05))] text-center shadow-[0_10px_20px_rgba(255,255,255,0.08)]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--color-cream)]">
                    DCM
                  </span>
                </div>
              </div>
              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-cream)]">Champion Card</p>
                <p className="mt-3 text-sm text-[var(--color-mist)]">
                  {tournamentMode === "singles" ? "Singles champion" : "Doubles champion"} |{" "}
                  {scoringMode === "best-of-3" ? "Best of 3" : "29 points"}
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--color-sand)]">
                  Designed for celebration, sharing, and direct download after the tournament.
                </p>
              </div>
            </Card>
            <Card className="premium-ring overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,rgba(73,180,171,0.18),rgba(79,51,95,0.34),rgba(10,12,18,0.98))]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-sand)]">Runner-up Celebration</p>
                  <p className="mt-4 font-display text-4xl text-white">{runnerUp || "Select the runner-up"}</p>
                  <p className="mt-3 text-sm text-[var(--color-mist)]">{tournamentName || "DCM Carrom Tournament"}</p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(240,246,255,0.16),rgba(73,180,171,0.14),rgba(255,255,255,0.05))] text-center shadow-[0_10px_20px_rgba(255,255,255,0.08)]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]">
                    PROUD
                  </span>
                </div>
              </div>
              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-cream)]">Celebration Card</p>
                <p className="mt-3 text-sm text-[var(--color-mist)]">
                  A polished runner-up card for sharing and recognition.
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--color-sand)]">
                  Use the download button to save a ready-made card file instantly.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
