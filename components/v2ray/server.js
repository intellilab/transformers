const baseConfig = {
  log: {
    loglevel: "error",
  },
  inbounds: [
    {
      tag: "socks-in",
      port: 10010,
      listen: "::",
      protocol: "vmess",
      settings: {
        clients: [
          {
            id: "",
            alterId: 0,
          },
        ],
      },
    },
  ],
  outbounds: [
    {
      protocol: "freedom",
    },
    {
      protocol: "blackhole",
      tag: "blocked",
    },
  ],
  routing: {
    domainStrategy: "IPOnDemand",
    rules: [
      {
        type: "field",
        ip: [
          "geoip:private",
        ],
        outboundTag: "blocked",
      },
    ],
  },
};

export function createConfig(vmess) {
  const inbound = baseConfig.inbounds[0];
  const config = {
    ...baseConfig,
    inbounds: [
      {
        ...inbound,
        listen: '::',
        port: vmess.port,
        settings: {
          ...inbound.settings,
          clients: [
            { id: vmess.id, alterId: vmess.aid },
          ],
        },
        streamSettings: {
          ...inbound.streamSettings,
          network: vmess.net,
          ...vmess.net === "ws" && {
            path: vmess.path,
            headers: {
              Host: vmess.host,
            },
          },
        },
      },
      ...baseConfig.inbounds.slice(1),
    ],
  };
  return config;
}
