"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.AttemptModelClass = exports.DeviceModel = exports.TokenModel = exports.CommentModel = exports.UserModel = exports.PostModel = exports.BlogModelClass = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv.config();
const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error("No mongo URL");
}
const dbName = 'mongooseDB';
// const client = new MongoClient(mongoUri)
// const db = client.db();
// export const blogsCollection = db.collection<blogDbModel>("blogs")
// export const postsCollection = db.collection<postDbModel>("posts")
// export const userAccountsCollection = db.collection<userAccountDbModel>("userAccounts")
// export const commentsCollection = db.collection<commentDbModel>("comments")
// export const tokenCollection = db.collection<refreshTokenModel>("tokens")
// export const devicesCollection = db.collection<deviceDbModel>("devices")
const blogSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
    websiteUrl: String,
    createdAt: String
});
const postSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
});
const emailConfirmationSchema = new mongoose_1.default.Schema({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: String
});
const passwordRecoverySchema = new mongoose_1.default.Schema({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }
});
const accountDataSchema = new mongoose_1.default.Schema({
    login: String,
    email: String,
    createdAt: String,
    passwordHash: String
});
const userAccountSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    accountData: accountDataSchema,
    emailConfirmation: emailConfirmationSchema,
    passwordRecovery: passwordRecoverySchema
});
const commentSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    content: String,
    createdAt: String,
    userId: String,
    userLogin: String,
    postId: String,
});
const tokenSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    issuedAt: String,
    deviceId: String,
    deviceName: String,
    ip: String,
    userId: Object,
    expiredAt: String
});
const deviceSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    userId: mongoose_1.Schema.Types.ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String
});
const attemptSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    requestData: String,
    date: String
});
exports.BlogModelClass = mongoose_1.default.model('blogs', blogSchema);
exports.PostModel = mongoose_1.default.model('posts', postSchema);
exports.UserModel = mongoose_1.default.model('userAccounts', userAccountSchema);
exports.CommentModel = mongoose_1.default.model('comments', commentSchema);
exports.TokenModel = mongoose_1.default.model('tokens', tokenSchema);
exports.DeviceModel = mongoose_1.default.model('devices', deviceSchema);
exports.AttemptModelClass = mongoose_1.default.model('attempts', attemptSchema);
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect client tot the server
            // await client.connect();
            mongoose_1.default.set("strictQuery", false);
            yield mongoose_1.default.connect(mongoUri);
            // Establish and verify connection
            // await client.db().command({ ping: 1 });
            // await mongoose.
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            console.log("Can not connect to mongo db");
            //Ensures that client will close after finish/error
            // await client.close()
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
