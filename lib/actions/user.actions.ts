"use server";


import {createAdminClient} from "@/lib/appwrite";
import appwriteConfig from "@/lib/appwrite/config";
import {ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

const sendEmailOTP = async ({email} : {email: string}) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
};


export const createAccount = async ({fullName, email} : {fullName: string; email: string}) => {

    const existingAccount = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });
    if(!accountId) throw new Error("Failed to send an OTP");

    if(!existingAccount) {
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "@/public/images/avatar.svg",
                accountId,
            },
        );
    }

    return parseStringify({ accountId });
};