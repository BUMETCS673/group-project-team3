/*!
 * This module contains Card class
 * By Serguei Chervachidze
 * July 2021
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

        // Daily time series API
        this.dailyStkUrl = 'https://www.alphavantage.co/query?function='
        this.dailyStkUrl += 'TIME_SERIES_DAILY';
        this.dailyStkUrl += '&outputsize=full&apikey=Q5SUUT82ASKLSWB1';

        // Weekly time series API
        this.weeklyStkUrl = 'https://www.alphavantage.co/query?function=';
        this.weeklyStkUrl += 'TIME_SERIES_WEEKLY&apikey=Q5SUUT82ASKLSWB1';

        // Monthly time series API
        this.monthlyStkUrl = 'https://www.alphavantage.co/query?function=';
        this.monthlyStkUrl += 'TIME_SERIES_MONTHLY&apikey=Q5SUUT82ASKLSWB1';

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
    
        // Construct url for API and key for parsing JSON
        let url = '';
        let parseKey = '';
    
        if (this.grain == 'daily') {
            url = this.dailyStkUrl;
            parseKey = 'Time Series (Daily)'
        } else if (this.grain == 'weekly') {
            url = this.weeklyStkUrl;
            parseKey = 'Weekly Time Series';
        } else {
            url = this.monthlyStkUrl;
            parseKey = 'Monthly Time Series';
        }
    
        // Add in stock symbol
        url += `&symbol=${this.stockSymbol}`;
    
        // Fetch the data 
        console.log(url);
        fetch(url, {})
            .then(response => {
                console.log("Response: " + response);
                return response.json();
                })
            .then(data => {
                let gridData = this.extractGridData(data[parseKey]);
                let plotData = this.extractPlotData(data[parseKey])
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
        for (let key in json) {
            let row = {'date': key};
            row['open'] =   json[key]['1. open'];
            row['high'] =   json[key]['2. high'];
            row['low'] =    json[key]['3. low'];
            row['close'] =  json[key]['4. close'];
            row['volume'] = json[key]['5. volume'];        
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
        for (let key in json) {
            date.push(key);
            open.push(json[key]['1. open']);
            hi.push(json[key]['2. high']);
            low.push(json[key]['3. low']);
            close.push(json[key]['4. close']);
            volume.push(json[key]['5. volume']);
    
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
