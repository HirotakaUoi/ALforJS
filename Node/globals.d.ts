// io.js がグローバルに登録する関数の宣言（エディタの補完・型チェック用。実行には関与しない）
declare function output(s: unknown): void;
declare function input(msg: string): Promise<string>;
declare function close(): void;
declare function clock(): number;
declare const CLOCKS_PER_SEC: number;
