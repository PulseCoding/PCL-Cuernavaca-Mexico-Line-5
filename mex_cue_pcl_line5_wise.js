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


var Capsorterct = null,
  Capsorterresults = null,
  Capsorteractual = 0,
  Capsortertime = 0,
  Capsortersec = 0,
  CapsorterflagStopped = false,
  Capsorterstate = 0,
  Capsorterspeed = 0,
  CapsorterspeedTemp = 0,
  CapsorterflagPrint = 0,
  CapsortersecStop = 0,
  CapsorterONS = 0,
  CapsortertimeStop = 50, //NOTE: Timestop
  CapsorterWorktime = 15, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  CapsorterflagRunning = false,
  CntInCapsorter = null,
  CntOutCapsorter = null;
var CntOutCapsorter = 0,
  Capsorterestado = 0,
  initialTimeCapsorter = Date.now(),
  Capsortertime = 0,
  CapsorterflagPrint = 0,
  Capsortermaster;



var Capperct = null,
  Capperresults = null,
  Capperactual = 0,
  Cappertime = 0,
  Cappersec = 0,
  CapperflagStopped = false,
  Capperstate = 0,
  Capperspeed = 0,
  CapperspeedTemp = 0,
  CapperflagPrint = 0,
  CappersecStop = 0,
  CapperONS = 0,
  CappertimeStop = 50, //NOTE: Timestop
  CapperWorktime = 30, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  CapperflagRunning = false,
  CntInCapper = null,
  CntOutCapper = null;
var CntInCapper1 = 0,
  CntInCapper2 = 0,
  CntOutCapper = 0,
  CntRjCapper = 0,
  Capperestado = 0,
  initialTimeCapper = Date.now(),
  Cappertime = 0,
  CapperflagPrint = 0,
  cappermaster;



var Casesorterct = null,
  Casesorterresults = null,
  Casesorteractual = 0,
  Casesortertime = 0,
  Casesortersec = 0,
  CasesorterflagStopped = false,
  Casesorterstate = 0,
  Casesorterspeed = 0,
  CasesorterspeedTemp = 0,
  CasesorterflagPrint = 0,
  CasesortersecStop = 0,
  CasesorterONS = 0,
  CasesortertimeStop = 30, //NOTE: Timestop
  CasesorterWorktime = 3, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  CasesorterflagRunning = false,
  CntInCasesorter = null,
  CntOutCasesorter = null;
var CntInEOL1 = 0,
  CntInEOL2 = 0,
  CntInCasesorter = 0,
  CntOutCasesorter = 0,
  CntRjCasesorter = 0,
  Casesorterestado = 0,
  initialTimeCasesorter = Date.now(),
  Casesortertime = 0,
  CasesorterflagPrint = 0,
  Casesortermaster;

var initialTimeEOL = Date.now(),
  EOLtime = 0,
  EOLflagPrint = 0;




var Casepackerct = null,
  Casepackerresults = null,
  Casepackeractual = 0,
  Casepackertime = 0,
  Casepackersec = 0,
  CasepackerflagStopped = false,
  Casepackerstate = 0,
  Casepackerspeed = 0,
  CasepackerspeedTemp = 0,
  CasepackerflagPrint = 0,
  CasepackersecStop = 0,
  CasepackerONS = 0,
  CasepackertimeStop = 30, //NOTE: Timestop
  CasepackerWorktime = 3, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  CasepackerflagRunning = false,
  CntInCasepacker = null,
  CntOutCasepacker = null;
var CntInCasepacker1 = 0,
  CntInCasepacker2 = 0,
  CntOutCasepacker = 0,
  CntRjCasepacker = 0,
  Casepackerestado = 0,
  initialTimeCasepacker = Date.now(),
  Casepackertime = 0,
  CasepackerflagPrint = 0,
  Casepackermaster;


