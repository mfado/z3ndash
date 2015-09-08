/*
Mark Fado - mfado@zendesk.com
2015-08-12

USAGE: Call the main function goDash() with no parameters. It will probably work.

CREDITS: 
- Matt Barker. Used his Ducksboard script as boilerplate
- Gian Fontanilla. Troubleshooted the recursive function pullFromZD

Requires the following Script Properties (File > Project Properties > Script Properties)
- zd_username (bob@ross.com)
- zd_subdomain (support)
- zd_token (ULTRA_TOP_SECRET_API_TOKEN)
- gb_token (geckoboard API token)

To do:
- add timeout to recursive function pullFromZD
- check .length error for array
- MOAR comments
- add logging per action
- check logic, need to avoid 5pm solves for the next period
*/


// Widget ID's

var title = "155900-5125b693-3e4f-449f-9e76-8daef431d8b2";

var manT1W1 = "155900-de805c6d-8be1-4a85-9348-facd73e42875";
var manT2W1 = "96241-08c49db0-264d-0133-a9a3-22000b51936c";
var manT3W1 = "96241-0a9ed200-264d-0133-0752-22000b490a2f";

var melT1W1 = "96241-13696a70-264d-0133-5d12-22000b5b8090";
var melT2W1 = "96241-1770f130-264d-0133-e35c-22000b5391df";
var melT3W1 = "96241-1b9c1410-264d-0133-e35d-22000b5391df";

var totalT1W1 = "96241-91980510-26b6-0133-e386-22000b5391df";
var totalT2W1 = "96241-9ad08880-26b6-0133-a9c6-22000b51936c";
var totalT3W1 = "96241-9fe51a30-26b6-0133-d0e4-22000b559a7d";

var weeklyT1 = "155900-deaa0bf1-2837-479a-974f-17ad3f0308fb";
var weeklyT2 = "96241-d18c9520-3773-0133-ff43-22000b5391df";
var weeklyT3 = "96241-eb805f60-3773-0133-7920-22000b5b8090";



// Min + Max for Gecko-o-meter widget

var globalMin = 0;
var T1Max = 750;
var T2Max = 300;
var T3Max = 30;

// Agents array

var arrManilaT1 = [
  {"Name":"Janelle Pena","ID":"1028547577"},
  {"Name":"Sarah Aristain","ID":"1137150448"},
  {"Name":"Gab Manlapig","ID":"1022903156"},
  {"Name":"Darwin Cruz","ID":"856827313"},
  {"Name":"Anna Mae Alonzo","ID":"1099405738"},
  {"Name":"Angel Altura","ID":"1137150348"},  
  {"Name":"Arthur Mori","ID":"382773698"}  
];


var arrManilaT2 = [
  {"Name":"Alex De Jesus","ID":"688825177"},
  {"Name":"Alex Perez","ID":"962139513"},
  {"Name":"Kevin Jardiniano","ID":"700216896"},
  {"Name":"Erin Andres","ID":"1005729913"}
];
    
var arrManilaT3 = [
  {"Name":"Mark Fado","ID":"415880477"},
  {"Name":"Gian Fontanilla","ID":"1137150418"}  
];

var arrMelbT1 = [
  {"Name":"Amie Brennan","ID":"803582193"},
  {"Name":"Sanket Khodankar","ID":"132713933"},
  {"Name":"Kay Noda","ID":"489579936"}
];

var arrMelbT2 = [
  {"Name":"Hiro Iguchi","ID":"489579916"},
  {"Name":"Scott Williamson","ID":"1016681996"},
  {"Name":"Dan Beirouty","ID":"700639477"},
  {"Name":"Tania Panagacos","ID":"256181548"}
];
    
var arrMelbT3 = [
  {"Name":"David Lowe","ID":"496968536"}
];




