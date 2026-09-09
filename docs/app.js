const state = {
  players: [],
  filtered: [],
  sortKey: "RANK",
  sortDirection: "asc",
  page: 1,
  pageSize: 50,
};

const els = {
  body: document.querySelector("#rankingsBody"),
  loading: document.querySelector("#loadingState"),
  empty: document.querySelector("#emptyState"),
  error: document.querySelector("#errorState"),
  search: document.querySelector("#searchInput"),
  position: document.querySelector("#positionFilter"),
  team: document.querySelector("#teamFilter"),
  status: document.querySelector("#statusFilter"),
  total: document.querySelector("#totalPlayers"),
  visible: document.querySelector("#visiblePlayers"),
  pageStatus: document.querySelector("#pageStatus"),
  previous: document.querySelector("#previousPage"),
  next: document.querySelector("#nextPage"),
  reset: document.querySelector("#resetFilters"),
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function recordsFromRows(rows) {
  const headerIndex = rows.findIndex((row) => row.includes("RANK") && row.includes("Player"));
  if (headerIndex < 0) throw new Error("Ranking headers not found");

  const headers = rows[headerIndex];
  return rows.slice(headerIndex + 1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      if (header) record[header.trim()] = (row[index] ?? "").trim();
    });
    return record;
  }).filter((record) => record.Player && record.RANK);
}

function numericValue(value) {
  if (value === null || value === undefined || value === "") return Number.POSITIVE_INFINITY;
  const parsed = Number(String(value).replace(/[$,%]/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

function compareRecords(a, b) {
  const numericKeys = new Set(["RANK", "ADP", "Value", "Pos Rank", "Proj Pts"]);
  let result;

  if (numericKeys.has(state.sortKey)) {
    result = numericValue(a[state.sortKey]) - numericValue(b[state.sortKey]);
  } else {
    result = String(a[state.sortKey] ?? "").localeCompare(String(b[state.sortKey] ?? ""), undefined, { sensitivity: "base" });
  }

  return state.sortDirection === "asc" ? result : -result;
}

function uniqueValues(key) {
  return [...new Set(state.players.map((player) => player[key]).filter(Boolean))].sort();
}

function populateFilter(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function applyFilters() {
  const query = els.search.value.trim().toLowerCase();
  const position = els.position.value;
  const team = els.team.value;
  const status = els.status.value;

  state.filtered = state.players.filter((player) => {
    const searchable = `${player.Player} ${player.Team} ${player.POS}`.toLowerCase();
    return (!query || searchable.includes(query))
      && (!position || player.POS === position)
      && (!team || player.Team === team)
      && (!status || player["Roster Status"] === status);
  }).sort(compareRecords);

  state.page = 1;
  render();
}

function render() {
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pagePlayers = state.filtered.slice(start, start + state.pageSize);

  els.body.replaceChildren(...pagePlayers.map((player) => {
    const tr = document.createElement("tr");
    const values = [
      player.RANK,
      player.Player,
      player.Team,
      player.POS,
      player.ADP || "—",
      player.Value || "—",
      player["Pos Rank"] || "—",
      player["Proj Pts"] || "—",
      player["Roster Status"] || "—",
      player["Change Notes"] || "—",
    ];

    values.forEach((value, index) => {
      const td = document.createElement("td");
      td.textContent = value;
      if (index === 1) td.className = "player-name";
      if (index === 3) td.className = "position-pill-cell";
      if (index === 3) {
        const pill = document.createElement("span");
        pill.className = "position-pill";
        pill.textContent = value;
        td.replaceChildren(pill);
      }
      if (index === 8) {
        const pill = document.createElement("span");
        pill.className = "status-pill";
        pill.textContent = value;
        td.replaceChildren(pill);
      }
      if (index === 9) td.className = "change-note";
      tr.append(td);
    });
    return tr;
  }));

  els.loading.hidden = true;
  els.error.hidden = true;
  els.empty.hidden = state.filtered.length !== 0;
  els.visible.textContent = state.filtered.length.toLocaleString();
  els.pageStatus.textContent = `Page ${state.page} of ${totalPages}`;
  els.previous.disabled = state.page <= 1;
  els.next.disabled = state.page >= totalPages;
}

function setSort(key) {
  if (state.sortKey === key) {
    state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  } else {
    state.sortKey = key;
    state.sortDirection = "asc";
  }
  state.filtered.sort(compareRecords);
  state.page = 1;
  render();
}

async function loadRankings() {
  try {
    const response = await fetch("./rankings.csv", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = parseCsv(await response.text());
    state.players = recordsFromRows(rows);
    state.filtered = [...state.players].sort(compareRecords);
    els.total.textContent = state.players.length.toLocaleString();
    populateFilter(els.team, uniqueValues("Team"));
    populateFilter(els.status, uniqueValues("Roster Status"));
    render();
  } catch (error) {
    console.error(error);
    els.loading.hidden = true;
    els.error.hidden = false;
    els.previous.disabled = true;
    els.next.disabled = true;
  }
}

[els.search, els.position, els.team, els.status].forEach((control) => {
  control.addEventListener(control === els.search ? "input" : "change", applyFilters);
});

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => setSort(button.dataset.sort));
});

els.previous.addEventListener("click", () => {
  state.page -= 1;
  render();
  document.querySelector("#rankings-heading").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.next.addEventListener("click", () => {
  state.page += 1;
  render();
  document.querySelector("#rankings-heading").scrollIntoView({ behavior: "smooth", block: "start" });
});

els.reset.addEventListener("click", () => {
  els.search.value = "";
  els.position.value = "";
  els.team.value = "";
  els.status.value = "";
  state.sortKey = "RANK";
  state.sortDirection = "asc";
  applyFilters();
});

loadRankings();

