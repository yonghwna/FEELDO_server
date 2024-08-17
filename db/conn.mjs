import { MongoClient } from "mongodb";
/**.env에서 uri를 읽어와서 client 인스턴스를 만드는 코드
 * 일단 client가 정의 되면, 스스로 db와 새로운 Connection을 만드려고 시도한다.
 */
const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db("Cluster93490");

/**
 * 연결이 완료되면 sample_training db가 export 된다. 모든 모듈에서 사용 가능한
 * 통합된 인터페이스를 제공한다
 */
export default db;
