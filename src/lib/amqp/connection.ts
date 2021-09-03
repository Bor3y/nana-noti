import { Connection, ConnectionOptions } from "rhea-promise";

const createConnection = async (host: string, port: number) : Promise<Connection> => {
  const connectionOptions: ConnectionOptions = { host, port, reconnect: true };
  const connection: Connection = new Connection(connectionOptions);
  await connection.open();
  return connection;
};

export default createConnection;