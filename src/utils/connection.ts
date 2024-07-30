import { connect, connection } from 'mongoose';

const cluster = process.env.MNG_CLUSTER;
const pass = process.env.MNG_PASS;
const domain = process.env.MNG_DOMAIN;
const dbsec = process.env.MNG_DB;

const conn = {
    isConnected: 0,
    dbName: ''
};

export async function connectDB() {
    if (conn.isConnected >= 1) {
        return;
    }
    //console.log(`mongodb+srv://${cluster}:${pass}@${domain}/${dbsec}`, localhostURI);
    const database = await connect(
        `mongodb+srv://${cluster}:${pass}@${domain}/${dbsec}`
        //`mongodb://localhost:27017/${dbsec}`
    );
    conn.isConnected = database.connections[0].readyState;
    conn.dbName = await database.connection.db.databaseName;
}

// Eventos de conexión
connection.on('connected', () => {
    console.log(`Conectado Exitosamente a BD.`);
});
connection.on('error', (err) => {
    console.error(`Error en la Conexión a BD: ${conn.dbName}.`, err);
});
connection.on('disconnected', () => {
    console.log(`Se ha desconectado de la BD: ${conn.dbName}.`);
});

// Opción para cerrar la conexión al cerrar la aplicación
process.on('SIGINT', async () => {
    await connection.close();
    console.log('Se ha cerrado la conexión de BD, por desconexión del servidor local.');
    process.exit(0);
});