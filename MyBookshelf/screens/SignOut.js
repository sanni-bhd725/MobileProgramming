import { useEffect } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';

export default function SignOut({ navigation }) {
    useEffect(() => {
        FIREBASE_AUTH.signOut()
    }, [navigation]);
}
