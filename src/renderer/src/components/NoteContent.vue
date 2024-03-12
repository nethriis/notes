<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import Editor from '@/components/Editor.vue'
import More from '@/components/Icon/More.vue'
import Calendar from '@/components/Icon/Calendar.vue'
import Folder from '@/components/Icon/Folder.vue'
import File from '@/components/Icon/File.vue'
import { useNotesStore } from '@/store/notes'
import { useDateFns } from '@/hooks/useDateFns'

const store = useNotesStore()
const { format } = useDateFns()

const note = computed(() => store.selectedNote)
const noteTitle = ref(note.value?.title)
const isEnterPressed = ref(false)

watch(note, (value) => {
	noteTitle.value = value?.title
}, { immediate: true })

const reloadFolderNotes = async () => {
	if (store.selectedNote) {
		await store.selectFolder(store.selectedNote.folder)
	}
}

const changeTitle = async (event: KeyboardEvent | FocusEvent) => {
	if (isEnterPressed.value) {
		isEnterPressed.value = false
		return
	}

	if (event instanceof KeyboardEvent && event.target instanceof HTMLInputElement) {
		isEnterPressed.value = true
		event.target.blur()
	}

	if (store.selectedNote && noteTitle.value) {
		await store.renameNote(store.selectedNote.folder, store.selectedNote?.title, noteTitle.value)
	}
}
</script>

<template>
	<div v-if="note" class="content mt-8 p-12 flex-1 overflow-auto relative">
		<div class="flex items-center justify-between space-x-4">
			<input type="text" v-model="noteTitle" @blur="changeTitle" @keyup.enter="changeTitle" class="w-full font-bold text-3xl leading-none outline-none" />
			<button type="button" class="flex items-center p-1 border border-zinc-500 rounded-full">
				<More class="w-5 h-5 text-zinc-500" />
			</button>
		</div>
		<table class="w-full mb-4">
			<thead class="h-0">
				<tr>
					<th class="py-2 font-medium text-zinc-500 w-32"></th>
					<th class="py-2 font-medium text-zinc-500"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-200 text-sm">
				<tr>
					<th scope="row" class="py-4 space-x-4 flex items-center font-medium text-zinc-500">
						<Calendar class="w-4 h-4" />
						<p class="font-medium">Date</p>
					</th>
					<td class="py-4 font-medium underline">{{ format(new Date(note.date), 'dd/MM/yyyy') }}</td>
				</tr>
				<tr>
					<th scope="row" class="py-4 space-x-4 flex items-center font-medium text-zinc-500">
						<Folder class="w-4 h-4" />
						<p class="font-medium">Folder</p>
					</th>
					<td class="py-4 font-medium underline">{{ note.folder }}</td>
				</tr>
			</tbody>
		</table>
		<div>
			<Editor v-model="note.content" @save="reloadFolderNotes()" />
		</div>
	</div>
	<div v-else class="flex items-center justify-center flex-1">
		<div class="space-y-4 max-w-md">
			<File class="mx-auto w-24 h-24 text-zinc-500" />
			<p class="font-semibold text-center text-xl">Select a note to view</p>
			<p class="text-center text-sm text-zinc-500">
				Choose a note from the list on the left to view it's contents,
				or create a new note to add to your collection.
			</p>
		</div>
	</div>
</template>

<style scoped>
.content {
	scrollbar-width: thin;
	scrollbar-color: rgb(212 212 216);
}

.content::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

.content::-webkit-scrollbar-track {
	background: transparent;
}

.content::-webkit-scrollbar-thumb {
	background-color: rgb(212 212 216);
	border-radius: 4px;
}

.content::-webkit-scrollbar-thumb:hover {
	background-color: rgb(161 161 170);
}
</style>
