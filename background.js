const DEFAULT_SERVERS = [
  { id: "off", name: "No proxy" },
  { id: "us1", name: "US - New York", host: "198.51.100.10", port: 8080 },
  { id: "de1", name: "Germany - Frankfurt", host: "203.0.113.20", port: 8080 },
  { id: "sg1", name: "Singapore", host: "192.0.2.30", port: 8080 }
];

async function initServers() {
  const { servers } = await chrome.storage.local.get("servers");
  if (!servers) {
    await chrome.storage.local.set({ servers: DEFAULT_SERVERS, activeServerId: "off" });
  }
}

function setProxyConfig(server) {
  if (!server || server.id === "off") {
    chrome.proxy.settings.clear({ scope: "regular" });
    return;
  }

  chrome.proxy.settings.set({
    value: {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: server.host,
          port: server.port
        },
        bypassList: ["<local>"]
      }
    },
    scope: "regular"
  });
}

chrome.runtime.onInstalled.addListener(initServers);
chrome.runtime.onStartup.addListener(initServers);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "SET_SERVER") {
    chrome.storage.local.get("servers").then(async ({ servers }) => {
      const selected = servers.find((server) => server.id === msg.serverId) || servers[0];
      setProxyConfig(selected);
      await chrome.storage.local.set({ activeServerId: selected.id });
      sendResponse({ ok: true, activeServerId: selected.id });
    });
    return true;
  }

  if (msg?.type === "GET_STATE") {
    chrome.storage.local.get(["servers", "activeServerId"]).then((state) => {
      sendResponse({ ...state });
    });
    return true;
  }

  return false;
});
