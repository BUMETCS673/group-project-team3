/*!
 * This module contains Card class
 * By Group 3
 * Initial code by Serguei Chervachidze
 * May 2022  
 */

class Card {
    constructor(stockSelection, grain, cardNum, forecast=true) {
        // Set the needed fields
        this.stockSymbol = stockSelection[0]["short_name"];
        this.stockName = stockSelection[0]["name"];
        this.cardNum = cardNum;
        this.grain = grain;
        this.forecast = forecast

        // Set up elements and ids
        this.gridDivElement = document
            .querySelector(`#stock_data_grid${this.cardNum}`);
        this.plotDivId = `stk_plot${this.cardNum}`;
        this.exportDataBtn = document.querySelector(
            `#export_data${this.cardNum}`);
        this.exportPlotBtn = document.querySelector(
            `#export_plot${this.cardNum}`);

        this.dataSpinner = document.querySelector('#get_data_spinner');
        this.spinnerTextContainer = document.querySelector('#spinner_text_container');
        this.spinnerText = document.querySelector('#spinner_text');

        // Set up backend URL
        this.StkDataUrl = 'http://127.0.0.1:8000/stock_data/';

        // specify the columns
        if (this.forecast) {
            this.columnDefsStk = [
                { headerName: 'Date', field: "date", sort: 'asc' },
                { headerName: 'Open Price', field: "open" },
                { headerName: 'High Price', field: "high" },
                { headerName: 'Low Price', field: "low" },
                { headerName: 'Close Price', field: "close" },
                { headerName: 'Volume', field: "volume" },
                { headerName: 'Open Price Forecast', field: "open_forecast" },
                { headerName: 'High Price Forecast', field: "high_forecast" },
                { headerName: 'Low Price Forecast', field: "low_forecast" },
                { headerName: 'Close Price Forecast', field: "close_forecast" },
                { headerName: 'Volume Forecast', field: "volume_forecast" }
            ];
        }  else {
            this.columnDefsStk = [
                { headerName: 'Date', field: "date", sort: 'asc' },
                { headerName: 'Open Price', field: "open" },
                { headerName: 'High Price', field: "high" },
                { headerName: 'Low Price', field: "low" },
                { headerName: 'Close Price', field: "close" },
                { headerName: 'Volume', field: "volume" }
            ];
        }          
        // let the grid know which columns and what data to use
        this.gridOptionsStk = {
            columnDefs: this.columnDefsStk,

            defaultColDef: {
                editable: false,
                resizable: true,
                minWidth: 100,
                flex: 1,
            },
        };
    }

    // Function to make spinner visible
    makeSpinnerVisible(name) {
        this.dataSpinner.style.display = "block";
        this.spinnerText.innerHTML = "Loading stock data/generating forecasts";
        this.spinnerText.innerHTML += ` for ${name}`;
        this.spinnerTextContainer.style.display = "block";
    }

    // Function to make spinner invisible
    makeSpinnerInvisible() {
        this.dataSpinner.style.display = "none";
        this.spinnerTextContainer.style.display = "none";
        this.spinnerText = '';
    }

    unsetStockCard() {
        let cardAreaDiv = document.querySelector(`#card_area${this.cardNum}`);
        cardAreaDiv.style.display = "none";
    }

