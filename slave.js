var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE line5 SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex_cue_pcl_line5_wise.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
