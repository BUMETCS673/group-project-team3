/*!
 * This module contains Card class
 * By Group 3
 * Initial code by Serguei Chervachidze
 * May 2022  
 */

class Card {
    constructor(stockSelection, grain, cardNum) {
        // Set the needed fields
        this.stockSymbol = stockSelection[0]["short_name"];
        this.stockName = stockSelection[0]["name"];
        this.cardNum = cardNum;
        this.grain = grain;

        // Set up elements and ids
        this.gridDivElement = document
            .querySelector(`#stock_data_grid${this.cardNum}`);
        this.plotDivId = `stk_plot${this.cardNum}`;
        this.exportDataBtn = document.querySelector(
            `#export_data${this.cardNum}`)
        this.exportPlotBtn = document.querySelector(
            `#export_plot${this.cardNum}`)

        // Set up backend URL
        this.StkDataUrl = 'http://127.0.0.1:8000/stock_data/';

        // specify the columns
        this.columnDefsStk = [
            { headerName: 'Date', field: "date", sort: 'asc' },
            { headerName: 'Open Price', field: "open" },
            { headerName: 'High Price', field: "high" },
            { headerName: 'Low Price', field: "low" },
            { headerName: 'Close Price', field: "close" },
            { headerName: 'Volume', field: "volume" }
        ];

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

    unsetStockCard() {
        let cardAreaDiv = document.querySelector(`#card_area${this.cardNum}`);
        cardAreaDiv.style.display = "none";
    }

    setStockCard() {
        console.log(`Getting data for stock symbol ${this.stockSymbol} 
            at ${this.grain} grain`)
    
        // Now construct the JSON with request data
        const requestJSON = {
            'Symbol': this.stockSymbol,
            'Grain': this.grain
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
    
        // Now populate
        for (let item of json) {
            date.push(item['date']);
            open.push(item['open']);
            hi.push(item['high']);
            low.push(item['low']);
            close.push(item['close']);
            volume.push(item['volume']);
    
            outArray = [date, open, hi, low, close, volume];
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
            line: {color: '#17BECF'}
          }
          
          let trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'Low',
            x: data[0],
            y: data[3],
            line: {color: '#7F7F7F'}
          }
          
          let trace3 = {
            type: "scatter",
            mode: "lines",
            name: 'Close',
            x: data[0],
            y: data[4],
            line: {color: '#f0187d'}
          }
    
          let plotData = [trace1,trace2, trace3];
    
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
                x: 0.35,
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
