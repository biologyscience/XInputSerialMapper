const
    vigemclient = require('vigemclient'),
    { SerialPort } = require('serialport'),
    { argv, exit } = require('process');

const
    vjoy = new vigemclient(),
    serialport = new SerialPort({ path: `COM${argv[2]}`, baudRate: Math.floor(argv[3]), autoOpen: false });

vjoy.connect();

const x360 = vjoy.createX360Controller();

x360.connect();

let check = false;

serialport.on('data', (serialBuffer) =>
{
    try
    {
        const payload = JSON.parse(serialBuffer.toString());

        if (!check)
        {
            console.log('Received JSON data !');
            console.log('\nTo inspect controller actions: Run > joy.cpl > Double click "Controller (XBOX 360 For Windows)" > Test\nor simply go to https://hardwaretester.com/gamepad');

            check = true;
        }

        if (!payload.ENABLED) return;

        if (payload.LX !== undefined) x360.axis.leftX.setValue(payload.LX / 100);
        if (payload.LY !== undefined) x360.axis.leftY.setValue(payload.LY / 100);
        if (payload.L2 !== undefined) x360.axis.leftTrigger.setValue(payload.L2 / 100);

        if (payload.RX !== undefined) x360.axis.rightX.setValue(payload.RX / 100);
        if (payload.RY !== undefined) x360.axis.rightY.setValue(payload.RY / 100);
        if (payload.R2 !== undefined) x360.axis.rightTrigger.setValue(payload.R2 / 100);

        if (payload.D !== undefined)
        {
            const { L, R, D, U } = payload.D;

            L ? x360.axis.dpadHorz.setValue(-1) : null;
            R ? x360.axis.dpadHorz.setValue(1) : null;
            D ? x360.axis.dpadVert.setValue(-1) : null;
            U ? x360.axis.dpadVert.setValue(1) : null;
        }

        else
        {
            x360.axis.dpadHorz.setValue(0);
            x360.axis.dpadVert.setValue(0);
        }

        if (payload.BTN !== undefined)
        {
            const { L1, L3, R1, R3, X, Y, A, B, BACK, MISC, START } = payload.BTN;
            
            x360.button.LEFT_SHOULDER.setValue(L1);
            x360.button.LEFT_THUMB.setValue(L3);

            x360.button.RIGHT_SHOULDER.setValue(R1);
            x360.button.RIGHT_THUMB.setValue(R3);

            x360.button.X.setValue(X);
            x360.button.Y.setValue(Y);
            x360.button.A.setValue(A);
            x360.button.B.setValue(B);

            x360.button.BACK.setValue(BACK);
            x360.button.GUIDE.setValue(MISC);
            x360.button.START.setValue(START);
        }
        
        else
        {
            for (const BTN in x360.button)
            {
                x360.button[BTN].setValue(false);
            }
        }
    }

    catch (E) { }
});

const dataFrame =
`
{
    // Number (-100 to 100) %
    LX, LY, RX, RY
    
    // Number (0 to 100) %
    L2, R2
    
    // Boolean
    D: { L, R, D, U }
    BTN: { L1, L3, R1, R3, X, Y, A, B, BACK, MISC, START }
    ENABLED: true
}
`;

console.log('Expected Serialised JSON object for XInput Mapping', dataFrame);

serialport.open((err) =>
{
    if (err === null) return console.log(`Expecting JSON data @ ${serialport.path} ...`);

    console.log(err, `| Try again.\n${'_'.repeat(60)}\n`);
    exit(1);
});