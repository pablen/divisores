declare module 'firestore-parser' {
  interface Json {
    [x: string]: string | number | boolean | Date | Json | JsonArray
  }

  export default function parser<T>(json: Json): T
}
