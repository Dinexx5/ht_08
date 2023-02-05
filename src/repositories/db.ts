import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import {
    accountData,
    blogDbModel,
    commentDbModel,
    deviceDbModel, emailConfirmation, passwordRecovery,
    postDbModel,
    refreshTokenDbModel,
    userAccountDbModel
} from "../models/models";
import mongoose, {Schema} from "mongoose";

dotenv.config()


const mongoUri = process.env.MONGO_URL!
if (!mongoUri) {
    throw new Error("No mongo URL")
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

const blogSchema = new mongoose.Schema<blogDbModel>({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: String,
    websiteUrl: String,
    createdAt: String
});

const postSchema = new mongoose.Schema<postDbModel>({
    _id: Schema.Types.ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
});

const emailConfirmationSchema = new mongoose.Schema<emailConfirmation>({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: String
});

const passwordRecoverySchema = new mongoose.Schema<passwordRecovery>({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }

});
const accountDataSchema = new mongoose.Schema<accountData>({
    login: String,
    email: String,
    createdAt: String,
    passwordHash: String
});

const userAccountSchema = new mongoose.Schema<userAccountDbModel>({
    _id: Schema.Types.ObjectId,
    accountData: accountDataSchema,
    emailConfirmation: emailConfirmationSchema,
    passwordRecovery: passwordRecoverySchema
});
const commentSchema = new mongoose.Schema<commentDbModel>({
    _id: Schema.Types.ObjectId,
    content: String,
    createdAt: String,
    userId: String,
    userLogin: String,
    postId: String,
});

const tokenSchema = new mongoose.Schema<refreshTokenDbModel>({
    _id: Schema.Types.ObjectId,
    issuedAt: String,
    deviceId: String,
    deviceName: String,
    ip: String,
    userId: Object,
    expiredAt: String
});
const deviceSchema = new mongoose.Schema<deviceDbModel>({
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String
});


export const BlogModelClass = mongoose.model('blogs', blogSchema);
export const PostModel = mongoose.model('posts', postSchema);
export const UserModel = mongoose.model('userAccounts', userAccountSchema);
export const CommentModel = mongoose.model('comments', commentSchema);
export const TokenModel = mongoose.model('tokens', tokenSchema);
export const DeviceModel = mongoose.model('devices', deviceSchema);


export async function runDb() {
    try {
        // Connect client tot the server
        // await client.connect();
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongoUri);
        // Establish and verify connection
        // await client.db().command({ ping: 1 });

        // await mongoose.

        console.log("Connected successfully to mongo server");
    } catch {
        console.log ("Can not connect to mongo db");
        //Ensures that client will close after finish/error
        // await client.close()
        await mongoose.disconnect()
    }
}