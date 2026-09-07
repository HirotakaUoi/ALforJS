// 共通の入出力機能は Node/io.js にある。サブフォルダからも
// import { output, input, close } from "./io.js"; の1行で届くようにするための中継ファイル。
export { output, input, close } from "../io.js";
