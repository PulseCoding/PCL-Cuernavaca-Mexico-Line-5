/////////////////////////////////////////CLIENTE//////////////////////////////////////////////////////////////////////////////////////
var NanoTimer = require('nanotimer');
var timer = new NanoTimer();
const fs = require('fs'),
  assert = require('assert');
/**
 * @param {string} directorio de destino
 * @param {string} texto a escribir dentro del archivo
 * @param {function} manejador de funcion
 */
var opcua = require("node-opcua");
var async = require("async");
var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://127.0.0.1:44818/UA/L5;" //Endpoint especificado en la configuración de OCP del KEPserver
var the_session = null;


var canal = "s=L5."; //"s=AB 5345.";
var disp = "Ch1."; //"L5345.";
var CapfeederStatus = "Cap Feeder.Status.";
var CapsorterCounter = "Cap Sorter.Counter.";
var CapsorterStatus = "Cap Sorter.Status.";
var CapperCounter = "Capper.Counter.";
var CapperStatus = "Capper.Status.";
var CasesorterCounter = "Case Sorter.Counter.";
var CasesorterStatus = "Case Sorter.Status.";
var CasepackerCounter = "CasePacker.Counter.";
var CasepackerStatus = "CasePacker.Status.";
var TurnerCounter = "Down SideUp Turner.Counter.";
var TurnerStatus = "Down SideUp Turner.Status.";
var FillerCounter = "Filler.Counter.";
var FillerStatus = "Filler.Status.";
var JarturnerCounter = "Jar Turner.Counter.";
var JarturnerStatus = "Jar Turner.Status.";
var PalletizerCounter = "Palletizer Robo2.Counter.";
var PalletizerStatus = "Palletizer Robo2.Status.";
var SleeveapplicatorCounter = "Sleeve Applicator.Counter.";
var SleeveapplicatorStatus = "Sleeve Applicator.Status.";
var SpiralconveyorCounter = "Spiral Conveyor.Counter.";
var SpiralconveyorStatus = "Spiral Conveyor.Status.";





var Capfeederestado = 0,
    initialTimeCapfeeder = Date.now(),
    Capfeedertime = 0,
    CapfeederflagPrint = 0,
    Capfeedermaster;


var capsorterct = null,
    capsorterresults = null,
    capsorteractual = 0,
    capsortertime = 0,
    capsortersec = 0,
    capsorterflagStopped = false,
    capsorterstate = 0,
    capsorterspeed = 0,
    capsorterspeedTemp = 0,
    capsorterflagPrint = 0,
    capsortersecStop = 0,
    capsorterONS = false,
    capsortertimeStop = 60, //NOTE: Timestop
    capsorterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    capsorterflagRunning = false;
var CntOutCapsorter = 0,
    Capsorterestado = 0;
var capperct = null,
    capperresults = null,
    CntOutCapper = null,
    capperactual = 0,
    cappertime = 0,
    cappersec = 0,
    capperflagStopped = false,
    capperstate = 0,
    capperspeed = 0,
    capperspeedTemp = 0,
    capperflagPrint = 0,
    cappersecStop = 0,
    capperONS = false,
    cappertimeStop = 60, //NOTE: Timestop
    capperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    capperflagRunning = false;
var CntInCapper1 = 0,
    CntInCapper2 = 0,
    CntRjCapper = 0,
    Capperestado = 0;
var casesorterct = null,
    casesorterresults = null,
    casesorteractual = 0,
    casesortertime = 0,
    casesortersec = 0,
    casesorterflagStopped = false,
    casesorterstate = 0,
    casesorterspeed = 0,
    casesorterspeedTemp = 0,
    casesorterflagPrint = 0,
    casesortersecStop = 0,
    casesorterONS = false,
    casesortertimeStop = 60, //NOTE: Timestop
    casesorterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    casesorterflagRunning = false;
var CntInEOL1 = 0,
    CntInEOL2 = 0,
    CntInCasesorter = 0,
    CntOutCasesorter = 0,
    CntRjCasesorter = 0,
    Casesorterestado = 0;
var initialTimeEOL = Date.now(),
    EOLtime = 0,
    EOLflagPrint = 0;
var casepackerct = null,
    casepackerresults = null,
    casepackeractual = 0,
    casepackertime = 0,
    casepackersec = 0,
    casepackerflagStopped = false,
    casepackerstate = 0,
    casepackerspeed = 0,
    casepackerspeedTemp = 0,
    casepackerflagPrint = 0,
    casepackersecStop = 0,
    casepackerONS = false,
    casepackertimeStop = 60, //NOTE: Timestop
    casepackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    casepackerflagRunning = false;
