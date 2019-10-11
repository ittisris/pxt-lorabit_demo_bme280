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
        if (loraBit.getReceivedPort() == 99) {
            cayenneLPP.lpp_update(loraBit.getReceivedPayload())
        }
    }
    basic.clearScreen()
})
led.setBrightness(20)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
let interval = input.runningTime()
loraBit.Verbose(Verbose_Mode.On)
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P1)
loraBit.param_Config(
5,
2,
loraBit_ADR.On
)
basic.forever(function () {
    while (!(loraBit.available())) {
        basic.pause(100)
    }
    if (input.runningTime() > interval) {
        BME280.PowerOn()
        basic.pause(500)
        interval = input.runningTime() + 30000
        loraBit.sendPacket(loraBit_Confirmed.Uncomfirmed, 99, "" + cayenneLPP.lpp(
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
        ) + cayenneLPP.lpp_upload())
        BME280.PowerOff()
        loraBit.sleep()
    }
})
