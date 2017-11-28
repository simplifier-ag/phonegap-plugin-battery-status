@objc(CDVBatteryStatus) class CDVBatteryStatus : CDVPlugin {

    var callbackId: String = ""

    @objc(getBatteryStatus:)
    func getBatteryStatus(command: CDVInvokedUrlCommand) {
       self.callbackId = command.callbackId
        
        if !UIDevice.current.isBatteryMonitoringEnabled {
            UIDevice.current.isBatteryMonitoringEnabled = true
            NotificationCenter.default.addObserver(self, selector: #selector(CDVBatteryStatus.batteryStateDidChange(_:)), name: NSNotification.Name.UIDeviceBatteryStateDidChange, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(CDVBatteryStatus.batteryLevelDidChange(_:)), name: NSNotification.Name.UIDeviceBatteryLevelDidChange, object: nil)
        }
        
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: self.getBatteryInfo())
        pluginResult!.setKeepCallbackAs(true)
        
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }

    //Battery level did change
    func batteryLevelDidChange(_ notification: Notification) {
        if self.callbackId != "" {
            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: self.getBatteryInfo())
            pluginResult!.setKeepCallbackAs(true)

            self.commandDelegate!.send(pluginResult, callbackId: self.callbackId)
        }
    }

    //Battery state did change (Plugin/Unplug)
    func batteryStateDidChange(_ notification: Notification) {
        if self.callbackId != "" {
            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: self.getBatteryInfo())
            pluginResult!.setKeepCallbackAs(true)

            self.commandDelegate!.send(pluginResult, callbackId: self.callbackId)
        }
    }

    func getBatteryInfo () ->  [String: Any] {
        var batteryState : Bool
        switch UIDevice.current.batteryState {
        case .unknown:
            batteryState = false
            break
        case .unplugged:
            batteryState = false
            break
        case .charging:
            batteryState = true
            break
        case .full:
            batteryState = true
            break
        default:
            batteryState = false
        }

        let batteryLevel: Float = UIDevice.current.batteryLevel

        return ["charging":batteryState,"level":batteryLevel]
    }
}