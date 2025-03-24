"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = exports.auth = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const storage_1 = require("firebase/storage");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const app = (0, app_1.initializeApp)(firebase_1.firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)();
//# sourceMappingURL=firebase.js.map