    setStockCard(forecast=false, horizon=10) {
        console.log(`Getting data for stock symbol ${this.stockSymbol} 
            at ${this.grain} grain`)

        // Make spinner visible
        this.makeSpinnerVisible(this.stockName);
    
        // Now construct the JSON with request data
        const requestJSON = {
            'Symbol': this.stockSymbol,
            'Grain': this.grain
        }

        // Add additional fields if requesting a forecast
        if (forecast) {
            requestJSON.Forecast = true;
            requestJSON.horizon = horizon;
        }

        // Construct the request options (make sure it's JSON)
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(requestJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        // Fetch the data 
        let fetchMsg = `Getting data for stock ${this.stockSymbol} `;
        fetchMsg += `at grain ${this.grain}`
        console.log(fetchMsg);
        
        fetch(this.StkDataUrl, requestOptions)
            .then(response => {
                console.log("Response: " + response);
                return response.json();
                })
            .then(data => {
                let gridData = this.extractGridData(data['data']);
                let plotData = this.extractPlotData(data['data'])
                this.setStockGrid(gridData);
                this.setStockPlot(plotData);
                this.setCardTitles(this.stockName);
                this.makeSpinnerInvisible();
                this.makeCardVisible();
                console.log('Success setting stock grid and plot');
            })
            .catch((error) => {
                console.log('Error', error);
            });
    }

    extractGridData(json) {
        // Create a new flattened json object
        let outArray = [];
    
        // Now populate
        for (let item of json) {
            let row = {'date': item['date']};
            row['open'] =   item['open'];
            row['high'] =   item['high'];
            row['low'] =    item['low'];
            row['close'] =  item['close'];
            row['volume'] = item['volume'];
            
            // Handle the forecast case
            if (this.forecast) {
                row['open_forecast'] =   item['open_forecast'];
                row['high_forecast'] =   item['high_forecast'];
                row['low_forecast'] =    item['low_forecast'];
                row['close_forecast'] =  item['close_forecast'];
                row['volume_forecast'] = item['volume_forecast'];
            }

            outArray.push(row);
        }
        return outArray;
    }
    
    extractPlotData(json) {
        let outArray = [];
        let date = [];
        let hi = [];
        let low = [];
        let open = [];
        let close = [];
        let volume = [];

        let hi_forecast = [];
        let low_forecast = [];
        let open_forecast = [];
        let close_forecast = [];
        let volume_forecast = [];
    
        // Now populate, handling the forecast case
        if (this.forecast) {
            for (let item of json) {
                date.push(item['date']);
                open.push(item['open']);
                hi.push(item['high']);
                low.push(item['low']);
                close.push(item['close']);
                volume.push(item['volume']);
                open_forecast.push(item['open_forecast']);
                hi_forecast.push(item['high_forecast']);
                low_forecast.push(item['low_forecast']);
                close_forecast.push(item['close_forecast']);
                volume_forecast.push(item['volume_forecast']);
        
                outArray = [
                    date, open, hi, low, close, volume,
                    open_forecast, hi_forecast, low_forecast,
                    close_forecast, volume_forecast
                ];
            }
        
        } else {
            for (let item of json) {
                date.push(item['date']);
                open.push(item['open']);
                hi.push(item['high']);
                low.push(item['low']);
                close.push(item['close']);
                volume.push(item['volume']);
        
                outArray = [date, open, hi, low, close, volume];
            }
        }
        return outArray;
    }

    setStockGrid(data) {
        // Get the div and clear it just in case
        this.gridDivElement.innerHTML = '';
    
        // Set the grid and row data
        new agGrid.Grid(this.gridDivElement, this.gridOptionsStk);
        this.gridOptionsStk.api.setRowData(data);
    }
    
    setStockPlot(data) {
        let trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'High',
            x: data[0],
            y: data[2],
            mode: 'markers',
            marker: {
                color: '#17BECF',
                size: 2
            }
          }
          
          let trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'Low',
            x: data[0],
            y: data[3],
            mode: 'markers',
            marker: {
                color: '#7F7F7F',
                size: 2
        
            }
          }
          
          let trace3 = {
            type: "scatter",
            mode: "lines",
            name: 'Close',
            x: data[0],
            y: data[4],
            mode: 'markers',
            marker: {
                color: '#f0187d',
                size: 2
            }
          }
          
        // Handle forecast case
          let plotData = []
          if (this.forecast) {
            let trace4 = {
                type: "scatter",
                mode: "lines",
                name: 'High Forecast',
                x: data[0],
                y: data[7],
                line: {
                    color: '#17BECF',
                    width: 1
                }
              }
              
              let trace5 = {
                type: "scatter",
                mode: "lines",
                name: 'Low Forecast',
                x: data[0],
                y: data[8],
                line: {
                    color: '#7F7F7F',
                    width: 1
                }
              }
              
              let trace6 = {
                type: "scatter",
                mode: "lines",
                name: 'Close Forecast',
                x: data[0],
                y: data[9],
                line: {
                    color: '#f0187d',
                    width: 1
                }
              }
              plotData = [trace1,trace2, trace3, trace4, trace5, trace6];
          
            } else {
              plotData = [trace1,trace2, trace3];
          }

          let legPositon;
          if (this.forecast) {
            legPositon = 0.05
          } else {
            legPositon = 0.35
          }
    
          let layout = {
            title: 'Stock Price History',
            yaxis: {
                title: 'Stock Price, $'},
            xaxis : {
                rangeselector: {buttons: [
                    {
                      count: 1,
                      label: '1m',
                      step: 'month',
                      stepmode: 'backward'
                    },
                    {
                      count: 6,
                      label: '6m',
                      step: 'month',
                      stepmode: 'backward'
                    },
                    {step: 'all'}
                  ]},
                type: 'date'
            },
    
            legend: {
                orientation: 'h',
                x: legPositon,
            }
          };
          
          Plotly.newPlot(this.plotDivId, plotData, layout, 
            {responsive: true,
            modeBarButtonsToRemove: ['toImage']});
    }
    
    setCardTitles(name) {
        let tbl_h3 = document.querySelector(`#stk_tbl_title${this.cardNum}`);
        tbl_h3.innerHTML = `Price History for ${name}`;
    
        let plot_h3 = document.querySelector(`#stk_plot_title${this.cardNum}`);
        plot_h3.innerHTML = `Plot for ${name}`;
    }

    makeCardVisible() {
        // Make card visible
        let cardAreaDiv = document.querySelector(`#card_area${this.cardNum}`);
        cardAreaDiv.style.display = "block";
    }
}

// Export class
export {Card};
