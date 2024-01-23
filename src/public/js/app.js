const sendUrl = "ws://localhost:3000";

const ssoSocket = new WebSocket(sendUrl);

const getSsoData = (param) => {
  console.log("GeoSsoData() called.");

  try {
    const strParam = JSON.stringify(param);

    const byteParam = new TextEncoder().encode(strParam);

    ssoSocket.send(byteParam);
  } catch (error) {
    console.error("Occurred error in GetSsoData().", error);
  }
};

const $socketIdInput = document.querySelector("#socket-input");

const $SocketLoginBtn = document.querySelector("#socket-login");

$SocketLoginBtn.addEventListener("click", () => {
  getSsoData({
    rqtype: $socketIdInput.value, // success rqtype: getknoxsso
    data: "KCB10TRAY0020",
    token: "",
  });

  $socketIdInput.value = "";
});

const $resultInput = document.querySelector("#result-input");

const $keyInput = document.querySelector("#key-input");

const $userInfoInput = document.querySelector("#userInfo-input");

const $errorDetailInput = document.querySelector("#error-detail-input");

ssoSocket.addEventListener("message", (message) => {
  try {
    const ssoData = JSON.parse(message.data);

    const { rpcode } = ssoData;

    switch (rpcode) {
      case "EMPTY_BOX":
        $resultInput.value = -1;
        $keyInput.value = "";
        $userInfoInput.value = "";
        $errorDetailInput.value = ssoData.detail;
        break;
      case "RETURN_SUCCESS":
        $resultInput.value = 1;
        $keyInput.value = ssoData.data.key;
        $userInfoInput.value = ssoData.data.userInfo;
        $errorDetailInput.value = "";
        break;
      case "ERROR":
        $resultInput.value = 0;
        $keyInput.value = "";
        $userInfoInput.value = "";
        $errorDetailInput.value = ssoData.detail;
        break;
      default:
        throw new Error("Invalid rpcode.");
    }
  } catch (error) {
    console.log("Occurred error in received message event().", error);
  }
});
