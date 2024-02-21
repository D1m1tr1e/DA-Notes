import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collectionData, doc, onSnapshot, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubNotes;
  unsubTrash;

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
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async updateNote(note: Note) {

    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFormNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err) }
      )
    
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFormNote(note: Note) {
    if (note.type == "note") {
      return 'notes';
    } else {
      return 'trash;'
    }
  }

  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef?.id); }
    )
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.market || false
    }
  }

}
