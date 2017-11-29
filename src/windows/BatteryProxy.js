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
/* globals Windows */

var battery = Windows.Devices.Power.Battery.aggregateBattery;
module.exports = {
  getBatteryStatus : function (win, fail, args) {
    var batteryInfo = {
      level : null,
      charging : null,
      chargingTime : null,
      dischargingTime : null
    };

    function onReportUpdated(eventArgs){
      var batteryReport = battery.getReport();
      batteryInfo.level = batteryReport.remainingCapacityInMilliwattHours/batteryReport.fullChargeCapacityInMilliwattHours;
      if (batteryReport.status == 3) {
        batteryInfo.charging = true;
      } else {
        batteryInfo.charging = false;
      }
      var rateOfCharging = batteryReport.chargeRateInMilliwatts;
      
      if(rateOfCharging > 0) {
        batteryInfo.chargingTime = batteryReport.fullChargeCapacityInMilliwattHours * (1 - batteryInfo.level)/batteryReport.chargeRateInMilliwatts;
        batteryInfo.dischargingTime = Number.POSITIVE_INFINITY;
      } else {
        batteryInfo.dischargingTime = batteryReport.remainingCapacityInMilliwattHours/Math.abs(batteryReport.chargeRateInMilliwatts);
        batteryInfo.chargingTime = Number.POSITIVE_INFINITY;
      }
      win(batteryInfo, { keepCallback: true });
    }

    battery.addEventListener("reportUpdated", onReportUpdated);
    setTimeout(onReportUpdated, 0);
  }
};
require('cordova/exec/proxy').add('Battery', module.exports);

  