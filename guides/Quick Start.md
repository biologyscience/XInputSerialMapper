## 🧐 How to use ?
- Start the script by opening **XInputSerialMapper.bat**
- Follow the prompts and provide the COM port number and the baud rate for your serial device (defaults to COM23 @ 115200bps, if given nothing)
- If your serial device provides the required [serialized JSON object](#serialized-json-object), the script will map your data to the axis and buttons on the Xbox 360 contoller
- Once the mapping is established, you can verify the working of the controller at two places.
  - [Gamepad Tester](https://hardwaretester.com/gamepad)
  - Windows Game Controllers | Run > joy.cpl > Double click "Controller (XBOX 360 For Windows)" > Test
- To stop the emulation, simply close the .bat file, or Ctrl+C a bunch of times on the script

## Serialized JSON Object
```js
{
    ENABLED: true, // If false, all the following data is ignored

    // X Y axis of the Left joystick. -100 to 100 (%)
    LX: Number, 
    LY: Number,

    // X Y axis of the Right joystick. -100 to 100 (%)
    RX: Number,
    RY: Number,

    // Left and Right triggers. 0 to 100 (%)
    L2: Number,
    R2: Number,

    // D-Pad
    D:
    {
        L: Boolean, // Left
        R: Boolean, // Right
        D: Boolean, // Down
        U: Boolean  // Up
    },

    // Buttons
    BTN:
    {
        L1: Boolean, // Left bumper/shoulder
        L3: Boolean, // Left thumb

        R1: Boolean, // Right bumper/shoulder
        R3: Boolean, // Right thumb

        BACK: Boolean,  // Back
        MISC: Boolean,  // Guide
        START: Boolean, // Start

        // Action buttons
        X: Boolean,
        Y: Boolean,
        A: Boolean,
        B: Boolean
    }
}
```
This object should be serialized into a string while sending it via the serial port