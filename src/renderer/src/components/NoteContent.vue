<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import Editor from '@/components/Editor.vue'
import More from '@/components/Icon/More.vue'
import Calendar from '@/components/Icon/Calendar.vue'
import Folder from '@/components/Icon/Folder.vue'
import File from '@/components/Icon/File.vue'
import Star from '@/components/Icon/Star.vue'
import Archive from '@/components/Icon/Archive.vue'
import Trash from '@/components/Icon/Trash.vue'
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

const deleteNote = async (folder?: string, title?: string) => {
	if (folder && title && store.currentFolder) {
		await window.context.deleteNote(folder, title)
		await store.loadRecentNotes()
		await store.selectFolder(store.currentFolder)
		store.selectNote(null)
	}
}
</script>

<template>
	<div v-if="note" class="content mt-8 p-12 flex-1 overflow-auto relative">
		<div class="flex items-center justify-between space-x-4">
			<input type="text" v-model="noteTitle" @blur="changeTitle" @keyup.enter="changeTitle" class="w-full font-bold text-3xl leading-none outline-none" />
			<Popover v-slot="{ open }" class="relative">
				<PopoverButton
					as="button"
					class="flex items-center p-1 border border-zinc-500 rounded-full"
				>
					<More class="w-5 h-5 text-zinc-500" />
				</PopoverButton>
				<Transition
					enterActiveClass="transition duration-200 ease-out"
					enterFromClass="translate-y-1 opacity-0"
					enterToClass="translate-y-0 opacity-100"
					leaveActiveClass="transition duration-150 ease-in"
					leaveFromClass="translate-y-0 opacity-100"
					leaveToClass="translate-y-1 opacity-0"
				>
					<PopoverPanel
						class="absolute right-0 z-20 mt-3 p-2 rounded-lg min-w-44 bg-zinc-100 shadow-md"
					>
						<ul>
							<li>
								<button
									class="px-2 py-1.5 space-x-2 rounded-md flex items-center w-full hover:bg-zinc-200 text-sm transition-colors"
								>
									<Star	class="w-4 h-4" />
									<p class="whitespace-nowrap">Add to favorites</p>
								</button>
							</li>
							<li>
								<button
									class="px-2 py-1.5 space-x-2 rounded-md flex items-center w-full hover:bg-zinc-200 text-sm transition-colors"
								>
									<Archive class="w-4 h-4" />
									<p class="whitespace-nowrap">Archive</p>
								</button>
							</li>
							<div class="h-[1px] bg-zinc-200 my-2" />
							<li>
								<button
									@click="() => deleteNote(note?.folder, note?.title)"
									class="px-2 py-1.5 space-x-2 rounded-md flex items-center w-full hover:bg-zinc-200 text-sm transition-colors"
								>
									<Trash class="w-4 h-4" />
									<p class="whitespace-nowrap">Delete</p>
								</button>
							</li>
						</ul>
					</PopoverPanel>
				</Transition>
			</Popover>
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
