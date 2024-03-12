import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Note } from '@shared/types'

export const useNotesStore = defineStore('notes', () => {
	const folders = ref<string[]>([])
	const currentFolder = ref<string | null>(null)
	const notes = ref<Note[]>([])
	const recentNotes = ref<Note[]>([])
	const selectedNote = ref<Note | null>(null)

	const currentFolderNotes = computed(() => notes.value)

	const loadFolders = async () => {
		const _folders = await window.context.getFolders()

		folders.value = _folders
		if (_folders.length > 0 && !currentFolder.value) {
			selectFolder(_folders[0])
		}
	}
	const selectFolder = async (folderName: string) => {
		currentFolder.value = folderName
		const _notes = await window.context.getFolderNotes(folderName)

		notes.value = _notes
	}
	const loadRecentNotes = async () => {
		const _notes = await window.context.getRecentNotes()

		recentNotes.value = _notes.flat()
	}
	const selectNote = (noteName: string) => {
		const note = notes.value.find((note) => note.title === noteName)

		if (note) {
			selectedNote.value = note
		}
	}
	const selectRecentNote = (folderName: string, noteName: string) => {
		const note = recentNotes.value.find(
			(note) => `${note.folder}/${note.title}` === `${folderName}/${noteName}`
		)

		if (note) {
			selectedNote.value = note
		}
	}
	const renameNote = async (folder: string, oldTitle: string, newTitle: string) => {
		console.log(`Renaming note ${oldTitle} to ${newTitle}`)
		try {
			await window.context.renameNote(folder, oldTitle, newTitle)
			await selectFolder(folder)
			selectNote(newTitle)
			await loadRecentNotes()
			console.log('Note renamed')
		} catch (error) {
			console.log(error)
		}

	}

	return {
		folders,
		currentFolder,
		currentFolderNotes,
		recentNotes,
		selectedNote,
		loadFolders,
		selectFolder,
		loadRecentNotes,
		selectNote,
		selectRecentNote,
		renameNote
	}
})
