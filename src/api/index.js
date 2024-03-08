import { collection, doc, onSnapshot, query, setDoc, orderBy } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribeAuth = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];

                const unsubscribe = onSnapshot(
                    doc(db, "users", userData?.uid),
                    (_doc) => {
                        if (_doc.exists()) {
                            resolve(_doc.data());
                        } else {
                            setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                                resolve(userData)
                            });
                        }
                    }
                ); console.log(`Here Login Details of user `);
                return unsubscribe;
            } else {
                reject(new Error("User is not authenticated"))
            }
            unsubscribeAuth();
        });

    });
};


export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });
    
        return unsubscribe;
    });
}

