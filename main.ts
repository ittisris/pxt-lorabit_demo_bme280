input.onButtonPressed(Button.AB, function () {
    joinOTAA()
})
function joinOTAA () {
    loraBit.reset()
    loraBit.param_Config(
    2,
    7,
    loraBit_ADR.On
    )
    loraBit.param_OTAA(
    "003D23377585E082",
    "70B3D57ED00219AA",
    "398AD37EB687A225DC5E3E3A8CACB425"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.showString("join 001")
    basic.clearScreen()
}
function joinABP () {
    loraBit.reset()
    loraBit.param_Config(
    2,
    7,
    loraBit_ADR.On
    )
    loraBit.param_ABP(
    "260413F9",
    "7397A4B87CC59FF4C9118C3A23E78C54",
    "AD08530B092DEF1AD58478547F17825C"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.showString("join 003 ABP")
    basic.clearScreen()
}
function SendImmediate () {
    interval = input.runningTime()
    conf = true
    images.createImage(`
        . . . . #
        . . . . #
        . . . # #
        . . # # #
        # # # # #
        `).scrollImage(1, 50)
}
input.onGesture(Gesture.Shake, function () {
    SendImmediate()
})
input.onButtonPressed(Button.A, function () {
    SendImmediate()
})
loraBit.whenReceived(function () {
    if (loraBit.nacknowledged()) {
        basic.showIcon(IconNames.No)
    } else {
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
let payload = ""
let result = 0
let conf = false
let interval = 0
led.setBrightness(20)
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P1)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Temperature)
interval = input.runningTime()
conf = true
let seqno = 0
loraBit.Verbose(Verbose_Mode.On)
joinABP()
basic.forever(function () {
    if (input.runningTime() > interval) {
        if (!(loraBit.available())) {
            basic.showIcon(IconNames.SmallDiamond)
            basic.pause(50)
        } else {
            seqno += 1
            payload = "" + cayenneLPP.lpp_upload() + "6265" + loraBit.toHexString(Math.floor(seqno / 256)) + loraBit.toHexString(seqno % 256)
            if (conf) {
                loraBit.sendPacket(loraBit_Confirmed.Confirmed, 99, payload)
            } else {
                loraBit.sendPacket(loraBit_Confirmed.Uncomfirmed, 99, payload)
            }
            interval = input.runningTime() + 60000
            loraBit.sleep()
        }
        basic.clearScreen()
    }
    basic.pause(1000)
})