var CntInCasepacker1 = 0,
    CntInCasepacker2 = 0,
    CntOutCasepacker = 0,
    CntRjCasepacker = 0,
    Casepackerestado = 0;
var turnerct = null,
    turnerresults = null,
    CntInturner = null,
    CntOutturner = null,
    turneractual = 0,
    turnertime = 0,
    turnersec = 0,
    turnerflagStopped = false,
    turnerstate = 0,
    turnerspeed = 0,
    turnerspeedTemp = 0,
    turnerflagPrint = 0,
    turnersecStop = 0,
    turnerONS = false,
    turnertimeStop = 60, //NOTE: Timestop
    turnerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    turnerflagRunning = false;
var CntInTurner = 0,
    CntOutTurner = 0,
    Turnerestado = 0;
var fillerct = null,
    fillerresults = null,
    filleractual = 0,
    fillertime = 0,
    fillersec = 0,
    fillerflagStopped = false,
    fillerstate = 0,
    fillerspeed = 0,
    fillerspeedTemp = 0,
    fillerflagPrint = 0,
    fillersecStop = 0,
    fillerONS = false,
    fillertimeStop = 60, //NOTE: Timestop
    fillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    fillerflagRunning = false;
var CntInFiller = 0,
    CntOutFiller = 0,
    CntRjFiller = 0,
    Fillerestado = 0;
var jarturnerct = null,
    jarturnerresults = null,
    jarturneractual = 0,
    jarturnertime = 0,
    jarturnersec = 0,
    jarturnerflagStopped = false,
    jarturnerstate = 0,
    jarturnerspeed = 0,
    jarturnerspeedTemp = 0,
    jarturnerflagPrint = 0,
    jarturnersecStop = 0,
    jarturnerONS = false,
    jarturnertimeStop = 60, //NOTE: Timestop
    jarturnerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    jarturnerflagRunning = false;
var CntInJarturner = 0,
    CntOutJarturner = 0,
    Jarturnerestado = 0;
var palletizerct = null,
    palletizerresults = null,
    palletizeractual = 0,
    palletizertime = 0,
    palletizersec = 0,
    palletizerflagStopped = false,
    palletizerstate = 0,
    palletizerspeed = 0,
    palletizerspeedTemp = 0,
    palletizerflagPrint = 0,
    palletizersecStop = 0,
    palletizerONS = false,
    palletizertimeStop = 60, //NOTE: Timestop
    palletizerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    palletizerflagRunning = false;
var CntInPalletizer = 0,
    CntOutPalletizer = 0,
    Palletizerestado = 0;
var Sleeveapplicatorspeed = 0,
    CntInSleeveapplicator = 0,
    CntOutSleeveapplicator = 0,
    CntRjSleeveapplicator = 0,
    Sleeveapplicatorestado = 0,
    initialTimeSleeveapplicator = Date.now(),
    Sleeveapplicatortime = 0,
    SleeveapplicatorflagPrint = 0,
    Sleeveapplicatormaster;
var spiralconveyorct = null,
    spiralconveyorresults = null,
    CntInspiralconveyor = null,
    CntOutspiralconveyor = null,
    spiralconveyoractual = 0,
    spiralconveyortime = 0,
    spiralconveyorsec = 0,
    spiralconveyorflagStopped = false,
    spiralconveyorstate = 0,
    spiralconveyorspeed = 0,
    spiralconveyorspeedTemp = 0,
    spiralconveyorflagPrint = 0,
    spiralconveyorsecStop = 0,
    spiralconveyorONS = false,
    spiralconveyortimeStop = 60, //NOTE: Timestop
    spiralconveyorWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    spiralconveyorflagRunning = false;
var CntInSpiralconveyor = 0,
    CntOutSpiralconveyor = 0,
    Spiralconveyorestado = 0;
start();

function start() {
  setInterval(connect, 1000);
}


