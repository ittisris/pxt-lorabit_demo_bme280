input.onButtonPressed(Button.B, function () {
    basic.showString("join lorabit_demo_001")
    loraBit.reset()
    loraBit.param_OTAA(
    "003D23377585E082",
    "70B3D57ED00219AA",
    "398AD37EB687A225DC5E3E3A8CACB425"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.clearScreen()
})
input.onPinPressed(TouchPin.P0, function () {
    interval = input.runningTime()
    immediate = true
    images.createImage(`
        . . . . #
        . . . . #
        . . . # #
        . . # # #
        # # # # #
        `).scrollImage(1, 50)
})
function doSomething () {
    if (loraBit.nacknowledged()) {
        basic.showIcon(IconNames.No)
    } else {
        immediate = false
        interval = input.runningTime() + 15000
        basic.clearScreen()
    }
    if (loraBit.getReceivedPort() == 99) {
        cayenneLPP.lpp_update(loraBit.getReceivedPayload())
    }
}
loraBit.whenReceived(function () {
    doSomething()
})
let payload = ""
let seqNo = 0
let immediate = false
let interval = 0
led.setBrightness(20)
basic.showIcon(IconNames.Heart)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
interval = input.runningTime()
immediate = false
loraBit.Verbose(Verbose_Mode.On)
loraBit.param_Config(
5,
7,
loraBit_ADR.On
)
basic.forever(function () {
    while (!(loraBit.available())) {
        basic.pause(100)
    }
    if (input.runningTime() > interval) {
        BME280.PowerOn()
        basic.pause(500)
        seqNo += 1
        payload = cayenneLPP.lpp(
        LPP_DATA_TYPE.Temperature,
        51,
        BME280.temperature(BME280_T.T_C)
        )
        BME280.PowerOff()
        if (immediate) {
            interval = input.runningTime() + 120000
            loraBit.sendPacket(loraBit_Confirmed.Confirmed, 191, payload)
        } else {
            interval = input.runningTime() + 15000
            loraBit.sendPacket(loraBit_Confirmed.Confirmed, 99, payload)
        }
        loraBit.sleep()
    }
})
