<h1>Construction Estimator Application</h1>

<p>
This repository contains a web-based construction estimator tool that calculates material requirements, construction time durations, labor needs, and future cost projections based on user inputs such as building area, dimensions, number of floors, and layout type. The application features dynamic user interactions, data visualizations using Chart.js, and options for saving and exporting estimation results.
</p>

<h2>Overview</h2>

<p>
When the document loads, the application sets up various event listeners to manage user interactions. These include opening and closing navigation menus and modals, toggling between login and signup forms, and displaying dynamic charts and tables based on calculated data. The tool leverages asynchronous data fetching (simulated API calls) along with several calculation algorithms to deliver detailed construction estimates.
</p>

<h2>UI Interactions and Navigation</h2>

<h3>Mobile Navbar</h3>

<p>
A hamburger button is used to toggle the mobile navigation menu. Clicking the button adds or removes a CSS class that displays or hides the menu. A dedicated close button within the menu triggers the same action to hide the navigation options.
</p>

<h3>Login/Signup Popup</h3>

<p>
The application uses a popup modal for user authentication. Clicking the login button displays the popup by adding a specific CSS class to the body. Users can switch between the login and signup views within the modal by toggling a sub-class. The modal also features a close button to dismiss the popup.
</p>

<h2>Fetching and Displaying Material Prices</h2>

<p>
The application simulates an asynchronous API call that retrieves material prices for steel, cement, sand, and gravel. Once retrieved, the prices are formatted and displayed alongside corresponding icons in the user interface.
</p>

<h2>Material Requirement Calculation Logic</h2>

<h3>Average Consumption Configurations</h3>

<p>
The estimator uses predefined average material consumption values per square foot for two layout types:
</p>

<p>
<b>2BHK:</b> Steel: 0.005 tonnes per sqft, Cement: 20 kg per sqft, Sand: 0.09 m³ per sqft, Gravel: 0.055 tonnes per sqft.
</p>

<p>
<b>3BHK:</b> Steel: 0.006 tonnes per sqft, Cement: 21 kg per sqft, Sand: 0.09 m³ per sqft, Gravel: 0.06 tonnes per sqft.
</p>

<h3>Area Conversion (SQM to SQFT)</h3>

<p>
A conversion factor of 10.764 is used to convert the input area in square meters to square feet before any calculations take place.
</p>

<h3>Distribution Function for Multi-Level Structures</h3>

<p>
For multi-level buildings, material usage is distributed as follows:
</p>

<p>
For a one-floor building, 10% of the material is allocated to the foundation and 90% to the floor. In multi-floor structures, 10% is reserved for the foundation, 30% for the ground floor, and the remaining 60% is split equally among the upper floors.
</p>

<h3>Material Requirement Calculation</h3>

<p>
The function that calculates material requirements takes into account the building area (converted to sqft if needed), the chosen layout type (2BHK or 3BHK), and the number of floors. Total material usage is computed by multiplying the area by the consumption rate per sqft and the number of floors, with the resulting totals distributed appropriately across the structure.
</p>

<h2>Time Estimation Calculations</h2>

<h3>Per-Square-Foot Phase Durations</h3>

<p>
Each construction phase has a fixed time allocation per square foot: 
</p>

<p>
<b>Foundation:</b> 0.08 days per sqft.
</p>

<p>
<b>Floor (ground and upper floors):</b> 0.06 days per sqft.
</p>

<p>
Optionally, finishing work is estimated at 0.1 days per sqft.
</p>

<h3>Total Duration Calculation</h3>

<p>
The function that calculates phase durations works by multiplying the area (in sqft) by the time per sqft for each phase. This results in durations for the foundation, ground floor, and each upper floor. A helper function aggregates these values to provide the total construction duration.
</p>

<h2>Cost Calculation and Summary</h2>

<h3>Material Cost Calculation</h3>

<p>
For each building level, material cost is calculated by multiplying the quantity of each material by its corresponding unit price. The following formula is used:
</p>

<p>
Cost per Floor = (Steel usage &times; Steel price) + (Cement usage &times; Cement price) + (Sand usage &times; Sand price) + (Gravel usage &times; Gravel price).
</p>

<h3>Table Generation and Summation</h3>

<p>
An HTML table is dynamically generated to display a breakdown of material usage and costs per level. This includes labeling of floors (using proper ordinal suffixes) and calculating a grand total for the entire project.
</p>

<h2>Chart Rendering and Visualization</h2>

<h3>Material Consumption Pie Charts</h3>

<p>
Doughnut charts are rendered for each material type to illustrate the distribution of material usage across different floors.
</p>

<h3>Time Bar Chart & Timeline Diagram</h3>

<p>
A bar chart displays the duration (in days) for each construction phase, and a vertical timeline diagram provides a sequential visual representation of the project phases.
</p>

<h3>Labour Analysis</h3>

<p>
Labor requirements are estimated based on worker ratios (skilled, semi-skilled, and unskilled workers per sqft) along with their respective rates. A pie chart displays the distribution of labor types, and a table outlines the detailed labor cost calculations.
</p>

<h3>Total Cost Comparison and Future Projection</h3>

<p>
A bar chart compares the costs of materials and labor. Additionally, a future cost projection chart predicts construction costs over a 10-year period using an annual inflation rate of 5% using the formula:
</p>

<p>
Future Cost = Current Cost &times; (1.05)<sup>i</sup>, where <i>i</i> represents the number of years.
</p>

<h2>Supporting Features</h2>

<h3>Saving and Displaying Past Results</h3>

<p>
Estimation results (including date, area, number of floors, and total cost) are saved to local storage and displayed in a results table on subsequent page loads.
</p>

<h3>Downloading Estimation Reports</h3>

<p>
Users can download a comprehensive text report that consolidates the bill of quantities, time estimates, material charts, and labor details for offline record keeping.
</p>

<h2>Toggle and Form Interactions</h2>

<p>
The estimator provides toggle controls to switch between input modes (total area versus individual dimensions) and to select measurement units (meters or feet). These toggles dynamically update the visible input fields and placeholder text, ensuring the correct data is captured.
</p>

<h2>Summary of Formulas and Calculations</h2>

<p>
Area Conversion: If the input unit is in meters, the area is converted to square feet by multiplying by 10.764.
</p>

<p>
Total Material Calculation: Total Material = Area (sqft) &times; Consumption Rate &times; Number of Floors.
</p>

<p>
Material Distribution: One-floor: 10% foundation, 90% floor; Multi-floor: 10% foundation, 30% ground floor, 60% divided equally among upper floors.
</p>

<p>
Time Estimation: Foundation time = 0.08 &times; Area (sqft) (days); Floor time = 0.06 &times; Area (sqft) (days per floor).
</p>

<p>
Labor Cost Calculation: Labour Cost = Worker Count &times; Rate &times; Total Duration &times; 0.1.
</p>

<p>
Future Cost Projection: Future Cost = Current Cost &times; (1.05)<sup>i</sup>, for each future year i.
</p>

<h2>Conclusion</h2>

<p>
This construction estimator tool integrates dynamic UI interactions, asynchronous data fetching, and robust calculation logic to provide detailed construction cost and time estimates. The clear structure and modular functions make it easy to maintain and enhance the application in the future.
</p>
