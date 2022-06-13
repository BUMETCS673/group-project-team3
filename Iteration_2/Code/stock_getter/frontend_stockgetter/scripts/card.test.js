//Unit test for functions:
// makeCardVisible, setCardTitle,makeSpinnerVisible,
// makeSpinnerInvisible,unsetStockCard
// more Unit test will be added in the future.
//
import { expect, it,vi } from "vitest";
import { Card } from "./card";
import fs from 'fs';
import path from 'path';
import { Window } from 'happy-dom';


// getting file path for dashboard.html
const htmlDocPath = path.join(process.cwd(),"..", '/dashboard.html');
// converting HTML to string
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window();
const document = window.document;
document.write(htmlDocumentContent);
vi.stubGlobal('document', document);
//creating a new card that will be used for following tests.
let card=new Card("AAPL","Weekly",1);

it("make card visible",()=>{
    card.makeCardVisible();
    let cardAreaDiv = document.querySelector(`#card_area1`);
    expect(cardAreaDiv.style.display).toBe("block");
});


it("set card title",()=>{
    card.setCardTitles("Apple Card");
    let tbl_h3 = document.querySelector(`#stk_tbl_title1`);
    expect(tbl_h3.innerHTML).includes("Apple Card");
});

it("make data spinner visible",()=>{
    card.cardNum=1;
    card.makeSpinnerVisible("AAPL");
    expect(card.spinnerTextContainer.style.display).toBe("block");
});

it("make data spinner invisible",()=>{
    card.cardNum=1;
    card.makeSpinnerInvisible();
    expect(card.spinnerTextContainer.style.display).toBe("none");
});

it("unset stock card",()=>{
    card.cardNum=1;
    card.unsetStockCard();
    let cardAreaDiv = document.querySelector(`#card_area1`);
    expect(cardAreaDiv.style.display).toBe("none")
})