var Turnerct = null,
  Turnerresults = null,
  Turneractual = 0,
  Turnertime = 0,
  Turnersec = 0,
  TurnerflagStopped = false,
  Turnerstate = 0,
  Turnerspeed = 0,
  TurnerspeedTemp = 0,
  TurnerflagPrint = 0,
  TurnersecStop = 0,
  TurnerONS = 0,
  TurnertimeStop = 30, //NOTE: Timestop
  TurnerWorktime = 3, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  TurnerflagRunning = false,
  CntInTurner = null,
  CntOutTurner = null;
var CntInTurner = 0,
  CntOutTurner = 0,
  Turnerestado = 0,
  initialTimeTurner = Date.now(),
  Turnertime = 0,
  TurnerflagPrint = 0,
  Turnermaster;

var Fillerct = null,
  Fillerresults = null,
  Filleractual = 0,
  Fillertime = 0,
  Fillersec = 0,
  FillerflagStopped = false,
  Fillerstate = 0,
  Fillerspeed = 0,
  FillerspeedTemp = 0,
  FillerflagPrint = 0,
  FillersecStop = 0,
  FillerONS = 0,
  FillertimeStop = 50, //NOTE: Timestop
  FillerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  FillerflagRunning = false,
  CntInFiller = null,
  CntOutFiller = null;
var CntInFiller = 0,
  CntOutFiller = 0,
  CntRjFiller = 0,
  Fillerestado = 0,
  initialTimeFiller = Date.now(),
  Fillertime = 0,
  FillerflagPrint = 0,
  Fillermaster;

var Jarturnerct = null,
  Jarturnerresults = null,
  Jarturneractual = 0,
  Jarturnertime = 0,
  Jarturnersec = 0,
  JarturnerflagStopped = false,
  Jarturnerstate = 0,
  Jarturnerspeed = 0,
  JarturnerspeedTemp = 0,
  JarturnerflagPrint = 0,
  JarturnersecStop = 0,
  JarturnerONS = 0,
  JarturnertimeStop = 50, //NOTE: Timestop
  JarturnerWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  JarturnerflagRunning = false,
  CntInJarturner = null,
  CntOutJarturner = null;
var CntInJarturner = 0,
  CntOutJarturner = 0,
  Jarturnerestado = 0,
  initialTimeJarturner = Date.now(),
  Jarturnertime = 0,
  JarturnerflagPrint = 0,
  Jarturnermaster;


var Palletizerct = null,
  Palletizerresults = null,
  Palletizeractual = 0,
  Palletizertime = 0,
  Palletizersec = 0,
  PalletizerflagStopped = false,
  Palletizerstate = 0,
  Palletizerspeed = 0,
  PalletizerspeedTemp = 0,
  PalletizerflagPrint = 0,
  PalletizersecStop = 0,
  PalletizerONS = 0,
  PalletizertimeStop = 30, //NOTE: Timestop
  PalletizerWorktime = 3, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  PalletizerflagRunning = false,
  CntInPalletizer = null,
  CntOutPalletizer = null;
var CntInPalletizer = 0,
  CntOutPalletizer = 0,
  Palletizerestado = 0,
  initialTimePalletizer = Date.now(),
  Palletizertime = 0,
  PalletizerflagPrint = 0,
  Palletizermaster;

var Sleeveapplicatorct = null,
  Sleeveapplicatorresults = null,
  Sleeveapplicatoractual = 0,
  Sleeveapplicatortime = 0,
  Sleeveapplicatorsec = 0,
  SleeveapplicatorflagStopped = false,
  Sleeveapplicatorstate = 0,
  Sleeveapplicatorspeed = 0,
  SleeveapplicatorspeedTemp = 0,
  SleeveapplicatorflagPrint = 0,
  SleeveapplicatorsecStop = 0,
  SleeveapplicatorONS = 0,
  SleeveapplicatortimeStop = 50, //NOTE: Timestop
  SleeveapplicatorWorktime = 60, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  SleeveapplicatorflagRunning = false,
  CntInSleeveapplicator = null,
  CntOutSleeveapplicator = null;
