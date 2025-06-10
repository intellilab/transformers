interface IStreamSettings {
  network: 'tcp' | 'ws';
  security?: 'none' | 'tls';
  tlsSettings?: {
    serverName?: string;
    allowInsecure?: boolean;
  };
  wsSettings?: {
    path: string;
    headers?: Record<string, string>;
  };
}

interface IV2flyUser {
  id: string;
  alterId: number;
}

interface ICommonInbound {
  tag?: string;
  port: number;
  listen: string;
  sniffing?: {
    enabled: boolean;
    destOverride: string[];
  };
  settings?: object;
  streamSettings?: IStreamSettings;
}

interface IInboundVmess extends ICommonInbound {
  protocol: 'vmess';
  settings?: {
    clients: IV2flyUser[];
  };
}

interface IInboundSocks extends ICommonInbound {
  protocol: 'socks';
  auth?: 'noauth';
  udp?: boolean;
  ip?: string;
}

interface IInboundHttp extends ICommonInbound {
  protocol: 'http';
}

export type IInbound = IInboundVmess | IInboundSocks | IInboundHttp;

interface ICommonOutbound {
  tag?: string;
  streamSettings?: IStreamSettings;
  mux?: { enabled: boolean };
  settings?: object;
}

export interface IOutboundVmess extends ICommonOutbound {
  protocol: 'vmess';
  settings: {
    vnext: Array<{
      address: string;
      port: number;
      users: IV2flyUser[];
    }>;
  };
}

export interface IOutboundOthers extends ICommonOutbound {
  protocol: 'freedom' | 'blackhole';
}

export type IOutbound = IOutboundVmess | IOutboundOthers;

/** VMess config object, used commonly on many apps. */
export interface IVmessConfig {
  /** Server address */
  add: string;
  /** Server port */
  port: number;
  /** User id, e.g. a UUID */
  id: string;
  /** AlterID, should be 0 */
  aid?: number;
  /** Network to use */
  net: 'tcp' | 'ws';
  /** Websocket path */
  path?: string;
  /** Host for HTTP service and TLS certificates */
  host?: string;
  /** Whether to enable TLS */
  tls?: 'none' | 'tls';
}

export interface IV2flyRoutingRule {
  type: 'field';
  outboundTag: string;
  domain?: string[];
  ip?: string[];
}

export interface IV2flyConfig {
  log?: {
    loglevel?: 'info' | 'error';
  };
  inbounds: IInbound[];
  outbounds: IOutbound[];
  routing?: {
    domainStrategy?: string;
    rules?: IV2flyRoutingRule[];
  };
}

const defaultServerRules: IV2flyRoutingRule[] = [
  {
    type: 'field',
    ip: ['geoip:private'],
    outboundTag: 'blocked',
  },
];

const defaultClientRules: IV2flyRoutingRule[] = [
  {
    type: 'field',
    outboundTag: 'direct',
    domain: ['geosite:cn'],
  },
  {
    type: 'field',
    ip: ['geoip:cn', 'geoip:private'],
    outboundTag: 'direct',
  },
  {
    type: 'field',
    domain: ['geosite:category-ads'],
    outboundTag: 'blocked',
  },
];

const defaultVmessInbound: IInbound = {
  tag: 'socks-in',
  port: 1080,
  listen: '::',
  protocol: 'vmess',
  settings: {
    clients: [
      {
        id: '',
        alterId: 0,
      },
    ],
  },
};

const defaultVmessOutbound: IOutboundVmess = {
  protocol: 'vmess',
  settings: {
    vnext: [],
  },
  streamSettings: {
    network: 'tcp',
  },
  mux: {
    enabled: true,
  },
  tag: 'proxy',
};

const defaultWebsocketInbound: IInbound = {
  tag: 'socks-in',
  port: 1080,
  listen: '::',
  protocol: 'socks',
  settings: {
    auth: 'noauth',
    udp: true,
    ip: '127.0.0.1',
  },
  sniffing: {
    enabled: true,
    destOverride: ['http', 'tls'],
  },
};

const defaultHttpInbound: IInbound = {
  tag: 'http-in',
  port: 1086,
  listen: '::',
  protocol: 'http',
};

const defaultOutbounds: IOutbound[] = [
  {
    protocol: 'freedom',
  },
  {
    protocol: 'blackhole',
    tag: 'blocked',
  },
];

const baseConfig: IV2flyConfig = {
  log: {
    loglevel: 'error',
  },
  inbounds: [],
  outbounds: [],
  routing: {
    domainStrategy: 'IPOnDemand',
    rules: [],
  },
};

export function createServerConfig(vmess: IVmessConfig) {
  const config: IV2flyConfig = {
    ...baseConfig,
    inbounds: [
      {
        ...defaultVmessInbound,
        port: vmess.port,
        settings: {
          ...defaultVmessInbound.settings,
          clients: [{ id: vmess.id, alterId: vmess.aid || 0 }],
        },
        streamSettings: {
          ...defaultVmessInbound.streamSettings,
          network: vmess.net,
          ...(vmess.net === 'ws' && {
            wsSettings: {
              path: vmess.path || '/',
              // If TLS is enabled, assume host is already handled by the reverse proxy
              ...(vmess.tls !== 'tls' && {
                headers: {
                  Host: vmess.host || '',
                },
              }),
            },
          }),
        },
      },
    ],
    outbounds: defaultOutbounds,
    routing: {
      ...baseConfig.routing,
      rules: defaultServerRules,
    },
  };
  return config;
}

export function createClientConfig(vmess: IVmessConfig) {
  const config: IV2flyConfig = {
    ...baseConfig,
    inbounds: [defaultWebsocketInbound, defaultHttpInbound],
    outbounds: [
      {
        ...defaultVmessOutbound,
        settings: {
          ...defaultVmessOutbound.settings,
          vnext: [
            {
              address: vmess.add,
              port: vmess.port,
              users: [
                {
                  id: vmess.id,
                  alterId: vmess.aid || 0,
                },
              ],
            },
          ],
        },
        streamSettings: {
          ...defaultVmessInbound.streamSettings,
          network: vmess.net,
          ...(vmess.tls === 'tls' && {
            security: 'tls',
            tlsSettings: {
              ...(vmess.host
                ? {
                    serverName: vmess.host,
                  }
                : {
                    allowInsecure: true,
                  }),
            },
          }),
          ...(vmess.net === 'ws' && {
            wsSettings: {
              path: vmess.path || '/',
              // If TLS is enabled, assume host is already handled by the reverse proxy
              ...(vmess.tls !== 'tls' && {
                headers: {
                  Host: vmess.host || '',
                },
              }),
            },
          }),
        },
      },
      ...defaultOutbounds,
    ],
    routing: {
      ...baseConfig.routing,
      rules: defaultClientRules,
    },
  };
  return config;
}
