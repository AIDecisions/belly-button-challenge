// Original code was modified to only make the API call once and store the data in a global variable

// Global variable for the sample data
let samples_data = [];

// Build the metadata panel
function buildMetadata(sample) {
  // get the metadata field
  let metadata = samples_data.metadata;

  // Filter the metadata for the object with the desired sample number
  let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  let result = resultArray[0];

  // Use d3 to select the panel with id of `#sample-metadata`
  let panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panel.html("");

  // Inside a loop, you will need to use d3 to append new
  // tags for each key-value in the filtered metadata.

  // Note: This for loop comes from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries 
  for ([key, value] of Object.entries(result)) {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  }
 }

// function to build both charts
function buildCharts(sample) {
  // Get the samples field
  let samples = samples_data.samples;

  // Filter the samples for the object with the desired sample number
  let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  let result = resultArray[0];

  // Get the sample_values, otu_ids, and otu_labels
  let sample_values = result.sample_values;
  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;

  // Build a Bubble Chart
  let bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    yaxis: { title: "Number of Bacteria" },
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
    margin: { t: 30}
  };

  let bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];
    
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    
    // Render the Bar Chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Assing the sample data to the global variable
    samples_data = data;

    // Get the names field
    let names = samples_data.names;
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]);
    }

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
