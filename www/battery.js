cordova.define("cordova-plugin-battery-status.battery", function(require, exports, module) {
/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * This class contains information about the current battery status.
 * @constructor
 */
var cordova = require('cordova'),
    exec = require('cordova/exec');

               var getBattery = function() {
                return new Promise(function(resolve, reject) {
                                  var BatteryManager = {
                                  charging: true,
                                  chargingTime: 0,
                                  dischargingTime: Number.POSITIVE_INFINITY,
                                  level: 0,
                                  onchargingchange: function() {},
                                  onchargingtimechange: function() {},
                                  ondischargingtimechange: function() {},
                                  onlevelchange: function() {}
                                  };
                                  var success = function(batteryInfo) {
                                   console.log(batteryInfo.charging);
                                   console.log(batteryInfo.level);
                                   
//                                  if (BatteryManager.charging !== batteryInfo.charging) {
//                                  BatteryManager.onchargingchange(batteryInfo.charging);
//                                  }
//                                 
//                                  if (BatteryManager.level !== batteryInfo.level) {
//                                  BatteryManager.onlevelchange(batteryInfo.level);
//                                  }
//                                  BatteryManager.charging = batteryInfo.charging;
//                                  BatteryManager.chargingTime = 0;
//                                  BatteryManager.dischargingTime = Number.POSITIVE_INFINITY;
//                                  BatteryManager.level = batteryInfo.level;
                                  };
                                  
                                   var error = function(error){
                                   
                                   }
                                  exec(success, error, "Battery","getBatteryStatus", []);
                                  });
               };
               
               module.exports = getBattery;


});