var CntInSleeveapplicator = 0,
  CntOutSleeveapplicator = 0,
  CntRjSleeveapplicator = 0,
  Sleeveapplicatorestado = 0,
  initialTimeSleeveapplicator = Date.now(),
  Sleeveapplicatortime = 0,
  SleeveapplicatorflagPrint = 0,
  Sleeveapplicatormaster;

var Spiralconveyorct = null,
  Spiralconveyorresults = null,
  Spiralconveyoractual = 0,
  Spiralconveyortime = 0,
  Spiralconveyorsec = 0,
  SpiralconveyorflagStopped = false,
  Spiralconveyorstate = 0,
  Spiralconveyorspeed = 0,
  SpiralconveyorspeedTemp = 0,
  SpiralconveyorflagPrint = 0,
  SpiralconveyorsecStop = 0,
  SpiralconveyorONS = 0,
  SpiralconveyortimeStop = 30, //NOTE: Timestop
  SpiralconveyorWorktime = 3, //NOTE: 60 si la máquina trabaja continuamente, 3 sí tarda entre 40 y 60 segundos en "operar"
  SpiralconveyorflagRunning = false,
  CntInSpiralconveyor = null,
  CntOutSpiralconveyor = null;
var CntInSpiralconveyor = 0,
  CntOutSpiralconveyor = 0,
  Spiralconveyorestado = 0,
  initialTimeSpiralconveyor = Date.now(),
  Spiralconveyortime = 0,
  SpiralconveyorflagPrint = 0,
  Spiralconveyormaster;
var count = 10;
start();

function start() {
  setInterval(connect, 1000);
}