function connect() {
  client.connect(endpointUrl, function(err) {
    if (err) {

    } else {

      session();
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////

function session() {
  client.createSession(function(err, session) {
    if (!err) {
      the_session = session;

      lectura();
    }
  });
}



function lectura(cappermaster) {

 ////////////////////////////////////////////Cap feeder///////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + CapfeederStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Capfeederestado = dataValue.value.value;

      Capfeedermaster = {
        "ST": Capfeederestado
      };


      if (Date.now() - initialTimeCapfeeder >= 60000) { //NOTE: Uso de timestamp
        CapfeederflagPrint = 1;
        Capfeedertime = Date.now();

        initialTimeCapfeeder = Date.now();
      }

      if (CapfeederflagPrint == 1) {
        for (var key in Capfeedermaster) {
          if (Capfeedermaster[key] != null && !isNaN(Capfeedermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_capfeeder_l5.log", 'tt=' + Capfeedertime + ',var=' + key + ',val=' + Capfeedermaster[key] + '\n');
        }
        CapfeederflagPrint = 0;
      }


    }
  });


  //////////////////////////////////////////Capsorter/////////////////////////////////////////////////////////////////////

  the_session.readVariableValue("ns=2;" + canal + disp + CapsorterCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutCapsorter = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CapsorterStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Capsorterestado = dataValue.value.value;

        //------------------------------------------capsorter----------------------------------------------
              capsorterct = CntOutCapsorter // NOTE: igualar al contador de salida
              if (!capsorterONS && capsorterct) {
                capsorterspeedTemp = capsorterct
                capsortersec = Date.now()
                capsorterONS = true
                capsortertime = Date.now()
              }
              if(capsorterct > capsorteractual){
                if(capsorterflagStopped){
                  capsorterspeed = capsorterct - capsorterspeedTemp
                  capsorterspeedTemp = capsorterct
                  capsortersec = Date.now()
                  capsortertime = Date.now()
                }
                capsortersecStop = 0
                capsorterstate = 1
                capsorterflagStopped = false
                capsorterflagRunning = true
              } else if( capsorterct == capsorteractual ){
                if(capsortersecStop == 0){
                  capsortertime = Date.now()
                  capsortersecStop = Date.now()
                }
                if( ( Date.now() - ( capsortertimeStop * 1000 ) ) >= capsortersecStop ){
                  capsorterspeed = 0
                  capsorterstate = 2
                  capsorterspeedTemp = capsorterct
                  capsorterflagStopped = true
                  capsorterflagRunning = false
                  capsorterflagPrint = 1
                }
              }
              capsorteractual = capsorterct
              if(Date.now() - 60000 * capsorterWorktime >= capsortersec && capsortersecStop == 0){
                if(capsorterflagRunning && capsorterct){
                  capsorterflagPrint = 1
                  capsortersecStop = 0
                  capsorterspeed = capsorterct - capsorterspeedTemp
                  capsorterspeedTemp = capsorterct
                  capsortersec = Date.now()
                }
              }
              capsorterresults = {
                ST: Capsorterestado,
                CPQO:  null,
                SP: null
              }
              if (capsorterflagPrint == 1) {
                for (var key in capsorterresults) {
                  if( capsorterresults[key] != null && ! isNaN(capsorterresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_capsorter_l5.log', 'tt=' + capsortertime + ',var=' + key + ',val=' + capsorterresults[key] + '\n')
                }
                capsorterflagPrint = 0
                capsortersecStop = 0
                capsortertime = Date.now()
              }
        //------------------------------------------capsorter----------------------------------------------
      }
    });
  //////////////////////////////////////////Capper/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + CapperCounter + "ProdInCount1", function(err, dataValue) {
    if (!err) {
      CntInCapper1 = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CapperCounter + "ProdInCount2", function(err, dataValue) {
    if (!err) {
      CntInCapper2 = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CapperCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutCapper = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CapperCounter + "ProdRejCount", function(err, dataValue) {
    if (!err) {
      CntRjCapper = dataValue.value.value;

    }

  });
  the_session.readVariableValue("ns=2;" + canal + disp + CapperStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Capperestado = dataValue.value.value;


        //------------------------------------------capper----------------------------------------------
              capperct = CntOutCapper // NOTE: igualar al contador de salida
              if (!capperONS && capperct) {
                capperspeedTemp = capperct
                cappersec = Date.now()
                capperONS = true
                cappertime = Date.now()
              }
              if(capperct > capperactual){
                if(capperflagStopped){
                  capperspeed = capperct - capperspeedTemp
                  capperspeedTemp = capperct
                  cappersec = Date.now()
                  cappertime = Date.now()
                }
                cappersecStop = 0
                capperstate = 1
                capperflagStopped = false
                capperflagRunning = true
              } else if( capperct == capperactual ){
                if(cappersecStop == 0){
                  cappertime = Date.now()
                  cappersecStop = Date.now()
                }
                if( ( Date.now() - ( cappertimeStop * 1000 ) ) >= cappersecStop ){
                  capperspeed = 0
                  capperstate = 2
                  capperspeedTemp = capperct
                  capperflagStopped = true
                  capperflagRunning = false
                  capperflagPrint = 1
                }
              }
              capperactual = capperct
              if(Date.now() - 60000 * capperWorktime >= cappersec && cappersecStop == 0){
                if(capperflagRunning && capperct){
                  capperflagPrint = 1
                  cappersecStop = 0
                  capperspeed = capperct - capperspeedTemp
                  capperspeedTemp = capperct
                  cappersec = Date.now()
                }
              }
              capperresults = {
                ST: Capperestado,
                CPQIB: CntInCapper1,
                CPQI: CntInCapper2,
                CPQO: CntOutCapper,
                CPQR: CntRjCapper,
                SP: capperspeed
              }
              if (capperflagPrint == 1) {
                for (var key in capperresults) {
                  if( capperresults[key] != null && ! isNaN(capperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_capper_l5.log', 'tt=' + cappertime + ',var=' + key + ',val=' + capperresults[key] + '\n')
                }
                capperflagPrint = 0
                cappersecStop = 0
                cappertime = Date.now()
              }
        //------------------------------------------capper----------------------------------------------
    }
  });
  //////////////////////////////////////////Casesorter/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + CasesorterCounter + "Eol1Count", function(err, dataValue) {
    if (!err) {
      CntInEOL1 = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasesorterCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInCasesorter = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasesorterCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutCasesorter = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasesorterCounter + "ProdRejCount", function(err, dataValue) {
    if (!err) {
      CntRjCasesorter = dataValue.value.value;

    }

  });
  the_session.readVariableValue("ns=2;" + canal + disp + CasesorterStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Casesorterestado = dataValue.value.value;
        //------------------------------------------casesorter----------------------------------------------
              casesorterct = CntOutCasesorter // NOTE: igualar al contador de salida
              if (!casesorterONS && casesorterct) {
                casesorterspeedTemp = casesorterct
                casesortersec = Date.now()
                casesorterONS = true
                casesortertime = Date.now()
              }
              if(casesorterct > casesorteractual){
                if(casesorterflagStopped){
                  casesorterspeed = casesorterct - casesorterspeedTemp
                  casesorterspeedTemp = casesorterct
                  casesortersec = Date.now()
                  casesortertime = Date.now()
                }
                casesortersecStop = 0
                casesorterstate = 1
                casesorterflagStopped = false
                casesorterflagRunning = true
              } else if( casesorterct == casesorteractual ){
                if(casesortersecStop == 0){
                  casesortertime = Date.now()
                  casesortersecStop = Date.now()
                }
                if( ( Date.now() - ( casesortertimeStop * 1000 ) ) >= casesortersecStop ){
                  casesorterspeed = 0
                  casesorterstate = 2
                  casesorterspeedTemp = casesorterct
                  casesorterflagStopped = true
                  casesorterflagRunning = false
                  casesorterflagPrint = 1
                }
              }
              casesorteractual = casesorterct
              if(Date.now() - 60000 * casesorterWorktime >= casesortersec && casesortersecStop == 0){
                if(casesorterflagRunning && casesorterct){
                  casesorterflagPrint = 1
                  casesortersecStop = 0
                  casesorterspeed = casesorterct - casesorterspeedTemp
                  casesorterspeedTemp = casesorterct
                  casesortersec = Date.now()
                }
              }
              casesorterresults = {
                ST: Casesorterestado,
                CPQI: CntInCasesorter,
                CPQO: CntOutCasesorter,
                CPQR: CntRjCasesorter,
                SP: casesorterspeed
              }
              if (casesorterflagPrint == 1) {
                /*for (var key in casesorterresults) {
                  if( casesorterresults[key] != null && ! isNaN(casesorterresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_casesorter_l5.log', 'tt=' + casesortertime + ',var=' + key + ',val=' + casesorterresults[key] + '\n')
                }*/
                casesorterflagPrint = 0
                casesortersecStop = 0
                casesortertime = Date.now()
              }
        //------------------------------------------casesorter----------------------------------------------
    }
  });


  //////////////////////////////////////////Casepacker/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + CasepackerCounter + "ProdInCount1", function(err, dataValue) {
    if (!err) {
      CntInCasepacker1 = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasepackerCounter + "ProdInCount2", function(err, dataValue) {
    if (!err) {
      CntInCasepacker2 = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasepackerCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutCasepacker = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + CasepackerCounter + "ProdRejCount", function(err, dataValue) {
    if (!err) {
      CntRjCasepacker = dataValue.value.value;

    }

  });
  the_session.readVariableValue("ns=2;" + canal + disp + CasepackerStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Casepackerestado = dataValue.value.value;


        //------------------------------------------casepacker----------------------------------------------
              casepackerct = CntOutCasepacker // NOTE: igualar al contador de salida
              if (!casepackerONS && casepackerct) {
                casepackerspeedTemp = casepackerct
                casepackersec = Date.now()
                casepackerONS = true
                casepackertime = Date.now()
              }
              if(casepackerct > casepackeractual){
                if(casepackerflagStopped){
                  casepackerspeed = casepackerct - casepackerspeedTemp
                  casepackerspeedTemp = casepackerct
                  casepackersec = Date.now()
                  casepackertime = Date.now()
                }
                casepackersecStop = 0
                casepackerstate = 1
                casepackerflagStopped = false
                casepackerflagRunning = true
              } else if( casepackerct == casepackeractual ){
                if(casepackersecStop == 0){
                  casepackertime = Date.now()
                  casepackersecStop = Date.now()
                }
                if( ( Date.now() - ( casepackertimeStop * 1000 ) ) >= casepackersecStop ){
                  casepackerspeed = 0
                  casepackerstate = 2
                  casepackerspeedTemp = casepackerct
                  casepackerflagStopped = true
                  casepackerflagRunning = false
                  casepackerflagPrint = 1
                }
              }
              casepackeractual = casepackerct
              if(Date.now() - 60000 * casepackerWorktime >= casepackersec && casepackersecStop == 0){
                if(casepackerflagRunning && casepackerct){
                  casepackerflagPrint = 1
                  casepackersecStop = 0
                  casepackerspeed = casepackerct - casepackerspeedTemp
                  casepackerspeedTemp = casepackerct
                  casepackersec = Date.now()
                }
              }
              casepackerresults = {
                ST: Casepackerestado,
                CPQIB: CntInCasepacker1,
                CPQI: CntInCasepacker2,
                CPQO: CntOutCasepacker,
                CPQR: CntRjCasepacker,
                SP: casepackerspeed
              }
              if (casepackerflagPrint == 1) {
                for (var key in casepackerresults) {
                  if( casepackerresults[key] != null && ! isNaN(casepackerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_casepacker_l5.log', 'tt=' + casepackertime + ',var=' + key + ',val=' + casepackerresults[key] + '\n')
                }
                casepackerflagPrint = 0
                casepackersecStop = 0
                casepackertime = Date.now()
              }
        //------------------------------------------casepacker----------------------------------------------
    }
  });

  //////////////////////////////////////////Turner/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + TurnerCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInTurner = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + TurnerCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutTurner = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + TurnerStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Turnerestado = dataValue.value.value;

        //------------------------------------------turner----------------------------------------------
              turnerct = CntOutTurner // NOTE: igualar al contador de salida
              if (!turnerONS && turnerct) {
                turnerspeedTemp = turnerct
                turnersec = Date.now()
                turnerONS = true
                turnertime = Date.now()
              }
              if(turnerct > turneractual){
                if(turnerflagStopped){
                  turnerspeed = turnerct - turnerspeedTemp
                  turnerspeedTemp = turnerct
                  turnersec = Date.now()
                  turnertime = Date.now()
                }
                turnersecStop = 0
                turnerstate = 1
                turnerflagStopped = false
                turnerflagRunning = true
              } else if( turnerct == turneractual ){
                if(turnersecStop == 0){
                  turnertime = Date.now()
                  turnersecStop = Date.now()
                }
                if( ( Date.now() - ( turnertimeStop * 1000 ) ) >= turnersecStop ){
                  turnerspeed = 0
                  turnerstate = 2
                  turnerspeedTemp = turnerct
                  turnerflagStopped = true
                  turnerflagRunning = false
                  turnerflagPrint = 1
                }
              }
              turneractual = turnerct
              if(Date.now() - 60000 * turnerWorktime >= turnersec && turnersecStop == 0){
                if(turnerflagRunning && turnerct){
                  turnerflagPrint = 1
                  turnersecStop = 0
                  turnerspeed = turnerct - turnerspeedTemp
                  turnerspeedTemp = turnerct
                  turnersec = Date.now()
                }
              }
              turnerresults = {
                ST: Turnerestado,
                CPQI: CntInTurner,
                CPQO: CntOutTurner,
                SP: turnerspeed
              }
              if (turnerflagPrint == 1) {
                for (var key in turnerresults) {
                  if( turnerresults[key] != null && ! isNaN(turnerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_turner_l5.log', 'tt=' + turnertime + ',var=' + key + ',val=' + turnerresults[key] + '\n')
                }
                turnerflagPrint = 0
                turnersecStop = 0
                turnertime = Date.now()
              }
        //------------------------------------------turner----------------------------------------------
    }
  });



  //////////////////////////////////////////Filler/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + FillerCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInFiller = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + FillerCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutFiller = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + FillerCounter + "ProdRejCount", function(err, dataValue) {
    if (!err) {
      CntRjFiller = dataValue.value.value;

    }

  });
  the_session.readVariableValue("ns=2;" + canal + disp + FillerStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Fillerestado = dataValue.value.value;

        //------------------------------------------filler----------------------------------------------
              fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!fillerONS && fillerct) {
                fillerspeedTemp = fillerct
                fillersec = Date.now()
                fillerONS = true
                fillertime = Date.now()
              }
              if(fillerct > filleractual){
                if(fillerflagStopped){
                  fillerspeed = fillerct - fillerspeedTemp
                  fillerspeedTemp = fillerct
                  fillersec = Date.now()
                  fillertime = Date.now()
                }
                fillersecStop = 0
                fillerstate = 1
                fillerflagStopped = false
                fillerflagRunning = true
              } else if( fillerct == filleractual ){
                if(fillersecStop == 0){
                  fillertime = Date.now()
                  fillersecStop = Date.now()
                }
                if( ( Date.now() - ( fillertimeStop * 1000 ) ) >= fillersecStop ){
                  fillerspeed = 0
                  fillerstate = 2
                  fillerspeedTemp = fillerct
                  fillerflagStopped = true
                  fillerflagRunning = false
                  fillerflagPrint = 1
                }
              }
              filleractual = fillerct
              if(Date.now() - 60000 * fillerWorktime >= fillersec && fillersecStop == 0){
                if(fillerflagRunning && fillerct){
                  fillerflagPrint = 1
                  fillersecStop = 0
                  fillerspeed = fillerct - fillerspeedTemp
                  fillerspeedTemp = fillerct
                  fillersec = Date.now()
                }
              }
              fillerresults = {
                ST: Fillerestado,
                CPQI: CntInFiller,
                CPQO: CntOutFiller,
                CPQR: CntRjFiller,
                SP: fillerspeed
              }
              if (fillerflagPrint == 1) {
                for (var key in fillerresults) {
                  if( fillerresults[key] != null && ! isNaN(fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_filler_l5.log', 'tt=' + fillertime + ',var=' + key + ',val=' + fillerresults[key] + '\n')
                }
                fillerflagPrint = 0
                fillersecStop = 0
                fillertime = Date.now()
              }
        //------------------------------------------filler----------------------------------------------
    }
  });




  //////////////////////////////////////////Jarturner/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + JarturnerCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInJarturner = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + JarturnerCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutJarturner = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + JarturnerStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Jarturnerestado = dataValue.value.value;

        //------------------------------------------jarturner----------------------------------------------
              jarturnerct = CntOutJarturner // NOTE: igualar al contador de salida
              if (!jarturnerONS && jarturnerct) {
                jarturnerspeedTemp = jarturnerct
                jarturnersec = Date.now()
                jarturnerONS = true
                jarturnertime = Date.now()
              }
              if(jarturnerct > jarturneractual){
                if(jarturnerflagStopped){
                  jarturnerspeed = jarturnerct - jarturnerspeedTemp
                  jarturnerspeedTemp = jarturnerct
                  jarturnersec = Date.now()
                  jarturnertime = Date.now()
                }
                jarturnersecStop = 0
                jarturnerstate = 1
                jarturnerflagStopped = false
                jarturnerflagRunning = true
              } else if( jarturnerct == jarturneractual ){
                if(jarturnersecStop == 0){
                  jarturnertime = Date.now()
                  jarturnersecStop = Date.now()
                }
                if( ( Date.now() - ( jarturnertimeStop * 1000 ) ) >= jarturnersecStop ){
                  jarturnerspeed = 0
                  jarturnerstate = 2
                  jarturnerspeedTemp = jarturnerct
                  jarturnerflagStopped = true
                  jarturnerflagRunning = false
                  jarturnerflagPrint = 1
                }
              }
              jarturneractual = jarturnerct
              if(Date.now() - 60000 * jarturnerWorktime >= jarturnersec && jarturnersecStop == 0){
                if(jarturnerflagRunning && jarturnerct){
                  jarturnerflagPrint = 1
                  jarturnersecStop = 0
                  jarturnerspeed = jarturnerct - jarturnerspeedTemp
                  jarturnerspeedTemp = jarturnerct
                  jarturnersec = Date.now()
                }
              }
              jarturnerresults = {
                ST: Jarturnerestado,
                CPQI: CntInJarturner,
                CPQO: CntOutJarturner,
                SP: jarturnerspeed
              }
              if (jarturnerflagPrint == 1) {
                for (var key in jarturnerresults) {
                  if( jarturnerresults[key] != null && ! isNaN(jarturnerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_jarturner_l5.log', 'tt=' + jarturnertime + ',var=' + key + ',val=' + jarturnerresults[key] + '\n')
                }
                jarturnerflagPrint = 0
                jarturnersecStop = 0
                jarturnertime = Date.now()
              }
        //------------------------------------------jarturner----------------------------------------------
    }
  });


  //////////////////////////////////////////Palletizer/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + PalletizerCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInPalletizer = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + PalletizerCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutPalletizer = dataValue.value.value;
    }
  });


  the_session.readVariableValue("ns=2;" + canal + disp + PalletizerStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Palletizerestado = dataValue.value.value;

        //------------------------------------------palletizer----------------------------------------------
              palletizerct = CntOutPalletizer // NOTE: igualar al contador de salida
              if (!palletizerONS && palletizerct) {
                palletizerspeedTemp = palletizerct
                palletizersec = Date.now()
                palletizerONS = true
                palletizertime = Date.now()
              }
              if(palletizerct > palletizeractual){
                if(palletizerflagStopped){
                  palletizerspeed = palletizerct - palletizerspeedTemp
                  palletizerspeedTemp = palletizerct
                  palletizersec = Date.now()
                  palletizertime = Date.now()
                }
                palletizersecStop = 0
                palletizerstate = 1
                palletizerflagStopped = false
                palletizerflagRunning = true
              } else if( palletizerct == palletizeractual ){
                if(palletizersecStop == 0){
                  palletizertime = Date.now()
                  palletizersecStop = Date.now()
                }
                if( ( Date.now() - ( palletizertimeStop * 1000 ) ) >= palletizersecStop ){
                  palletizerspeed = 0
                  palletizerstate = 2
                  palletizerspeedTemp = palletizerct
                  palletizerflagStopped = true
                  palletizerflagRunning = false
                  palletizerflagPrint = 1
                }
              }
              palletizeractual = palletizerct
              if(Date.now() - 60000 * palletizerWorktime >= palletizersec && palletizersecStop == 0){
                if(palletizerflagRunning && palletizerct){
                  palletizerflagPrint = 1
                  palletizersecStop = 0
                  palletizerspeed = palletizerct - palletizerspeedTemp
                  palletizerspeedTemp = palletizerct
                  palletizersec = Date.now()
                }
              }
              palletizerresults = {
                ST: Palletizerestado,
                CPQI: CntInPalletizer,
                CPQO: CntOutPalletizer,
                SP: palletizerspeed
              }
              if (palletizerflagPrint == 1) {
                /*for (var key in palletizerresults) {
                  if( palletizerresults[key] != null && ! isNaN(palletizerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_palletizer_l5.log', 'tt=' + palletizertime + ',var=' + key + ',val=' + palletizerresults[key] + '\n')
                }*/
                palletizerflagPrint = 0
                palletizersecStop = 0
                palletizertime = Date.now()
              }
        //------------------------------------------palletizer----------------------------------------------
    }
  });




  //////////////////////////////////////////Sleeveapplicator/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + SleeveapplicatorCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInSleeveapplicator = dataValue.value.value;
}

  });

  the_session.readVariableValue("ns=2;" + canal + disp + "Sleeve Applicator.Actual Speed.ActSpeed", function(err, dataValue) {
    if (!err) {
      Sleeveapplicatorspeed = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + SleeveapplicatorCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutSleeveapplicator = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + SleeveapplicatorCounter + "ProdRejCount", function(err, dataValue) {
    if (!err) {
      CntRjSleeveapplicator = dataValue.value.value;

    }

  });
  the_session.readVariableValue("ns=2;" + canal + disp + SleeveapplicatorStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Sleeveapplicatorestado = dataValue.value.value;

      if (Date.now() - initialTimeSleeveapplicator >= 60000) { //NOTE: Uso de timestamp
        SleeveapplicatorflagPrint = 1;
        Sleeveapplicatortime = Date.now();
        initialTimeSleeveapplicator = Date.now();
      }


      Sleeveapplicatormaster = {
        "ST": Sleeveapplicatorestado,
        "CPQI": CntInSleeveapplicator,
        "CPQO": CntOutSleeveapplicator,
        "CPQR": CntRjSleeveapplicator,
        "SP": Sleeveapplicatorspeed
      };

      if (SleeveapplicatorflagPrint == 1) {
        for (var key in Sleeveapplicatormaster) {
          if (Sleeveapplicatormaster[key] != null && !isNaN(Sleeveapplicatormaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_sleeve_applicator_l5.log", 'tt=' + Sleeveapplicatortime + ',var=' + key + ',val=' + Sleeveapplicatormaster[key] + '\n');
        }
        SleeveapplicatorflagPrint = 0;
      }
    }
  });




  //////////////////////////////////////////Spiralconveyor/////////////////////////////////////////////////////////////////////
  the_session.readVariableValue("ns=2;" + canal + disp + SpiralconveyorCounter + "ProdInCount", function(err, dataValue) {
    if (!err) {
      CntInSpiralconveyor = dataValue.value.value;

    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + SpiralconveyorCounter + "Eol2Count", function(err, dataValue) {
    if (!err) {
      CntInEOL2 = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + SpiralconveyorCounter + "ProdOutCount", function(err, dataValue) {
    if (!err) {
      CntOutSpiralconveyor = dataValue.value.value;
    }
  });

  the_session.readVariableValue("ns=2;" + canal + disp + SpiralconveyorStatus + "MchStatus", function(err, dataValue) {
    if (!err) {
      Spiralconveyorestado = dataValue.value.value;

        //------------------------------------------spiralconveyor----------------------------------------------
              spiralconveyorct = CntOutSpiralconveyor // NOTE: igualar al contador de salida
              if (!spiralconveyorONS && spiralconveyorct) {
                spiralconveyorspeedTemp = spiralconveyorct
                spiralconveyorsec = Date.now()
                spiralconveyorONS = true
                spiralconveyortime = Date.now()
              }
              if(spiralconveyorct > spiralconveyoractual){
                if(spiralconveyorflagStopped){
                  spiralconveyorspeed = spiralconveyorct - spiralconveyorspeedTemp
                  spiralconveyorspeedTemp = spiralconveyorct
                  spiralconveyorsec = Date.now()
                  spiralconveyortime = Date.now()
                }
                spiralconveyorsecStop = 0
                spiralconveyorstate = 1
                spiralconveyorflagStopped = false
                spiralconveyorflagRunning = true
              } else if( spiralconveyorct == spiralconveyoractual ){
                if(spiralconveyorsecStop == 0){
                  spiralconveyortime = Date.now()
                  spiralconveyorsecStop = Date.now()
                }
                if( ( Date.now() - ( spiralconveyortimeStop * 1000 ) ) >= spiralconveyorsecStop ){
                  spiralconveyorspeed = 0
                  spiralconveyorstate = 2
                  spiralconveyorspeedTemp = spiralconveyorct
                  spiralconveyorflagStopped = true
                  spiralconveyorflagRunning = false
                  spiralconveyorflagPrint = 1
                }
              }
              spiralconveyoractual = spiralconveyorct
              if(Date.now() - 60000 * spiralconveyorWorktime >= spiralconveyorsec && spiralconveyorsecStop == 0){
                if(spiralconveyorflagRunning && spiralconveyorct){
                  spiralconveyorflagPrint = 1
                  spiralconveyorsecStop = 0
                  spiralconveyorspeed = spiralconveyorct - spiralconveyorspeedTemp
                  spiralconveyorspeedTemp = spiralconveyorct
                  spiralconveyorsec = Date.now()
                }
              }
              spiralconveyorresults = {
                ST: Spiralconveyorestado,
                CPQI: CntInSpiralconveyor,
                CPQO: CntOutSpiralconveyor,
                SP: spiralconveyorspeed
              }
              if (spiralconveyorflagPrint == 1) {
                /*for (var key in spiralconveyorresults) {
                  if( spiralconveyorresults[key] != null && ! isNaN(spiralconveyorresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L5_LOGS/cue_pcl_spiralconveyor_l5.log', 'tt=' + spiralconveyortime + ',var=' + key + ',val=' + spiralconveyorresults[key] + '\n')
                }*/
                spiralconveyorflagPrint = 0
                spiralconveyorsecStop = 0
                spiralconveyortime = Date.now()
              }
        //------------------------------------------spiralconveyor----------------------------------------------


      if (Date.now() - initialTimeEOL >= 60000) { //NOTE: Uso de timestamp
        EOLflagPrint = 1;
        EOLtime = Date.now();

        initialTimeEOL = Date.now();
      }

      if (EOLflagPrint == 1) {
        fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_eol_l5.log", 'tt=' + EOLtime + ',var= EOL' + ',val=' + (CntInEOL1 + CntInEOL2) + '\n');
        EOLflagPrint = 0;
      }


    }
  });



  setTimeout(close, 1000);
}

var PubNub = require('pubnub');
var pubnub = new PubNub({
publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
uuid: "Cue_PCL_LINE3"
});

var senderData = function (){
pubnub.publish(publishConfig, function(status, response) {
});}

var files = fs.readdirSync("C:/PULSE/L5_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i=0;
var publishConfig;
var secPubNub = 60*4+55;

  setInterval(function(){
//PubNub --------------------------------------------------------------------------------------------------------------------
        if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/L5_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                text2send[i]=files[k];
                i++;
              }
            }
          };
          secPubNub=0;
          idle();
          publishConfig = {
            channel : "Cue_PCL_Monitor",
            message : {
                  line: "5",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
//PubNub --------------------------------------------------------------------------------------------------------------------
  },1000);


function close() {

  the_session.close(function(err) {
    if (err) {
      null
    }
  });
  client.disconnect(function() {});


}
