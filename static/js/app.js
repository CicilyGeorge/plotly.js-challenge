// Selecting the Dropdown DOM element
let selDataset = d3.select("#selDataset");

let info_box = d3.select("#sample-metadata");

// Function to Load the dropdown items on page load
function init() {
  // reading data from json file
    d3.json("../../data/samples.json").then(function(data){
        // Getting each dataset from the data
        let ids = data.metadata.map(names => names.id);

        // Appending option tags to Select tag for Dropdown
        let options = selDataset.selectAll('option')
                                .data(ids)
                                .enter()
                                .append('option')
                                .attr("class", "idOption")
                                .attr("value", (d) => d)
                                .text((d) => d)
                                .property("selected", (d) => d == ids[0]);

    });
}


// Function to create Plots on selected Dropdown item
function createPlots() {
    // Reading data from json file
    d3.json("../../data/samples.json").then(function(data){
        // Getting id choosen from dropdown
        dataSet = selDataset.property("value");

        // Getting metadata from of selected id and appending it to Demographic info box
        let metadata = data.metadata.filter(names => names.id == dataSet);
        let info_type = Object.keys(metadata[0]);
        info_box.html("");
        info_type.forEach((type) => {
            
            info_box.append('p')
                    .html(`<span class='info_type'>${type.toUpperCase()} : </span> ${metadata[0][type]}`);
        });


        // Extracting samples data for bar plot
        let samples = data.samples.filter(names => names.id == dataSet)[0];        
        let otu_ids = samples.otu_ids;
        let ids = otu_ids.slice(0,10).reverse().map((id) => "OTU "+id)
        let labels = samples.otu_labels;
        let values = samples.sample_values;



        // Ploting Bar chart that displays Top 10 otu-ids
        let bar_data = [{
            x: values.slice(0,10).reverse(),
            y: ids,
            text: labels.slice(0,10).reverse(),
            // name: "Greek",
            type: "bar",
            orientation: "h",
            opacity: 0.7,
            marker: {
              color: 'rgb(158,202,225)',
              line: {
                color: 'rgb(8,48,107)',
                width: 1.5
              }
            }
        }];

        // Plot Layout
        var layout = {
            plot_bgcolor:"#272727",
            paper_bgcolor:"#262626",
            title: "<b>Top 10 Sample Values</b>",
            xaxis: {
                title: "Sample Values"
            },
            font: {
              color: '#a1a1a1'
            },
            automargin: true
        };
              
        // Render the bar plot
        Plotly.newPlot("bar", bar_data, layout, {responsive: true});



        //  Plotting bubble chart that displays each sample
        var bubble_data = [{
            x: otu_ids,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              colorscale: 'Earth',
              size: values
            }
          }];

          // Plot Layout
          var layout = {
            plot_bgcolor:"#262626",
            paper_bgcolor:"#222222",
            title: '<b>Values of Each Sample</b>',
            xaxis: {
              title: "OTU ID"
            },
            height: 600,
            showlegend: false,
            font: {
              color: '#a1a1a1'
            },
            automargin: true
          };
          let config = {
            displayModeBar: false, // this is the line that hides the bar.
            responsive: true
          };
          // Render the bubble chart
          Plotly.newPlot('bubble', bubble_data, layout, config);
          


          // Calling Gauge Chart function from bonus.js
          plotGauge(+metadata[0].wfreq);

    });
}

// Calling functions on page load
init();
createPlots();
// On Dropdown Select event Calling create plot function
selDataset.on("change", createPlots);
   



