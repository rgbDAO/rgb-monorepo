export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'http://discord.gg/rgb';
    case ExternalURL.twitter:
      return 'https://twitter.com/rgbdao';
    case ExternalURL.notion:
      return 'https://rgbdao.notion.site/';
    case ExternalURL.discourse:
      return 'https://discourse.rgbdao.xyz/';
  }
};
