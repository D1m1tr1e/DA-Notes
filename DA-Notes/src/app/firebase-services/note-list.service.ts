import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);
  items$;
  items;
  //const itemCollection = collection(this.firestore, 'item');

  //Greit auf die Sammlung Notes aus dem Projekt /Firebase
  getNotesRef() { 
    return collection(this.firestore, 'notes');
  }

  //Greift auf den Sammlung Trash im Projekt aus Firebase 
  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  //Greift auf den Sammlung der IDs im Projekt aus Firebase
  getSingleDocRef(colId: string, docId: string) { 
    return doc(collection(this.firestore, colId, docId));
  }

  constructor() {
    this.items$ = collectionData(this.getNotesRef())
    this.items = this.items$.subscribe((list) =>{
      list.forEach(element => {
        console.log(element);
      });
    } );
    this.items.unsubscribe();
  }
  
}
