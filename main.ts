input.onButtonPressed(Button.B, function () {
    basic.showString("join")
    loraBit.reset()
    loraBit.param_OTAA(
    "003D23377585E082",
    "70B3D57ED00219AA",
    "1F22AD071F8D67F2410EBFFAB6A6B278"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.clearScreen()
})
loraBit.whenReceived(function () {
    if (loraBit.nacknowledged()) {
        basic.showIcon(IconNames.No)
    } else {
        immediate = false
        basic.clearScreen()
    }
    if (loraBit.getReceivedPort() == 99) {
        cayenneLPP.lpp_update(loraBit.getReceivedPayload())
    }
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
loraBit.Verbose(Verbose_Mode.On)
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P1)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Temperature)
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
        ) + cayenneLPP.lpp_upload()
        BME280.PowerOff()
        if (immediate) {
            interval = input.runningTime() + 120000
            loraBit.sendPacket(loraBit_Confirmed.Confirmed, 191, payload)
        } else {
            interval = input.runningTime() + 30000
            loraBit.sendPacket(loraBit_Confirmed.Uncomfirmed, 99, payload)
        }
        loraBit.sleep()
    }
})
