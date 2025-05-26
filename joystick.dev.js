const
    vigemclient = require('vigemclient'),
    { SerialPort } = require('serialport');
    
const
    vjoy = new vigemclient(),
    serialport = new SerialPort({ path: `COM23`, baudRate: 115200, autoOpen: false });

vjoy.connect();

const x360 = vjoy.createX360Controller();

x360.connect();

serialport.on('data', (serialBuffer) =>
{
    try
    {
        const payload = JSON.parse(serialBuffer.toString());

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
    // catch (E) { console.warn(E); }
});

serialport.open((err) =>
{
    console.log(err, `| Try again.\n${'_'.repeat(60)}\n`);
});