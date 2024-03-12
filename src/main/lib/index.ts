import { readdir, readFile, writeFile, rename, stat } from 'node:fs/promises'

import { rootDir, fileEncoding } from '@shared/constants'

export const getFolders = async () => {
	const folders = await readdir(rootDir, {
		encoding: 'utf-8',
		withFileTypes: true
	})

	return folders
		.filter((folder) => folder.isDirectory())
		.map((folder) => folder.name)
}

export const getFolderNotes = async (folder: string) => {
	const notes = await readdir(`${rootDir}/${folder}`, {
		encoding: 'utf-8',
		withFileTypes: true
	})

	const notesPromises = notes
		.filter((note) => note.isFile() && note.name.endsWith('.html'))
		.map(async (note) => {
			const content = await readFile(`${rootDir}/${folder}/${note.name}`, fileEncoding)
			const meta = await stat(`${rootDir}/${folder}/${note.name}`)

			return {
				title: note.name.replace('.html', ''),
				date: meta.ctime.toISOString(),
				folder,
				content
			}
		})

	return Promise.all(notesPromises)
}

export const getRecentNotes = async () => {
	const folders = await getFolders()
	const notesPromise = folders.map(async (folder) => {
		const notes = await readdir(`${rootDir}/${folder}`, {
			encoding: 'utf-8',
			withFileTypes: true
		})

		const notesPromise = notes
			.filter((note) => note.isFile() && note.name.endsWith('.html'))
			.map(async (note) => {
				const content = await readFile(`${rootDir}/${folder}/${note.name}`, fileEncoding)
				const meta = await stat(`${rootDir}/${folder}/${note.name}`)

				return {
					title: note.name.replace('.html', ''),
					date: meta.mtime.toISOString(),
					folder,
					content
				}
			})

		return Promise.all(notesPromise)
	})
	const notes = await Promise.all(notesPromise)

	return notes.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const saveNote = async (folder: string, title: string, content: string) => {
	await writeFile(`${rootDir}/${folder}/${title}.html`, content, fileEncoding)
}

export const renameNote = async (folder: string, oldTitle: string, newTitle: string) => {
	await rename(`${rootDir}/${folder}/${oldTitle}.html`, `${rootDir}/${folder}/${newTitle}.html`)
}
