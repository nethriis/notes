<script setup lang="ts">
import File from '@/components/Icon/File.vue'
import { useNotesStore } from '@/store/notes'

const store = useNotesStore()

await store.loadRecentNotes()

const selectRecentNote = async (folder: string, title: string) => {
	await store.selectFolder(folder)
	store.selectRecentNote(folder, title)
}
</script>

<template>
	<nav class="mt-1">
		<ul>
			<li
				v-for="note of store.recentNotes"
				:key="`${note.folder}/${note.title}`"
				@click="selectRecentNote(note.folder, note.title)"
				class="w-full flex items-center px-4 py-1.5 font-medium text-sm cursor-pointer"
				:class="{
					'bg-blue-500 text-white': `${store.selectedNote?.folder}/${store.selectedNote?.title}` === `${note.folder}/${note.title}`,
					'text-zinc-500 hover:text-zinc-900': `${store.selectedNote?.folder}/${store.selectedNote?.title}` !== `${note.folder}/${note.title}`,
				}"
				>
				<File class="w-4 h-4 mr-3" />
				<span class="whitespace-nowrap text-ellipsis overflow-hidden">{{ note.title }}</span>
			</li>
		</ul>
	</nav>
</template>