function connect() {

  //  timer.setInterval(countDown, '', '1s');
  console.log("Connecting");
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
      console.log("sesion inciada");

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
        "Status": Capfeederestado
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



      Capsorterct = CntOutCapsorter; // NOTE: igualar al contador de salida
      if (CapsorterONS == 0 && Capsorterct) {
        CapsorterspeedTemp = Capsorterct;
        CapsorterONS = 1;
      }
      if (Capsorterct > Capsorteractual) {
        if (CapsorterflagStopped) {
          Capsorterspeed = Capsorterct - CapsorterspeedTemp;
          CapsorterspeedTemp = Capsorterct;
          Capsortersec = 0;
        }
        CapsortersecStop = 0;
        Capsortersec++;
        Capsortertime = Date.now();
        Capsorterstate = 1;
        CapsorterflagStopped = false;
        CapsorterflagRunning = true;
      } else if (Capsorterct == Capsorteractual) {
        if (CapsortersecStop == 0) {
          Capsortertime = Date.now();
        }
        CapsortersecStop++;
        if (CapsortersecStop >= CapsortertimeStop) {
          Capsorterspeed = 0;
          Capsorterstate = 2;
          CapsorterspeedTemp = Capsorterct;
          CapsorterflagStopped = true;
          CapsorterflagRunning = false;
        }
        if (CapsortersecStop % CapsortertimeStop * 3 == 0 || CapsortersecStop == CapsortertimeStop) {
          CapsorterflagPrint = 1;

          if (CapsortersecStop % CapsortertimeStop * 3 == 0) {
            Capsortertime = Date.now();
          }
        }
      }
      Capsorteractual = Capsorterct;
      if (Capsortersec == CapsorterWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Capsortersec = 0;
        if (CapsorterflagRunning && Capsorterct) {
          CapsorterflagPrint = 1;
          CapsortersecStop = 0;
          Capsorterspeed = Capsorterct - CapsorterspeedTemp;
          CapsorterspeedTemp = Capsorterct;
        }
      }
      Capsortermaster = {
        "ST": Capsorterestado,
        "CPQO": CntOutCapsorter,
        "SP": Capsorterspeed

      };


      if (CapsorterflagPrint == 1) {
        for (var key in Capsortermaster) {
          if (Capsortermaster[key] != null && !isNaN(Capsortermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_capsorter_l5.log", 'tt=' + Capsortertime + ',var=' + key + ',val=' + Capsortermaster[key] + '\n');
        }
        CapsorterflagPrint = 0;
      }


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


      Capperct = CntOutCapper; // NOTE: igualar al contador de salida
      if (CapperONS == 0 && Capperct) {
        CapperspeedTemp = Capperct;
        CapperONS = 1;
      }
      if (Capperct > Capperactual) {
        if (CapperflagStopped) {
          Capperspeed = Capperct - CapperspeedTemp;
          CapperspeedTemp = Capperct;
          Cappersec = 0;
        }
        CappersecStop = 0;
        Cappersec++;
        Cappertime = Date.now();
        Capperstate = 1;
        CapperflagStopped = false;
        CapperflagRunning = true;
      } else if (Capperct == Capperactual) {
        if (CappersecStop == 0) {
          Cappertime = Date.now();
        }
        CappersecStop++;
        if (CappersecStop >= CappertimeStop) {
          Capperspeed = 0;
          Capperstate = 2;
          CapperspeedTemp = Capperct;
          CapperflagStopped = true;
          CapperflagRunning = false;
        }
        if (CappersecStop % CappertimeStop * 3 == 0 || CappersecStop == CappertimeStop) {
          CapperflagPrint = 1;

          if (CappersecStop % CappertimeStop * 3 == 0) {
            Cappertime = Date.now();
          }
        }
      }
      Capperactual = Capperct;
      if (Cappersec == CapperWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Cappersec = 0;
        if (CapperflagRunning && Capperct) {
          CapperflagPrint = 1;
          CappersecStop = 0;
          Capperspeed = Capperct - CapperspeedTemp;
          CapperspeedTemp = Capperct;
        }
      }

      cappermaster = {
        "ST": Capperestado,
        "CPQIB": CntInCapper1,
        "CPQI": CntInCapper2,
        "CPQO": CntOutCapper,
        "CPQR": CntRjCapper,
        "SP": Capperspeed
      };

      if (CapperflagPrint == 1) {
        for (var key in cappermaster) {
          if (cappermaster[key] != null && !isNaN(cappermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_capper_l5.log", 'tt=' + Cappertime + ',var=' + key + ',val=' + cappermaster[key] + '\n');
        }
        CapperflagPrint = 0;
      }
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

      Casesorterct = CntOutCasesorter; // NOTE: igualar al contador de salida
      if (CasesorterONS == 0 && Casesorterct) {
        CasesorterspeedTemp = Casesorterct;
        CasesorterONS = 1;
      }
      if (Casesorterct > Casesorteractual) {
        if (CasesorterflagStopped) {
          Casesorterspeed = Casesorterct - CasesorterspeedTemp;
          CasesorterspeedTemp = Casesorterct;
          Casesortersec = 0;
        }
        CasesortersecStop = 0;
        Casesortersec++;
        Casesortertime = Date.now();
        Casesorterstate = 1;
        CasesorterflagStopped = false;
        CasesorterflagRunning = true;
      } else if (Casesorterct == Casesorteractual) {
        if (CasesortersecStop == 0) {
          Casesortertime = Date.now();
        }
        CasesortersecStop++;
        if (CasesortersecStop >= CasesortertimeStop) {
          Casesorterspeed = 0;
          Casesorterstate = 2;
          CasesorterspeedTemp = Casesorterct;
          CasesorterflagStopped = true;
          CasesorterflagRunning = false;
        }
        if (CasesortersecStop % CasesortertimeStop * 3 == 0 || CasesortersecStop == CasesortertimeStop) {
          CasesorterflagPrint = 1;

          if (CasesortersecStop % CasesortertimeStop * 3 == 0) {
            Casesortertime = Date.now();
          }
        }
      }
      Casesorteractual = Casesorterct;
      if (Casesortersec == CasesorterWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Casesortersec = 0;
        if (CasesorterflagRunning && Casesorterct) {
          CasesorterflagPrint = 1;
          CasesortersecStop = 0;
          Casesorterspeed = Casesorterct - CasesorterspeedTemp;
          CasesorterspeedTemp = Casesorterct;
        }
      }



      Casesortermaster = {
        "ST": Casesorterestado,
        "CPQI": CntInCasesorter,
        "CPQO": CntOutCasesorter,
        "CPQR": CntRjCasesorter,
        "SP": Casesorterspeed
      };

      if (CasesorterflagPrint == 1) {
        for (var key in Casesortermaster) {
          if (Casesortermaster[key] != null && !isNaN(Casesortermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_casesorter_l5.log", 'tt=' + Casesortertime + ',var=' + key + ',val=' + Casesortermaster[key] + '\n');
        }
        CasesorterflagPrint = 0;
      }


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


      Casepackerct = CntOutCasepacker; // NOTE: igualar al contador de salida
      if (CasepackerONS == 0 && Casepackerct) {
        CasepackerspeedTemp = Casepackerct;
        CasepackerONS = 1;
      }
      if (Casepackerct > Casepackeractual) {
        if (CasepackerflagStopped) {
          Casepackerspeed = Casepackerct - CasepackerspeedTemp;
          CasepackerspeedTemp = Casepackerct;
          Casepackersec = 0;
        }
        CasepackersecStop = 0;
        Casepackersec++;
        Casepackertime = Date.now();
        Casepackerstate = 1;
        CasepackerflagStopped = false;
        CasepackerflagRunning = true;
      } else if (Casepackerct == Casepackeractual) {
        if (CasepackersecStop == 0) {
          Casepackertime = Date.now();
        }
        CasepackersecStop++;
        if (CasepackersecStop >= CasepackertimeStop) {
          Casepackerspeed = 0;
          Casepackerstate = 2;
          CasepackerspeedTemp = Casepackerct;
          CasepackerflagStopped = true;
          CasepackerflagRunning = false;
        }
        if (CasepackersecStop % CasepackertimeStop * 3 == 0 || CasepackersecStop == CasepackertimeStop) {
          CasepackerflagPrint = 1;

          if (CasepackersecStop % CasepackertimeStop * 3 == 0) {
            Casepackertime = Date.now();
          }
        }
      }
      Casepackeractual = Casepackerct;
      if (Casepackersec == CasepackerWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Casepackersec = 0;
        if (CasepackerflagRunning && Casepackerct) {
          CasepackerflagPrint = 1;
          CasepackersecStop = 0;
          Casepackerspeed = Casepackerct - CasepackerspeedTemp;
          CasepackerspeedTemp = Casepackerct;
        }
      }

      Casepackermaster = {
        "ST": Casepackerestado,
        "CPQIB": CntInCasepacker1,
        "CPQI": CntInCasepacker2,
        "CPQO": CntOutCasepacker,
        "CPQR": CntRjCasepacker,
        "SP": Casepackerspeed
      };

      if (CasepackerflagPrint == 1) {
        for (var key in Casepackermaster) {
          if (Casepackermaster[key] != null && !isNaN(Casepackermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_casepacker_l5.log", 'tt=' + Casepackertime + ',var=' + key + ',val=' + Casepackermaster[key] + '\n');
        }
        CasepackerflagPrint = 0;
      }
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


      Turnerct = CntOutTurner; // NOTE: igualar al contador de salida
      if (TurnerONS == 0 && Turnerct) {
        TurnerspeedTemp = Turnerct;
        TurnerONS = 1;
      }
      if (Turnerct > Turneractual) {
        if (TurnerflagStopped) {
          Turnerspeed = Turnerct - TurnerspeedTemp;
          TurnerspeedTemp = Turnerct;
          Turnersec = 0;
        }
        TurnersecStop = 0;
        Turnersec++;
        Turnertime = Date.now();
        Turnerstate = 1;
        TurnerflagStopped = false;
        TurnerflagRunning = true;
      } else if (Turnerct == Turneractual) {
        if (TurnersecStop == 0) {
          Turnertime = Date.now();
        }
        TurnersecStop++;
        if (TurnersecStop >= TurnertimeStop) {
          Turnerspeed = 0;
          Turnerstate = 2;
          TurnerspeedTemp = Turnerct;
          TurnerflagStopped = true;
          TurnerflagRunning = false;
        }
        if (TurnersecStop % TurnertimeStop * 3 == 0 || TurnersecStop == TurnertimeStop) {
          TurnerflagPrint = 1;

          if (TurnersecStop % TurnertimeStop * 3 == 0) {
            Turnertime = Date.now();
          }
        }
      }
      Turneractual = Turnerct;
      if (Turnersec == TurnerWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Turnersec = 0;
        if (TurnerflagRunning && Turnerct) {
          TurnerflagPrint = 1;
          TurnersecStop = 0;
          Turnerspeed = Turnerct - TurnerspeedTemp;
          TurnerspeedTemp = Turnerct;
        }
      }

      Turnermaster = {
        "ST": Turnerestado,
        "CPQI": CntInTurner,
        "CPQO": CntOutTurner,
        "SP": Turnerspeed
      };

      if (TurnerflagPrint == 1) {
        for (var key in Turnermaster) {
          if (Turnermaster[key] != null && !isNaN(Turnermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_turner_l5.log", 'tt=' + Turnertime + ',var=' + key + ',val=' + Turnermaster[key] + '\n');
        }
        TurnerflagPrint = 0;
      }
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


      Fillerct = CntOutFiller; // NOTE: igualar al contador de salida
      if (FillerONS == 0 && Fillerct) {
        FillerspeedTemp = Fillerct;
        FillerONS = 1;
      }
      if (Fillerct > Filleractual) {
        if (FillerflagStopped) {
          Fillerspeed = Fillerct - FillerspeedTemp;
          FillerspeedTemp = Fillerct;
          Fillersec = 0;
        }
        FillersecStop = 0;
        Fillersec++;
        Fillertime = Date.now();
        Fillerstate = 1;
        FillerflagStopped = false;
        FillerflagRunning = true;
      } else if (Fillerct == Filleractual) {
        if (FillersecStop == 0) {
          Fillertime = Date.now();
        }
        FillersecStop++;
        if (FillersecStop >= FillertimeStop) {
          Fillerspeed = 0;
          Fillerstate = 2;
          FillerspeedTemp = Fillerct;
          FillerflagStopped = true;
          FillerflagRunning = false;
        }
        if (FillersecStop % FillertimeStop * 3 == 0 || FillersecStop == FillertimeStop) {
          FillerflagPrint = 1;

          if (FillersecStop % FillertimeStop * 3 == 0) {
            Fillertime = Date.now();
          }
        }
      }
      Filleractual = Fillerct;
      if (Fillersec == FillerWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Fillersec = 0;
        if (FillerflagRunning && Fillerct) {
          FillerflagPrint = 1;
          FillersecStop = 0;
          Fillerspeed = Fillerct - FillerspeedTemp;
          FillerspeedTemp = Fillerct;
        }
      }

      Fillermaster = {
        "ST": Fillerestado,
        "CPQI": CntInFiller,
        "CPQO": CntOutFiller,
        "CPQR": CntRjFiller,
        "SP": Fillerspeed
      };

      if (FillerflagPrint == 1) {
        for (var key in Fillermaster) {
          if (Fillermaster[key] != null && !isNaN(Fillermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_filler_l5.log", 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillermaster[key] + '\n');
        }
        FillerflagPrint = 0;
      }
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


      Jarturnerct = CntOutJarturner; // NOTE: igualar al contador de salida
      if (JarturnerONS == 0 && Jarturnerct) {
        JarturnerspeedTemp = Jarturnerct;
        JarturnerONS = 1;
      }
      if (Jarturnerct > Jarturneractual) {
        if (JarturnerflagStopped) {
          Jarturnerspeed = Jarturnerct - JarturnerspeedTemp;
          JarturnerspeedTemp = Jarturnerct;
          Jarturnersec = 0;
        }
        JarturnersecStop = 0;
        Jarturnersec++;
        Jarturnertime = Date.now();
        Jarturnerstate = 1;
        JarturnerflagStopped = false;
        JarturnerflagRunning = true;
      } else if (Jarturnerct == Jarturneractual) {
        if (JarturnersecStop == 0) {
          Jarturnertime = Date.now();
        }
        JarturnersecStop++;
        if (JarturnersecStop >= JarturnertimeStop) {
          Jarturnerspeed = 0;
          Jarturnerstate = 2;
          JarturnerspeedTemp = Jarturnerct;
          JarturnerflagStopped = true;
          JarturnerflagRunning = false;
        }
        if (JarturnersecStop % JarturnertimeStop * 3 == 0 || JarturnersecStop == JarturnertimeStop) {
          JarturnerflagPrint = 1;

          if (JarturnersecStop % JarturnertimeStop * 3 == 0) {
            Jarturnertime = Date.now();
          }
        }
      }
      Jarturneractual = Jarturnerct;
      if (Jarturnersec == JarturnerWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Jarturnersec = 0;
        if (JarturnerflagRunning && Jarturnerct) {
          JarturnerflagPrint = 1;
          JarturnersecStop = 0;
          Jarturnerspeed = Jarturnerct - JarturnerspeedTemp;
          JarturnerspeedTemp = Jarturnerct;
        }
      }

      Jarturnermaster = {
        "ST": Jarturnerestado,
        "CPQI": CntInJarturner,
        "CPQO": CntOutJarturner,
        "SP": Jarturnerspeed
      };

      if (JarturnerflagPrint == 1) {
        for (var key in Jarturnermaster) {
          if (Jarturnermaster[key] != null && !isNaN(Jarturnermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_jar_turner_l5.log", 'tt=' + Jarturnertime + ',var=' + key + ',val=' + Jarturnermaster[key] + '\n');
        }
        JarturnerflagPrint = 0;
      }
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


      Palletizerct = CntOutPalletizer; // NOTE: igualar al contador de salida
      if (PalletizerONS == 0 && Palletizerct) {
        PalletizerspeedTemp = Palletizerct;
        PalletizerONS = 1;
      }
      if (Palletizerct > Palletizeractual) {
        if (PalletizerflagStopped) {
          Palletizerspeed = Palletizerct - PalletizerspeedTemp;
          PalletizerspeedTemp = Palletizerct;
          Palletizersec = 0;
        }
        PalletizersecStop = 0;
        Palletizersec++;
        Palletizertime = Date.now();
        Palletizerstate = 1;
        PalletizerflagStopped = false;
        PalletizerflagRunning = true;
      } else if (Palletizerct == Palletizeractual) {
        if (PalletizersecStop == 0) {
          Palletizertime = Date.now();
        }
        PalletizersecStop++;
        if (PalletizersecStop >= PalletizertimeStop) {
          Palletizerspeed = 0;
          Palletizerstate = 2;
          PalletizerspeedTemp = Palletizerct;
          PalletizerflagStopped = true;
          PalletizerflagRunning = false;
        }
        if (PalletizersecStop % PalletizertimeStop * 3 == 0 || PalletizersecStop == PalletizertimeStop) {
          PalletizerflagPrint = 1;

          if (PalletizersecStop % PalletizertimeStop * 3 == 0) {
            Palletizertime = Date.now();
          }
        }
      }
      Palletizeractual = Palletizerct;
      if (Palletizersec == PalletizerWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Palletizersec = 0;
        if (PalletizerflagRunning && Palletizerct) {
          PalletizerflagPrint = 1;
          PalletizersecStop = 0;
          Palletizerspeed = Palletizerct - PalletizerspeedTemp;
          PalletizerspeedTemp = Palletizerct;
        }
      }

      Palletizermaster = {
        "ST": Palletizerestado,
        "CPQI": CntInPalletizer,
        "CPQO": CntOutPalletizer,
        "SP": Palletizerspeed
      };

      if (PalletizerflagPrint == 1) {
        for (var key in Palletizermaster) {
          if (Palletizermaster[key] != null && !isNaN(Palletizermaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_palletizer_l5.log", 'tt=' + Palletizertime + ',var=' + key + ',val=' + Palletizermaster[key] + '\n');
        }
        PalletizerflagPrint = 0;
      }
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


      Spiralconveyorct = CntOutSpiralconveyor; // NOTE: igualar al contador de salida
      if (SpiralconveyorONS == 0 && Spiralconveyorct) {
        SpiralconveyorspeedTemp = Spiralconveyorct;
        SpiralconveyorONS = 1;
      }
      if (Spiralconveyorct > Spiralconveyoractual) {
        if (SpiralconveyorflagStopped) {
          Spiralconveyorspeed = Spiralconveyorct - SpiralconveyorspeedTemp;
          SpiralconveyorspeedTemp = Spiralconveyorct;
          Spiralconveyorsec = 0;
        }
        SpiralconveyorsecStop = 0;
        Spiralconveyorsec++;
        Spiralconveyortime = Date.now();
        Spiralconveyorstate = 1;
        SpiralconveyorflagStopped = false;
        SpiralconveyorflagRunning = true;
      } else if (Spiralconveyorct == Spiralconveyoractual) {
        if (SpiralconveyorsecStop == 0) {
          Spiralconveyortime = Date.now();
        }
        SpiralconveyorsecStop++;
        if (SpiralconveyorsecStop >= SpiralconveyortimeStop) {
          Spiralconveyorspeed = 0;
          Spiralconveyorstate = 2;
          SpiralconveyorspeedTemp = Spiralconveyorct;
          SpiralconveyorflagStopped = true;
          SpiralconveyorflagRunning = false;
        }
        if (SpiralconveyorsecStop % SpiralconveyortimeStop * 3 == 0 || SpiralconveyorsecStop == SpiralconveyortimeStop) {
          SpiralconveyorflagPrint = 1;

          if (SpiralconveyorsecStop % SpiralconveyortimeStop * 3 == 0) {
            Spiralconveyortime = Date.now();
          }
        }
      }
      Spiralconveyoractual = Spiralconveyorct;
      if (Spiralconveyorsec == SpiralconveyorWorktime) { //NOTE: Modificar el 60 dependiendo del tiempo de trabajo de la máquina. (Cerca de 40 segundos igualar a 3)
        Spiralconveyorsec = 0;
        if (SpiralconveyorflagRunning && Spiralconveyorct) {
          SpiralconveyorflagPrint = 1;
          SpiralconveyorsecStop = 0;
          Spiralconveyorspeed = Spiralconveyorct - SpiralconveyorspeedTemp;
          SpiralconveyorspeedTemp = Spiralconveyorct;
        }
      }

      Spiralconveyormaster = {
        "ST": Spiralconveyorestado,
        "CPQI": CntInSpiralconveyor,
        "CPQO": CntOutSpiralconveyor,
        "SP": Spiralconveyorspeed
      };

      if (SpiralconveyorflagPrint == 1) {
        for (var key in Spiralconveyormaster) {
          if (Spiralconveyormaster[key] != null && !isNaN(Spiralconveyormaster[key]))
            fs.appendFileSync("C:/PULSE/L5_LOGS/cue_pcl_Spiralconveyor_l5.log", 'tt=' + Spiralconveyortime + ',var=' + key + ',val=' + Spiralconveyormaster[key] + '\n');
        }
        SpiralconveyorflagPrint = 0;
      }


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


function close() {
  console.log("leyendo");
  //var obj= await lectura();

  the_session.close(function(err) {
    if (err) {
      console.log("session closed failed ?");
    }
    console.log("Session is closed");
  });
  client.disconnect(function() {});


}
