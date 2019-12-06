loraBit.whenReceived(function () {
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
})
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
let payload = ""
let immediate = false
let interval = 0
led.setBrightness(20)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
interval = input.runningTime()
immediate = false
let seqNo = 0
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
        payload = "" + cayenneLPP.lpp(
        LPP_DATA_TYPE.Temperature,
        51,
        BME280.temperature(BME280_T.T_C)
        ) + cayenneLPP.lpp(
        LPP_DATA_TYPE.Humidity,
        52,
        BME280.humidity()
        ) + cayenneLPP.lpp(
        LPP_DATA_TYPE.Pressure,
        53,
        BME280.pressure(BME280_P.hPa)
        ) + "6265" + loraBit.toHexString(Math.floor(seqNo / 256)) + loraBit.toHexString(seqNo % 256)
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
