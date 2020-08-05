var express = require('express');
var router = express.Router();
const fs = require('fs');
var connection = require("../controllers/dbconnection");
// respond with items elements to be listed in the dropdown menu and to list the prices in the frontend
router.get('/store', function (request, response, next) {
  console.log("da5alt index");
  connection.query("Use SolarPanel");
  fs.readFile(__dirname + '/items.json', function (error, data) {
    if (error) {
      response.status(500).send(error);
    } else {
      var itemsJSON = JSON.parse(data);
      console.log(itemsJSON);
      response.send(itemsJSON);
    }
  });
});
// post method to obtain customer's input to return to him the final price to be paid
router.post('/itemselection', function (request, response, next) {
  fs.readFile(__dirname + '/items.json', function (error, data) {
    if (error) {
      response.status(500).send(error);
    } else {
      var itemsJSON = JSON.parse(data);
      console.log(itemsJSON);
      var pump = request.body.pump;
      var checkbox = request.body.checkbox;
      var cableLength = request.body.cableLength;
      var volt = request.body.volt;
      // if user did not select the checkbox, then return the price of the solar pump only without extra cable
      if (!checkbox) {
        for (var x in itemsJSON.solarpumps) {
          console.log("da5alt el for");
          // check if the inserted pump is in our list
          // if true
          if (pump === itemsJSON.solarpumps[x].name) {
            console.log(itemsJSON.solarpumps[x]);
            //return price of the pump
            response.status(200).send(itemsJSON.solarpumps[x].price);
          }
          // if false, return error message
          else {
            return response.status(400).send({
              error: true,
              message: "This item is not on the list"
            })
          }
        }
      } else {
        var totalprice;
        for (var x in itemsJSON.solarpumps) {
          if (pump === itemsJSON.solarpumps[x].name) {
            for (var y in itemsJSON.cable) {
              switch (volt) {
                case "24V":
                if(cableLength>=0.0025&& cableLength<=25)
                {
                  totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.short * cableLength ;
                  return response.status(200).send(totalprice);
                } else if(cableLength>25 && cableLength<=50){
                  totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.long * cableLength ;
                  return response.status(200).send(totalprice);
                }
                  break;
                case "48V":
                  if(cableLength>=0.0025&& cableLength<=35)
                  {
                    totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.short * cableLength ;
                    return response.status(200).send(totalprice);
                  } else if(cableLength>35 && cableLength<=70){
                    totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.long * cableLength ;
                    return response.status(200).send(totalprice);
                  }
                  break;
                case "72V":
                  if(cableLength>=0.0025&& cableLength<=40)
                  {
                    totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.short * cableLength ;
                    return response.status(200).send(totalprice);
                  } else if(cableLength>40 && cableLength<=80){
                    totalprice = itemsJSON.solarpumps[x].price + itemsJSON.cable[y].price.long * cableLength ;
                    return response.status(200).send(totalprice);
                  }
                  break;

                default:
                  return response.status(400).send({
                    error: true,
                    message: "This volt is not listed"
                  });
                  break;
              }
            }
          }
          // if false, return error message
          else {
            return response.status(400).send({
              error: true,
              message: "This item is not on the list"
            })
          }
        }
      }
      response.send(data);
    }
  });
});

module.exports = router;
