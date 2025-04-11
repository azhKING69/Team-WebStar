document.addEventListener("DOMContentLoaded", async () => {
  // Mobile Navbar
  const navbarMenu = document.querySelector(".navbar .links");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const hideMenuBtn = navbarMenu.querySelector(".close-btn");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      navbarMenu.classList.toggle("show-menu");
    });
  }
  if (hideMenuBtn) {
    hideMenuBtn.addEventListener("click", () => {
      hamburgerBtn.click();
    });
  }

  // Login/Signup Popup
  const showPopupBtn = document.querySelector(".login-btn");
  const formPopup = document.querySelector(".form-popup");
  const hidePopupBtn = formPopup.querySelector(".close-btn");
  const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");
  if (showPopupBtn) {
    showPopupBtn.addEventListener("click", () => {
      document.body.classList.add("show-popup");
      formPopup.classList.remove("show-signup");
    });
  }
  if (hidePopupBtn) {
    hidePopupBtn.addEventListener("click", () => {
      document.body.classList.remove("show-popup");
    });
  }
  signupLoginLink.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      formPopup.classList.toggle("show-signup");
    });
  });

  // Fetch & Display Prices
  async function fetchMaterialPrices() {
    return new Promise((res) =>
      setTimeout(
        () =>
          res({
            steel: 50000, // ₹ per tonne
            cement: 10, // ₹ per kg
            sand: 1200, // ₹ per m³
            gravel: 750, // ₹ per tonne
          }),
        300
      )
    );
  }
  function displayPrices(prices) {
    const icons = {
      steel: "images/steel.png",
      cement: "images/cement.png",
      sand: "images/sand.png",
      gravel: "images/gravel.png",
    };
    const names = {
      steel: "Steel (per tonne)",
      cement: "Cement (per kg)",
      sand: "Sand (m³)",
      gravel: "Gravel (tonne)",
    };
    let html = "";
    ["steel", "cement", "sand", "gravel"].forEach((mat) => {
      html += `
        <div class="price-item">
          <img src="${icons[mat]}" alt="${names[mat]}">
          <span>${names[mat]}: ₹${prices[mat].toLocaleString()}</span>
        </div>
      `;
    });
    document.getElementById("pricePanel").innerHTML += html;
  }
  const prices = await fetchMaterialPrices();
  displayPrices(prices);

  // Calculation Logic
  const AVERAGE_CONSUMPTION = {
    "2BHK": {
      steelPerSqft: 0.005,
      cementPerSqft: 20,
      sandPerSqft: 0.09,
      gravelPerSqft: 0.055,
    },
    "3BHK": {
      steelPerSqft: 0.006,
      cementPerSqft: 21,
      sandPerSqft: 0.09,
      gravelPerSqft: 0.06,
    },
  };
  const SQM_TO_SQFT = 10.764;
  function getDistributionArray(floors) {
    const dist = [0.1];
    if (floors === 1) {
      dist.push(0.9);
    } else {
      dist.push(0.3);
      const rem = 0.6,
        above = floors - 1,
        each = rem / above;
      for (let i = 0; i < above; i++) dist.push(each);
    }
    return dist;
  }
  function calculateMaterialRequirements(size, unit, floors, type) {
    const sqft = unit === "meter" ? size * SQM_TO_SQFT : size;
    const cfg = AVERAGE_CONSUMPTION[type];
    const totals = {
      steel: sqft * cfg.steelPerSqft * floors,
      cement: sqft * cfg.cementPerSqft * floors,
      sand: sqft * cfg.sandPerSqft * floors,
      gravel: sqft * cfg.gravelPerSqft * floors,
    };
    const dist = getDistributionArray(floors);
    const usagePerLevel = dist.map((f) => ({
      steel: totals.steel * f,
      cement: totals.cement * f,
      sand: totals.sand * f,
      gravel: totals.gravel * f,
    }));
    return { usagePerLevel, total: totals };
  }

  // Helper function to get floor suffix (1st, 2nd, 3rd, etc.)
  function getSuffix(n) {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }
  function buildTable(usage, prices) {
    let rows = "",
      grand = 0;
    usage.forEach((u, i) => {
      const label =
        i === 0
          ? "Foundation"
          : i === 1
          ? "Ground Floor"
          : `${i - 1}${getSuffix(i - 1)} Floor`;
      const cost =
        u.steel * prices.steel +
        u.cement * prices.cement +
        u.sand * prices.sand +
        u.gravel * prices.gravel;
      grand += cost;
      rows += `
        <tr>
          <td class="floor-label">${label}</td>
          <td>${u.steel.toFixed(2)}</td>
          <td>${u.cement.toFixed(2)}</td>
          <td>${u.sand.toFixed(2)}</td>
          <td>${u.gravel.toFixed(2)}</td>
          <td>${cost.toFixed(2)}</td>
        </tr>
      `;
    });
    const sum = usage.reduce(
      (a, u) => {
        a.steel += u.steel;
        a.cement += u.cement;
        a.sand += u.sand;
        a.gravel += u.gravel;
        return a;
      },
      { steel: 0, cement: 0, sand: 0, gravel: 0 }
    );
    rows += `
      <tr class="total-row">
        <td class="total-label">Total</td>
        <td>${sum.steel.toFixed(2)}</td>
        <td>${sum.cement.toFixed(2)}</td>
        <td>${sum.sand.toFixed(2)}</td>
        <td>${sum.gravel.toFixed(2)}</td>
        <td>${grand.toFixed(2)}</td>
      </tr>
    `;
    return { rows, grand, totals: sum };
  }

  // NEW: Function to display total material amounts with icons
  function displayMaterialAmounts(totals) {
    const icons = {
      steel: "images/steel.png",
      cement: "images/cement.png",
      sand: "images/sand.png",
      gravel: "images/gravel.png",
    };
    const names = {
      steel: "Steel (Tonne)",
      cement: "Cement (Kg)",
      sand: "Sand (m³)",
      gravel: "Gravel (Tonne)",
    };
    let html = "";
    ["steel", "cement", "sand", "gravel"].forEach((mat) => {
      html += `
      <div class="material-item">
        <img src="${icons[mat]}" alt="${names[mat]}">
        <span>${names[mat]}: ${totals[mat].toFixed(2)}</span>
      </div>
    `;
    });
    // Ensure you have added a container with this ID in your HTML
    const container = document.getElementById("materialAmountContainer");
    container.innerHTML = html;
    container.style.display = "flex"; // ensures container is visible and uses flex styling
  }

  // -----------------------
  // New Time Calculation Code (Per Sqft)
  // -----------------------
  // Time per sqft for each phase (in days)
  const timePerSqft = {
    foundation: 0.08,
    floor: 0.06,
    finishing: 0.1, // optional, not part of structural phases
  };

  // Time Calculations for Phases (per sqft based)
  function calculatePhaseDurations(floors, areaSqft) {
    const phases = [];
    const durations = [];

    // Foundation
    phases.push("Foundation");
    durations.push((timePerSqft.foundation * areaSqft).toFixed(1));

    // Ground Floor
    phases.push("Ground Floor");
    durations.push((timePerSqft.floor * areaSqft).toFixed(1));

    // Upper Floors
    for (let i = 2; i < floors + 2; i++) {
      const label = i === 2 ? "1st Floor" : `${i - 1}${getSuffix(i - 1)} Floor`;
      phases.push(label);
      durations.push((timePerSqft.floor * areaSqft).toFixed(1));
    }

    return { phases, durations };
  }
  function getTotalDuration(durations) {
    return durations.reduce((sum, d) => sum + parseFloat(d), 0);
  }

  // Render Material Consumption Pie Charts
  function renderMaterialPieCharts(usage) {
    const materials = ["steel", "cement", "sand", "gravel"];
    const names = {
      steel: "Steel (Tonne)",
      cement: "Cement (Kg)",
      sand: "Sand (m³)",
      gravel: "Gravel (tonne)",
    };
    const floorLabels = usage.map((_, i) =>
      i === 0
        ? "Foundation"
        : i === 1
        ? "Ground Floor"
        : `${i - 1}${getSuffix(i - 1)} Floor`
    );
    const container = document.getElementById("materialCharts");
    container.innerHTML = "";
    materials.forEach((material) => {
      const div = document.createElement("div");
      div.classList.add("chart-item");
      const h4 = document.createElement("h4");
      h4.textContent = names[material];
      h4.style.textAlign = "center";
      div.appendChild(h4);
      const canvas = document.createElement("canvas");
      canvas.id = "materialPie_" + material;
      div.appendChild(canvas);
      container.appendChild(div);
      const data = usage.map((u) => u[material]);
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: floorLabels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#4caf50",
                "#2196f3",
                "#ff9800",
                "#9c27b0",
                "#e91e63",
                "#00bcd4",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (context) =>
                  context.label + ": " + context.parsed.toFixed(2),
              },
            },
          },
          cutout: "50%",
        },
      });
    });
  }
  // -----------------------
  // End Time Calculation Code
  // -----------------------

  // Render Time Bar Chart
  function renderTimeBarChart(phases, durations) {
    const ctx = document.getElementById("timeBarChart").getContext("2d");
    if (window.timeChart instanceof Chart) window.timeChart.destroy();
    window.timeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: phases,
        datasets: [
          {
            label: "Duration (days)",
            data: durations,
            backgroundColor: "#6a64f1",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (context) => context.parsed.y + " days" },
          },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // Render Timeline Diagram (vertical)
  function renderTimelineDiagram(phases, durations) {
    const timelineBar = document.getElementById("timelineBar");
    timelineBar.innerHTML = "";

    phases.forEach((phase, index) => {
      // Container for one step
      const item = document.createElement("div");
      item.classList.add("timeline-item");

      // The dot
      const dot = document.createElement("div");
      dot.classList.add("timeline-dot");
      // alternate colors if you like
      dot.style.background = index % 2 === 0 ? "#4caf50" : "#2196f3";

      // The label
      const content = document.createElement("div");
      content.classList.add("timeline-content");
      content.textContent = `${phase} (${durations[index]} days)`;

      item.appendChild(dot);
      item.appendChild(content);

      // The connecting line (skip after last)
      if (index < phases.length - 1) {
        const line = document.createElement("div");
        line.classList.add("timeline-line");
        item.appendChild(line);
      }

      timelineBar.appendChild(item);
    });
  }

  // Render Labour Pie Chart & Cost Table with Per Sqft Labour Calculation
  function renderLabourPieChart(areaSqft) {
    const labourData = [
      { type: "Skilled", workersPerSqft: 0.01, rate: 500 },
      { type: "Semi-skilled", workersPerSqft: 0.015, rate: 350 },
      { type: "Unskilled", workersPerSqft: 0.02, rate: 250 },
    ];
    labourData.forEach((item) => {
      item.count = item.workersPerSqft * areaSqft;
    });
    const ctx = document.getElementById("labourPieChart").getContext("2d");
    if (window.labourChart instanceof Chart) window.labourChart.destroy();
    window.labourChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labourData.map((item) => item.type),
        datasets: [
          {
            data: labourData.map((item) => item.count),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (context) =>
                context.label + ": " + context.parsed.toFixed(2),
            },
          },
        },
      },
    });
    return labourData;
  }

  // **Updated**: include totalDays in labour cost calculation
  function renderLabourCostTable(labourData, totalDays) {
    const tbody = document.querySelector("#labourTable tbody");
    tbody.innerHTML = "";
    let total = 0;
    labourData.forEach((item) => {
      const cost = item.count * item.rate * totalDays * 0.1;
      total += cost;
      tbody.innerHTML += `
        <tr>
          <td>${item.type}</td>
          <td>${item.count.toFixed(2)}</td>
          <td>${item.rate}</td>
          <td>${cost.toFixed(2)}</td>
        </tr>
      `;
    });
    document.getElementById("labourTotalCost").textContent = total.toFixed(2);
    return total;
  }

  // Render Total Cost Comparison Bar Chart
  function renderTotalCostBarChart(materialTotals, labourTotal) {
    const data = [
      { name: "Steel", cost: materialTotals.sumSteelCost },
      { name: "Cement", cost: materialTotals.sumCementCost },
      { name: "Sand", cost: materialTotals.sumSandCost },
      { name: "Gravel", cost: materialTotals.sumGravelCost },
      { name: "Labour", cost: labourTotal },
    ];
    const ctx = document.getElementById("totalCostBarChart").getContext("2d");
    if (window.totalCostChart instanceof Chart) window.totalCostChart.destroy();
    window.totalCostChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Cost (₹)",
            data: data.map((item) => item.cost),
            backgroundColor: [
              "#4caf50",
              "#2196f3",
              "#ff9800",
              "#9c27b0",
              "#e91e63",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                context.label + ": ₹" + context.parsed.y.toFixed(2),
            },
          },
        },
      },
    });
  }

  // Render Future Cost Projection Chart
  function renderFutureCostChart(years, costs) {
    const ctx = document.getElementById("futureCostChart").getContext("2d");
    if (window.futureCostChart instanceof Chart)
      window.futureCostChart.destroy();
    window.futureCostChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Predicted Total Cost (₹)",
            data: costs,
            borderColor: "#e91e63",
            backgroundColor: "rgba(233,30,99,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Year" } },
          y: {
            title: { display: true, text: "Total Cost (₹)" },
            beginAtZero: false,
          },
        },
      },
    });
  }

  // Save & Render Past Data
  function saveResult(area, floors, grandTotal) {
    const results = JSON.parse(localStorage.getItem("pastResults")) || [];
    const now = new Date();
    results.push({
      date: now.toLocaleString(),
      area,
      floors,
      totalCost: grandTotal.toFixed(2),
    });
    localStorage.setItem("pastResults", JSON.stringify(results));
  }
  function renderPastData() {
    const results = JSON.parse(localStorage.getItem("pastResults")) || [];
    const tbody = document.querySelector("#pastDataTable tbody");
    tbody.innerHTML = "";
    results.forEach((item) => {
      tbody.innerHTML += `
        <tr>
          <td>${item.date}</td>
          <td>${item.area}</td>
          <td>${item.floors}</td>
          <td>₹${item.totalCost}</td>
        </tr>
      `;
    });
    document.getElementById("pastDataContainer").style.display = results.length
      ? "block"
      : "none";
  }

  // Download All Data as Plain Text Report
  function downloadAllData() {
    let reportText = "Estimation Report\n\n";
    const sections = [
      { id: "resultsWrapper", title: "Bill of Quantities" },
      { id: "timeChartContainer", title: "Time Required in Each Phase" },
      {
        id: "timelineContainer",
        title: "Timeline & Estimated Completion Time",
      },
      {
        id: "materialPieContainer",
        title: "Material Consumption Distribution",
      },
      { id: "labourContainer", title: "Labour Distribution and Costs" },
      {
        id: "costComparisonContainer",
        title: "Total Cost Comparison (Materials & Labour)",
      },
      { id: "futureCostChartContainer", title: "Future Cost Projection" },
      { id: "pastDataContainer", title: "Past Data" },
    ];
    sections.forEach((section) => {
      const elem = document.getElementById(section.id);
      if (
        elem &&
        elem.style.display !== "none" &&
        elem.innerText.trim() !== ""
      ) {
        reportText +=
          section.title +
          "\n--------------------\n" +
          elem.innerText.trim() +
          "\n\n";
      }
    });
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estimation_report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Form Submission
  const estimatorForm = document.getElementById("estimatorForm");
  estimatorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const method = document.querySelector("#inputToggle .toggle-option.active")
      .dataset.value;
    const unit = document.querySelector("#unitToggle .toggle-option.active")
      .dataset.value;
    let size = 0;
    if (method === "area") {
      size = parseFloat(document.getElementById("area").value);
    } else {
      const L = parseFloat(document.getElementById("length").value);
      const B = parseFloat(document.getElementById("breadth").value);
      size = L * B;
    }
    const floors = parseInt(document.getElementById("numFloors").value, 10);
    const type = document.getElementById("plotType").value;
    const areaSqft = unit === "meter" ? size * SQM_TO_SQFT : size;

    // Materials
    const { usagePerLevel, total: totals } = calculateMaterialRequirements(
      size,
      unit,
      floors,
      type
    );
    const { rows, grand } = buildTable(usagePerLevel, prices);
    document.getElementById("tableBody").innerHTML = rows;
    document.getElementById("grandTotalCost").textContent = grand.toFixed(2);
    document.getElementById("resultsWrapper").style.display = "block";

    // NEW: Display total material amounts with icons below the material estimates container
    displayMaterialAmounts(totals);

    // Time
    const { phases, durations } = calculatePhaseDurations(floors, areaSqft);
    renderTimeBarChart(phases, durations);
    renderTimelineDiagram(phases, durations);
    document.getElementById("totalTime").textContent =
      getTotalDuration(durations);
    document.getElementById("timeChartContainer").style.display = "block";
    document.getElementById("timelineContainer").style.display = "block";

    // Material pies
    renderMaterialPieCharts(usagePerLevel);
    document.getElementById("materialPieContainer").style.display = "block";

    // Labour
    const labourData = renderLabourPieChart(areaSqft);
    const labourTotal = renderLabourCostTable(
      labourData,
      getTotalDuration(durations)
    );
    document.getElementById("labourContainer").style.display = "block";

    // Show overall total construction cost
    const totalConstructionCost = grand + labourTotal;
    document.getElementById("totalConstructionCost").textContent =
      totalConstructionCost.toFixed(2);
    document.getElementById("totalCostContainer").style.display = "block";

    // Cost comparison
    const materialTotals = {
      sumSteelCost: totals.steel * prices.steel,
      sumCementCost: totals.cement * prices.cement,
      sumSandCost: totals.sand * prices.sand,
      sumGravelCost: totals.gravel * prices.gravel,
    };
    renderTotalCostBarChart(materialTotals, labourTotal);
    document.getElementById("costComparisonContainer").style.display = "block";

    // Future projection
    const currentYear = new Date().getFullYear();
    const inflationRate = 0.05;
    const numberOfYears = 10;
    const predictedYears = [];
    const predictedCosts = [];
    for (let i = 0; i <= numberOfYears; i++) {
      predictedYears.push(currentYear + i);
      predictedCosts.push(grand * Math.pow(1 + inflationRate, i));
    }
    renderFutureCostChart(predictedYears, predictedCosts);
    document.getElementById("futureCostChartContainer").style.display = "block";

    // Save & past data
    saveResult(size, floors, grand);
    renderPastData();
  });

  // Toggle Setup Function
  function setupToggle(containerId, onChange) {
    const container = document.getElementById(containerId);
    const opts = container.querySelectorAll(".toggle-option");
    opts.forEach((opt) => {
      opt.addEventListener("click", () => {
        opts.forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
        onChange(opt.dataset.value);
      });
    });
  }
  setupToggle("inputToggle", (val) => {
    if (val === "area") {
      document.getElementById("areaDiv").style.display = "block";
      document.getElementById("dimDiv").style.display = "none";
      document.getElementById("area").required = true;
      document.getElementById("length").required = false;
      document.getElementById("breadth").required = false;
    } else {
      document.getElementById("areaDiv").style.display = "none";
      document.getElementById("dimDiv").style.display = "block";
      document.getElementById("area").required = false;
      document.getElementById("length").required = true;
      document.getElementById("breadth").required = true;
    }
  });
  setupToggle("unitToggle", (val) => {
    const isM = val === "meter";
    document.getElementById("area").placeholder = `Area (sq ${
      isM ? "m" : "ft"
    })`;
    document.getElementById("length").placeholder = `Length (${
      isM ? "m" : "ft"
    })`;
    document.getElementById("breadth").placeholder = `Breadth (${
      isM ? "m" : "ft"
    })`;
  });

  // Download All Data Button Event
  document
    .getElementById("downloadButton")
    .addEventListener("click", downloadAllData);

  // On load, render any existing Past Data
  renderPastData();
});
