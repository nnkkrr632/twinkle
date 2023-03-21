import { useRoute, useAsyncData, useNuxtApp } from '#imports'

import {
    Firestore,
    collection,
    query,
    getDocs,
    setDoc,
    doc,
    getDoc,
    Timestamp,
    serverTimestamp,
    addDoc,
    DocumentReference,
    DocumentSnapshot,
    DocumentData,
    orderBy,
    limit,
} from 'firebase/firestore'

import { ref as storageRef, StorageReference, uploadBytes, getDownloadURL } from 'firebase/storage'