function goDash() {
  // daily  
  localManila = getLocal("man");
  hoursManila = getHours(localManila,"man");
  
  localMelb = getLocal("melb");
  hoursMelb = getHours(localMelb,"melb");  
      
  // daily Manila T1    
  countManT1 = pullFromZD(buildView(arrManilaT1,hoursManila));
  payloadManT1 = buildPayload(countManT1);
  pushtoGecko(manT1W1,payloadManT1);

  // daily Manila T2
  countManT2 = pullFromZD(buildView(arrManilaT2,hoursManila));
  payloadManT2 = buildPayload(countManT2);
  pushtoGecko(manT2W1,payloadManT2);
    
  // daily Manila T3
  countManT3 = pullFromZD(buildView(arrManilaT3,hoursManila));
  payloadManT3 = buildPayload(countManT3);
  pushtoGecko(manT3W1,payloadManT3);  

  // daily Melbourne T1
  countMelbT1 = pullFromZD(buildView(arrMelbT1,hoursMelb));
  payloadMelbT1 = buildPayload(countMelbT1);
  pushtoGecko(melT1W1,payloadMelbT1);

  // daily Melbourne T2
  countMelbT2 = pullFromZD(buildView(arrMelbT2,hoursMelb));
  payloadMelbT2 = buildPayload(countMelbT2);
  pushtoGecko(melT2W1,payloadMelbT2);

  // daily Melbourne T3
  countMelbT3 = pullFromZD(buildView(arrMelbT3,hoursMelb));
  payloadMelbT3 = buildPayload(countMelbT3);
  pushtoGecko(melT3W1,payloadMelbT3);  
  
  // daily Total T1  
  totalT1 = countManT1 + countMelbT1;
  payloadTotalT1 = buildPayload(totalT1);
  pushtoGecko(totalT1W1,payloadTotalT1);  

  // daily Total T2
  totalT2 = countManT2 + countMelbT2;
  payloadTotalT2 = buildPayload(totalT2);
  pushtoGecko(totalT2W1,payloadTotalT2);  

  // daily Total T3
  totalT3 = countManT3 + countMelbT3;
  payloadTotalT3 = buildPayload(totalT3);
  pushtoGecko(totalT3W1,payloadTotalT3);     
  
  // weekly, function that caculates how may days to multiply by
  weeklyManila = calcWeekly("manila") + hoursManila;
  weeklyMelbourne = calcWeekly("melbourne") + hoursMelb;

  Logger.log("Manila hours" + calcWeekly("manila"));
  Logger.log("Manila get hours" + hoursManila);  
  
  Logger.log("Melbourne hours" + calcWeekly("melbourne"));
  Logger.log("Melbourne get hours" + hoursMelb);   

  // weekly T1
  totalWeeklyManT1 = pullFromZD(buildView(arrManilaT1,weeklyManila));
  totalWeeklyMelbT1 = pullFromZD(buildView(arrMelbT1,weeklyMelbourne));
  payloadweeklyT1 = buildPayloadMeter(totalWeeklyManT1 + totalWeeklyMelbT1,globalMin,T1Max);
  pushtoGecko(weeklyT1,payloadweeklyT1);  
  
  // weekly T2
  totalWeeklyManT2 = pullFromZD(buildView(arrManilaT2,weeklyManila));
  totalWeeklyMelbT2 = pullFromZD(buildView(arrMelbT2,weeklyMelbourne));
  payloadweeklyT2 = buildPayloadMeter(totalWeeklyManT2 + totalWeeklyMelbT2,globalMin,T2Max);
  pushtoGecko(weeklyT2,payloadweeklyT2);  

  // weekly T3
  totalWeeklyManT3 = pullFromZD(buildView(arrManilaT3,weeklyManila));
  totalWeeklyMelbT3 = pullFromZD(buildView(arrMelbT3,weeklyMelbourne));
  payloadweeklyT3 = buildPayloadMeter(totalWeeklyManT3 + totalWeeklyMelbT3,globalMin,T3Max);
  pushtoGecko(weeklyT3,payloadweeklyT3);  
    
  // title
  payloadTitle = buildPayload("<b>Team APAC Dash</b>");
  //pushtoGecko(title,payloadTitle);        
}





function buildView(group,sinceSolved) {  
  var data = {
    "view": {
      "conditions": {
        "all": [{
          "field": "status",
          "operator": "is",
          "value": "solved"
        }, {
          "field": "SOLVED",
          "operator": "less_than",
          "value": sinceSolved
        }]    
      }
    }
  };
  data["view"]["conditions"]["any"] = createUserArray(group);
  return JSON.stringify(data);  
}

function buildPayload(payloadValue) {
  var data = {
    "api_key": getProperty('gb_token'),    
    "data": {
        "item": [{
          "value": payloadValue
        }]    
    }
  };
  return JSON.stringify(data);  
}

function buildPayloadMeter(payloadValue,min,max) {
  var data = {
    "api_key": getProperty('gb_token'),    
    "data": {
        "item": payloadValue,
        "min" : {
          "value":min
      },
        "max" : {
          "value":max
      }      
    }
  };
  return JSON.stringify(data);  
}

