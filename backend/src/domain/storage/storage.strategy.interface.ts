export interface IStorageStrategy {
  saveFile(buffer: Buffer, filename: string): Promise<string>;
  getStaticUrl(filename: string, host: string, protocol: string): string;
}

export const IStorageStrategyToken = Symbol('IStorageStrategy');
