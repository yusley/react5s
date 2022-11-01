import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = React.useState("Not Found");
  const [stopStream, setStopStream] = React.useState(false);

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        stopStream={stopStream}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text);
            setStopStream(true);
          } else {
            setData("Not Found");
          }
        }}
      />
      <p>{data}</p>
    </>
  );
}

export default App;