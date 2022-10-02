const baseConfig = {
  log: {
    loglevel: "error",
  },
  inbounds: [
    {
      tag: "socks-in",
      port: 1080,
      listen: "::",
      protocol: "socks",
      settings: {
        auth: "noauth",
        udp: true,
        ip: "127.0.0.1",
      },
      sniffing: {
        enabled: true,
        destOverride: ["http", "tls"]
      },
    },
    {
      tag: "http-in",
      port: 1086,
      listen: "::",
      protocol: "http",
    },
  ],
  outbounds: [
    {
      protocol: "vmess",
      settings: {
        vnext: [
          {
            address: "",
            port: 443,
            users: [
              {
                email: "user@v2ray.com",
                id: "",
                alterId: 0,
                security: "auto",
              },
            ],
          },
        ],
      },
      streamSettings: {
        network: "tcp",
      },
      mux: {
        enabled: true,
      },
      tag: "proxy",
    },
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
        outboundTag: "direct",
        domain: [
          "geosite:cn",
        ],
      },
      {
        type: "field",
        ip: [
          "geoip:cn",
          "geoip:private",
        ],
        outboundTag: "direct",
      },
      {
        type: "field",
        domain: [
          "geosite:category-ads",
        ],
        outboundTag: "blocked",
      },
    ],
  },
};

export function createConfig(vmess) {
  const outbound = baseConfig.outbounds[0];
  const config = {
    ...baseConfig,
    outbounds: [
      {
        ...outbound,
        settings: {
          ...outbound.settings,
          vnext: [
            {
              ...outbound.settings?.vnext?.[0],
              address: vmess.add,
              port: vmess.port,
              users: [
                {
                  email: "user@v2ray.com",
                  id: vmess.id,
                  alterId: vmess.aid,
                  security: "auto",
                },
              ],
            },
          ],
        },
        streamSettings: {
          ...outbound.streamSettings,
          network: vmess.net,

          ...vmess.tls === "tls" && {
            security: "tls",
            tlsSettings: {
              allowInsecure: true,
              ...vmess.host && {
                serverName: vmess.host,
              },
            },
          },

          ...vmess.tls === "ws" && {
            wsSettings: {
              connectionReuse: true,
              path: vmess.path,
              headers: {
                Host: vmess.host,
              },
            },
          },
        },
      },
      ...baseConfig.outbounds.slice(1),
    ],
  };
  return config;
}
