function SendImmediate() {
    conf = true
    interval = input.runningTime()
    images.createImage(`
        . . . . #
        . . . . #
        . . . # #
        . . # # #
        # # # # #
        `).scrollImage(1, 50)
}
loraBit.whenReceived(function () {
    if (loraBit.nacknowledged()) {
        basic.showIcon(IconNames.No)
    } else {
        conf = false
        if (loraBit.getReceivedPort() == 99) {
            cayenneLPP.lpp_update(loraBit.getReceivedPayload())
            result = ["010000FF", "010064FF"].indexOf(loraBit.getReceivedPayload())
            if (result >= 0) {
                basic.showNumber(result)
                basic.pause(200)
            }
        }
    }
    basic.clearScreen()
})
input.onButtonPressed(Button.AB, function () {
    loraBit.reset()
    loraBit.param_OTAA(
        "003D23377585E082",
        "70B3D57ED00219AA",
        "398AD37EB687A225DC5E3E3A8CACB425"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.showString("join lorabit_demo_002")
    basic.clearScreen()
})
input.onGesture(Gesture.Shake, function () {
    SendImmediate()
})
input.onButtonPressed(Button.A, function () {
    SendImmediate()
})
let payload = ""
let seqno = 0
let result = 0
let conf = false
let interval = 0
led.setBrightness(20)
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P1)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Temperature)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
interval = input.runningTime()
loraBit.Verbose(Verbose_Mode.On)
loraBit.reset()
loraBit.param_Config(
    2,
    7,
    loraBit_ADR.On
)
if (false) {
    loraBit.param_ABP(
        "260413F9",
        "7397A4B87CC59FF4C9118C3A23E78C54",
        "AD08530B092DEF1AD58478547F17825C"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
}
basic.forever(function () {
    while (!(loraBit.available())) {
        basic.pause(100)
    }
    if (input.runningTime() > interval) {
        interval = input.runningTime() + 30000
        seqno += 1
        BME280.PowerOn()
        basic.pause(500)
        seqno += 1
        payload = "" + cayenneLPP.lpp_upload() + cayenneLPP.lpp(
            LPP_DATA_TYPE.Temperature,
            51,
            BME280.temperature(BME280_T.T_C)
        ) + "6265" + loraBit.toHexString(Math.floor(seqno / 256)) + loraBit.toHexString(seqno % 256)
        BME280.PowerOff()
        loraBit.sendPacket(loraBit_Confirmed.Confirmed, 99, payload)
        loraBit.sleep()
    }
})
