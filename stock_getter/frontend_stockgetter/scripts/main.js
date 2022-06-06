/*!
 * Script file for the site                       
 * By Group 3
 * Initial code by Serguei Chervachidze
 * May 2022                                   
*/

/**
 * --------------------------------------------------------------------------
 * Definitions and setup section 
 * --------------------------------------------------------------------------
 */
// Import Card class
import {Card} from './card.js';
import {favoriteCellRenderer} from './favorites.js';

// Set up the card counter array
let cardArray = [];

// Set up some URL's to access the API's
let stkLstUrl = 'http://127.0.0.1:8000/stock_list/';

// Specify the columns
const columnDefs = [
    { headerName: 'Stock Symbol', field: "short_name", checkboxSelection: true,
        sortable: true, filter: true, sort: 'asc' },
    { headerName: 'Favorite', cellRenderer: favoriteCellRenderer },
    { headerName: 'Name', field: "name", sortable: true, filter: true  },
    { headerName: 'Country', field: "country" },
    { headerName: 'Sector', field: "sector", sortable: true, filter: true },
    { headerName: 'Exchange', field: "exch" , sortable: true, filter: true},
    { headerName: 'Currency', field: "ccy" }
];

// Let the grid know which columns and what data to use
const gridOptionsSym = {
    columnDefs: columnDefs,

    defaultColDef: {
        editable: false,
        resizable: true,
        minWidth: 100,
        flex: 1,
      },
};

// Define needed functions
function setSymbolGrid(data) {
    // Clean data for missing vals
    let clnData = [];
    for (let json of data) {
        if (json['short_name'] != '') {
            clnData.push(json);
        }
    }
    
    // Set the grid and row data
    let grid_div = document.querySelector(`#sym_lst_grid`);
    new agGrid.Grid(grid_div, gridOptionsSym);
    gridOptionsSym.api.setRowData(clnData);
}

function onBtnExportStkData(gridOptionsStk, name, grain) {
    let file = `stk_data_${name}_${grain}`.toLowerCase();
    console.log(`Exporting data to ${file}`);
    let params = {fileName: file};
    gridOptionsStk.api.exportDataAsCsv(params);
}

function onBtnExportPlot(plotDiv, name) {
    let file = `stk_data_${name}`.toLowerCase();
    console.log(`Export plot to ${file}`);
    
    Plotly.downloadImage(plotDiv, {format: 'png', 
        filename: file});
}

/**
 * --------------------------------------------------------------------------
 * Main section
 * --------------------------------------------------------------------------
 */
// Start when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    // Set up the stock symbol fetch fetch
    console.log("Making initial ready fetch");
    console.log(stkLstUrl);

    // Fetch the stock data
    fetch(stkLstUrl, {})
        .then(response => {
            console.log("Response: " + response);
            return response.json();
            })
        .then(data => {
            setSymbolGrid(data['response']);
            console.log('Success');
        })
        .catch((error) => {
            console.log('Error', error);
        });


    // Add event listensers
    // Get stock data listener
    document.querySelector('#get_data').onclick = function() {
        console.log("Getting data for stocks");

        // Handle data on clicking
        let selectedSeries = gridOptionsSym.api.getSelectedRows();

        // Check that something is selected
        if (selectedSeries.length == 0) {
            alert("You must select a stock to get data")
            return;
        }

        // Enable clear all and download all buttons
        if (cardArray.length === 0) {
            document.querySelector('#clear_cards').disabled = false;
            document.querySelector('#get_zip').disabled = false;
        }
        
        // Create card and set event listeners
        if (cardArray.length < 6) {
            // Get grain selection
            let grainValue = document.querySelector('#data_grain').value;

            // Create card
            let idNum = cardArray.length + 1;
            let card = new Card(selectedSeries, grainValue, idNum);
            card.setStockCard();

            // Event listeners
            card.exportDataBtn.onclick = function() {
                console.log(`Downloading data for ${card.stockSymbol}`);
                onBtnExportStkData(card.gridOptionsStk, 
                    card.stockSymbol, card.grain);
            };
            card.exportPlotBtn.onclick = function() {
                console.log(`Downloading plot for ${card.stockSymbol}`);
                onBtnExportPlot(card.plotDivId, card.stockSymbol);
            };
            
            cardArray.push(card);
            
            // Deselect after clicking
            gridOptionsSym.api.deselectAll();

            // Disable the get button
            if (idNum === 5) {
                document.querySelector('#get_data').disabled = true;
            }
        }
    }

    // Clear cards listener
    document.querySelector('#clear_cards').onclick = function() {
            console.log("Clearing all cards for all stocks");
            // Clear everything
            let arLen = cardArray.length;
            for (let i = 0; i < arLen; i++) {
                let card = cardArray.pop();
                card.unsetStockCard();
            }

            // Update the buttons
            document.querySelector('#get_data').disabled = false;
            document.querySelector('#clear_cards').disabled = true;
            document.querySelector('#get_zip').disabled = true;
            console.log(`Length of card array is ${cardArray.length}`);
    }

    // Download all card data listener
    document.querySelector('#get_zip').onclick = function() {
        console.log("Downloading data for all cards for all stocks");

        // Instantiate zipper
        let zip = new JSZip();

        // Iterate over cards and create zip files
        for (let card of cardArray) {
           let outCsv = card.gridOptionsStk.api.getDataAsCsv();
           zip.file(`stk_data_${card.stockSymbol}_${card.grain}.csv`
            .toLowerCase(), outCsv);
        }

        // Save the zip file and log
        zip.generateAsync({type: "blob"}).then(function(content) {
            saveAs(content, "stock_data.zip");
        });
        console.log(`Data download complete`);
    }
});