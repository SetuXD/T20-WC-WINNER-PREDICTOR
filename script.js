// ===================== GROUPS & TEAMS =====================
const groups = {
  A: ["Pakistan","Netherlands","India","United States Of America","Namibia"],
  B: ["Australia","Sri Lanka","Zimbabwe","Ireland","Oman"],
  C: ["England","West Indies","Bangladesh","Nepal","Italy"],
  D: ["South Africa","New Zealand","Afghanistan","Canada","United Arab Emirates"]
};

// ===================== FIXTURES =====================
const fixtures = {
  A: [
    {team1:"Pakistan",team2:"Netherlands"},
    {team1:"India",team2:"United States Of America"},
    {team1:"Netherlands",team2:"Namibia"},
    {team1:"Pakistan",team2:"United States Of America"},
    {team1:"India",team2:"Namibia"},
    {team1:"United States Of America",team2:"Netherlands"},
    {team1:"United States Of America",team2:"Namibia"},
    {team1:"India",team2:"Pakistan"},
    {team1:"Pakistan",team2:"Namibia"},
    {team1:"India",team2:"Netherlands"}
  ],
  B: [
    {team1:"Sri Lanka",team2:"Ireland"},
    {team1:"Zimbabwe",team2:"Oman"},
    {team1:"Australia",team2:"Ireland"},
    {team1:"Sri Lanka",team2:"Oman"},
    {team1:"Australia",team2:"Zimbabwe"},
    {team1:"Ireland",team2:"Oman"},
    {team1:"Australia",team2:"Sri Lanka"},
    {team1:"Ireland",team2:"Zimbabwe"},
    {team1:"Sri Lanka",team2:"Zimbabwe"},
    {team1:"Australia",team2:"Oman"}
  ],
  C: [
    {team1:"West Indies",team2:"Bangladesh"},
    {team1:"England",team2:"Nepal"},
    {team1:"Bangladesh",team2:"Italy"},
    {team1:"England",team2:"West Indies"},
    {team1:"Nepal",team2:"Italy"},
    {team1:"England",team2:"Bangladesh"},
    {team1:"West Indies",team2:"Nepal"},
    {team1:"Bangladesh",team2:"Nepal"},
    {team1:"West Indies",team2:"Italy"},
    {team1:"England",team2:"Italy"}
  ],
  D: [
    {team1:"New Zealand",team2:"Afghanistan"},
    {team1:"South Africa",team2:"Canada"},
    {team1:"New Zealand",team2:"United Arab Emirates"},
    {team1:"South Africa",team2:"Afghanistan"},
    {team1:"New Zealand",team2:"South Africa"},
    {team1:"Canada",team2:"United Arab Emirates"},
    {team1:"Afghanistan",team2:"United Arab Emirates"},
    {team1:"New Zealand",team2:"Canada"},
    {team1:"South Africa",team2:"United Arab Emirates"},
    {team1:"Afghanistan",team2:"Canada"}
  ]
};

// ===================== POINTS TABLE =====================
const points = {};
Object.keys(groups).forEach(g=>{
  points[g]={};
  groups[g].forEach(team=>{
    points[g][team]={played:0,won:0,lost:0,points:0};
  });
});

// Render points table
function renderPointsTable(group){
  const table = document.getElementById(`points${group}`);
  table.innerHTML = "<tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th></tr>";
  Object.keys(points[group]).forEach(team=>{
    const p = points[group][team];
    const row = document.createElement("tr");
    row.innerHTML = `<td>${team}</td><td>${p.played}</td><td>${p.won}</td><td>${p.lost}</td><td>${p.points}</td>`;
    table.appendChild(row);
  });
}

// Recalculate points based on user selection
function recalcGroupPoints(group){
  Object.keys(points[group]).forEach(t=>{
    points[group][t]={played:0,won:0,lost:0,points:0};
  });

  fixtures[group].forEach((m,i)=>{
    const sel = document.getElementById(`res-${group}-${i}`);
    const w = sel.value;
    if(!w) return;
    if(w==="tie"){
      points[group][m.team1].played++;
      points[group][m.team2].played++;
      points[group][m.team1].points += 1;
      points[group][m.team2].points += 1;
    } else {
      points[group][w].played++;
      points[group][w].won++;
      points[group][w].points += 2;

      const loser = (w===m.team1)? m.team2 : m.team1;
      points[group][loser].played++;
      points[group][loser].lost++;
    }
  });

  renderPointsTable(group);
}

// Render matches for a group
function renderGroupMatches(group){
  const container=document.getElementById(`group${group}-matches`);
  container.innerHTML="";
  fixtures[group].forEach((m,i)=>{
    const div=document.createElement("div");
    div.className="match";
    div.innerHTML = `
      <div>${m.team1} vs ${m.team2}</div>
      <div>
        <select id="res-${group}-${i}">
          <option value="">Select Winner</option>
          <option value="${m.team1}">${m.team1}</option>
          <option value="${m.team2}">${m.team2}</option>
          <option value="tie">Tie / No Result</option>
        </select>
      </div>`;
    container.appendChild(div);
    document.getElementById(`res-${group}-${i}`).addEventListener("change",()=>{
      recalcGroupPoints(group);
      updateSuper8();
    });
  });
}

// Get top 2 in a group
function getTop2(group){
  const sorted = Object.keys(points[group]).sort((a,b)=>{
    return points[group][b].points - points[group][a].points;
  });
  return sorted.slice(0,2);
}

