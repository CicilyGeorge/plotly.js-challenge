let selDataset = d3.select("#selDataset");
let info_box = d3.select("#sample-metadata");


function init() {
    d3.json("samples.json").then(function(data){
        // Getting each dataset from the data
        let ids = data.metadata.map(names => names.id);

        // Appending option tags to Select tag for Dropdown
        let options = selDataset.selectAll('option')
                                .data(ids)
                                .enter()
                                .append('option')
                                .attr("value", (d) => d)
                                .text((d) => d)
                                .property("selected", (d) => d == ids[0]);

    });
}



function updatePlots() {
    d3.json("samples.json").then(function(data){

        dataSet = selDataset.property("value");



        let metadata = data.metadata.filter(names => names.id == dataSet);
        let info_type = Object.keys(metadata[0]);
        info_box.html("");
        info_type.forEach((type) => {
            
            info_box.append('p')
                    .html(`<span class='info_type'>${type} : </span> ${metadata[0][type]}`);
        });


                
        let samples = data.samples.filter(names => names.id == dataSet)[0];        
        var otu_ids = samples.otu_ids;
        let ids = otu_ids.slice(0,10).reverse().map((id) => "OTU "+id)
        var labels = samples.otu_labels;
        var values = samples.sample_values;



        // Ploting Top 10
        var bar_data = [{
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
                
        // Apply the group bar mode to the layout
        var layout = {
            plot_bgcolor:"#272727",
            paper_bgcolor:"#262626",
            title: "Top 10",
            xaxis: {
                range: [0, 250]
            },
            // margin: {
            // l: 100,
            // r: 100,
            // t: 400,
            // b: 100
            // }
        };
                
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", bar_data, layout);


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
          
          var layout = {
            plot_bgcolor:"black",
            paper_bgcolor:"#262626",
            title: 'Bubble Chart Hover Text',
            showlegend: false,
            height: 600,
            width: 900
          };
          
          Plotly.newPlot('bubble', bubble_data, layout);
          


          // Calling Gauge Chart function from bonus.js
          plotGauge(+metadata[0].wfreq);

    });
}


init();
updatePlots();
selDataset.on("change", updatePlots);
   