function pushtoGecko(widget, payload) {
    var url = "https://push.geckoboard.com/v1/send/" + widget;
    var options = {
        "method": "post",
        "contentType": "application/json"
    };

    options.payload = payload;

    var success = true;
    try {
        var response = UrlFetchApp.fetch(url, options);
    } catch (e) {
        success = false;
        Logger.log("Push to Geckoboard failed...");
        Logger.log(e.message);
    }
}



function pullFromZD(payload) {
    var url = "https://support.zendesk.com/api/v2/views/preview/count.json";
    var options = {
        "method": "post",
        "contentType": "application/json",
        "headers": setHeaders("zd"),
        "payload": payload
    };

    var success = true;
    try {
        var response = UrlFetchApp.fetch(url, options);
    } catch (e) {
        success = false;
        Logger.log("Pull from Zendesk failed...");
        Logger.log(e.message);
    }
  
  if (success) {
    var fresh = JSON.parse(response.getContentText()).view_count.fresh;
    if (! fresh) {
      return pullFromZD(payload);
      //setTimeout(pullFromZD(payload), 2000); // need to make this work
    }
    return JSON.parse(response.getContentText()).view_count.value;  
  }
}

function calcWeekly(local){

  if (local=="manila") {
    var n = getLocalDay("manila");
    var u = getLocal("manila");
        
    // after 6pm
    if (u>17) {
      x = (n>4) ? n - 5 : n + 2;    
    }
    
    // before 6pm
    else if (u<18) {
      x = (n==6) ? n - 6 : n + 1;    
    }
      
    sinceSolved = x * 24;     
  }
  
  else if (local=="melbourne") {
    var n = getLocalDay("melb");
    var u = getLocal("melb");    
    
    // after 8pm
    if (u>19) {
      x = (n>4) ? n - 5 : n + 2;    
    }
    
    // before 8pm
    else if (u<20) {
      x = (n==6) ? n - 6 : n + 1;    
    }
    
    sinceSolved = x * 24;     
  }

  return sinceSolved;
  
  /*
  Logger.log("JS day= " + n);  
  Logger.log("Timestamp= " + d2);
  Logger.log("localManila= " + u);
  Logger.log("hoursManila= " + hoursManila);
  Logger.log("x value = " + x);    
  Logger.log("since solved value= " + sinceSolved);    
  */
}

/*

HELPER FUNCTIONS

*/

function getLocal(groupLoc) {
  var d = new Date();
  var n = d.getUTCHours();  
  return (groupLoc=="melb") ? n + 10 : n + 8;
}

function getLocalDay(groupLoc) {
  var offset = (groupLoc=="melb") ? 10 : 8;
  var d = new Date();
  d.setUTCHours(offset);
  return d.getDay();
}

function getHours(localHour,type){
  var sinceHours;
  if (type=="man") {
    if ((localHour>17)&&(localHour<24))sinceHours=localHour-17;
    else if ((localHour>=0)&&(localHour<18))sinceHours=localHour+7;
    }
  else if (type=="melb")  {
    if ((localHour>19)&&(localHour<24))sinceHours=localHour-19;
    else if ((localHour>=0)&&(localHour<20))sinceHours=localHour+5;  
  }
  return sinceHours;
}


function createUserArray(arrGroup){
  var arr = [];   
  //var len = getLength(arrGroup);
  var len = arrGroup.length
  
  for (var i = 0; i < len; i++) {
    arr.push({
      value: arrGroup[i].ID,
      field: "assignee_id",
      operator: "is"
    });
  }  
  return arr;  
}

function getProperty(propertyName) {
    return PropertiesService.getScriptProperties().getProperty(propertyName);
}

// helper function to grab array length, no idea why a simple .length on an array throws an error. edit, it's fixed!

function getLength(item) { 
  try {
    var iLength = item.length; 
  } catch (e) {
    success = false;
    Logger.log(e.message);
  }  
  return iLength;
}

function setHeaders(type) {
    var zd_auth = getProperty('zd_username') + ":" + getProperty('zd_token');
    var db_auth = getProperty('db_token') + ":" + "whatever";
    var unamepass = (type == "zd") ? zd_auth : db_auth;
    var digest = Utilities.base64Encode(unamepass);
    var digestfull = "Basic " + digest;
    var httpheaders = {
        "Authorization": digestfull,
        "Accept": "application/json"
    };
    return httpheaders;
}