// ===================== SUPER 8 =====================
let super8Matches = [];
function updateSuper8(){
  const topA = getTop2("A");
  const topB = getTop2("B");
  const topC = getTop2("C");
  const topD = getTop2("D");

  if([topA,topB,topC,topD].some(g=>g.length<2)){
    document.getElementById("super8").innerHTML = "Super 8 Teams: Incomplete selections";
    document.getElementById("semiFinals").innerHTML = "Semi-Finals placeholders";
    document.getElementById("final").innerHTML = "Final placeholder";
    return;
  }

  const super8 = [...topA,...topB,...topC,...topD];
  document.getElementById("super8").innerHTML = "";

  super8Matches = [
    {id:1, team1: topA[0], team2: topC[1], winner:null},
    {id:2, team1: topB[0], team2: topD[1], winner:null},
    {id:3, team1: topC[0], team2: topA[1], winner:null},
    {id:4, team1: topD[0], team2: topB[1], winner:null}
  ];

  super8Matches.forEach((m)=>{
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Match ${m.id}:</strong> ${m.team1} vs ${m.team2}
      <select id="super8-${m.id}">
        <option value="">Select Winner</option>
        <option value="${m.team1}">${m.team1}</option>
        <option value="${m.team2}">${m.team2}</option>
      </select>
    `;
    document.getElementById("super8").appendChild(div);
    document.getElementById(`super8-${m.id}`).addEventListener("change",()=>updateSemiFinals());
  });
}

// ===================== SEMI-FINALS =====================
let semiFinals = [];
function updateSemiFinals(){
  const winners = [];
  super8Matches.forEach((m)=>{
    const sel = document.getElementById(`super8-${m.id}`);
    m.winner = sel.value || null;
    if(m.winner) winners.push(m.winner);
  });

  if(winners.length < 4){
    document.getElementById("semiFinals").innerHTML = "Semi-Finals: Waiting for Super 8 results";
    document.getElementById("final").innerHTML = "Final: Waiting for Semi-Final results";
    return;
  }

  semiFinals = [
    {id:1, team1: super8Matches[0].winner, team2: super8Matches[1].winner, winner:null},
    {id:2, team1: super8Matches[2].winner, team2: super8Matches[3].winner, winner:null}
  ];

  document.getElementById("semiFinals").innerHTML = "";
  semiFinals.forEach((m)=>{
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Semi-Final ${m.id}:</strong> ${m.team1} vs ${m.team2}
      <select id="semi-${m.id}">
        <option value="">Select Winner</option>
        <option value="${m.team1}">${m.team1}</option>
        <option value="${m.team2}">${m.team2}</option>
      </select>
    `;
    document.getElementById("semiFinals").appendChild(div);
    document.getElementById(`semi-${m.id}`).addEventListener("change",()=>updateFinal());
  });
}

// ===================== FINAL & CHAMPION =====================
let finalMatch = {team1:null, team2:null, winner:null};
function updateFinal(){
  semiFinals.forEach((m)=>{
    const sel = document.getElementById(`semi-${m.id}`);
    m.winner = sel.value || null;
  });

  if(semiFinals.some(m=>!m.winner)) {
    document.getElementById("final").innerHTML = "Final: Waiting for Semi-Final results";
    return;
  }

  finalMatch.team1 = semiFinals[0].winner;
  finalMatch.team2 = semiFinals[1].winner;
  finalMatch.winner = null;

  document.getElementById("final").innerHTML = `
    <strong>Final:</strong> ${finalMatch.team1} vs ${finalMatch.team2}
    <select id="final-winner">
      <option value="">Select Champion</option>
      <option value="${finalMatch.team1}">${finalMatch.team1}</option>
      <option value="${finalMatch.team2}">${finalMatch.team2}</option>
    </select>
    <div id="champion"></div>
  `;

  document.getElementById("final-winner").addEventListener("change",()=>{
    finalMatch.winner = document.getElementById("final-winner").value;
    document.getElementById("champion").innerHTML = finalMatch.winner ? `<strong>Champion: ${finalMatch.winner}</strong>` : "";
    if(finalMatch.winner) showExitPoll(finalMatch.winner);
  });
}

// ===================== EXIT POLL =====================
function showExitPoll(winner) {
  const pollWeights = {
    "India": 10,"Australia": 9,"England": 8,"New Zealand": 7,
    "South Africa": 6,"West Indies": 5,"Pakistan": 5,"Sri Lanka": 4,
    "Bangladesh": 3,"Afghanistan": 3,"Ireland": 2,"Zimbabwe": 2,
    "USA": 2,"Canada": 1,"Netherlands": 1,"Namibia": 1,"Oman": 1,"Italy": 1,
    "United Arab Emirates": 1
  };

  let total = 0;
  for (let team in pollWeights) total += pollWeights[team];

  const winnerWeight = pollWeights[winner] || 1; 
  const pollPercentage = Math.round((winnerWeight / total) * 100);

  const pollMsg = `You're one of ${pollPercentage}% of people who think that ${winner} will be the winner`;
  const pollDiv = document.createElement("div");
  pollDiv.style.marginTop = "10px";
  pollDiv.style.fontWeight = "bold";
  pollDiv.innerText = pollMsg;

  // Append to champion div
  document.getElementById("champion").appendChild(pollDiv);
}

// ===================== INITIAL RENDER =====================
["A","B","C","D"].forEach(g=>{
  renderGroupMatches(g);
  recalcGroupPoints(g);
});
