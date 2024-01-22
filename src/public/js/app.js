const sendUrl = "ws://localhost:3000";

const ssoSocket = new WebSocket(sendUrl);

let result;
let key;
let userInfo;

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
    rptype: $socketIdInput.value,
    data: "KCB10TRAY0020",
    token: "",
  });

  $socketIdInput.value = "";
});

const $resultInput = document.querySelector("#result-input");

const $keyInput = document.querySelector("#key-input");

const $userInfoInput = document.querySelector("#userInfo-input");

ssoSocket.addEventListener("message", (message) => {
  try {
    const ssoData = JSON.parse(message.data);

    const { rqcode } = ssoData;

    const { key, userInfo } = ssoData.data;

    switch (rqcode) {
      case "EMPTY_BOX":
        $resultInput.value = -1;
        $keyInput.value = key;
        $userInfoInput.value = userInfo;
        break;
      case "RETURN_SUCCESS":
        $resultInput.value = 1;
        $keyInput.value = key;
        $userInfoInput.value = JSON.stringify(userInfo);
        break;
      case "ERROR":
        $resultInput.value = 0;
        $keyInput.value = key;
        $userInfoInput.value = userInfo;
        break;
      default:
        throw new Error("Invalid rqcode.");
    }
  } catch (error) {
    console.log("Occurred error in received message event().", error);
  }
});