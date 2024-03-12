<script setup lang="ts">
import { load } from 'cheerio'
import { computed } from 'vue'

import { useNotesStore } from '@/store/notes'
import { useDateFns } from '@/hooks/useDateFns'

const store = useNotesStore()
const { format } = useDateFns()

const notesPreview = computed(() => {
	const folder = store.currentFolderNotes

	return folder.map((note) => {
		const html = note.content || ''
		const $ = load(html)

		return $.text()
	})
})
</script>

<template>
	<nav>
		<ul class="px-4 space-y-4">
			<li
				v-for="note, i of store.currentFolderNotes"
				@click="store.selectNote(note.title)"
				class="p-4 space-y-2 bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors cursor-pointer"
				:class="{
					'bg-zinc-300': store.selectedNote?.title === note.title,
				}"
			>
				<div>
					<span class="font-medium">{{ note.title }}</span>
				</div>
				<div class="flex items-center space-x-2 text-sm">
					<span class="text-zinc-500">{{ format(new Date(note.date), 'dd/MM/yyyy') }}</span>
					<span class="whitespace-nowrap text-ellipsis text-zinc-600 overflow-hidden">
						{{ notesPreview[i] }}
					</span>
				</div>
			</li>
		</ul>
	</nav>
</template>
