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
/* globals Promise */
/**
 * This class contains information about the current battery status.
 * @constructor
 */
var exec = cordova.require('cordova/exec');

var BatteryManager = function() {
  this.charging = undefined;
  this.chargingTime = 0;
  this.dischargingTime = Number.POSITIVE_INFINITY;
  this.level = -1.0;
  this._handlers = {
    'chargingchange': [],
    'chargingtimechange': [],
    'dischargingtimechange': [],
    'levelchange': []
  };

  this.onchargingchange = function() {};
  this.onchargingtimechange = function() {};
  this.ondischargingtimechange = function() {};
  this.onlevelchange = function() {};

  var success = function(batteryInfo) {
    var temp = {
      charging: this.charging,
      chargingTime: this.chargingTime,
      dischargingTime: this.dischargingTime,
      level: this.level
    };
    this.charging = typeof batteryInfo.charging !== "undefined" ? batteryInfo.charging : this.charging;
    this.chargingTime = typeof batteryInfo.chargingTime !== "undefined" ? batteryInfo.chargingTime : this.chargingTime;
    this.dischargingTime = typeof batteryInfo.dischargingTime !== "undefined" ? batteryInfo.dischargingTime : this.dischargingTime;
    this.level = typeof batteryInfo.level !== "undefined" ? batteryInfo.level : this.level;

    if (temp.charging !== batteryInfo.charging) {
      this.onchargingchange();
      this.emit('chargingchange');
    }

    if (temp.chargingTime !== batteryInfo.chargingTime) {
      this.onchargingtimechange();
      this.emit('chargingtimechange');
    }

    if (temp.dischargingTime !== batteryInfo.dischargingTime) {
      this.ondischargingtimechange();
      this.emit('dischargingtimechange');
    }
    
    if (temp.level !== batteryInfo.level) {
      this.onlevelchange();
      this.emit('levelchange');
    }
  };

  exec(success.bind(this), null, "CDVBatteryStatus","getBatteryStatus", []);
};

BatteryManager.prototype.addEventListener = function(eventName, callback) {
  if (!this._handlers.hasOwnProperty(eventName)) {
    this._handlers[eventName] = [];
  }
  this._handlers[eventName].push(callback);
};

BatteryManager.prototype.removeEventListener = function(eventName, handle) {
  if (this._handlers.hasOwnProperty(eventName)) {
    var handleIndex = this._handlers[eventName].indexOf(handle);
    if (handleIndex >= 0) {
      this._handlers[eventName].splice(handleIndex, 1);
    }
  }
};

BatteryManager.prototype.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var eventName = args.shift();

  if (!this._handlers.hasOwnProperty(eventName)) {
    return false;
  }

  for (var i = 0, length = this._handlers[eventName].length; i < length; i++) {
    var callback = this._handlers[eventName][i];
    if (typeof callback === 'function') {
      callback.apply(undefined,args);
    } else {
      console.log('event handler: ' + eventName + ' must be a function');
    }
  }
  return true;
};

var getBattery = function() {
  return new Promise(function(resolve, reject) {
    var manager = new BatteryManager();
    resolve(manager);
  });
};

module.exports = getBattery;


var _batteryStatus = cordova.addWindowEventHandler('batterystatus');
_batteryStatus.onHasSubscribersChange = function(){
    navigator.getBattery().then(function (battery) {
        cordova.fireWindowEvent('batterystatus', {
            level: parseInt(battery.level * 100),
            isPlugged: battery.charging
        });

        battery.onchargingchange = function () {
            cordova.fireWindowEvent('batterystatus', {
                level: parseInt(battery.level * 100),
                isPlugged: battery.charging
            });
        };

        battery.onlevelchange = function () {
            cordova.fireWindowEvent('batterystatus', {
                level: parseInt(battery.level * 100),
                isPlugged: battery.charging
            });
        };
    });
};

var _batteryLow = cordova.addWindowEventHandler('batterylow');
_batteryLow.onHasSubscribersChange = function(){
    var STATUS_LOW = 20;
    navigator.getBattery().then(function (battery) {
        if(parseInt(battery.level * 100) <= STATUS_LOW) {
            cordova.fireWindowEvent('batterylow', {
                level: parseInt(battery.level * 100),
                isPlugged: battery.charging
            });
        }

        battery.onchargingchange = function () {
            if(parseInt(battery.level * 100) <= STATUS_LOW) {
                cordova.fireWindowEvent('batterylow', {
                    level: parseInt(battery.level * 100),
                    isPlugged: battery.charging
                });
            }
        };

        battery.onlevelchange = function () {
            if(parseInt(battery.level * 100) <= STATUS_LOW) {
                cordova.fireWindowEvent('batterylow', {
                    level: parseInt(battery.level * 100),
                    isPlugged: battery.charging
                });
            }
        };
    });
};

var _batteryCritical = cordova.addWindowEventHandler('batterycritical');
_batteryCritical.onHasSubscribersChange = function(){
    var STATUS_CRITICAL = 5;
    navigator.getBattery().then(function (battery) {
        if(parseInt(battery.level * 100) <= STATUS_CRITICAL) {
            cordova.fireWindowEvent('batterycritical', {
                level: parseInt(battery.level * 100),
                isPlugged: battery.charging
            });
        }

        battery.onchargingchange = function () {
            if(parseInt(battery.level * 100) <= STATUS_CRITICAL) {
                cordova.fireWindowEvent('batterycritical', {
                    level: parseInt(battery.level * 100),
                    isPlugged: battery.charging
                });
            }
        };

        battery.onlevelchange = function () {
            if(parseInt(battery.level * 100) <= STATUS_CRITICAL) {
                cordova.fireWindowEvent('batterycritical', {
                    level: parseInt(battery.level * 100),
                    isPlugged: battery.charging
                });
            }
        };
    });
};