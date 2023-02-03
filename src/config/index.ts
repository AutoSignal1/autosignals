// export const MONGO_URL =
//   'mongodb+srv://gnqnpn:Faithor-2298@foodcluster.fwq1l.mongodb.net/?retryWrites=true&w=majority';
export const MONGO_URL = `mongodb+srv://autosignal:${process.env.DB_PASSWORD}@cluster0.x3qslhc.mongodb.net/?retryWrites=true&w=majority`;
// export const MONGO_URL = 'mongodb://localhost:27017/block';
// export const APP_SECRET = 'The_APP_Secret';

export const PORT = process.env.PORT || 8000;
