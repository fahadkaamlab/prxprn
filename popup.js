const serverSelect = document.getElementById("server");
const connectButton = document.getElementById("connect");
const disconnectButton = document.getElementById("disconnect");
const statusText = document.getElementById("status");

function setStatus(message, isConnected) {
  statusText.textContent = message;
  statusText.style.color = isConnected ? "#34d399" : "#fca5a5";
}

function renderServers(servers, activeServerId) {
  serverSelect.innerHTML = "";
  servers.forEach((server) => {
    const option = document.createElement("option");
    option.value = server.id;
    option.textContent = server.name;
    if (server.id === activeServerId) {
      option.selected = true;
    }
    serverSelect.appendChild(option);
  });
}

function applyServer(serverId) {
  chrome.runtime.sendMessage({ type: "SET_SERVER", serverId }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      setStatus("Failed to apply proxy", false);
      return;
    }

    const isConnected = response.activeServerId !== "off";
    setStatus(isConnected ? "Connected" : "Disconnected", isConnected);
  });
}

chrome.runtime.sendMessage({ type: "GET_STATE" }, (state) => {
  if (chrome.runtime.lastError || !state?.servers?.length) {
    setStatus("Failed to load config", false);
    return;
  }

  renderServers(state.servers, state.activeServerId || "off");
  const active = state.servers.find((server) => server.id === (state.activeServerId || "off"));
  setStatus(active?.id && active.id !== "off" ? "Connected" : "Disconnected", active?.id !== "off");
});

connectButton.addEventListener("click", () => {
  applyServer(serverSelect.value);
});

disconnectButton.addEventListener("click", () => {
  serverSelect.value = "off";
  applyServer("off");
});
