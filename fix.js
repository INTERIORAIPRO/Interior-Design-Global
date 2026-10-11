const fs = require("fs");
const p = "src/lib/partner-store/catalog.ts";
let c = fs.readFileSync(p, "utf8");
let toAdd = "";
if(!c.includes("primaryPartnerStore")){
  toAdd += "\nexport const primaryPartnerStore = { name: \"Kave Home\", slug: \"kave-home\", url: \"https://kavehome.com\" };\n";
}
if(!c.includes("withAffiliateParams")){
  toAdd += "\nexport function withAffiliateParams(url, params){ return url; }\n";
}
if(!c.includes("formatProductDimensions")){
  toAdd += "\nexport function formatProductDimensions(p){ return p?.dimensions || \"\"; }\n";
}
if(!c.includes("formatProductPrice")){
  toAdd += "\nexport function formatProductPrice(price){ return price ? price + \" RON\" : \"\"; }\n";
}
if(!c.includes("partnerProducts")){
  toAdd += "\nexport const partnerProducts = [];\n";
}
if(!c.includes("getPartnerProducts")){
  toAdd += "\nexport function getPartnerProducts(){ return []; }\n";
}
if(!c.includes("getPartnerProduct")){
  toAdd += "\nexport function getPartnerProduct(id){ return null; }\n";
}
if(toAdd){
  fs.writeFileSync(p, c + toAdd, "utf8");
  console.log("Adaugat getPartnerProduct si celelalte exporturi in catalog.ts!");
} else {
  console.log("Toate exporturile exista deja!");
}
